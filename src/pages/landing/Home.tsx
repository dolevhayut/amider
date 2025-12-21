import { Link } from 'react-router-dom';
import { Heart, Users, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '../../components/shared/Button';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50" dir="rtl">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            עמידר
            <span className="text-indigo-600"> - מערכת ניהול תורמים ותפילות</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            הצטרף למערכת ייחודית המחברת בין שליחים למצטרפים למען תפילות יומיות ותמיכה בצדקה
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/messenger/signup">
              <Button size="lg">הצטרף כשליח</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">התחבר</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">איך זה עובד?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">הירשם כשליח</h3>
            <p className="text-gray-600">
              הירשם למערכת, בחר מטרה אישית וקבל דף נחיתה ייחודי משלך
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">גייס מצטרפים</h3>
            <p className="text-gray-600">
              שתף את הלינק האישי שלך וגייס תורמים שיתפללו למטרה שלך
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">תפילות יומיות</h3>
            <p className="text-gray-600">
              כל מצטרף מקבל תפילות יומיות במקומות קדושים
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">קבל עמלות</h3>
            <p className="text-gray-600">
              הרווח מכל מצטרף חדש - 60₪ חד-פעמי או 5₪ לחודש
            </p>
          </div>
        </div>
      </div>
      
      {/* Pricing */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">מסלולי שליחות</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">מסלול בסיסי</h3>
            <div className="text-4xl font-bold text-indigo-600 mb-6">₪18<span className="text-lg text-gray-600">/חודש</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>דף נחיתה אישי</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>QR Code ייחודי</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>עמלות על כל מצטרף</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>ניהול ארנק דיגיטלי</span>
              </li>
            </ul>
            <Button variant="secondary" className="w-full">בחר מסלול</Button>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-lg text-white">
            <h3 className="text-2xl font-bold mb-2">מסלול מתקדם</h3>
            <div className="text-4xl font-bold mb-6">₪30<span className="text-lg opacity-90">/חודש</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✓</span>
                <span>כל היתרונות של המסלול הבסיסי</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✓</span>
                <span>תמיכה מועדפת</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✓</span>
                <span>חומרי שיווק מתקדמים</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✓</span>
                <span>דוחות מפורטים</span>
              </li>
            </ul>
            <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100">בחר מסלול</Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>© 2024 עמידר - כל הזכויות שמורות</p>
        </div>
      </footer>
    </div>
  );
}

