import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MonthlyData {
  month: string;
  donors: number;
  messengers: number;
  prayers: number;
}

export interface MessengerGrowthData {
  month: string;
  donors: number;
  activeDonors: number;
}

export function useAnalytics(messengerId?: string) {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [messengerGrowth, setMessengerGrowth] = useState<MessengerGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError(null);

        // Get last 6 months
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          last6Months.push({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            label: date.toLocaleDateString('he-IL', { year: 'numeric', month: 'short' }),
          });
        }

        // If no messengerId, fetch system-wide analytics (for admin)
        if (!messengerId) {
          const monthlyAnalytics: MonthlyData[] = await Promise.all(
            last6Months.map(async ({ year, month, label }) => {
              const startDate = new Date(year, month - 1, 1).toISOString();
              const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

              // Count new donors
              const { count: donorsCount } = await supabase
                .from('members')
                .select('id', { count: 'exact', head: true })
                .gte('created_at', startDate)
                .lte('created_at', endDate);

              // Count new messengers
              const { count: messengersCount } = await supabase
                .from('messengers')
                .select('id', { count: 'exact', head: true })
                .gte('created_at', startDate)
                .lte('created_at', endDate);

              // Count prayers
              const { count: prayersCount } = await supabase
                .from('prayer_requests')
                .select('id', { count: 'exact', head: true })
                .gte('submitted_at', startDate)
                .lte('submitted_at', endDate);

              return {
                month: label,
                donors: donorsCount || 0,
                messengers: messengersCount || 0,
                prayers: prayersCount || 0,
              };
            })
          );

          setMonthlyData(monthlyAnalytics);
        } else {
          // Fetch messenger-specific growth
          const messengerGrowthData: MessengerGrowthData[] = await Promise.all(
            last6Months.map(async ({ year, month, label }) => {
              const startDate = new Date(year, month - 1, 1).toISOString();
              const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

              // Count new donors for this messenger
              const { count: donorsCount } = await supabase
                .from('members')
                .select('id', { count: 'exact', head: true })
                .eq('messenger_id', messengerId)
                .gte('created_at', startDate)
                .lte('created_at', endDate);

              // Count active donors at end of month
              const { count: activeCount } = await supabase
                .from('members')
                .select('id', { count: 'exact', head: true })
                .eq('messenger_id', messengerId)
                .eq('subscription_status', 'active')
                .lte('created_at', endDate);

              return {
                month: label,
                donors: donorsCount || 0,
                activeDonors: activeCount || 0,
              };
            })
          );

          setMessengerGrowth(messengerGrowthData);
        }

      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [messengerId]);

  return {
    monthlyData,
    messengerGrowth,
    loading,
    error,
  };
}

