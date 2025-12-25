import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface AdminPrayerData {
  id: string;
  prayerSubjectName: string;
  prayerIntention: string;
  status: 'active' | 'completed' | 'archived' | null;
  submittedAt: string;
  completedAt: string | null;
  memberName: string;
  messengerName: string;
  messengerId: string;
}

export function useAdminPrayers() {
  const [prayers, setPrayers] = useState<AdminPrayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllPrayers() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all prayers with member and messenger info
        const { data, error: fetchError } = await supabase
          .from('prayer_requests')
          .select(`
            id,
            prayer_subject_name,
            prayer_intention,
            status,
            submitted_at,
            completed_at,
            member:members!prayer_requests_member_id_fkey (
              user:users!members_user_id_fkey (
                full_name
              )
            ),
            messenger:messengers!prayer_requests_messenger_id_fkey (
              id,
              user:users!messengers_user_id_fkey (
                full_name
              )
            )
          `)
          .order('submitted_at', { ascending: false });

        if (fetchError) throw fetchError;

        const formattedPrayers: AdminPrayerData[] = (data || []).map((prayer: any) => {
          const memberData = prayer.member as any;
          const memberUser = memberData?.user as any;
          const messengerData = prayer.messenger as any;
          const messengerUser = messengerData?.user as any;

          return {
            id: prayer.id,
            prayerSubjectName: prayer.prayer_subject_name,
            prayerIntention: prayer.prayer_intention,
            status: prayer.status,
            submittedAt: new Date(prayer.submitted_at).toLocaleDateString('he-IL'),
            completedAt: prayer.completed_at 
              ? new Date(prayer.completed_at).toLocaleDateString('he-IL')
              : null,
            memberName: memberUser?.full_name || 'לא ידוע',
            messengerName: messengerUser?.full_name || 'לא משויך',
            messengerId: messengerData?.id || '',
          };
        });

        setPrayers(formattedPrayers);
      } catch (err) {
        console.error('Error fetching all prayers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load prayers');
      } finally {
        setLoading(false);
      }
    }

    fetchAllPrayers();
  }, []);

  return { prayers, loading, error };
}

