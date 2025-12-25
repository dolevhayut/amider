import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface LeaderboardEntry {
  rank: number;
  messengerId: string;
  messengerName: string;
  slug: string;
  totalDonors: number;
  activeDonors: number;
  joinDate: string;
}

export interface MyRankInfo {
  myRank: number | null;
  totalMessengers: number;
  myDonors: number;
  nextRankDonors: number | null; // How many donors needed for next rank
  topThree: LeaderboardEntry[];
}

export function useLeaderboard(messengerId?: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRankInfo, setMyRankInfo] = useState<MyRankInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all active messengers
        const { data: messengers, error: messengersError } = await supabase
          .from('messengers')
          .select(`
            id,
            landing_page_slug,
            created_at,
            is_active,
            user:users!messengers_user_id_fkey (
              full_name
            )
          `)
          .eq('is_active', true);

        if (messengersError) throw messengersError;

        // For each messenger, count their donors
        const messengersWithCounts = await Promise.all(
          (messengers || []).map(async (messenger: any) => {
            const { count: totalCount } = await supabase
              .from('members')
              .select('id', { count: 'exact', head: true })
              .eq('messenger_id', messenger.id);

            const { count: activeCount } = await supabase
              .from('members')
              .select('id', { count: 'exact', head: true })
              .eq('messenger_id', messenger.id)
              .eq('subscription_status', 'active');

            return {
              messengerId: messenger.id,
              messengerName: messenger.user?.full_name || 'לא ידוע',
              slug: messenger.landing_page_slug,
              totalDonors: totalCount || 0,
              activeDonors: activeCount || 0,
              joinDate: new Date(messenger.created_at).toLocaleDateString('he-IL'),
            };
          })
        );

        // Sort by total donors (descending)
        const sorted = messengersWithCounts.sort((a, b) => b.totalDonors - a.totalDonors);

        // Add ranks
        const withRanks: LeaderboardEntry[] = sorted.map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

        setLeaderboard(withRanks);

        // Calculate my rank info if messengerId provided
        if (messengerId) {
          const myEntry = withRanks.find(e => e.messengerId === messengerId);
          const myRank = myEntry?.rank || null;
          const myDonors = myEntry?.totalDonors || 0;

          // Find next rank target
          let nextRankDonors = null;
          if (myRank && myRank > 1) {
            const nextRankEntry = withRanks.find(e => e.rank === myRank - 1);
            if (nextRankEntry) {
              nextRankDonors = nextRankEntry.totalDonors - myDonors;
            }
          }

          setMyRankInfo({
            myRank,
            totalMessengers: withRanks.length,
            myDonors,
            nextRankDonors,
            topThree: withRanks.slice(0, 3),
          });
        }

      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [messengerId]);

  return {
    leaderboard,
    myRankInfo,
    loading,
    error,
  };
}

