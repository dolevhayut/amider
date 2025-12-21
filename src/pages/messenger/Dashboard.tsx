import { useState } from 'react';
import { Users, DollarSign, Wallet, Heart, Copy, QrCode, Share2 } from 'lucide-react';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/shared/Badge';
import { QRCodeSVG } from 'react-qr-code';

// Mock data - will be replaced with real data from Supabase
const mockStats = {
  totalMembers: 45,
  activeSubscriptions: 38,
  totalEarned: 3240,
  walletBalance: 1580,
  activePrayers: 127,
};

const mockMembers = [
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">לוח בקרה - שליח</h1>
        <p className="mt-2 text-gray-600">סקירה כללית של הפעילות שלך</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="סה''כ מצטרפים"
          value={mockStats.totalMembers}
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
              הקישור האישי שלך
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={landingPageUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <Button onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
                {copied ? 'הועתק!' : 'העתק'}
              </Button>
              <Button variant="secondary">
                <Share2 className="h-4 w-4" />
                שתף
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">QR Code שלך</h3>
              <p className="text-sm text-gray-600 mb-4">
                הדפס וצרף לעמדת תפילין
              </p>
              <Button size="sm" variant="secondary">
                <QrCode className="h-4 w-4" />
                הורד QR
              </Button>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={landingPageUrl} size={150} />
            </div>
          </div>
        </div>
      </Card>
      
      {/* Members List */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">המצטרפים שלי</h2>
            <Badge variant="info">{mockMembers.length} מצטרפים</Badge>
          </div>
        }
      >
        <DataTable
          data={mockMembers}
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

