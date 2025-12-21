import { useState } from 'react';
import { Users, DollarSign, Wallet, Heart, Copy, QrCode, Share2 } from 'lucide-react';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/shared/Badge';
import { QRCode } from 'react-qr-code';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';

// Mock data - will be replaced with real data from Supabase
const mockStats = {
  totalDonors: 45,
  activeSubscriptions: 38,
  totalEarned: 3240,
  walletBalance: 1580,
  activePrayers: 127,
};

const mockDonors = [
  {
    id: '1',
    name: 'יוסף כהן',
    email: 'yosef@example.com',
    subscriptionType: 'monthly',
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'שרה לוי',
    email: 'sarah@example.com',
    subscriptionType: 'one_time',
    status: 'active',
    joinDate: '2024-02-20',
  },
];

export function MessengerDashboard() {
  const [copied, setCopied] = useState(false);
  const messengerSlug = 'test-messenger'; // Will come from actual user data
  const landingPageUrl = `${window.location.origin}/m/${messengerSlug}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(landingPageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
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
          value={mockStats.totalDonors}
          icon={Users}
        />
        <StatsCard
          title="מנויים פעילים"
          value={mockStats.activeSubscriptions}
          icon={Heart}
        />
        <StatsCard
          title="סה''כ הרוחתי"
          value={`₪${mockStats.totalEarned}`}
          icon={DollarSign}
        />
        <StatsCard
          title="יתרת ארנק"
          value={`₪${mockStats.walletBalance}`}
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
            <Badge variant="info">{mockDonors.length} תורמים</Badge>
          </div>
        }
      >
        <DataTable
          data={mockDonors}
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
              <p className="text-2xl font-bold text-green-600">₪{mockStats.walletBalance}</p>
            </div>
            <Button>
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

