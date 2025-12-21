import { useState } from 'react';
import { Users, DollarSign, Wallet, Heart, Copy, QrCode, Share2 } from 'lucide-react';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/shared/Badge';
import QRCode from 'react-qr-code';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { useMessengerData } from '../../hooks/useMessengerData';
import { useMessengerDonors } from '../../hooks/useMessengerDonors';

export function MessengerDashboard() {
  const [copied, setCopied] = useState(false);
  const { stats, profile, loading, error } = useMessengerData();
  const { donors } = useMessengerDonors(profile?.id);
  
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
          title="סה''כ תורמים"
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
      
      {/* Donors List */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">תורמים תחתיי</h2>
            <Badge variant="info">{donors.length} תורמים</Badge>
          </div>
        }
      >
        {donors.length > 0 ? (
          <DataTable
            data={donors}
            columns={[
              { key: 'name', header: 'שם' },
              { key: 'email', header: 'אימייל' },
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
                  <Badge variant={item.subscriptionStatus === 'active' ? 'success' : 'danger'}>
                    {item.subscriptionStatus === 'active' ? 'פעיל' : 
                     item.subscriptionStatus === 'cancelled' ? 'בוטל' :
                     item.subscriptionStatus === 'pending' ? 'ממתין' : 'נכשל'}
                  </Badge>
                ),
              },
              { key: 'joinDate', header: 'תאריך הצטרפות' },
            ]}
          />
        ) : (
          <p className="text-center text-gray-500 py-8">אין תורמים עדיין</p>
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
            <Button disabled={stats.walletBalance === 0}>
              משוך כספים
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            * משיכות מועברות לחשבון הבנק שהוגדר בין התאריכים 1-10 בכל חודש
          </p>
        </div>
      </Card>
    </div>
  );
}

