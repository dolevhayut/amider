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
  
  const handleMockLogin = (role: 'messenger' | 'member' | 'admin') => {
    mockLogin(role);
    const redirectPath = role === 'admin' ? '/admin/dashboard' : 
                        role === 'messenger' ? '/messenger/dashboard' : 
                        '/member/dashboard';
    navigate(redirectPath);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">עמידר</h1>
          <p className="text-gray-600">מערכת ניהול תורמים ותפילות</p>
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
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3 text-center">התחברות מהירה לפיתוח:</p>
          <div className="space-y-2">
            <Button 
              variant="secondary" 
              onClick={() => handleMockLogin('messenger')}
              className="w-full"
            >
              כניסה כשליח
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleMockLogin('member')}
              className="w-full"
            >
              כניסה כמצטרף
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleMockLogin('admin')}
              className="w-full"
            >
              כניסה כמנהל
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

