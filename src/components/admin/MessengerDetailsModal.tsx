import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { 
  Users, 
  DollarSign, 
  Heart, 
  Settings as SettingsIcon,
  TrendingUp,
  Activity,
  Ban,
  CheckCircle,
  Key
} from 'lucide-react';
import type { MessengerWithStats } from '../../types';

interface MessengerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  messenger: MessengerWithStats | null;
  onToggleStatus: (messengerId: string) => Promise<{ success: boolean; error?: string }>;
}

type Tab = 'overview' | 'donors' | 'transactions' | 'prayers' | 'settings';

export function MessengerDetailsModal({ 
  isOpen, 
  onClose, 
  messenger,
  onToggleStatus 
}: MessengerDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);

  if (!messenger) return null;

  const handleToggleStatus = async () => {
    setLoading(true);
    await onToggleStatus(messenger.id);
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={messenger.full_name}
    >
      <div className="space-y-4">
        {/* Header Info */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <p className="text-sm text-gray-600">/{messenger.landing_page_slug}</p>
            <p className="text-xs text-gray-500">{messenger.email}</p>
          </div>
          <Badge variant={messenger.is_active ? 'success' : 'danger'}>
            {messenger.is_active ? 'פעיל' : 'מושהה'}
          </Badge>
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
              onClick={() => setActiveTab('donors')}
              className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap text-sm ${
                activeTab === 'donors'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              תורמים
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap text-sm ${
                activeTab === 'transactions'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              טרנזקציות
            </button>
            <button
              onClick={() => setActiveTab('prayers')}
              className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap text-sm ${
                activeTab === 'prayers'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              תפילות
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap text-sm ${
                activeTab === 'settings'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              הגדרות
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs text-gray-600">תורמים</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{messenger.total_donors}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {messenger.active_subscriptions} פעילים
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-600">הרוויח החודש</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₪{messenger.this_month_revenue.toFixed(2)}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-xs text-gray-600">סה"כ הרוויח</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₪{messenger.total_revenue.toFixed(2)}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-gray-600">יתרת ארנק</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₪{messenger.wallet_balance.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">תוכנית:</span>
                  <span className="font-medium">{messenger.plan_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">עמלה חד-פעמי:</span>
                  <span className="font-medium">{messenger.commission_rate_one_time}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">עמלה חודשית:</span>
                  <span className="font-medium">{messenger.commission_rate_monthly}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">טלפון:</span>
                  <span className="font-medium">{messenger.phone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">הצטרף:</span>
                  <span className="font-medium">
                    {new Date(messenger.created_at).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>

              {messenger.custom_goal_text && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">מטרה:</p>
                  <p className="text-sm text-gray-900">{messenger.custom_goal_text}</p>
                </div>
              )}
            </div>
          )}

          {/* Donors Tab */}
          {activeTab === 'donors' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                רשימת כל התורמים של {messenger.full_name}
              </p>
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">טעינת רשימת תורמים...</p>
                <p className="text-xs mt-1">סה"כ {messenger.total_donors} תורמים</p>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                היסטוריית כל העמלות והטרנזקציות
              </p>
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">טעינת טרנזקציות...</p>
                <p className="text-xs mt-1">סה"כ הרוויח: ₪{messenger.total_revenue.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Prayers Tab */}
          {activeTab === 'prayers' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                רשימת כל התפילות הפעילות
              </p>
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">טעינת תפילות...</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  פעולות ניהול
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {messenger.is_active ? 'השהה שליח' : 'הפעל שליח'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {messenger.is_active 
                          ? 'השליח לא יוכל להתחבר למערכת'
                          : 'השליח יוכל להתחבר שוב למערכת'
                        }
                      </p>
                    </div>
                    <Button
                      variant={messenger.is_active ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={handleToggleStatus}
                      loading={loading}
                    >
                      {messenger.is_active ? (
                        <>
                          <Ban className="h-4 w-4" />
                          השהה
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          הפעל
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-sm font-medium text-gray-900">איפוס סיסמה</p>
                      <p className="text-xs text-gray-600">שלח מייל לאיפוס סיסמה</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Key className="h-4 w-4" />
                      איפוס
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">אזור סכנה</h4>
                <p className="text-xs text-red-700 mb-3">
                  מחיקת שליח תמחק גם את כל הנתונים הקשורים אליו. פעולה זו בלתי הפיכה!
                </p>
                <Button variant="secondary" size="sm" className="text-red-600 border-red-300">
                  מחק שליח
                </Button>
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
  );
}

