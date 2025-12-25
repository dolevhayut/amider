import { useState } from 'react';
import { Users, UserCheck, TrendingUp, Heart, Activity, Award } from 'lucide-react';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card } from '../../components/shared/Card';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/shared/Badge';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { useAdminStats } from '../../hooks/useAdminStats';

export function AdminDashboard() {
  const { stats, topMessengers, recentDonors, todayPrayers, loading, error } = useAdminStats();
  const [activeTab, setActiveTab] = useState<'overview' | 'messengers' | 'donors' | 'prayers'>('overview');

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

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">אין נתונים להצגה</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">שלום עמית!</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">סקירה כללית של מיזם עמי-דר</p>
        </div>
        <HebrewDateDisplay className="sm:mt-2" />
      </div>
      
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatsCard
          title="שליחים"
          value={stats.totalMessengers}
          icon={UserCheck}
        />
        <StatsCard
          title="שליחים פעילים"
          value={stats.activeMessengers}
          icon={Activity}
        />
        <StatsCard
          title="לקוחות"
          value={stats.totalDonors}
          icon={Users}
        />
        <StatsCard
          title="לקוחות פעילים"
          value={stats.activeDonors}
          icon={TrendingUp}
        />
        <StatsCard
          title="מנויים חודשיים"
          value={stats.monthlySubscriptions}
          icon={Award}
        />
        <StatsCard
          title="תפילות פעילות"
          value={stats.activePrayers}
          icon={Heart}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">מנויים חד-פעמי</p>
            <p className="text-2xl font-bold text-purple-600">{stats.oneTimeSubscriptions}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">סה"כ תפילות</p>
            <p className="text-2xl font-bold text-indigo-600">{stats.totalPrayers}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">תפילות הושלמו</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedPrayers}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">אחוז השלמה</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalPrayers > 0 
                ? Math.round((stats.completedPrayers / stats.totalPrayers) * 100) 
                : 0}%
            </p>
          </div>
        </Card>
      </div>
      
      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex gap-2 overflow-x-auto">
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
              לקוחות חדשים
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
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">צמיחה במערכת</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">שליחים פעילים:</span>
                      <span className="font-semibold">{stats.activeMessengers} מתוך {stats.totalMessengers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">לקוחות פעילים:</span>
                      <span className="font-semibold">{stats.activeDonors} מתוך {stats.totalDonors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">אחוז שימור:</span>
                      <span className="font-semibold text-green-600">
                        {stats.totalDonors > 0 
                          ? Math.round((stats.activeDonors / stats.totalDonors) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">תפילות</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">סה"כ תפילות:</span>
                      <span className="font-semibold">{stats.totalPrayers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">פעילות:</span>
                      <span className="font-semibold text-green-600">{stats.activePrayers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">הושלמו:</span>
                      <span className="font-semibold text-blue-600">{stats.completedPrayers}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 sm:p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">סוגי מנויים</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{stats.monthlySubscriptions}</p>
                    <p className="text-sm text-gray-600 mt-1">מנויים חודשיים</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600">{stats.oneTimeSubscriptions}</p>
                    <p className="text-sm text-gray-600 mt-1">מנויים חד-פעמי</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MESSENGERS TAB */}
          {activeTab === 'messengers' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold text-indigo-600">{topMessengers.length} שליחים מצטיינים</span> לפי מספר לקוחות
              </p>
              {topMessengers.length > 0 ? (
                <DataTable
                  data={topMessengers}
                  columns={[
                    { 
                      key: 'name', 
                      header: 'שם',
                      render: (item) => (
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-600">/{item.slug}</p>
                        </div>
                      )
                    },
                    { 
                      key: 'donors', 
                      header: 'לקוחות',
                      render: (item) => (
                        <span className="font-semibold text-indigo-600">{item.donors}</span>
                      )
                    },
                    { 
                      key: 'activeSubscriptions', 
                      header: 'פעילים',
                      render: (item) => (
                        <span className="font-semibold text-green-600">{item.activeSubscriptions}</span>
                      )
                    },
                    { 
                      key: 'joinDate', 
                      header: 'הצטרף',
                      render: (item) => (
                        <span className="text-sm text-gray-600">{item.joinDate}</span>
                      )
                    },
                  ]}
                />
              ) : (
                <p className="text-center text-gray-500 py-8">אין נתונים להצגה</p>
              )}
            </div>
          )}

          {/* DONORS TAB */}
          {activeTab === 'donors' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold text-green-600">{recentDonors.length} לקוחות חדשים</span> לאחרונה
              </p>
              {recentDonors.length > 0 ? (
                <DataTable
                  data={recentDonors}
                  columns={[
                    { key: 'name', header: 'שם' },
                    { key: 'messengerName', header: 'שליח' },
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
                      key: 'subscriptionStatus',
                      header: 'סטטוס',
                      render: (item) => (
                        <Badge variant={item.subscriptionStatus === 'active' ? 'success' : 'warning'}>
                          {item.subscriptionStatus === 'active' ? 'פעיל' : item.subscriptionStatus}
                        </Badge>
                      ),
                    },
                    { key: 'joinDate', header: 'הצטרף' },
                  ]}
                />
              ) : (
                <p className="text-center text-gray-500 py-8">אין נתונים להצגה</p>
              )}
            </div>
          )}

          {/* PRAYERS TAB */}
          {activeTab === 'prayers' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold text-red-600">{todayPrayers.length} תפילות פעילות</span> במערכת
              </p>
              {todayPrayers.length > 0 ? (
                <div className="space-y-3">
                  {todayPrayers.map((prayer) => (
                    <div key={prayer.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            <h4 className="font-semibold text-gray-900">{prayer.prayerSubjectName}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{prayer.prayerIntention}</p>
                          <p className="text-xs text-gray-500">שליח: {prayer.messengerName}</p>
                        </div>
                        <Badge variant="success">פעיל</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">אין תפילות פעילות</p>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
