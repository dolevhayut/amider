import { useState } from 'react';
import { 
  Link as LinkIcon, 
  QrCode, 
  Image as ImageIcon, 
  Copy, 
  Download,
  Share2,
  FileText,
  Video,
  CheckCircle
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { HebrewDateDisplay } from '../../components/shared/HebrewDateDisplay';
import { useMessengerData } from '../../hooks/useMessengerData';
import QRCode from 'react-qr-code';

export function MyAssets() {
  const { profile, loading } = useMessengerData();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const landingPageUrl = profile 
    ? `${window.location.origin}/m/${profile.landing_page_slug}`
    : '';

  const copyToClipboard = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemId);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-${profile?.landing_page_slug}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
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

  // Marketing texts
  const marketingTexts = [
    {
      id: 'whatsapp',
      platform: 'וואטסאפ',
      text: `🙏 שלום וברכה!\n\nרציתי לשתף אתכם במשהו מיוחד - אני מתפלל יום יום בקברות צדיקים בארץ ובחו"ל.\n\nאם תרצו שאתפלל גם עליכם ועל יקיריכם - נשמח לקבל אתכם למעגל התפילה שלי 💙\n\n👉 כל הפרטים כאן:\n${landingPageUrl}\n\nבברכת כל טוב! 🌟`,
      icon: Share2,
      color: 'green'
    },
    {
      id: 'facebook',
      platform: 'פייסבוק',
      text: `🕊️ תפילה בקברות הצדיקים - יום יום\n\nאני מתפלל עבורכם בקברות הצדיקים הקדושים בארץ ובחו"ל.\nמזכיר את שמכם יום יום לרפואה, פרנסה, שידוכים וכל ישועה.\n\n✨ הצטרפו למעגל התפילה:\n${landingPageUrl}\n\n#תפילה #צדיקים #ברכה`,
      icon: Share2,
      color: 'blue'
    },
    {
      id: 'email',
      platform: 'אימייל',
      text: `נושא: תפילה אישית בקברות הצדיקים\n\nשלום רב,\n\nאני ${profile?.full_name || '[שמך]'}, ואני מתפלל יום יום בקברות צדיקים קדושים.\nאשמח לקבל אתכם למעגל התפילה שלי - אזכיר את שמכם ואת שמות יקיריכם בתפילות.\n\nלכל הפרטים והצטרפות:\n${landingPageUrl}\n\nבברכה,\n${profile?.full_name || '[שמך]'}`,
      icon: FileText,
      color: 'purple'
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">הנכסים שלי</h1>
          <HebrewDateDisplay />
        </div>
        <p className="text-sm sm:text-base text-gray-600">כל הכלים והקריאטיבים לשיווק</p>
      </div>

      {/* Quick Links Section */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">הקישור האישי שלי</h2>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הקישור לדף הנחיתה שלך
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={landingPageUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 font-mono"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => copyToClipboard(landingPageUrl, 'main-link')}
                  className="flex-1 sm:flex-none" 
                  size="sm"
                >
                  {copiedItem === 'main-link' ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      הועתק!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      העתק
                    </>
                  )}
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 sm:flex-none" 
                  size="sm"
                  onClick={() => window.open(landingPageUrl, '_blank')}
                >
                  <Share2 className="h-4 w-4" />
                  פתח
                </Button>
              </div>
            </div>
          </div>

          {/* Short Link */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-900 mb-2 font-medium">💡 טיפ:</p>
            <p className="text-xs text-blue-700">
              שתף את הקישור בוואטסאפ, פייסבוק, אינסטגרם או בכל מקום אחר. כל מי שיירשם דרך הקישור שלך יהיה הלקוח שלך!
            </p>
          </div>
        </div>
      </Card>

      {/* QR Code Section */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">ברקוד (QR) להדפסה</h2>
          </div>
        }
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-4">
            <p className="text-sm text-gray-600">
              הדפס את הברקוד והצמד אותו בעמדת תפילין, בבית הכנסת, או בכל מקום ציבורי.
              כל מי שיסרוק את הברקוד יגיע לדף שלך!
            </p>
            <div className="space-y-2">
              <Button onClick={downloadQR} className="w-full sm:w-auto">
                <Download className="h-4 w-4" />
                הורד ברקוד להדפסה
              </Button>
              <p className="text-xs text-gray-500">
                * הברקוד יישמר כתמונה באיכות גבוהה
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
            <div id="qr-code-svg">
              <QRCode value={landingPageUrl} size={200} />
            </div>
          </div>
        </div>
      </Card>

      {/* Marketing Texts */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">טקסטים מוכנים לשיתוף</h2>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            טקסטים מוכנים לשיתוף ברשתות החברתיות - פשוט תעתיק ותשתף!
          </p>
          {marketingTexts.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 text-${item.color}-600`} />
                    <h3 className="font-semibold text-gray-900">{item.platform}</h3>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => copyToClipboard(item.text, item.id)}
                  >
                    {copiedItem === item.id ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        הועתק!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        העתק
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap font-sans border border-gray-200">
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Creative Assets - Coming Soon */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">קריאטיבים חזותיים</h2>
            <Badge variant="warning">בקרוב</Badge>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            תמונות ובאנרים מעוצבים להורדה ושיתוף
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Placeholder for future creative assets */}
            <div className="aspect-square bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center p-4">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">פוסט לפייסבוק</p>
                <p className="text-xs text-gray-400">בקרוב</p>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-pink-50 to-red-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center p-4">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">סטורי לאינסטגרם</p>
                <p className="text-xs text-gray-400">בקרוב</p>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center p-4">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">באנר לאתר</p>
                <p className="text-xs text-gray-400">בקרוב</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Video Assets - Coming Soon */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">סרטוני הסבר</h2>
            <Badge variant="warning">בקרוב</Badge>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            סרטונים קצרים להסבר על המיזם - לשיתוף ברשתות
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="aspect-video bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center p-4">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">סרטון הסבר 30 שניות</p>
                <p className="text-xs text-gray-400">בקרוב</p>
              </div>
            </div>
            <div className="aspect-video bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center p-4">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">סרטון המלצה</p>
                <p className="text-xs text-gray-400">בקרוב</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tips Section */}
      <Card>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            💡 טיפים לשיווק מוצלח
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">1.</span>
              <span>שתף את הקישור בסטטוס וואטסאפ פעם ביום</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">2.</span>
              <span>הדבק את הברקוד על עמדת התפילין שלך</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">3.</span>
              <span>שלח הודעה אישית לקרובים ולחברים</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">4.</span>
              <span>פרסם בקבוצות וואטסאפ שאתה חבר בהן</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">5.</span>
              <span>שתף את הקישור לאחר תפילה מוצלחת</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

