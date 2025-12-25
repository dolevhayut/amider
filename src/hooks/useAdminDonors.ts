import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type User = Database['public']['Tables']['users']['Row'];

export interface AdminDonorData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subscriptionType: 'one_time' | 'monthly';
  subscriptionStatus: 'active' | 'cancelled' | 'pending' | 'failed';
  joinDate: string;
  messengerName: string;
  messengerId: string;
}

export function useAdminDonors() {
  const [donors, setDonors] = useState<AdminDonorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllDonors() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all members with their user and messenger info
        const { data, error: fetchError } = await supabase
          .from('members')
          .select(`
            id,
            subscription_type,
            subscription_status,
            created_at,
            user:users!members_user_id_fkey (
              full_name,
              email,
              phone
            ),
            messenger:messengers!members_messenger_id_fkey (
              id,
              user:users!messengers_user_id_fkey (
                full_name
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const formattedDonors: AdminDonorData[] = (data || []).map((member: any) => {
          const userData = member.user as User;
          const messengerData = member.messenger as any;
          const messengerUser = messengerData?.user as User;

          return {
            id: member.id,
            name: userData.full_name,
            email: userData.email,
            phone: userData.phone,
            subscriptionType: member.subscription_type,
            subscriptionStatus: member.subscription_status,
            joinDate: new Date(member.created_at).toLocaleDateString('he-IL'),
            messengerName: messengerUser?.full_name || 'לא משויך',
            messengerId: messengerData?.id || '',
          };
        });

        setDonors(formattedDonors);
      } catch (err) {
        console.error('Error fetching all donors:', err);
        setError(err instanceof Error ? err.message : 'Failed to load donors');
      } finally {
        setLoading(false);
      }
    }

    fetchAllDonors();
  }, []);

  return { donors, loading, error };
}

