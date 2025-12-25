import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface AdminStats {
  totalMessengers: number;
  activeMessengers: number;
  totalDonors: number;
  activeDonors: number;
  monthlySubscriptions: number;
  oneTimeSubscriptions: number;
  totalPrayers: number;
  activePrayers: number;
  completedPrayers: number;
}

export interface TopMessenger {
  id: string;
  name: string;
  slug: string;
  donors: number;
  activeSubscriptions: number;
  joinDate: string;
}

export interface RecentDonor {
  id: string;
  name: string;
  messengerName: string;
  subscriptionType: 'one_time' | 'monthly';
  subscriptionStatus: string;
  joinDate: string;
}

export interface TodayPrayer {
  id: string;
  prayerSubjectName: string;
  prayerIntention: string;
  messengerName: string;
  status: string;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [topMessengers, setTopMessengers] = useState<TopMessenger[]>([]);
  const [recentDonors, setRecentDonors] = useState<RecentDonor[]>([]);
  const [todayPrayers, setTodayPrayers] = useState<TodayPrayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        setLoading(true);
        setError(null);

        // Fetch messengers stats
        const { data: messengers, error: messengersError } = await supabase
          .from('messengers')
          .select('id, is_active');

        if (messengersError) throw messengersError;

        // Fetch members (donors) stats
        const { data: members, error: membersError } = await supabase
          .from('members')
          .select('id, subscription_type, subscription_status');

        if (membersError) throw membersError;

        // Fetch prayers stats
        const { data: prayers, error: prayersError } = await supabase
          .from('prayer_requests')
          .select('id, status');

        if (prayersError) throw prayersError;

        // Calculate stats
        const adminStats: AdminStats = {
          totalMessengers: messengers?.length || 0,
          activeMessengers: messengers?.filter(m => m.is_active).length || 0,
          totalDonors: members?.length || 0,
          activeDonors: members?.filter(m => m.subscription_status === 'active').length || 0,
          monthlySubscriptions: members?.filter(m => m.subscription_type === 'monthly').length || 0,
          oneTimeSubscriptions: members?.filter(m => m.subscription_type === 'one_time').length || 0,
          totalPrayers: prayers?.length || 0,
          activePrayers: prayers?.filter(p => p.status === 'active').length || 0,
          completedPrayers: prayers?.filter(p => p.status === 'completed').length || 0,
        };

        setStats(adminStats);

        // Fetch top messengers (by number of donors)
        const { data: topMessengersData, error: topMessengersError } = await supabase
          .from('messengers')
          .select(`
            id,
            landing_page_slug,
            created_at,
            user:users!messengers_user_id_fkey (
              full_name
            )
          `)
          .eq('is_active', true)
          .limit(5);

        if (topMessengersError) throw topMessengersError;

        // For each messenger, count their donors
        const messengersWithCounts = await Promise.all(
          (topMessengersData || []).map(async (messenger: any) => {
            const { count: donorsCount } = await supabase
              .from('members')
              .select('id', { count: 'exact', head: true })
              .eq('messenger_id', messenger.id);

            const { count: activeCount } = await supabase
              .from('members')
              .select('id', { count: 'exact', head: true })
              .eq('messenger_id', messenger.id)
              .eq('subscription_status', 'active');

            return {
              id: messenger.id,
              name: messenger.user?.full_name || 'לא ידוע',
              slug: messenger.landing_page_slug,
              donors: donorsCount || 0,
              activeSubscriptions: activeCount || 0,
              joinDate: new Date(messenger.created_at).toLocaleDateString('he-IL'),
            };
          })
        );

        // Sort by number of donors and take top 5
        const sortedMessengers = messengersWithCounts
          .sort((a, b) => b.donors - a.donors)
          .slice(0, 5);

        setTopMessengers(sortedMessengers);

        // Fetch recent donors (last 10)
        const { data: recentDonorsData, error: recentDonorsError } = await supabase
          .from('members')
          .select(`
            id,
            subscription_type,
            subscription_status,
            created_at,
            user:users!members_user_id_fkey (
              full_name
            ),
            messenger:messengers!members_messenger_id_fkey (
              user:users!messengers_user_id_fkey (
                full_name
              )
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (recentDonorsError) throw recentDonorsError;

        const formattedRecentDonors: RecentDonor[] = (recentDonorsData || []).map((member: any) => ({
          id: member.id,
          name: member.user?.full_name || 'לא ידוע',
          messengerName: member.messenger?.user?.full_name || 'לא משויך',
          subscriptionType: member.subscription_type,
          subscriptionStatus: member.subscription_status,
          joinDate: new Date(member.created_at).toLocaleDateString('he-IL'),
        }));

        setRecentDonors(formattedRecentDonors);

        // Fetch today's active prayers (last 10)
        const { data: todayPrayersData, error: todayPrayersError } = await supabase
          .from('prayer_requests')
          .select(`
            id,
            prayer_subject_name,
            prayer_intention,
            status,
            messenger:messengers!prayer_requests_messenger_id_fkey (
              user:users!messengers_user_id_fkey (
                full_name
              )
            )
          `)
          .eq('status', 'active')
          .order('submitted_at', { ascending: false })
          .limit(10);

        if (todayPrayersError) throw todayPrayersError;

        const formattedPrayers: TodayPrayer[] = (todayPrayersData || []).map((prayer: any) => ({
          id: prayer.id,
          prayerSubjectName: prayer.prayer_subject_name,
          prayerIntention: prayer.prayer_intention,
          messengerName: prayer.messenger?.user?.full_name || 'לא ידוע',
          status: prayer.status,
        }));

        setTodayPrayers(formattedPrayers);

      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    }

    fetchAdminStats();
  }, []);

  return {
    stats,
    topMessengers,
    recentDonors,
    todayPrayers,
    loading,
    error,
  };
}

