import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type PrayerRequest = Database['public']['Tables']['prayer_requests']['Row'];

export interface PrayerData {
  id: string;
  prayerSubjectName: string;
  prayerIntention: string;
  status: 'active' | 'completed' | 'archived';
  submittedAt: string;
  completedAt: string | null;
  memberName: string;
}

export function useMessengerPrayers(messengerId: string | undefined) {
  const [prayers, setPrayers] = useState<PrayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!messengerId) {
      setLoading(false);
      return;
    }

    async function fetchPrayers() {
      try {
        setLoading(true);
        setError(null);

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
            )
          `)
          .eq('messenger_id', messengerId)
          .order('submitted_at', { ascending: false });

        if (fetchError) throw fetchError;

        const formattedPrayers: PrayerData[] = (data || []).map((prayer: any) => {
          const memberData = prayer.member as any;
          const userData = memberData?.user as any;
          
          return {
            id: prayer.id,
            prayerSubjectName: prayer.prayer_subject_name,
            prayerIntention: prayer.prayer_intention,
            status: prayer.status,
            submittedAt: new Date(prayer.submitted_at).toLocaleDateString('he-IL'),
            completedAt: prayer.completed_at 
              ? new Date(prayer.completed_at).toLocaleDateString('he-IL')
              : null,
            memberName: userData?.full_name || 'לא ידוע',
          };
        });

        setPrayers(formattedPrayers);
      } catch (err) {
        console.error('Error fetching prayers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load prayers');
      } finally {
        setLoading(false);
      }
    }

    fetchPrayers();
  }, [messengerId]);

  const markPrayerCompleted = async (prayerId: string) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', prayerId);

      if (error) throw error;

      // Update local state
      setPrayers(prev => prev.map(p => 
        p.id === prayerId 
          ? { ...p, status: 'completed' as const, completedAt: new Date().toLocaleDateString('he-IL') }
          : p
      ));

      return { success: true };
    } catch (err) {
      console.error('Error marking prayer completed:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update prayer' };
    }
  };

  return { prayers, loading, error, markPrayerCompleted };
}

