import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface MessengerStats {
  totalDonors: number;
  activeSubscriptions: number;
  totalEarned: number;
  walletBalance: number;
  activePrayers: number;
}

export interface MessengerProfile {
  id: string;
  landing_page_slug: string;
  wallet_balance: number;
  plan_type: '18' | '30';
  full_name: string;
  email: string;
  qr_code_url: string | null;
  goal_id: string | null;
  custom_goal_text: string | null;
  tzadik_image_url: string | null;
}

export function useMessengerData() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MessengerStats | null>(null);
  const [profile, setProfile] = useState<MessengerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const userId = user.id;

    async function fetchMessengerData() {
      try {
        setLoading(true);
        setError(null);

        // Get messenger profile
        const { data: messengerData, error: messengerError } = await supabase
          .from('messengers')
          .select(`
            id,
            landing_page_slug,
            wallet_balance,
            plan_type,
            qr_code_url,
            goal_id,
            custom_goal_text,
            tzadik_image_url,
            user:users!messengers_user_id_fkey (
              full_name,
              email
            )
          `)
          .eq('user_id', userId)
          .eq('is_active', true)
          .single();

        if (messengerError) throw messengerError;

        if (messengerData) {
          const userData = messengerData.user as any;
          setProfile({
            id: messengerData.id,
            landing_page_slug: messengerData.landing_page_slug,
            wallet_balance: Number(messengerData.wallet_balance) || 0,
            plan_type: messengerData.plan_type,
            full_name: userData.full_name,
            email: userData.email,
            qr_code_url: messengerData.qr_code_url,
            goal_id: messengerData.goal_id,
            custom_goal_text: messengerData.custom_goal_text,
            tzadik_image_url: messengerData.tzadik_image_url,
          });

          // Get stats
          const { data: membersData } = await supabase
            .from('members')
            .select('id, subscription_status, subscription_type')
            .eq('messenger_id', messengerData.id);

          const { data: prayersData } = await supabase
            .from('prayer_requests')
            .select('id')
            .eq('messenger_id', messengerData.id)
            .eq('status', 'active');

          // Calculate total earned from transactions
          const { data: transactionsData } = await supabase
            .from('transactions')
            .select('amount')
            .eq('related_messenger_id', messengerData.id)
            .eq('type', 'messenger_commission')
            .eq('status', 'completed');

          const totalEarned = transactionsData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
          const totalDonors = membersData?.length || 0;
          const activeSubscriptions = membersData?.filter(m => m.subscription_status === 'active').length || 0;
          const activePrayers = prayersData?.length || 0;

          setStats({
            totalDonors,
            activeSubscriptions,
            totalEarned,
            walletBalance: Number(messengerData.wallet_balance) || 0,
            activePrayers,
          });
        }
      } catch (err) {
        console.error('Error fetching messenger data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchMessengerData();
  }, [user]);

  return { stats, profile, loading, error };
}

