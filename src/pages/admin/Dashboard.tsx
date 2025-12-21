import { useState } from 'react';
import { Users, UserCheck, TrendingUp, DollarSign, Heart, Activity } from 'lucide-react';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card } from '../../components/shared/Card';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';

// Mock data
const mockAdminStats = {
  totalMessengers: 127,
  totalMembers: 1834,
  activeSubscriptions: 1621,
  monthlyRecurringRevenue: 48630,
  churnRate: 2.8,
  totalPrayers: 4521,
};

const mockMessengers = [
  {
    id: '1',
    name: 'אברהם לוי',
    email: 'abraham@example.com',
    planType: '30',
    members: 45,
    status: 'active',
    walletBalance: 1580,
  },
  {
    id: '2',
    name: 'יצחק כהן',
    email: 'yitzhak@example.com',
    planType: '18',
    members: 32,
    status: 'active',
    walletBalance: 960,
  },
];

const mockMembers = [
  {
    id: '1',
    name: 'שרה לוי',
    email: 'sarah@example.com',
    messenger: 'אברהם לוי',
    subscriptionType: 'monthly',
    status: 'active',
    joined: '2024-01-15',
  },
  {
    id: '2',
    name: 'רבקה כהן',
    email: 'rivka@example.com',
    messenger: 'יצחק כהן',
    subscriptionType: 'one_time',
    status: 'active',
    joined: '2024-02-20',
  },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'messengers' | 'members' | 'prayers'>('overview');
  
  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">לוח בקרה - מנהל</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">ניהול כללי של המערכת</p>
      </div>
      
      {/* Main Stats - Mobile: 2 cols, Tablet: 3 cols, Desktop: 6 cols */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="שליחים"
          value={mockAdminStats.totalMessengers}
          icon={UserCheck}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="מצטרפים"
          value={mockAdminStats.totalMembers}
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="מנויים פעילים"
          value={mockAdminStats.activeSubscriptions}
          icon={Activity}
        />
        <StatsCard
          title="MRR"
          value={`₪${mockAdminStats.monthlyRecurringRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatsCard
          title="Churn Rate"
          value={`${mockAdminStats.churnRate}%`}
          icon={TrendingUp}
          trend={{ value: 0.3, isPositive: false }}
        />
        <StatsCard
          title="תפילות"
          value={mockAdminStats.totalPrayers}
          icon={Heart}
        />
      </div>
      
      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              סקירה
            </button>
            <button
              onClick={() => setActiveTab('messengers')}
              className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                activeTab === 'messengers'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              שליחים
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                activeTab === 'members'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              מצטרפים
            </button>
            <button
              onClick={() => setActiveTab('prayers')}
              className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                activeTab === 'prayers'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              תפילות
            </button>
          </nav>
        </div>
        
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">צמיחה חודשית</h3>
                  <div className="text-3xl font-bold text-indigo-600">+12.5%</div>
                  <p className="text-sm text-gray-600 mt-2">מצטרפים חדשים החודש: 228</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">הכנסות החודש</h3>
                  <div className="text-3xl font-bold text-green-600">₪{mockAdminStats.monthlyRecurringRevenue.toLocaleString()}</div>
                  <p className="text-sm text-gray-600 mt-2">עלייה של 15.3% ביחס לחודש שעבר</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">פעולות מהירות</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="secondary" className="w-full">קמפיין חדש</Button>
                  <Button variant="secondary" className="w-full">ניהול מטרות</Button>
                  <Button variant="secondary" className="w-full">דוחות</Button>
                  <Button variant="secondary" className="w-full">הגדרות</Button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'messengers' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">סה''כ {mockMessengers.length} שליחים</p>
                <div className="flex gap-2">
                  <input
                    type="search"
                    placeholder="חפש שליח..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <Button size="sm">ייצוא</Button>
                </div>
              </div>
              
              <DataTable
                data={mockMessengers}
                columns={[
                  { key: 'name', header: 'שם' },
                  { key: 'email', header: 'אימייל' },
                  {
                    key: 'planType',
                    header: 'מסלול',
                    render: (item) => (
                      <Badge variant={item.planType === '30' ? 'success' : 'info'}>
                        ₪{item.planType}
                      </Badge>
                    ),
                  },
                  { key: 'members', header: 'מצטרפים' },
                  {
                    key: 'walletBalance',
                    header: 'יתרת ארנק',
                    render: (item) => `₪${item.walletBalance}`,
                  },
                  {
                    key: 'status',
                    header: 'סטטוס',
                    render: (item) => (
                      <Badge variant={item.status === 'active' ? 'success' : 'danger'}>
                        {item.status === 'active' ? 'פעיל' : 'מושהה'}
                      </Badge>
                    ),
                  },
                ]}
              />
            </div>
          )}
          
          {activeTab === 'members' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">סה''כ {mockMembers.length} מצטרפים</p>
                <div className="flex gap-2">
                  <input
                    type="search"
                    placeholder="חפש מצטרף..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <Button size="sm">ייצוא</Button>
                </div>
              </div>
              
              <DataTable
                data={mockMembers}
                columns={[
                  { key: 'name', header: 'שם' },
                  { key: 'email', header: 'אימייל' },
                  { key: 'messenger', header: 'שליח' },
                  {
                    key: 'subscriptionType',
                    header: 'סוג מנוי',
                    render: (item) => (
                      <Badge variant={item.subscriptionType === 'monthly' ? 'success' : 'info'}>
                        {item.subscriptionType === 'monthly' ? 'חודשי' : 'חד-פעמי'}
                      </Badge>
                    ),
                  },
                  {
                    key: 'status',
                    header: 'סטטוס',
                    render: (item) => (
                      <Badge variant={item.status === 'active' ? 'success' : 'danger'}>
                        {item.status === 'active' ? 'פעיל' : 'לא פעיל'}
                      </Badge>
                    ),
                  },
                  { key: 'joined', header: 'תאריך הצטרפות' },
                ]}
              />
            </div>
          )}
          
          {activeTab === 'prayers' && (
            <div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <Heart className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">מערכת תפילות</h3>
                <p className="text-gray-600 mt-2">
                  סה''כ {mockAdminStats.totalPrayers} תפילות פעילות במערכת
                </p>
                <div className="mt-4 flex gap-4 justify-center">
                  <Button>צפייה בתפילות</Button>
                  <Button variant="secondary">ייצוא רשימה</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

