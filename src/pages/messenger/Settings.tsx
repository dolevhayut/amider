import { Settings as SettingsIcon, User, Link, Save } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { useMessengerData } from '../../hooks/useMessengerData';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function MessengerSettings() {
  const { profile, loading } = useMessengerData();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    landing_page_slug: '',
    custom_goal_text: '',
    symbol: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: '',
        landing_page_slug: profile.landing_page_slug || '',
        custom_goal_text: profile.custom_goal_text || '',
        symbol: profile.symbol || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      setMessage(null);

      // Update user info
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
        })
        .eq('id', profile.id);

      if (userError) throw userError;

      // Update messenger info
      const { error: messengerError } = await supabase
        .from('messengers')
        .update({
          landing_page_slug: formData.landing_page_slug,
          custom_goal_text: formData.custom_goal_text,
          symbol: formData.symbol,
        })
        .eq('id', profile.id);

      if (messengerError) throw messengerError;

      setMessage({ type: 'success', text: 'ההגדרות נשמרו בהצלחה!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'שגיאה בשמירת ההגדרות' 
      });
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">הגדרות</h1>
          <HebrewDateDisplay />
        </div>
        <p className="text-sm sm:text-base text-gray-600">נהל את הפרופיל והגדרות החשבון שלך</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Personal Information */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">פרטים אישיים</h2>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם מלא
            </label>
            <Input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="הזן שם מלא"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              אימייל
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="הזן כתובת אימייל"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              טלפון
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="הזן מספר טלפון"
            />
          </div>
        </div>
      </Card>

      {/* Landing Page Settings */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">הגדרות דף נחיתה</h2>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת דף נחיתה (Slug)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{window.location.origin}/m/</span>
              <Input
                type="text"
                value={formData.landing_page_slug}
                onChange={(e) => setFormData({ ...formData, landing_page_slug: e.target.value })}
                placeholder="your-name"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              * השתמש באותיות אנגליות, מספרים ומקפים בלבד
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              טקסט מטרה מותאם אישית
            </label>
            <textarea
              value={formData.custom_goal_text}
              onChange={(e) => setFormData({ ...formData, custom_goal_text: e.target.value })}
              placeholder="הזן טקסט מטרה מותאם אישית..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סמל
            </label>
            <Input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              placeholder="הזן סמל (אמוג'י או טקסט קצר)"
            />
          </div>
        </div>
      </Card>

      {/* Plan Information */}
      {profile && (
        <Card
          header={
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">מידע על התוכנית</h2>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">סוג תוכנית</span>
              <span className="font-semibold text-gray-900">
                {profile.plan_type === '18' ? 'תוכנית 18' : 'תוכנית 30'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">יתרת ארנק</span>
              <span className="font-semibold text-green-600">
                ₪{profile.wallet_balance.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'שומר...' : 'שמור שינויים'}</span>
        </Button>
      </div>
    </div>
  );
}

