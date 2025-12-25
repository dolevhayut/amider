import { Trophy, Award, Medal } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { DataTable } from '../../components/shared/DataTable';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { useLeaderboard } from '../../hooks/useLeaderboard';

export function AdminLeaderboard() {
  const { leaderboard, loading, error } = useLeaderboard();

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

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🏆 טבלת מובילים</h1>
          <HebrewDateDisplay />
        </div>
        <p className="text-sm sm:text-base text-gray-600">דירוג השליחים המצליחים ביותר</p>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {/* 2nd Place */}
          <Card>
            <div className="text-center py-6">
              <div className="text-5xl mb-2">🥈</div>
              <p className="text-xs text-gray-500 mb-1">מקום #2</p>
              <p className="font-bold text-gray-900 mb-1">{top3[1].messengerName}</p>
              <p className="text-xs text-gray-500 mb-3">/{top3[1].slug}</p>
              <div className="bg-gray-100 px-3 py-2 rounded-lg">
                <p className="text-2xl font-bold text-gray-700">{top3[1].totalDonors}</p>
                <p className="text-xs text-gray-600">לקוחות</p>
              </div>
            </div>
          </Card>

          {/* 1st Place */}
          <Card>
            <div className="text-center py-6 bg-gradient-to-b from-yellow-50 to-white">
              <div className="text-6xl mb-2">🥇</div>
              <Badge variant="warning" className="mb-2">מקום ראשון!</Badge>
              <p className="font-bold text-lg text-gray-900 mb-1">{top3[0].messengerName}</p>
              <p className="text-xs text-gray-500 mb-3">/{top3[0].slug}</p>
              <div className="bg-yellow-100 px-4 py-3 rounded-lg">
                <p className="text-3xl font-bold text-yellow-700">{top3[0].totalDonors}</p>
                <p className="text-xs text-yellow-800">לקוחות</p>
              </div>
            </div>
          </Card>

          {/* 3rd Place */}
          <Card>
            <div className="text-center py-6">
              <div className="text-5xl mb-2">🥉</div>
              <p className="text-xs text-gray-500 mb-1">מקום #3</p>
              <p className="font-bold text-gray-900 mb-1">{top3[2].messengerName}</p>
              <p className="text-xs text-gray-500 mb-3">/{top3[2].slug}</p>
              <div className="bg-orange-100 px-3 py-2 rounded-lg">
                <p className="text-2xl font-bold text-orange-700">{top3[2].totalDonors}</p>
                <p className="text-xs text-orange-800">לקוחות</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">דירוג מלא</h2>
            </div>
            <Badge variant="info">{leaderboard.length} שליחים</Badge>
          </div>
        }
      >
        {leaderboard.length > 0 ? (
          <DataTable
            data={leaderboard}
            columns={[
              {
                key: 'rank',
                header: 'מקום',
                mobileOrder: 1,
                render: (item) => (
                  <div className="flex items-center gap-2">
                    {item.rank === 1 && <span className="text-2xl">🥇</span>}
                    {item.rank === 2 && <span className="text-2xl">🥈</span>}
                    {item.rank === 3 && <span className="text-2xl">🥉</span>}
                    {item.rank > 3 && item.rank <= 10 && <Medal className="h-5 w-5 text-indigo-500" />}
                    <span className={`text-lg font-bold ${
                      item.rank <= 3 ? 'text-indigo-600' : 'text-gray-700'
                    }`}>
                      #{item.rank}
                    </span>
                  </div>
                ),
              },
              {
                key: 'messengerName',
                header: 'שם השליח',
                mobileLabel: 'שליח',
                mobileOrder: 2,
                render: (item) => (
                  <div>
                    <p className="font-semibold text-gray-900">{item.messengerName}</p>
                    <p className="text-xs text-gray-500">/{item.slug}</p>
                  </div>
                ),
              },
              {
                key: 'totalDonors',
                header: 'סה"כ לקוחות',
                mobileLabel: 'לקוחות',
                mobileOrder: 3,
                render: (item) => (
                  <div className="text-center">
                    <p className="text-xl font-bold text-indigo-600">{item.totalDonors}</p>
                  </div>
                ),
              },
              {
                key: 'activeDonors',
                header: 'לקוחות פעילים',
                mobileLabel: 'פעילים',
                mobileOrder: 4,
                render: (item) => (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600">{item.activeDonors}</p>
                  </div>
                ),
              },
              {
                key: 'joinDate',
                header: 'תאריך הצטרפות',
                mobileLabel: 'הצטרף',
                hideOnMobile: true,
                render: (item) => (
                  <span className="text-sm text-gray-600">{item.joinDate}</span>
                ),
              },
              {
                key: 'badge',
                header: 'הישג',
                mobileOrder: 5,
                render: (item) => {
                  if (item.totalDonors >= 100) {
                    return <Badge variant="warning">⭐ מאה+</Badge>;
                  } else if (item.totalDonors >= 50) {
                    return <Badge variant="info">🌟 חמישים+</Badge>;
                  } else if (item.totalDonors >= 25) {
                    return <Badge variant="success">✨ עשרים וחמש+</Badge>;
                  }
                  return <span className="text-xs text-gray-400">-</span>;
                },
              },
            ]}
          />
        ) : (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">אין נתונים להצגה</p>
          </div>
        )}
      </Card>

      {/* Achievement Badges Info */}
      <Card>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="h-5 w-5" />
            הישגים ותגים
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-900 mb-1">⭐ מאה+</p>
              <p className="text-xs text-gray-600">100 לקוחות ומעלה</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-900 mb-1">🌟 חמישים+</p>
              <p className="text-xs text-gray-600">50-99 לקוחות</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-gray-900 mb-1">✨ עשרים וחמש+</p>
              <p className="text-xs text-gray-600">25-49 לקוחות</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

