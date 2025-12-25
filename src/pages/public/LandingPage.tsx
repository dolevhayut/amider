import { useParams, useNavigate } from 'react-router-dom';
import { useLandingPage } from '../../hooks';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Heart, ArrowLeft, Loader2 } from 'lucide-react';

export function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useLandingPage(slug || '');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען את הדף...</p>
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
            <ArrowLeft className="h-4 w-4" />
            חזרה לדף הבית
          </Button>
        </Card>
      </div>
    );
  }

  const { messenger, content } = data;
  
  // Use global colors
  const primaryColor = content.theme_color || '#A4832E';
  const secondaryColor = '#253B49';

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: content.background_style === 'gradient' 
          ? `linear-gradient(135deg, ${primaryColor}15 0%, #f8f9fa 50%, ${primaryColor}08 100%)`
          : content.background_style === 'dark'
          ? secondaryColor
          : '#ffffff'
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
            onClick={() => navigate(`/m/${slug}/donate`)}
            style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}
          >
            <Heart className="h-4 w-4 ml-2" />
            אני רוצה שיתפללו עלי
          </Button>
        </div>
      </header>

      {/* Hero Section with Background */}
      <section className="relative overflow-hidden mt-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/פתיח-למובייל-3.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Light beige overlay like the original site */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: 'rgba(238, 230, 213, 0.75)' }}
        />
        
        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Title with Religious Font */}
            <h1 
              className="landing-page-title text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight animate-fade-in-up"
              style={{ color: primaryColor }}
            >
              {content.hero_title}
            </h1>

            {/* Description */}
            <p 
              className="text-lg sm:text-xl mb-4 leading-relaxed px-4 animate-fade-in-up animate-delay-100"
              style={{ color: secondaryColor }}
            >
              {content.hero_description}
            </p>
            
            {/* Bold highlight - like the original site */}
            <p 
              className="text-lg sm:text-xl font-bold mb-12 px-4"
              style={{ color: secondaryColor }}
            >
              וכל הטוב הזה בהשתתפות סמלית רק של 1 ש"ח ביום.
            </p>

            {/* CTA Buttons - Like original site */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-delay-200">
              <Button
                onClick={() => navigate(`/m/${slug}/donate?plan=yearly`)}
                className="text-base sm:text-lg px-8 py-4 rounded-full min-w-[280px]"
                style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}
              >
                אני רוצה שיתפללו עלי כל השנה
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
              
              <Button
                onClick={() => navigate(`/m/${slug}/donate?plan=monthly`)}
                className="text-base sm:text-lg px-8 py-4 rounded-full min-w-[280px]"
                style={{ backgroundColor: secondaryColor, color: '#FFFFFF' }}
              >
                אני רוצה שיתפללו עלי כל חודש
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {content.about_content && (
        <section 
          id="about" 
          className="py-16 sm:py-20"
          style={{
            backgroundColor: '#f9fafb'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div 
                className="text-center p-6 rounded-lg shadow-md border"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: primaryColor + '20'
                }}
              >
                <h2 
                  className="landing-page-title text-3xl font-bold mb-6"
                  style={{ color: primaryColor }}
                >
                  {content.about_title}
                </h2>
                <p 
                  className="text-lg leading-relaxed whitespace-pre-wrap"
                  style={{ color: '#374151' }}
                >
                  {content.about_content}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Impact Section */}
      {content.impact_items && content.impact_items.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 
                className="landing-page-title text-3xl font-bold text-center mb-12"
                style={{ color: secondaryColor }}
              >
                {content.impact_title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.impact_items.map((item, index) => (
                  <div 
                    key={index}
                    className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow"
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: primaryColor + '20'
                    }}
                  >
                    <div 
                      className="text-4xl mb-4"
                      style={{ color: primaryColor }}
                    >
                      {item.icon}
                    </div>
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{ color: secondaryColor }}
                    >
                      {item.title}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: '#6b7280' }}
                    >
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section 
        className="py-20"
        style={{
          backgroundColor: primaryColor + '10'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 
            className="landing-page-title text-3xl sm:text-4xl font-bold mb-6"
            style={{ color: secondaryColor }}
          >
            הצטרפו עכשיו לשירות התפילה
          </h2>
          <p 
            className="text-lg mb-8"
            style={{ color: '#374151' }}
          >
            תפילה יומית והזכרת שמות בקברות הצדיקים - בהשתתפות סמלית של 1 ש״ח ליום
          </p>
          <Button
            onClick={() => navigate(`/m/${slug}/donate`)}
            className="text-xl px-10 py-7 shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}
          >
            <Heart className="h-7 w-7 ml-2" />
            הצטרפו לשירות התפילה
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-12 text-center"
        style={{ 
          backgroundColor: '#f3f4f6',
          color: '#6b7280'
        }}
      >
        <div className="container mx-auto px-4">
          <img 
            src="/logo.png" 
            alt="עמי דר" 
            className="h-12 w-auto mx-auto mb-4 opacity-60"
          />
          <p className="text-sm mb-2">מיזם עמי דר - שותפות בתפילה ובמצוות</p>
          <p className="text-xs">כל הזכויות שמורות © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

