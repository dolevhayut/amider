import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface WithdrawalRequest {
  id: string;
  amount: number;
  bankName: string | null;
  bankBranch: string | null;
  bankAccount: string | null;
  bankAccountHolder: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | null;
  requestedAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  messengerName?: string; // For admin view
  messengerId?: string; // For admin view
}

export function useWithdrawals(messengerId?: string) {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithdrawals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('transactions')
        .select(`
          *,
          messenger:messengers!transactions_related_messenger_id_fkey (
            user:users!messengers_user_id_fkey (
              full_name
            )
          )
        `)
        .eq('type', 'withdrawal')
        .order('requested_at', { ascending: false });

      // Filter by messenger if provided
      if (messengerId) {
        query = query.eq('related_messenger_id', messengerId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const formattedWithdrawals: WithdrawalRequest[] = (data || []).map((txn: any) => ({
        id: txn.id,
        amount: Number(txn.amount),
        bankName: txn.bank_name,
        bankBranch: txn.bank_branch,
        bankAccount: txn.bank_account,
        bankAccountHolder: txn.bank_account_holder,
        status: txn.status,
        requestedAt: txn.requested_at 
          ? new Date(txn.requested_at).toLocaleDateString('he-IL')
          : new Date(txn.created_at).toLocaleDateString('he-IL'),
        approvedAt: txn.approved_at 
          ? new Date(txn.approved_at).toLocaleDateString('he-IL')
          : null,
        rejectionReason: txn.rejection_reason,
        messengerName: txn.messenger?.user?.full_name,
        messengerId: txn.related_messenger_id,
      }));

      setWithdrawals(formattedWithdrawals);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
      setError(err instanceof Error ? err.message : 'Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  }, [messengerId]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const requestWithdrawal = useCallback(async (
    messengerId: string,
    amount: number,
    bankDetails: {
      bankName: string;
      bankBranch: string;
      bankAccount: string;
      bankAccountHolder: string;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if messenger has enough balance
      const { data: messenger, error: messengerError } = await supabase
        .from('messengers')
        .select('wallet_balance')
        .eq('id', messengerId)
        .single();

      if (messengerError) throw messengerError;

      const currentBalance = Number(messenger.wallet_balance || 0);
      if (currentBalance < amount) {
        return {
          success: false,
          error: `יתרה לא מספיקה. יתרה נוכחית: ₪${currentBalance.toFixed(2)}`,
        };
      }

      // Create withdrawal transaction
      const { error: insertError } = await supabase
        .from('transactions')
        .insert({
          type: 'withdrawal',
          amount: amount,
          currency: 'ILS',
          status: 'pending',
          related_messenger_id: messengerId,
          bank_name: bankDetails.bankName,
          bank_branch: bankDetails.bankBranch,
          bank_account: bankDetails.bankAccount,
          bank_account_holder: bankDetails.bankAccountHolder,
          description: 'בקשת משיכה',
        });

      if (insertError) throw insertError;

      // Refresh withdrawals list
      await fetchWithdrawals();

      return { success: true };
    } catch (err) {
      console.error('Error requesting withdrawal:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to request withdrawal',
      };
    }
  }, [fetchWithdrawals]);

  const approveWithdrawal = useCallback(async (
    withdrawalId: string,
    adminId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Get withdrawal details
      const { data: withdrawal, error: withdrawalError } = await supabase
        .from('transactions')
        .select('amount, related_messenger_id')
        .eq('id', withdrawalId)
        .single();

      if (withdrawalError) throw withdrawalError;

      // Update withdrawal status
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          approved_at: new Date().toISOString(),
          approved_by_admin_id: adminId,
        })
        .eq('id', withdrawalId);

      if (updateError) throw updateError;

      // Deduct amount from messenger's wallet
      if (withdrawal.related_messenger_id) {
        const { data: messenger } = await supabase
          .from('messengers')
          .select('wallet_balance')
          .eq('id', withdrawal.related_messenger_id)
          .single();

        const newBalance = Number(messenger?.wallet_balance || 0) - Number(withdrawal.amount);

        await supabase
          .from('messengers')
          .update({ wallet_balance: newBalance })
          .eq('id', withdrawal.related_messenger_id);
      }

      // Refresh withdrawals list
      await fetchWithdrawals();

      return { success: true };
    } catch (err) {
      console.error('Error approving withdrawal:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to approve withdrawal',
      };
    }
  }, [fetchWithdrawals]);

  const rejectWithdrawal = useCallback(async (
    withdrawalId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'failed',
          rejection_reason: reason,
        })
        .eq('id', withdrawalId);

      if (updateError) throw updateError;

      // Refresh withdrawals list
      await fetchWithdrawals();

      return { success: true };
    } catch (err) {
      console.error('Error rejecting withdrawal:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to reject withdrawal',
      };
    }
  }, [fetchWithdrawals]);

  return {
    withdrawals,
    loading,
    error,
    requestWithdrawal,
    approveWithdrawal,
    rejectWithdrawal,
    refreshWithdrawals: fetchWithdrawals,
  };
}

