import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Card } from '../../components/shared/Card';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, mockLogin } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('שגיאה בהתחברות. אנא בדוק את הפרטים ונסה שוב.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMockLogin = async (role: 'messenger' | 'member' | 'admin') => {
    await mockLogin(role);
    const redirectPath = role === 'admin' ? '/admin/dashboard' : 
                        role === 'messenger' ? '/messenger/dashboard' : 
                        '/member/dashboard';
    navigate(redirectPath);
  };

  const handleQuickLogin = async (userEmail: string, userPassword: string, redirectPath: string) => {
    setLoading(true);
    setError('');
    try {
      await login(userEmail, userPassword);
      navigate(redirectPath);
    } catch (err) {
      setError('שגיאה בהתחברות מהירה');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="עמידר" className="h-16 sm:h-20 w-auto object-contain" />
          </div>
          <p className="text-sm sm:text-base text-gray-600">מערכת ניהול תורמים ותפילות</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="אימייל"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
          
          <Input
            label="סיסמה"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <Button type="submit" loading={loading} className="w-full">
            התחבר
          </Button>
        </form>
        
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-3 text-center">התחברות מהירה (פיתוח בלבד):</p>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="secondary" 
              onClick={() => handleQuickLogin('amit@ami-dar.co.il', '123456', '/admin/dashboard')}
              disabled={loading}
              className="w-full text-xs sm:text-sm"
              size="sm"
            >
              🔐 מנהל
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleQuickLogin('dolevhayut1994@gmail.com', '123456', '/messenger/dashboard')}
              disabled={loading}
              className="w-full text-xs sm:text-sm"
              size="sm"
            >
              👤 שליח
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <p className="font-semibold mb-1">פרטי התחברות:</p>
            <p>• מנהל: amit@ami-dar.co.il / 123456</p>
            <p>• שליח: dolevhayut1994@gmail.com / 123456</p>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            * תורמים לא נכנסים למערכת - הם משלמים דרך Cardcom חיצוני
          </p>
        </div>
      </Card>
    </div>
  );
}

