import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { CheckCircle, ArrowRight, ArrowLeft, User, Settings, Globe, Building } from 'lucide-react';
import type { CreateMessengerData } from '../../types';

interface AddMessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMessengerData) => Promise<{ success: boolean; error?: string }>;
  checkSlugAvailability: (slug: string) => Promise<boolean>;
}

type Step = 1 | 2 | 3 | 4;

export function AddMessengerModal({ isOpen, onClose, onSubmit, checkSlugAvailability }: AddMessengerModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  // Form data
  const [formData, setFormData] = useState<CreateMessengerData>({
    full_name: '',
    email: '',
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

  const handleChange = (field: keyof CreateMessengerData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check slug availability
    if (field === 'landing_page_slug' && typeof value === 'string' && value.length > 2) {
      setSlugChecking(true);
      setSlugAvailable(null);
      
      // Debounce
      setTimeout(async () => {
        const available = await checkSlugAvailability(value);
        setSlugAvailable(available);
        setSlugChecking(false);
      }, 500);
    }
  };

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        return !!(formData.full_name && formData.email && formData.phone);
      case 2:
        return !!(formData.plan_type);
      case 3:
        return !!(formData.landing_page_slug && slugAvailable);
      case 4:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const result = await onSubmit(formData);

    if (result.success) {
      // Reset form
      setFormData({
        full_name: '',
        email: '',
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
      setCurrentStep(1);
      onClose();
    } else {
      setError(result.error || 'שגיאה בצירוף השליח');
    }

    setLoading(false);
  };

  const handleClose = () => {
    if (!loading) {
      setCurrentStep(1);
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="צירוף שליח חדש"
    >
      <div className="space-y-6">
        {/* Stepper */}
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : step === currentStep
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`h-0.5 w-12 sm:w-16 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Titles */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentStep === 1 && 'פרטים אישיים'}
            {currentStep === 2 && 'הגדרות תוכנית ועמלות'}
            {currentStep === 3 && 'מיתוג ודף נחיתה'}
            {currentStep === 4 && 'פרטי בנק (אופציונלי)'}
          </h3>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="space-y-4">
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <>
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">שלב 1: פרטים אישיים</span>
              </div>
              
              <Input
                label="שם מלא *"
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="הזן שם מלא"
                required
              />

              <Input
                label="אימייל *"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@example.com"
                required
              />

              <Input
                label="טלפון *"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="050-1234567"
                required
              />
            </>
          )}

          {/* Step 2: Plan & Commission */}
          {currentStep === 2 && (
            <>
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <Settings className="h-5 w-5" />
                <span className="text-sm font-medium">שלב 2: הגדרות תוכנית ועמלות</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  בחירת תוכנית *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange('plan_type', '18')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.plan_type === '18'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl font-bold text-gray-900">18</div>
                    <div className="text-xs text-gray-600 mt-1">תוכנית חי</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('plan_type', '30')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.plan_type === '30'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl font-bold text-gray-900">30</div>
                    <div className="text-xs text-gray-600 mt-1">תוכנית ל</div>
                  </button>
                </div>
              </div>

              <Input
                label="אחוז עמלה לתשלום חד-פעמי (%)"
                type="number"
                step="0.01"
                value={formData.commission_rate_one_time}
                onChange={(e) => handleChange('commission_rate_one_time', Number(e.target.value))}
              />

              <Input
                label="אחוז עמלה למנוי חודשי (%)"
                type="number"
                step="0.01"
                value={formData.commission_rate_monthly}
                onChange={(e) => handleChange('commission_rate_monthly', Number(e.target.value))}
              />
            </>
          )}

          {/* Step 3: Branding */}
          {currentStep === 3 && (
            <>
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">שלב 3: מיתוג ודף נחיתה</span>
              </div>

              <div>
                <Input
                  label="Slug לדף נחיתה *"
                  type="text"
                  value={formData.landing_page_slug}
                  onChange={(e) => handleChange('landing_page_slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="your-name"
                  required
                />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">
                    תצוגה מקדימה: <span className="font-medium">ami-dar.co.il/m/{formData.landing_page_slug || 'your-slug'}</span>
                  </p>
                  {slugChecking && (
                    <p className="text-xs text-blue-600">בודק זמינות...</p>
                  )}
                  {slugAvailable === true && (
                    <p className="text-xs text-green-600">✓ Slug זמין!</p>
                  )}
                  {slugAvailable === false && (
                    <p className="text-xs text-red-600">✗ Slug תפוס, נסה אחר</p>
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
                <p className="text-xs text-gray-500 mt-1">
                  {formData.custom_goal_text?.length || 0}/200 תווים
                </p>
              </div>

              <Input
                label="סמל"
                type="text"
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                placeholder="🙏 או טקסט קצר"
                maxLength={5}
              />
            </>
          )}

          {/* Step 4: Bank Details */}
          {currentStep === 4 && (
            <>
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <Building className="h-5 w-5" />
                <span className="text-sm font-medium">שלב 4: פרטי בנק (למשיכות)</span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                פרטי הבנק נדרשים לצורך העברת עמלות. ניתן למלא גם מאוחר יותר.
              </p>

              <Input
                label="שם בנק"
                type="text"
                value={formData.bank_name}
                onChange={(e) => handleChange('bank_name', e.target.value)}
                placeholder="לאומי, הפועלים..."
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="מספר סניף"
                  type="text"
                  value={formData.bank_branch}
                  onChange={(e) => handleChange('bank_branch', e.target.value)}
                  placeholder="123"
                />

                <Input
                  label="מספר חשבון"
                  type="text"
                  value={formData.bank_account}
                  onChange={(e) => handleChange('bank_account', e.target.value)}
                  placeholder="1234567"
                />
              </div>

              <Input
                label="שם בעל החשבון"
                type="text"
                value={formData.bank_account_holder}
                onChange={(e) => handleChange('bank_account_holder', e.target.value)}
                placeholder="שם מלא"
              />
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="secondary"
            onClick={currentStep === 1 ? handleClose : handleBack}
            disabled={loading}
          >
            <ArrowRight className="h-4 w-4" />
            {currentStep === 1 ? 'ביטול' : 'חזור'}
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
            >
              הבא
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!validateStep(3)} // Must complete step 3
            >
              צרף שליח
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

