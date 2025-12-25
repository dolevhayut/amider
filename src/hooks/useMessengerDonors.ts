import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type User = Database['public']['Tables']['users']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];
type PrayerRequest = Database['public']['Tables']['prayer_requests']['Row'];

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
  cancelledAt?: string | null;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | null;
  description: string | null;
  createdAt: string;
}

export interface PrayerNameItem {
  id: string;
  prayerSubjectName: string;
  prayerIntention: string;
  status: 'active' | 'completed' | 'archived' | null;
  submittedAt: string;
  completedAt: string | null;
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
            cancelled_at,
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
            cancelledAt: member.cancelled_at,
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

  // Shared function to refresh donors list
  const refreshDonors = useCallback(async () => {
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
        cancelled_at,
        user:users!members_user_id_fkey (
          full_name,
          email,
          phone
        )
      `)
      .eq('messenger_id', messengerId)
      .order('created_at', { ascending: false });

    if (!fetchError && data) {
      const formattedDonors: DonorData[] = data.map((member: any) => {
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
          cancelledAt: member.cancelled_at,
        };
      });
      setDonors(formattedDonors);
    }
  }, [messengerId]);

  const pauseDonorRoute = useCallback(async (memberId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: updateError } = await supabase
        .from('members')
        .update({
          subscription_status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', memberId);

      if (updateError) throw updateError;

      // Refresh donors list
      await refreshDonors();

      return { success: true };
    } catch (err) {
      console.error('Error pausing donor route:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to pause route',
      };
    }
  }, [messengerId, refreshDonors]);

  const changeDonorRoute = useCallback(async (
    memberId: string,
    newType: 'one_time' | 'monthly'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: updateError } = await supabase
        .from('members')
        .update({
          subscription_type: newType,
        })
        .eq('id', memberId);

      if (updateError) throw updateError;

      // Refresh donors list
      await refreshDonors();

      return { success: true };
    } catch (err) {
      console.error('Error changing donor route:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to change route',
      };
    }
  }, [messengerId, refreshDonors]);

  const fetchDonorPayments = useCallback(async (memberId: string): Promise<PaymentHistoryItem[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('related_member_id', memberId)
        .eq('type', 'member_payment')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      return (data || []).map((transaction: Transaction) => ({
        id: transaction.id,
        amount: Number(transaction.amount),
        currency: transaction.currency || 'ILS',
        status: transaction.status,
        description: transaction.description,
        createdAt: transaction.created_at 
          ? new Date(transaction.created_at).toLocaleDateString('he-IL')
          : '',
      }));
    } catch (err) {
      console.error('Error fetching donor payments:', err);
      return [];
    }
  }, []);

  const fetchDonorPrayers = useCallback(async (memberId: string): Promise<PrayerNameItem[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('member_id', memberId)
        .order('submitted_at', { ascending: false });

      if (fetchError) throw fetchError;

      return (data || []).map((prayer: PrayerRequest) => ({
        id: prayer.id,
        prayerSubjectName: prayer.prayer_subject_name,
        prayerIntention: prayer.prayer_intention,
        status: prayer.status,
        submittedAt: prayer.submitted_at 
          ? new Date(prayer.submitted_at).toLocaleDateString('he-IL')
          : '',
        completedAt: prayer.completed_at 
          ? new Date(prayer.completed_at).toLocaleDateString('he-IL')
          : null,
      }));
    } catch (err) {
      console.error('Error fetching donor prayers:', err);
      return [];
    }
  }, []);

  const reactivateDonorRoute = useCallback(async (memberId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: updateError } = await supabase
        .from('members')
        .update({
          subscription_status: 'active',
          cancelled_at: null,
        })
        .eq('id', memberId);

      if (updateError) throw updateError;

      // Refresh donors list
      await refreshDonors();

      return { success: true };
    } catch (err) {
      console.error('Error reactivating donor route:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to reactivate route',
      };
    }
  }, [messengerId, refreshDonors]);

  return {
    donors,
    loading,
    error,
    pauseDonorRoute,
    changeDonorRoute,
    reactivateDonorRoute,
    fetchDonorPayments,
    fetchDonorPrayers,
  };
}

