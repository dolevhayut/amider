import { TrendingUp, Users, UserCheck, Heart } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { useAnalytics } from '../../hooks/useAnalytics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function AdminAnalytics() {
  const { monthlyData, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">שגיאה בטעינת הנתונים</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📊 דוחות וגרפים</h1>
          <HebrewDateDisplay />
        </div>
        <p className="text-sm sm:text-base text-gray-600">ניתוח נתונים והתפתחות המערכת</p>
      </div>

      {/* Growth Chart - Donors & Messengers */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">צמיחת המערכת - 6 חודשים אחרונים</h2>
          </div>
        }
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                reversed={true}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  direction: 'rtl'
                }}
              />
              <Legend 
                wrapperStyle={{ direction: 'rtl', paddingTop: '20px' }}
              />
              <Line 
                type="monotone" 
                dataKey="donors" 
                stroke="#4f46e5" 
                strokeWidth={3}
                name="לקוחות חדשים"
                dot={{ fill: '#4f46e5', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="messengers" 
                stroke="#10b981" 
                strokeWidth={3}
                name="שליחים חדשים"
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 <strong>תובנה:</strong> הגרף מציג את מספר ההצטרפויות החדשות כל חודש. קו עולה = צמיחה חיובית!
          </p>
        </div>
      </Card>

      {/* Prayers Chart */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">תפילות לאורך זמן</h2>
          </div>
        }
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                reversed={true}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  direction: 'rtl'
                }}
              />
              <Legend wrapperStyle={{ direction: 'rtl', paddingTop: '20px' }} />
              <Bar 
                dataKey="prayers" 
                fill="#ec4899" 
                name="תפילות חדשות"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-pink-50 rounded-lg">
          <p className="text-sm text-gray-700">
            💝 מספר התפילות החדשות שהוגשו כל חודש
          </p>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-6 w-6 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">לקוחות</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ממוצע חודשי:</span>
                <span className="font-bold">
                  {monthlyData.length > 0
                    ? Math.round(monthlyData.reduce((sum, m) => sum + m.donors, 0) / monthlyData.length)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">החודש הכי טוב:</span>
                <span className="font-bold text-indigo-600">
                  {monthlyData.length > 0
                    ? Math.max(...monthlyData.map(m => m.donors))
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <UserCheck className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">שליחים</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ממוצע חודשי:</span>
                <span className="font-bold">
                  {monthlyData.length > 0
                    ? Math.round(monthlyData.reduce((sum, m) => sum + m.messengers, 0) / monthlyData.length)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">החודש הכי טוב:</span>
                <span className="font-bold text-green-600">
                  {monthlyData.length > 0
                    ? Math.max(...monthlyData.map(m => m.messengers))
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-red-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-6 w-6 text-pink-600" />
              <h3 className="font-semibold text-gray-900">תפילות</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ממוצע חודשי:</span>
                <span className="font-bold">
                  {monthlyData.length > 0
                    ? Math.round(monthlyData.reduce((sum, m) => sum + m.prayers, 0) / monthlyData.length)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">החודש הכי טוב:</span>
                <span className="font-bold text-pink-600">
                  {monthlyData.length > 0
                    ? Math.max(...monthlyData.map(m => m.prayers))
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

