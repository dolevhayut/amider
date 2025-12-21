import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type User = Database['public']['Tables']['users']['Row'];

export interface DonorData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subscriptionType: 'one_time' | 'monthly';
  subscriptionStatus: 'active' | 'cancelled' | 'pending' | 'failed';
  joinDate: string;
  nextPaymentDate: string | null;
  hebrewBirthDate: string | null;
}

export function useMessengerDonors(messengerId?: string) {
  const [donors, setDonors] = useState<DonorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!messengerId) {
      setLoading(false);
      setDonors([]);
      return;
    }

    async function fetchDonors() {
      try {
        setLoading(true);
        setError(null);

        if (!messengerId) return;

        const { data, error: fetchError } = await supabase
          .from('members')
          .select(`
            id,
            subscription_type,
            subscription_status,
            created_at,
            next_payment_date,
            hebrew_birth_date,
            user:users!members_user_id_fkey (
              full_name,
              email,
              phone
            )
          `)
          .eq('messenger_id', messengerId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const formattedDonors: DonorData[] = (data || []).map((member: any) => {
          const userData = member.user as User;
          return {
            id: member.id,
            name: userData.full_name,
            email: userData.email,
            phone: userData.phone,
            subscriptionType: member.subscription_type,
            subscriptionStatus: member.subscription_status,
            joinDate: new Date(member.created_at).toLocaleDateString('he-IL'),
            nextPaymentDate: member.next_payment_date 
              ? new Date(member.next_payment_date).toLocaleDateString('he-IL')
              : null,
            hebrewBirthDate: member.hebrew_birth_date,
          };
        });

        setDonors(formattedDonors);
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError(err instanceof Error ? err.message : 'Failed to load donors');
      } finally {
        setLoading(false);
      }
    }

    fetchDonors();
  }, [messengerId]);

  return { donors, loading, error };
}

