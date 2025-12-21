import { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Save, AlertTriangle } from 'lucide-react';
import type { MessengerWithStats, UpdateMessengerData } from '../../types';

interface EditMessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  messenger: MessengerWithStats | null;
  onSubmit: (messengerId: string, userId: string, data: UpdateMessengerData) => Promise<{ success: boolean; error?: string }>;
  checkSlugAvailability: (slug: string, excludeMessengerId?: string) => Promise<boolean>;
}

export function EditMessengerModal({ 
  isOpen, 
  onClose, 
  messenger, 
  onSubmit,
  checkSlugAvailability 
}: EditMessengerModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [showSlugWarning, setShowSlugWarning] = useState(false);

  const [formData, setFormData] = useState<UpdateMessengerData>({
    full_name: '',
    phone: '',
    plan_type: '18',
    landing_page_slug: '',
    commission_rate_one_time: 16.67,
    commission_rate_monthly: 16.67,
    custom_goal_text: '',
    symbol: '',
    bank_name: '',
    bank_branch: '',
    bank_account: '',
    bank_account_holder: '',
  });

  useEffect(() => {
    if (messenger) {
      setFormData({
        full_name: messenger.full_name,
        phone: messenger.phone || '',
        plan_type: messenger.plan_type,
        landing_page_slug: messenger.landing_page_slug,
        commission_rate_one_time: messenger.commission_rate_one_time,
        commission_rate_monthly: messenger.commission_rate_monthly,
        custom_goal_text: messenger.custom_goal_text || '',
        symbol: messenger.symbol || '',
      });
      setSlugAvailable(true);
      setShowSlugWarning(false);
    }
  }, [messenger]);

  const handleChange = (field: keyof UpdateMessengerData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check slug availability if changed
    if (field === 'landing_page_slug' && typeof value === 'string' && value !== messenger?.landing_page_slug) {
      setShowSlugWarning(true);
      
      if (value.length > 2) {
        setSlugChecking(true);
        setSlugAvailable(null);
        
        setTimeout(async () => {
          const available = await checkSlugAvailability(value, messenger?.id);
          setSlugAvailable(available);
          setSlugChecking(false);
        }, 500);
      }
    } else if (field === 'landing_page_slug' && value === messenger?.landing_page_slug) {
      setShowSlugWarning(false);
      setSlugAvailable(true);
    }
  };

  const handleSubmit = async () => {
    if (!messenger) return;

    setLoading(true);
    setError(null);

    const result = await onSubmit(messenger.id, messenger.user_id, formData);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'שגיאה בעדכון השליח');
    }

    setLoading(false);
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setShowSlugWarning(false);
      onClose();
    }
  };

  if (!messenger) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`עריכת שליח: ${messenger.full_name}`}
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">פרטים אישיים</h3>
          
          <Input
            label="שם מלא"
            type="text"
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              אימייל
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600">
              {messenger.email}
            </div>
            <p className="text-xs text-gray-500 mt-1">לא ניתן לשנות אימייל</p>
          </div>

          <Input
            label="טלפון"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        {/* Plan & Commission */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">תוכנית ועמלות</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תוכנית
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange('plan_type', '18')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.plan_type === '18'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-xl font-bold text-gray-900">18</div>
                <div className="text-xs text-gray-600">תוכנית חי</div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('plan_type', '30')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.plan_type === '30'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-xl font-bold text-gray-900">30</div>
                <div className="text-xs text-gray-600">תוכנית ל</div>
              </button>
            </div>
          </div>

          <Input
            label="אחוז עמלה חד-פעמי (%)"
            type="number"
            step="0.01"
            value={formData.commission_rate_one_time}
            onChange={(e) => handleChange('commission_rate_one_time', Number(e.target.value))}
          />

          <Input
            label="אחוז עמלה חודשי (%)"
            type="number"
            step="0.01"
            value={formData.commission_rate_monthly}
            onChange={(e) => handleChange('commission_rate_monthly', Number(e.target.value))}
          />
        </div>

        {/* Branding */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">מיתוג</h3>

          <div>
            <Input
              label="Slug לדף נחיתה"
              type="text"
              value={formData.landing_page_slug}
              onChange={(e) => handleChange('landing_page_slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              required
            />
            {showSlugWarning && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700">
                  שינוי ה-Slug ישנה את כתובת דף הנחיתה. קישורים קיימים לא יעבדו.
                </p>
              </div>
            )}
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">
                ami-dar.co.il/m/{formData.landing_page_slug}
              </p>
              {slugChecking && (
                <p className="text-xs text-blue-600">בודק זמינות...</p>
              )}
              {slugAvailable === true && formData.landing_page_slug !== messenger.landing_page_slug && (
                <p className="text-xs text-green-600">✓ Slug זמין!</p>
              )}
              {slugAvailable === false && (
                <p className="text-xs text-red-600">✗ Slug תפוס</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מטרה מותאמת אישית
            </label>
            <textarea
              value={formData.custom_goal_text}
              onChange={(e) => handleChange('custom_goal_text', e.target.value)}
              placeholder="להצלחת כל עם ישראל..."
              rows={3}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <Input
            label="סמל"
            type="text"
            value={formData.symbol}
            onChange={(e) => handleChange('symbol', e.target.value)}
            placeholder="🙏"
            maxLength={5}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            ביטול
          </Button>

          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={slugAvailable === false}
          >
            <Save className="h-4 w-4" />
            שמור שינויים
          </Button>
        </div>
      </div>
    </Modal>
  );
}

