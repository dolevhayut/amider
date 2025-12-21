import { useState } from 'react';
import { CreditCard, Calendar, Heart, AlertCircle } from 'lucide-react';
import { StatsCard } from '../../components/shared/StatsCard';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/shared/Badge';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';

// Mock data
const mockMemberInfo = {
  name: 'דוד כהן',
  email: 'david@example.com',
  phone: '050-1234567',
  subscriptionType: 'monthly',
  subscriptionStatus: 'active',
  nextPaymentDate: '2025-01-15',
  totalPaid: 360,
  activePrayers: 3,
};

const mockPaymentHistory = [
  { id: '1', date: '2024-12-15', amount: 30, status: 'completed', description: 'מנוי חודשי' },
  { id: '2', date: '2024-11-15', amount: 30, status: 'completed', description: 'מנוי חודשי' },
  { id: '3', date: '2024-10-15', amount: 30, status: 'completed', description: 'מנוי חודשי' },
];

const mockPrayerRequests = [
  { id: '1', subjectName: 'משה בן רחל', intention: 'רפואה שלמה', status: 'active', date: '2024-12-20' },
  { id: '2', subjectName: 'שרה בת מרים', intention: 'שידוך הגון', status: 'active', date: '2024-12-18' },
];

export function MemberDashboard() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [prayerForm, setPrayerForm] = useState({ subjectName: '', intention: '' });
  
  const handleCancelSubscription = () => {
    // Will implement with real API call
    console.log('Cancelling subscription...');
    setShowCancelModal(false);
  };
  
  const handleSubmitPrayer = () => {
    // Will implement with real API call
    console.log('Submitting prayer:', prayerForm);
    setShowPrayerModal(false);
    setPrayerForm({ subjectName: '', intention: '' });
  };
  
  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">לוח בקרה - מצטרף</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">ניהול המנוי והתפילות שלך</p>
      </div>
      
      {/* Stats - Mobile: 1 col, Tablet+: 3 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="תפילות פעילות"
          value={mockMemberInfo.activePrayers}
          icon={Heart}
        />
        <StatsCard
          title="סה''כ תרומות"
          value={`₪${mockMemberInfo.totalPaid}`}
          icon={CreditCard}
        />
        <StatsCard
          title="תשלום הבא"
          value={mockMemberInfo.nextPaymentDate}
          icon={Calendar}
        />
      </div>
      
      {/* Subscription Info */}
      <Card
        header={
          <h2 className="text-xl font-semibold text-gray-900">פרטי מנוי</h2>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">סוג מנוי</p>
              <p className="text-lg font-semibold">
                {mockMemberInfo.subscriptionType === 'monthly' ? 'חודשי - ₪30' : 'חד-פעמי - ₪360'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">סטטוס</p>
              <Badge variant={mockMemberInfo.subscriptionStatus === 'active' ? 'success' : 'danger'}>
                {mockMemberInfo.subscriptionStatus === 'active' ? 'פעיל' : 'לא פעיל'}
              </Badge>
            </div>
          </div>
          
          {mockMemberInfo.subscriptionType === 'monthly' && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">התשלום הבא</p>
                <p className="text-lg font-semibold text-blue-600">{mockMemberInfo.nextPaymentDate}</p>
              </div>
              <Button variant="danger" size="sm" onClick={() => setShowCancelModal(true)}>
                ביטול מנוי
              </Button>
            </div>
          )}
        </div>
      </Card>
      
      {/* Prayer Requests */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">בקשות תפילה</h2>
            <Button onClick={() => setShowPrayerModal(true)}>
              <Heart className="h-4 w-4" />
              הוסף תפילה
            </Button>
          </div>
        }
      >
        <DataTable
          data={mockPrayerRequests}
          columns={[
            { key: 'subjectName', header: 'שם למתפלל' },
            { key: 'intention', header: 'מטרת התפילה' },
            {
              key: 'status',
              header: 'סטטוס',
              render: (item) => (
                <Badge variant={item.status === 'active' ? 'success' : 'default'}>
                  {item.status === 'active' ? 'פעיל' : 'הושלם'}
                </Badge>
              ),
            },
            { key: 'date', header: 'תאריך הגשה' },
          ]}
        />
      </Card>
      
      {/* Payment History */}
      <Card
        header={
          <h2 className="text-xl font-semibold text-gray-900">היסטוריית תשלומים</h2>
        }
      >
        <DataTable
          data={mockPaymentHistory}
          columns={[
            { key: 'date', header: 'תאריך' },
            { key: 'description', header: 'תיאור' },
            {
              key: 'amount',
              header: 'סכום',
              render: (item) => `₪${item.amount}`,
            },
            {
              key: 'status',
              header: 'סטטוס',
              render: (item) => (
                <Badge variant={item.status === 'completed' ? 'success' : 'warning'}>
                  {item.status === 'completed' ? 'בוצע' : 'ממתין'}
                </Badge>
              ),
            },
          ]}
        />
      </Card>
      
      {/* Upgrade to Messenger */}
      <Card>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">הפוך לשליח!</h3>
            <p className="text-sm text-gray-600 mt-1">
              קנה עמדת תפילין והפוך לשליח עם קוד QR משלך וקבל עמלות על כל מצטרף חדש
            </p>
          </div>
          <Button size="lg">
            לפרטים נוספים
          </Button>
        </div>
      </Card>
      
      {/* Cancel Subscription Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="ביטול מנוי"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              בטל
            </Button>
            <Button variant="danger" onClick={handleCancelSubscription}>
              אשר ביטול
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">האם אתה בטוח?</p>
              <p className="text-sm text-yellow-700 mt-1">
                ביטול המנוי יעצור את התפילות היומיות עבורך. אנחנו נשמח אם תישאר איתנו!
              </p>
            </div>
          </div>
          
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">מקום לסרטון שימור</p>
          </div>
        </div>
      </Modal>
      
      {/* Prayer Request Modal */}
      <Modal
        isOpen={showPrayerModal}
        onClose={() => setShowPrayerModal(false)}
        title="הוסף בקשת תפילה חדשה"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPrayerModal(false)}>
              בטל
            </Button>
            <Button onClick={handleSubmitPrayer}>
              שלח תפילה
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="שם למתפלל"
            placeholder="לדוגמה: משה בן רחל"
            value={prayerForm.subjectName}
            onChange={(e) => setPrayerForm({ ...prayerForm, subjectName: e.target.value })}
          />
          <Input
            label="מטרת התפילה"
            placeholder="לדוגמה: רפואה שלמה, שידוך הגון"
            value={prayerForm.intention}
            onChange={(e) => setPrayerForm({ ...prayerForm, intention: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}

