import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { MessengerWithStats, CreateMessengerData, UpdateMessengerData, AdminMessengersStats } from '../types';

interface Filters {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  planType?: 'all' | '18' | '30';
}

export function useAdminMessengers() {
  const [messengers, setMessengers] = useState<MessengerWithStats[]>([]);
  const [stats, setStats] = useState<AdminMessengersStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessengers = async (filters?: Filters) => {
    try {
      console.log('fetchMessengers started', filters);
      setLoading(true);
      setError(null);

      // Build the query with filters
      let query = supabase
        .from('messengers')
        .select(`
          id,
          user_id,
          landing_page_slug,
          plan_type,
          wallet_balance,
          commission_rate_one_time,
          commission_rate_monthly,
          is_active,
          created_at,
          custom_goal_text,
          symbol,
          user:users!messengers_user_id_fkey (
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status === 'active') {
        query = query.eq('is_active', true);
      } else if (filters?.status === 'inactive') {
        query = query.eq('is_active', false);
      }

      if (filters?.planType && filters.planType !== 'all') {
        query = query.eq('plan_type', filters.planType);
      }

      const { data: messengersData, error: messengersError } = await query;
      console.log('messengers fetched:', messengersData?.length);

      if (messengersError) throw messengersError;

      if (!messengersData || messengersData.length === 0) {
        console.log('No messengers found');

        setMessengers([]);
        setStats({
          total_messengers: 0,
          active_messengers: 0,
          total_donors: 0,
          this_month_revenue: 0,
          total_commissions_paid: 0,
        });
        return;
      }

      // Get all messenger IDs for batch queries
      const messengerIds = messengersData.map((m: any) => m.id);

      // Batch fetch members data
      console.log('Fetching members for messengers:', messengerIds);
      const { data: allMembersData } = await supabase
        .from('members')
        .select('id, messenger_id, subscription_status')
        .in('messenger_id', messengerIds);
      console.log('Members fetched:', allMembersData?.length);

      // Batch fetch transactions data
      console.log('Fetching transactions...');
      const { data: allTransactionsData } = await supabase
        .from('transactions')
        .select('amount, created_at, related_messenger_id')
        .in('related_messenger_id', messengerIds)
        .eq('type', 'messenger_commission')
        .eq('status', 'completed');
      console.log('Transactions fetched:', allTransactionsData?.length);

      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      thisMonthStart.setHours(0, 0, 0, 0);

      // Process each messenger with the batched data
      const messengersWithStats: MessengerWithStats[] = messengersData.map((messenger: any) => {
        const userData = messenger.user as any;

        // Filter data for this messenger
        const messengerMembers = allMembersData?.filter(m => m.messenger_id === messenger.id) || [];
        const messengerTransactions = allTransactionsData?.filter(t => t.related_messenger_id === messenger.id) || [];

        const totalDonors = messengerMembers.length;
        const activeSubscriptions = messengerMembers.filter(m => m.subscription_status === 'active').length;
        const totalRevenue = messengerTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const thisMonthRevenue = messengerTransactions
          .filter(t => t.created_at && new Date(t.created_at) >= thisMonthStart)
          .reduce((sum, t) => sum + Number(t.amount), 0);

        return {
          id: messenger.id,
          user_id: messenger.user_id,
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone,
          landing_page_slug: messenger.landing_page_slug,
          plan_type: messenger.plan_type,
          wallet_balance: Number(messenger.wallet_balance),
          commission_rate_one_time: Number(messenger.commission_rate_one_time),
          commission_rate_monthly: Number(messenger.commission_rate_monthly),
          is_active: messenger.is_active,
          created_at: messenger.created_at,
          custom_goal_text: messenger.custom_goal_text,
          symbol: messenger.symbol,
          total_donors: totalDonors,
          active_subscriptions: activeSubscriptions,
          total_revenue: totalRevenue,
          this_month_revenue: thisMonthRevenue,
        };
      });

      // Apply search filter
      let filteredMessengers = messengersWithStats;
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredMessengers = messengersWithStats.filter(m =>
          m.full_name.toLowerCase().includes(searchLower) ||
          m.email.toLowerCase().includes(searchLower) ||
          m.landing_page_slug.toLowerCase().includes(searchLower)
        );
      }

      setMessengers(filteredMessengers);

      // Calculate overall stats
      const overallStats: AdminMessengersStats = {
        total_messengers: messengersWithStats.length,
        active_messengers: messengersWithStats.filter(m => m.is_active).length,
        total_donors: messengersWithStats.reduce((sum, m) => sum + m.total_donors, 0),
        this_month_revenue: messengersWithStats.reduce((sum, m) => sum + m.this_month_revenue, 0),
        total_commissions_paid: messengersWithStats.reduce((sum, m) => sum + m.total_revenue, 0),
      };

      setStats(overallStats);
      console.log('fetchMessengers completed successfully', {
        messengers: filteredMessengers.length,
        stats: overallStats
      });
    } catch (err) {
      console.error('Error fetching messengers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messengers');
    } finally {
      console.log('fetchMessengers finished, loading=false');
      setLoading(false);
    }
  };

  const createMessenger = async (data: CreateMessengerData): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(data.email, {
        data: {
          full_name: data.full_name,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create auth user');

      const userId = authData.user.id;

      // 2. Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          role: 'messenger',
        });

      if (userError) throw userError;

      // 3. Create messenger record
      const { error: messengerError } = await supabase
        .from('messengers')
        .insert({
          user_id: userId,
          plan_type: data.plan_type || '18', // Default to '18' if not provided
          landing_page_slug: data.landing_page_slug,
          commission_rate_one_time: data.commission_rate_one_time,
          commission_rate_monthly: data.commission_rate_monthly,
          custom_goal_text: data.custom_goal_text,
          symbol: data.symbol || null, // Will be uploaded to bucket in the future
          wallet_balance: 0,
          is_active: true,
        });

      if (messengerError) throw messengerError;

      // Refresh the list
      await fetchMessengers();

      return { success: true };
    } catch (err) {
      console.error('Error creating messenger:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create messenger' 
      };
    }
  };

  const updateMessenger = async (
    messengerId: string, 
    userId: string,
    data: UpdateMessengerData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Update user record if needed
      if (data.full_name || data.phone) {
        const userUpdates: any = {};
        if (data.full_name) userUpdates.full_name = data.full_name;
        if (data.phone) userUpdates.phone = data.phone;

        const { error: userError } = await supabase
          .from('users')
          .update(userUpdates)
          .eq('id', userId);

        if (userError) throw userError;
      }

      // Update messenger record
      const messengerUpdates: any = {};
      if (data.plan_type !== undefined) messengerUpdates.plan_type = data.plan_type;
      if (data.landing_page_slug) messengerUpdates.landing_page_slug = data.landing_page_slug;
      if (data.commission_rate_one_time !== undefined) messengerUpdates.commission_rate_one_time = data.commission_rate_one_time;
      if (data.commission_rate_monthly !== undefined) messengerUpdates.commission_rate_monthly = data.commission_rate_monthly;
      if (data.custom_goal_text !== undefined) messengerUpdates.custom_goal_text = data.custom_goal_text;
      if (data.symbol !== undefined) messengerUpdates.symbol = data.symbol;
      if (data.is_active !== undefined) messengerUpdates.is_active = data.is_active;

      const { error: messengerError } = await supabase
        .from('messengers')
        .update(messengerUpdates)
        .eq('id', messengerId);

      if (messengerError) throw messengerError;

      // Refresh the list
      await fetchMessengers();

      return { success: true };
    } catch (err) {
      console.error('Error updating messenger:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update messenger' 
      };
    }
  };

  const toggleMessengerStatus = async (messengerId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Get current status
      const messenger = messengers.find(m => m.id === messengerId);
      if (!messenger) throw new Error('Messenger not found');

      // Toggle status
      const { error } = await supabase
        .from('messengers')
        .update({ is_active: !messenger.is_active })
        .eq('id', messengerId);

      if (error) throw error;

      // Update local state
      setMessengers(prev => prev.map(m => 
        m.id === messengerId ? { ...m, is_active: !m.is_active } : m
      ));

      return { success: true };
    } catch (err) {
      console.error('Error toggling messenger status:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to toggle status' 
      };
    }
  };

  const checkSlugAvailability = async (slug: string, excludeMessengerId?: string): Promise<boolean> => {
    try {
      let query = supabase
        .from('messengers')
        .select('id')
        .eq('landing_page_slug', slug);

      if (excludeMessengerId) {
        query = query.neq('id', excludeMessengerId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.length === 0;
    } catch (err) {
      console.error('Error checking slug availability:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchMessengers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    messengers,
    stats,
    loading,
    error,
    fetchMessengers,
    createMessenger,
    updateMessenger,
    toggleMessengerStatus,
    checkSlugAvailability,
  };
}

