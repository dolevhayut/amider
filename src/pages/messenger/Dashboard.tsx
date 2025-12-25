import { useState } from 'react';
import { Users, DollarSign, Wallet, Heart, Copy, QrCode, Share2, TrendingUp } from 'lucide-react';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/shared/Badge';
import QRCode from 'react-qr-code';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { WithdrawalModal } from '../../components/messenger/WithdrawalModal';
import { useMessengerData } from '../../hooks/useMessengerData';
import { useMessengerDonors } from '../../hooks/useMessengerDonors';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useAnalytics } from '../../hooks/useAnalytics';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function MessengerDashboard() {
  const [copied, setCopied] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const { stats, profile, loading, error } = useMessengerData();
  const { donors } = useMessengerDonors(profile?.id);
  const { withdrawals, requestWithdrawal } = useWithdrawals(profile?.id);
  const { myRankInfo, loading: rankLoading } = useLeaderboard(profile?.id);
  const { messengerGrowth, loading: analyticsLoading } = useAnalytics(profile?.id);
  
  const landingPageUrl = profile 
    ? `${window.location.origin}/m/${profile.landing_page_slug}`
    : '';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(landingPageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
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

  if (!stats || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">לא נמצאו נתוני שליח</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">לוח בקרה - שליח</h1>
          <HebrewDateDisplay />
        </div>
        <p className="text-sm sm:text-base text-gray-600">סקירה כללית של הפעילות שלך</p>
      </div>
      
      {/* Stats Grid - Mobile: 2 cols, Tablet: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="סה''כ לקוחות"
          value={stats.totalDonors}
          icon={Users}
        />
        <StatsCard
          title="מנויים פעילים"
          value={stats.activeSubscriptions}
          icon={Heart}
        />
        <StatsCard
          title="סה''כ הרוחתי"
          value={`₪${stats.totalEarned.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatsCard
          title="יתרת ארנק"
          value={`₪${stats.walletBalance.toLocaleString()}`}
          icon={Wallet}
        />
      </div>

      {/* My Rank Widget */}
      {!rankLoading && myRankInfo && (
        <Card>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 המקום שלי בדירוג</h3>
            
            {myRankInfo.myRank ? (
              <div className="space-y-4">
                {/* My Position */}
                <div className="text-center py-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">אתה במקום</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-5xl font-bold text-indigo-600">#{myRankInfo.myRank}</span>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">מתוך</p>
                      <p className="text-2xl font-bold text-gray-900">{myRankInfo.totalMessengers}</p>
                      <p className="text-xs text-gray-500">שליחים</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    יש לך <span className="font-bold text-indigo-600">{myRankInfo.myDonors}</span> לקוחות
                  </p>
                </div>

                {/* Next Goal */}
                {myRankInfo.nextRankDonors && myRankInfo.nextRankDonors > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-gray-900">
                      💡 <strong>עוד {myRankInfo.nextRankDonors} לקוחות</strong> ותעלה למקום #{myRankInfo.myRank - 1}!
                    </p>
                  </div>
                )}

                {/* Top 3 */}
                {myRankInfo.topThree.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">3 המובילים:</p>
                    {myRankInfo.topThree.map((entry, index) => {
                      const medals = ['🥇', '🥈', '🥉'];
                      const isMe = entry.messengerId === profile?.id;
                      return (
                        <div
                          key={entry.messengerId}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            isMe ? 'bg-indigo-100 border-2 border-indigo-300' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{medals[index]}</span>
                            <div>
                              <p className={`font-medium ${                              isMe ? 'text-indigo-900' : 'text-gray-900'}`}>
                                {entry.messengerName} {isMe && '(אני!)'}
                              </p>
                              <p className="text-xs text-gray-500">/{entry.slug}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-lg font-bold text-indigo-600">{entry.totalDonors}</p>
                            <p className="text-xs text-gray-500">לקוחות</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">טוען דירוג...</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* My Growth Chart */}
      {!analyticsLoading && messengerGrowth.length > 0 && (
        <Card
          header={
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">הצמיחה שלי - 6 חודשים אחרונים</h2>
            </div>
          }
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={messengerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  reversed={true}
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    direction: 'rtl',
                    fontSize: '12px'
                  }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="donors" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  name="לקוחות חדשים"
                  dot={{ fill: '#4f46e5', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="activeDonors" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="לקוחות פעילים"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">סה"כ לקוחות חדשים</p>
              <p className="text-2xl font-bold text-indigo-600">
                {messengerGrowth.reduce((sum, m) => sum + m.donors, 0)}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">ממוצע חודשי</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(messengerGrowth.reduce((sum, m) => sum + m.donors, 0) / messengerGrowth.length)}
              </p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-gray-700">
              📈 <strong>טיפ:</strong> גרף עולה = אתה מצליח! כל לקוח חדש מוסיף הכנסה חודשית קבועה.
            </p>
          </div>
        </Card>
      )}
      
      {/* Marketing Tools */}
      <Card
        header={
          <h2 className="text-xl font-semibold text-gray-900">כלי שיווק</h2>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הקישור האישי שלך לדף WordPress
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={landingPageUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
              />
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} className="flex-1 sm:flex-none" size="sm">
                  <Copy className="h-4 w-4" />
                  <span className="sm:inline">{copied ? 'הועתק!' : 'העתק'}</span>
                </Button>
                <Button variant="secondary" className="flex-1 sm:flex-none" size="sm">
                  <Share2 className="h-4 w-4" />
                  <span className="sm:inline">שתף</span>
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * הקישור מוביל לדף הנחיתה שלך באתר WordPress/Elementor
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
            <div className="flex-1 text-center sm:text-right">
              <h3 className="font-medium text-gray-900 mb-2">QR Code שלך</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                הדפס וצרף לעמדת תפילין - מוביל לדף הנחיתה שלך
              </p>
              <Button size="sm" variant="secondary" className="w-full sm:w-auto">
                <QrCode className="h-4 w-4" />
                הורד QR
              </Button>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg">
              <QRCode value={landingPageUrl} size={120} className="sm:w-[150px] sm:h-[150px]" />
            </div>
          </div>
        </div>
      </Card>
      
      {/* Clients List */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">לקוחות תחתיי</h2>
            <Badge variant="info">{donors.length} לקוחות</Badge>
          </div>
        }
      >
        {donors.length > 0 ? (
          <DataTable
            data={donors}
            columns={[
              { 
                key: 'name', 
                header: 'שם',
                mobileOrder: 1
              },
              { 
                key: 'email', 
                header: 'אימייל',
                mobileOrder: 2
              },
              {
                key: 'subscriptionType',
                header: 'סוג מנוי',
                mobileLabel: 'סוג',
                mobileOrder: 3,
                render: (item) => (
                  <Badge variant={item.subscriptionType === 'monthly' ? 'success' : 'info'}>
                    {item.subscriptionType === 'monthly' ? 'חודשי' : 'חד-פעמי'}
                  </Badge>
                ),
              },
              {
                key: 'subscriptionStatus',
                header: 'סטטוס',
                mobileOrder: 4,
                render: (item) => (
                  <Badge variant={item.subscriptionStatus === 'active' ? 'success' : 'danger'}>
                    {item.subscriptionStatus === 'active' ? 'פעיל' : 
                     item.subscriptionStatus === 'cancelled' ? 'בוטל' :
                     item.subscriptionStatus === 'pending' ? 'ממתין' : 'נכשל'}
                  </Badge>
                ),
              },
              { 
                key: 'joinDate', 
                header: 'תאריך הצטרפות',
                mobileLabel: 'הצטרף',
                mobileOrder: 999
              },
            ]}
          />
        ) : (
          <p className="text-center text-gray-500 py-8">אין לקוחות עדיין</p>
        )}
      </Card>
      
      {/* Wallet Actions */}
      <Card
        header={
          <h2 className="text-xl font-semibold text-gray-900">ניהול ארנק</h2>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">יתרה זמינה למשיכה</p>
              <p className="text-2xl font-bold text-green-600">₪{stats.walletBalance.toLocaleString()}</p>
            </div>
            <Button 
              disabled={stats.walletBalance < 50}
              onClick={() => setShowWithdrawalModal(true)}
            >
              <DollarSign className="h-4 w-4" />
              משוך כספים
            </Button>
          </div>
          
          {/* Withdrawal History */}
          {withdrawals.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">היסטוריית משיכות</h3>
              {withdrawals.slice(0, 3).map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <p className="font-medium text-gray-900">₪{withdrawal.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{withdrawal.requestedAt}</p>
                  </div>
                  <Badge 
                    variant={
                      withdrawal.status === 'completed' ? 'success' :
                      withdrawal.status === 'pending' ? 'warning' :
                      'danger'
                    }
                  >
                    {withdrawal.status === 'completed' ? 'אושר' :
                     withdrawal.status === 'pending' ? 'ממתין לאישור' :
                     withdrawal.status === 'failed' ? 'נדחה' : 'בתהליך'}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">
            💡 סכום מינימלי למשיכה: ₪50 | משיכות מאושרות תוך 3-5 ימי עסקים
          </p>
        </div>
      </Card>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        currentBalance={stats.walletBalance}
        onSubmit={async (amount, bankDetails) => {
          if (!profile?.id) {
            return { success: false, error: 'לא נמצא פרופיל שליח' };
          }
          return await requestWithdrawal(profile.id, amount, bankDetails);
        }}
      />
    </div>
  );
}

