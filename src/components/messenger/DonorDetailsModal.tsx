import { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { DataTable } from '../shared/DataTable';
import {
  User,
  DollarSign,
  Heart,
  Settings as SettingsIcon,
  Ban,
  RefreshCw,
  ArrowLeftRight,
} from 'lucide-react';
import type {
  DonorData,
  PaymentHistoryItem,
  PrayerNameItem,
} from '../../hooks/useMessengerDonors';

interface DonorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: DonorData | null;
  onPauseRoute: (memberId: string) => Promise<{ success: boolean; error?: string }>;
  onReactivateRoute: (memberId: string) => Promise<{ success: boolean; error?: string }>;
  onChangeRoute: (memberId: string, newType: 'one_time' | 'monthly') => Promise<{ success: boolean; error?: string }>;
  onFetchPayments: (memberId: string) => Promise<PaymentHistoryItem[]>;
  onFetchPrayers: (memberId: string) => Promise<PrayerNameItem[]>;
}

type Tab = 'overview' | 'payments' | 'prayers' | 'actions';

export function DonorDetailsModal({
  isOpen,
  onClose,
  donor,
  onPauseRoute,
  onReactivateRoute,
  onChangeRoute,
  onFetchPayments,
  onFetchPrayers,
}: DonorDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [prayers, setPrayers] = useState<PrayerNameItem[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [prayersLoading, setPrayersLoading] = useState(false);
  const [showChangeRouteModal, setShowChangeRouteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [showReactivateConfirm, setShowReactivateConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && donor) {
      // Reset state when modal opens
      setActiveTab('overview');
      setPayments([]);
      setPrayers([]);
      setError(null);
    }
  }, [isOpen, donor]);

  useEffect(() => {
    if (activeTab === 'payments' && donor && payments.length === 0 && !paymentsLoading) {
      loadPayments();
    }
  }, [activeTab, donor]);

  useEffect(() => {
    if (activeTab === 'prayers' && donor && prayers.length === 0 && !prayersLoading) {
      loadPrayers();
    }
  }, [activeTab, donor]);

  const loadPayments = async () => {
    if (!donor) return;
    setPaymentsLoading(true);
    const data = await onFetchPayments(donor.id);
    setPayments(data);
    setPaymentsLoading(false);
  };

  const loadPrayers = async () => {
    if (!donor) return;
    setPrayersLoading(true);
    const data = await onFetchPrayers(donor.id);
    setPrayers(data);
    setPrayersLoading(false);
  };

  const handlePauseRoute = async () => {
    if (!donor) return;
    setError(null);
    setLoading(true);
    const result = await onPauseRoute(donor.id);
    setLoading(false);
    if (result.success) {
      setShowPauseConfirm(false);
      onClose();
    } else {
      setError(result.error || 'שגיאה בהפסקת המסלול');
      setShowPauseConfirm(false);
    }
  };

  const handleReactivateRoute = async () => {
    if (!donor) return;
    setError(null);
    setLoading(true);
    const result = await onReactivateRoute(donor.id);
    setLoading(false);
    if (result.success) {
      setShowReactivateConfirm(false);
      onClose();
    } else {
      setError(result.error || 'שגיאה בהפעלת המסלול מחדש');
      setShowReactivateConfirm(false);
    }
  };

  const handleChangeRoute = async (newType: 'one_time' | 'monthly') => {
    if (!donor) return;
    setError(null);
    setLoading(true);
    const result = await onChangeRoute(donor.id, newType);
    setLoading(false);
    if (result.success) {
      setShowChangeRouteModal(false);
      onClose();
    } else {
      setError(result.error || 'שגיאה בשינוי המסלול');
    }
  };

  if (!donor) return null;

  const statusConfig = {
    active: { variant: 'success' as const, label: 'פעיל' },
    cancelled: { variant: 'danger' as const, label: 'בוטל' },
    pending: { variant: 'warning' as const, label: 'ממתין' },
    failed: { variant: 'danger' as const, label: 'נכשל' },
  };

  const statusBadge = statusConfig[donor.subscriptionStatus];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={donor.name}
      >
        <div className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Header Info */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="text-sm text-gray-600">{donor.email}</p>
              {donor.phone && (
                <p className="text-xs text-gray-500">{donor.phone}</p>
              )}
            </div>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap text-sm ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                סקירה
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap text-sm ${
                  activeTab === 'payments'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                היסטוריית תשלומים
              </button>
              <button
                onClick={() => setActiveTab('prayers')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap text-sm ${
                  activeTab === 'prayers'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                שמות לתפילה
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap text-sm ${
                  activeTab === 'actions'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                פעולות
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Personal Details */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    פרטים אישיים
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-gray-600">שם:</span>
                    <span className="font-medium">{donor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">אימייל:</span>
                    <span className="font-medium">{donor.email}</span>
                  </div>
                  {donor.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">טלפון:</span>
                      <span className="font-medium">{donor.phone}</span>
                    </div>
                  )}
                  {donor.hebrewBirthDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">תאריך לידה עברי:</span>
                      <span className="font-medium">{donor.hebrewBirthDate}</span>
                    </div>
                  )}
                </div>

                {/* Subscription Details */}
                <div className="bg-indigo-50 p-4 rounded-lg space-y-2 text-sm">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    פרטי מנוי
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-gray-600">סוג מנוי:</span>
                    <Badge variant={donor.subscriptionType === 'monthly' ? 'success' : 'info'}>
                      {donor.subscriptionType === 'monthly' ? 'חודשי' : 'חד-פעמי'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">סטטוס:</span>
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">תאריך הצטרפות:</span>
                    <span className="font-medium">{donor.joinDate}</span>
                  </div>
                  {donor.nextPaymentDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">תשלום הבא:</span>
                      <span className="font-medium">{donor.nextPaymentDate}</span>
                    </div>
                  )}
                  {donor.cancelledAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">בוטל בתאריך:</span>
                      <span className="font-medium">
                        {new Date(donor.cancelledAt).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                {paymentsLoading ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-300 animate-pulse" />
                    <p className="text-sm text-gray-500">טוען תשלומים...</p>
                  </div>
                ) : payments.length > 0 ? (
                  <DataTable
                    data={payments}
                    columns={[
                      {
                        key: 'createdAt',
                        header: 'תאריך',
                        render: (item) => (
                          <span className="text-sm text-gray-900">{item.createdAt}</span>
                        ),
                      },
                      {
                        key: 'amount',
                        header: 'סכום',
                        render: (item) => (
                          <span className="font-medium text-gray-900">
                            ₪{item.amount.toFixed(2)}
                          </span>
                        ),
                      },
                      {
                        key: 'status',
                        header: 'סטטוס',
                        render: (item) => {
                          const statusConfig = {
                            completed: { variant: 'success' as const, label: 'הושלם' },
                            pending: { variant: 'warning' as const, label: 'ממתין' },
                            failed: { variant: 'danger' as const, label: 'נכשל' },
                            refunded: { variant: 'danger' as const, label: 'הוחזר' },
                          };
                          const config = statusConfig[item.status || 'pending'];
                          return <Badge variant={config.variant}>{config.label}</Badge>;
                        },
                      },
                      {
                        key: 'description',
                        header: 'תיאור',
                        render: (item) => (
                          <span className="text-sm text-gray-600">
                            {item.description || '-'}
                          </span>
                        ),
                      },
                    ]}
                  />
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">אין תשלומים להצגה</p>
                  </div>
                )}
              </div>
            )}

            {/* Prayers Tab */}
            {activeTab === 'prayers' && (
              <div>
                {prayersLoading ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto mb-2 text-gray-300 animate-pulse" />
                    <p className="text-sm text-gray-500">טוען תפילות...</p>
                  </div>
                ) : prayers.length > 0 ? (
                  <div className="space-y-3">
                    {prayers.map((prayer) => (
                      <div key={prayer.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <h4 className="font-semibold text-gray-900">
                              {prayer.prayerSubjectName}
                            </h4>
                          </div>
                          <Badge
                            variant={
                              prayer.status === 'active'
                                ? 'success'
                                : prayer.status === 'completed'
                                ? 'info'
                                : 'default'
                            }
                          >
                            {prayer.status === 'active'
                              ? 'פעיל'
                              : prayer.status === 'completed'
                              ? 'הושלם'
                              : 'בארכיון'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{prayer.prayerIntention}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>נשלח: {prayer.submittedAt}</span>
                          {prayer.completedAt && (
                            <>
                              <span>•</span>
                              <span>הושלם: {prayer.completedAt}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">אין תפילות להצגה</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions Tab */}
            {activeTab === 'actions' && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    פעולות ניהול
                  </h4>
                  <div className="space-y-3">
                    {donor.subscriptionStatus === 'active' ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">הפסק מסלול</p>
                          <p className="text-xs text-gray-600">
                            ביטול המנוי - הלקוח לא יגבה תשלומים נוספים
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowPauseConfirm(true)}
                          disabled={loading}
                        >
                          <Ban className="h-4 w-4" />
                          הפסק מסלול
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">הפעל מחדש</p>
                          <p className="text-xs text-gray-600">
                            הפעלת המנוי מחדש - הלקוח יגבה תשלומים נוספים
                          </p>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setShowReactivateConfirm(true)}
                          disabled={loading}
                        >
                          <RefreshCw className="h-4 w-4" />
                          הפעל מחדש
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-sm font-medium text-gray-900">שנה מסלול</p>
                        <p className="text-xs text-gray-600">
                          מעבר בין מנוי חודשי למנוי חד-פעמי ולהפך
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowChangeRouteModal(true)}
                        disabled={loading}
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                        שנה מסלול
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="secondary" onClick={onClose}>
              סגור
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pause Route Confirmation */}
      {showPauseConfirm && (
        <Modal
          isOpen={showPauseConfirm}
          onClose={() => setShowPauseConfirm(false)}
          title="אישור הפסקת מסלול"
        >
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">
                האם אתה בטוח שברצונך להפסיק את המסלול של {donor.name}?
              </p>
              <p className="text-xs text-gray-600">
                הלקוח לא יגבה תשלומים נוספים. ניתן להפעיל מחדש בכל עת.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setShowPauseConfirm(false)}
                disabled={loading}
              >
                ביטול
              </Button>
              <Button
                variant="danger"
                onClick={handlePauseRoute}
                loading={loading}
              >
                <Ban className="h-4 w-4" />
                הפסק מסלול
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reactivate Route Confirmation */}
      {showReactivateConfirm && (
        <Modal
          isOpen={showReactivateConfirm}
          onClose={() => setShowReactivateConfirm(false)}
          title="אישור הפעלת מסלול מחדש"
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">
                האם אתה בטוח שברצונך להפעיל מחדש את המסלול של {donor.name}?
              </p>
              <p className="text-xs text-gray-600">
                הלקוח יחדש את הגבייה בהתאם לסוג המנוי שלו.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setShowReactivateConfirm(false)}
                disabled={loading}
              >
                ביטול
              </Button>
              <Button
                variant="primary"
                onClick={handleReactivateRoute}
                loading={loading}
              >
                <RefreshCw className="h-4 w-4" />
                הפעל מחדש
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Change Route Modal */}
      {showChangeRouteModal && (
        <Modal
          isOpen={showChangeRouteModal}
          onClose={() => setShowChangeRouteModal(false)}
          title="שינוי מסלול"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              בחר את סוג המנוי החדש עבור {donor.name}:
            </p>
            <div className="space-y-2">
              <Button
                variant={donor.subscriptionType === 'monthly' ? 'primary' : 'secondary'}
                className="w-full"
                onClick={() => handleChangeRoute('monthly')}
                loading={loading}
                disabled={donor.subscriptionType === 'monthly'}
              >
                מנוי חודשי
              </Button>
              <Button
                variant={donor.subscriptionType === 'one_time' ? 'primary' : 'secondary'}
                className="w-full"
                onClick={() => handleChangeRoute('one_time')}
                loading={loading}
                disabled={donor.subscriptionType === 'one_time'}
              >
                מנוי חד-פעמי
              </Button>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setShowChangeRouteModal(false)}
              >
                ביטול
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

