import { useState } from 'react';
import { Users, UserCheck, TrendingUp, DollarSign, Heart, Activity, Award, Calendar, Upload, Send, UserCircle, Percent } from 'lucide-react';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card } from '../../components/shared/Card';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';

// Mock data
const mockAdminStats = {
  totalMessengers: 127,
  totalDonors: 1834,
  activeSubscriptions: 1621,
  monthlyRecurringRevenue: 48630,
  churnRate: 2.8,
  totalPrayers: 4521,
};

const mockTopMessengers = [
  {
    id: '1',
    name: 'אסף כהן',
    slug: 'asaf156',
    donors: 85,
    activeSubscriptions: 78,
    totalRevenue: 4680,
    thisMonthRevenue: 390,
    commissionRateOneTime: 16.67,
    commissionRateMonthly: 16.67,
    joinDate: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'נמרוד לוי',
    slug: 'nimrod42',
    donors: 62,
    activeSubscriptions: 59,
    totalRevenue: 3540,
    thisMonthRevenue: 295,
    commissionRateOneTime: 18.00,
    commissionRateMonthly: 18.00,
    joinDate: '2024-02-10',
    status: 'active',
  },
  {
    id: '3',
    name: 'בתיה מזרחי',
    slug: 'batya88',
    donors: 51,
    activeSubscriptions: 48,
    totalRevenue: 2880,
    thisMonthRevenue: 240,
    commissionRateOneTime: 15.00,
    commissionRateMonthly: 15.00,
    joinDate: '2024-03-05',
    status: 'active',
  },
];

const mockRecentDonors = [
  {
    id: '1',
    name: 'דוד שלום',
    messenger: 'אסף כהן',
    subscriptionType: 'monthly',
    amount: 30,
    status: 'active',
    joinDate: '2024-12-20',
  },
  {
    id: '2',
    name: 'רחל אברהם',
    messenger: 'נמרוד לוי',
    subscriptionType: 'yearly',
    amount: 360,
    status: 'active',
    joinDate: '2024-12-19',
  },
  {
    id: '3',
    name: 'משה יצחק',
    messenger: 'בתיה מזרחי',
    subscriptionType: 'monthly',
    amount: 30,
    status: 'active',
    joinDate: '2024-12-18',
  },
];

const mockTodaysPrayers = [
  { name: 'משה בן רחל', intention: 'רפואה שלמה', messenger: 'אסף כהן' },
  { name: 'שרה בת מרים', intention: 'שידוך הגון', messenger: 'נמרוד לוי' },
  { name: 'יעקב בן אברהם', intention: 'פרנסה טובה', messenger: 'בתיה מזרחי' },
  { name: 'לאה בת רבקה', intention: 'זרע של קיימא', messenger: 'אסף כהן' },
];

const mockCampaigns = [
  { id: '1', name: 'קמפיין חנוכה 2024', status: 'sent', sentDate: '2024-12-15', clicks: 342 },
  { id: '2', name: 'עמדת תפילין מיוחדת', status: 'scheduled', scheduledDate: '2024-12-25' },
  { id: '3', name: 'תיקון כללי לפורים', status: 'draft' },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'messengers' | 'donors' | 'prayers' | 'campaigns'>('overview');
  
  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div className="flex items-center gap-3">
        <UserCircle className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">שלום עמית!</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">סקירה כללית של מיזם עמי-דר</p>
        </div>
      </div>
      
      {/* Main Stats - Mobile: 2 cols, Tablet: 3 cols, Desktop: 6 cols */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="שליחים פעילים"
          value={mockAdminStats.totalMessengers}
          icon={UserCheck}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="תורמים"
          value={mockAdminStats.totalDonors}
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="מנויים פעילים"
          value={mockAdminStats.activeSubscriptions}
          icon={Activity}
        />
        <StatsCard
          title="הכנסות חודשיות"
          value={`₪${mockAdminStats.monthlyRecurringRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatsCard
          title="שיעור נשירה"
          value={`${mockAdminStats.churnRate}%`}
          icon={TrendingUp}
          trend={{ value: 0.3, isPositive: false }}
        />
        <StatsCard
          title="תפילות היום"
          value={mockTodaysPrayers.length}
          icon={Heart}
        />
      </div>
      
      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex gap-2 sm:gap-4 min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 sm:px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              סקירה
            </button>
            <button
              onClick={() => setActiveTab('messengers')}
              className={`px-3 sm:px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'messengers'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              שליחים מצטיינים
            </button>
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-3 sm:px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'donors'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              תורמים חדשים
            </button>
            <button
              onClick={() => setActiveTab('prayers')}
              className={`px-3 sm:px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'prayers'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              תפילות היום
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-3 sm:px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'campaigns'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              קמפיינים
            </button>
          </nav>
        </div>
        
        <div className="mt-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">צמיחה חודשית</h3>
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-600">+12.5%</div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">תורמים חדשים החודש: 228</p>
                  <p className="text-xs sm:text-sm text-gray-600">שליחים חדשים: 8</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">הכנסות החודש</h3>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">₪{mockAdminStats.monthlyRecurringRevenue.toLocaleString()}</div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">עלייה של 15.3% ביחס לחודש שעבר</p>
                  <p className="text-xs sm:text-sm text-gray-600">תשלום לשליחים החודש: ₪{(mockAdminStats.monthlyRecurringRevenue * 0.2).toLocaleString()}</p>
                </div>
              </div>
              
              {/* Top 3 Messengers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    3 השליחים המצטיינים
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {mockTopMessengers.map((messenger, index) => (
                    <div key={messenger.id} className={`p-4 rounded-lg border-2 ${
                      index === 0 ? 'border-yellow-400 bg-yellow-50' :
                      index === 1 ? 'border-gray-300 bg-gray-50' :
                      'border-orange-300 bg-orange-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`text-2xl font-bold ${
                          index === 0 ? 'text-yellow-600' :
                          index === 1 ? 'text-gray-600' :
                          'text-orange-600'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{messenger.name}</p>
                          <p className="text-xs text-gray-600">/{messenger.slug}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">תורמים:</span>
                          <span className="font-semibold">{messenger.donors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">מנויים פעילים:</span>
                          <span className="font-semibold">{messenger.activeSubscriptions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">הרוויח החודש:</span>
                          <span className="font-semibold text-green-600">₪{messenger.thisMonthRevenue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">פעולות מהירות</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <Button variant="secondary" className="w-full flex-col h-auto py-4">
                    <Upload className="h-5 w-5 mb-1" />
                    <span className="text-xs sm:text-sm">העלה תוכן</span>
                  </Button>
                  <Button variant="secondary" className="w-full flex-col h-auto py-4">
                    <Send className="h-5 w-5 mb-1" />
                    <span className="text-xs sm:text-sm">שלח קמפיין</span>
                  </Button>
                  <Button variant="secondary" className="w-full flex-col h-auto py-4">
                    <Heart className="h-5 w-5 mb-1" />
                    <span className="text-xs sm:text-sm">תפילות היום</span>
                  </Button>
                  <Button variant="secondary" className="w-full flex-col h-auto py-4">
                    <TrendingUp className="h-5 w-5 mb-1" />
                    <span className="text-xs sm:text-sm">דוחות</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* MESSENGERS TAB */}
          {activeTab === 'messengers' && (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <p className="text-sm text-gray-600">סה''כ {mockAdminStats.totalMessengers} שליחים במערכת</p>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="search"
                    placeholder="חפש שליח..."
                    className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <Button size="sm">ייצוא</Button>
                </div>
              </div>
              
              <DataTable
                data={mockTopMessengers}
                columns={[
                  { 
                    key: 'name', 
                    header: 'שם',
                    render: (item) => (
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">/{item.slug}</p>
                      </div>
                    )
                  },
                  { 
                    key: 'donors', 
                    header: 'תורמים',
                    render: (item) => (
                      <span className="font-semibold text-indigo-600">{item.donors}</span>
                    )
                  },
                  { 
                    key: 'activeSubscriptions', 
                    header: 'פעילים' 
                  },
                  {
                    key: 'commissionRateOneTime',
                    header: 'אחוז עמלה',
                    render: (item) => (
                      <span className="flex items-center gap-1 justify-end">
                        <Percent className="h-3 w-3 text-purple-600" />
                        <span className="font-medium">{item.commissionRateOneTime}%</span>
                      </span>
                    ),
                  },
                  {
                    key: 'thisMonthRevenue',
                    header: 'הרוויח החודש',
                    render: (item) => (
                      <span className="font-semibold text-green-600">₪{item.thisMonthRevenue}</span>
                    ),
                  },
                  {
                    key: 'totalRevenue',
                    header: 'סה"כ הרוויח',
                    render: (item) => `₪${item.totalRevenue}`,
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
          
          {/* DONORS TAB */}
          {activeTab === 'donors' && (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-green-600">{mockRecentDonors.length} תורמים חדשים</span> בשבוע האחרון
                </p>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="search"
                    placeholder="חפש תורם..."
                    className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <Button size="sm">ייצוא</Button>
                </div>
              </div>
              
              <DataTable
                data={mockRecentDonors}
                columns={[
                  { key: 'name', header: 'שם' },
                  { key: 'messenger', header: 'שליח' },
                  {
                    key: 'subscriptionType',
                    header: 'סוג מנוי',
                    render: (item) => (
                      <Badge variant={item.subscriptionType === 'monthly' ? 'success' : 'info'}>
                        {item.subscriptionType === 'monthly' ? 'חודשי' : 'שנתי'}
                      </Badge>
                    ),
                  },
                  {
                    key: 'amount',
                    header: 'סכום',
                    render: (item) => `₪${item.amount}`,
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
                  { key: 'joinDate', header: 'תאריך הצטרפות' },
                ]}
              />
            </div>
          )}
          
          {/* PRAYERS TAB */}
          {activeTab === 'prayers' && (
            <div>
              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">רשימת תפילות ליום {new Date().toLocaleDateString('he-IL')}</h3>
                    <p className="text-sm text-gray-600">סה"כ {mockTodaysPrayers.length} תפילות להזכיר היום</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button>
                    <Heart className="h-4 w-4" />
                    הדפס רשימה
                  </Button>
                  <Button variant="secondary">שלח לשליח חיצוני</Button>
                </div>
              </div>
              
              <DataTable
                data={mockTodaysPrayers}
                columns={[
                  { 
                    key: 'name', 
                    header: 'שם למתפלל',
                    render: (item) => (
                      <span className="font-medium">{item.name}</span>
                    )
                  },
                  { key: 'intention', header: 'מטרת התפילה' },
                  { 
                    key: 'messenger', 
                    header: 'שליח',
                    render: (item) => (
                      <Badge variant="info">{item.messenger}</Badge>
                    )
                  },
                ]}
              />
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  💡 <strong>טיפ:</strong> הרשימה מתעדכנת אוטומטית מכל התורמים הפעילים של כל השליחים במערכת
                </p>
              </div>
            </div>
          )}
          
          {/* CAMPAIGNS TAB */}
          {activeTab === 'campaigns' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ניהול קמפיינים</h3>
                  <p className="text-sm text-gray-600 mt-1">צור תוכן שיווקי שכל שליח יקבל עם הלינק האישי שלו</p>
                </div>
                <Button>
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">קמפיין חדש</span>
                </Button>
              </div>
              
              <DataTable
                data={mockCampaigns}
                columns={[
                  { key: 'name', header: 'שם קמפיין' },
                  {
                    key: 'status',
                    header: 'סטטוס',
                    render: (item) => (
                      <Badge 
                        variant={
                          item.status === 'sent' ? 'success' : 
                          item.status === 'scheduled' ? 'warning' : 
                          'default'
                        }
                      >
                        {item.status === 'sent' ? 'נשלח' : 
                         item.status === 'scheduled' ? 'מתוזמן' : 
                         'טיוטה'}
                      </Badge>
                    ),
                  },
                  {
                    key: 'date',
                    header: 'תאריך',
                    render: (item) => item.sentDate || item.scheduledDate || '-',
                  },
                  {
                    key: 'clicks',
                    header: 'קליקים',
                    render: (item) => item.clicks || '-',
                  },
                ]}
              />
              
              <div className="mt-6 bg-indigo-50 p-4 sm:p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">💡 איך זה עובד?</h4>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li>1. העלה תמונה/סרטון לקמפיין</li>
                  <li>2. המערכת תיצור גרסה אישית לכל שליח עם הלינק שלו</li>
                  <li>3. כל שליח יקבל את התוכן ויוכל לפרסם ברשתות החברתיות</li>
                  <li>4. עקוב אחרי תוצאות - מי פרסם, כמה קליקים, כמה המרות</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
