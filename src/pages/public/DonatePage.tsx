import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLandingPage } from '../../hooks';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Heart, ArrowRight, Loader2, Plus, X } from 'lucide-react';

interface PrayerName {
  id: string;
  name: string;
  motherName?: string;
}

export function DonatePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useLandingPage(slug || '');
  
  const [names, setNames] = useState<PrayerName[]>([
    { id: '1', name: '', motherName: '' }
  ]);
  const [prayerFor, setPrayerFor] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Card className="max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">הדף לא נמצא</h1>
          <p className="text-gray-600 mb-6">{error || 'לא הצלחנו למצוא את הדף שחיפשת'}</p>
          <Button onClick={() => navigate('/')} variant="secondary">
            <ArrowRight className="h-4 w-4" />
            חזרה לדף הבית
          </Button>
        </Card>
      </div>
    );
  }

  const { messenger, content } = data;
  
  // Use global colors
  const primaryColor = content.theme_color || '#A4832E';

  const addName = () => {
    setNames([...names, { id: Date.now().toString(), name: '', motherName: '' }]);
  };

  const removeName = (id: string) => {
    if (names.length > 1) {
      setNames(names.filter(n => n.id !== id));
    }
  };

  const updateName = (id: string, field: 'name' | 'motherName', value: string) => {
    setNames(names.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const handleSubmit = () => {
    // בדיקת ולידציה
    const filledNames = names.filter(n => n.name.trim());
    
    if (filledNames.length === 0) {
      alert('נא למלא לפחות שם אחד');
      return;
    }

    if (!prayerFor.trim()) {
      alert('נא למלא עבור מה התפילה');
      return;
    }

    // שמירת הנתונים ומעבר לדף תשלום
    const prayerData = {
      names: filledNames,
      prayerFor: prayerFor,
      messenger_id: messenger.id,
      messenger_slug: slug,
    };

    // שמירה ב-sessionStorage
    sessionStorage.setItem('prayerData', JSON.stringify(prayerData));

    // TODO: מעבר לדף תשלום שנגדיר בעתיד
    console.log('Prayer data submitted:', prayerData);
    alert(`תודה!\n\nקיבלנו את הפרטים:\n${filledNames.length} שמות לתפילה\nעבור: ${prayerFor}\n\nבשלב הבא נעביר אתכם לדף תשלום...`);
    
    // נעביר לדף תשלום עתידי
    // navigate(`/m/${slug}/checkout`);
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor}15 0%, #f8f9fa 50%, ${primaryColor}08 100%)`
      }}
    >
      {/* Fixed Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
        style={{ borderBottom: `2px solid ${primaryColor}` }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <img 
            src="/logo.png" 
            alt="עמי דר" 
            className="h-12 w-auto"
          />
          <Button
            variant="secondary"
            onClick={() => navigate(`/m/${slug}`)}
          >
            <ArrowRight className="h-4 w-4" />
            חזרה
          </Button>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 pt-24 pb-8">

        {/* Main Card */}
        <Card className="shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: primaryColor + '20' }}
            >
              <Heart 
                className="h-8 w-8"
                style={{ color: primaryColor }}
              />
            </div>
            <h1 className="landing-page-title text-3xl font-bold text-gray-900 mb-2">
              מי נזכיר בתפילה?
            </h1>
            <p className="text-gray-600 text-base">
              {messenger.full_name} יתפלל עבורכם מידי יום בקברות הצדיקים
            </p>
          </div>

          {/* Names Form */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              שמות לתפילה
            </label>
            <div className="space-y-3">
              {names.map((nameItem, index) => (
                <div key={nameItem.id} className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={nameItem.name}
                      onChange={(e) => updateName(nameItem.id, 'name', e.target.value)}
                      placeholder={`שם ${index + 1}`}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ outlineColor: primaryColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={nameItem.motherName}
                      onChange={(e) => updateName(nameItem.id, 'motherName', e.target.value)}
                      placeholder="בן/בת (אופציונלי)"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ outlineColor: primaryColor }}
                    />
                  </div>
                  {names.length > 1 && (
                    <button
                      onClick={() => removeName(nameItem.id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="הסר שם"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={addName}
              className="mt-3 w-full py-2 px-4 border-2 border-dashed rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <Plus className="h-4 w-4 inline ml-1" />
              הוסף שם נוסף
            </button>
            
            <p className="text-xs text-gray-500 mt-2">
              דוגמה: יוסף בן מרים, שרה בת רחל
            </p>
          </div>

          {/* Prayer For */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              עבור מה התפילה?
            </label>
            <textarea
              value={prayerFor}
              onChange={(e) => setPrayerFor(e.target.value)}
              placeholder="לדוגמה: בריאות, פרנסה, שידוך, הצלחה, ישועה..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
              style={{ outlineColor: primaryColor }}
            />
            <p className="text-xs text-gray-500 mt-1">
              שתפו אותנו במה אתם זקוקים - נתפלל בשבילכם מכל הלב
            </p>
          </div>

          {/* Submit Button */}
          <div 
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: primaryColor + '10' }}
          >
            <p className="text-xs text-center text-gray-600 mb-2">
              לאחר מילוי הפרטים נעביר אתכם לבחירת תוכנית ותשלום
            </p>
            <p className="text-sm text-center font-medium" style={{ color: primaryColor }}>
              מחיר: 1 ש״ח ליום לכל שם (30 ש״ח לחודש)
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full py-4 text-xl shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}
          >
            <Heart className="h-6 w-6 ml-2" />
            המשך לתשלום
          </Button>

          {/* Trust Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              תשלום מאובטח | ביטול בכל עת ללא עלויות נוספות
            </p>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <img 
            src="/logo.png" 
            alt="עמי דר" 
            className="h-10 w-auto mx-auto mb-3 opacity-60"
          />
          <p className="text-sm text-gray-600 font-medium mb-2">
            זכות התפילה בקברות הצדיקים
          </p>
          <p className="text-xs text-gray-400">
            מיזם עמי דר - שותפות בתפילה ובמצוות
          </p>
        </div>
      </div>
    </div>
  );
}

