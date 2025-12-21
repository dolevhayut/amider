# עמידר - מערכת ניהול שליחים ותורמים 🙏

מערכת CRM מתקדמת לניהול שליחים, תורמים, תפילות ועמלות.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Private-red)

---

## 🌟 תכונות עיקריות

### צד שליח
- 📊 Dashboard אישי עם סטטיסטיקות בזמן אמת
- 👥 ניהול תורמים - רשימה, חיפוש, סינון
- 🙏 ניהול תפילות - רשימה, סימון כהושלם
- 💰 ניהול ארנק - עמלות, משיכות
- 📱 QR Code אישי להדפסה
- 🔗 קישור אישי לדף נחיתה
- ⚙️ עדכון הגדרות ופרופיל

### צד מנהל
- 📈 Dashboard כללי עם סקירת המערכת
- 👨‍💼 ניהול שליחים מלא:
  - צירוף שליח חדש (4 שלבים)
  - עריכת פרטי שליח
  - צפייה מפורטת בשליח
  - השהיה/הפעלה
  - חיפוש וסינון מתקדם
- 📊 סטטיסטיקות כלליות
- 💳 ניהול עמלות ותשלומים

---

## 🛠️ טכנולוגיות

### Frontend
- **React 18** - ספריית UI
- **TypeScript** - Type safety
- **Vite** - Build tool מהיר
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend & Database
- **Supabase** - PostgreSQL + Auth + Realtime
- **Row Level Security** - אבטחת נתונים
- **PostgreSQL** - Database

### Tools & Services
- **Vercel** - Hosting & CI/CD
- **Git** - Version control
- **npm** - Package manager

---

## 🚀 התחלה מהירה

### 1. התקנה
```bash
# שכפול הפרויקט
git clone <repository-url>
cd amidar

# התקנת תלויות
npm install
```

### 2. הגדרת משתני סביבה
צור קובץ `.env.local`:
```env
VITE_SUPABASE_URL=https://flmtdtkegepwbvxyemwp.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. הרצה
```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

האפליקציה תרוץ על: `http://localhost:5173`

---

## 👥 משתמשים במערכת

### מנהל (Admin)
- **אימייל:** amit@ami-dar.co.il
- **סיסמה:** 123456
- **גישה:** כל הדשבורד, ניהול שליחים, קמפיינים

### שליח (Messenger)
- **אימייל:** dolevhayut1994@gmail.com
- **סיסמה:** 123456
- **גישה:** דשבורד אישי, תורמים, תפילות, הגדרות

### תורם (Member)
- **אין גישה למערכת**
- משלמים דרך Cardcom חיצוני
- נרשמים אוטומטית בדאטה בייס

---

## 📁 מבנה הפרויקט

```
amidar/
├── src/
│   ├── components/
│   │   ├── admin/          # קומפוננטות אדמין
│   │   ├── messenger/      # קומפוננטות שליח
│   │   └── shared/         # קומפוננטות משותפות
│   ├── contexts/
│   │   └── AuthContext.tsx # ניהול אימות
│   ├── hooks/
│   │   ├── useAdminMessengers.ts
│   │   ├── useMessengerData.ts
│   │   ├── useMessengerDonors.ts
│   │   └── useMessengerPrayers.ts
│   ├── layouts/
│   │   └── DashboardLayout.tsx
│   ├── lib/
│   │   ├── supabase.ts    # Supabase client
│   │   └── hebrewDate.ts  # המרה לתאריך עברי
│   ├── pages/
│   │   ├── admin/         # דפי אדמין
│   │   ├── auth/          # התחברות
│   │   └── messenger/     # דפי שליח
│   ├── types/
│   │   ├── database.types.ts  # טייפים מ-Supabase
│   │   └── index.ts       # טייפים כלליים
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── logo.png
│   └── manifest.json
├── index.html
├── vercel.json
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 📚 תיעוד

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - מדריך בדיקה מפורט
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - הוראות פריסה
- **[DATA_SUMMARY.md](DATA_SUMMARY.md)** - סיכום נתוני המערכת
- **[ADMIN_MESSENGERS_COMPLETE.md](ADMIN_MESSENGERS_COMPLETE.md)** - תיעוד מערכת ניהול שליחים

---

## 🗄️ מבנה הדאטה בייס

### טבלאות עיקריות:
- `users` - כל המשתמשים (שליחים, תורמים, אדמינים)
- `messengers` - פרטי שליחים
- `members` - פרטי תורמים
- `prayer_requests` - בקשות תפילה
- `transactions` - טרנזקציות כספיות
- `goals` - מטרות תפילה
- `campaigns` - קמפיינים שיווקיים
- `tefillin_stands` - עמדות תפילין

### יחסים:
```
users (1) → (1) messengers
messengers (1) → (*) members
messengers (1) → (*) prayer_requests
messengers (1) → (*) transactions
members (1) → (*) prayer_requests
```

---

## 🎨 עיצוב

- **צבע ראשי:** Indigo (#4F46E5)
- **כיוון:** RTL (עברית)
- **רספונסיבי:** מובייל, טאבלט, דסקטופ
- **נגישות:** WCAG 2.1 AA
- **פונט:** Google Sans

---

## 🔧 פקודות זמינות

```bash
# Development
npm run dev          # הרץ dev server

# Build
npm run build        # בנה לפרודקשן
npm run preview      # תצוגה מקדימה של build

# Linting
npm run lint         # הרץ ESLint

# Type Checking
npx tsc --noEmit     # בדוק טייפים
```

---

## 🤝 תרומה

הפרויקט הוא פרטי. לשאלות ותמיכה צור קשר עם הצוות.

---

## 📄 רישיון

Private - All rights reserved to Amidar Team

---

## 📞 צור קשר

- **Website:** https://ami-dar.co.il
- **Email:** amit@ami-dar.co.il

---

**גרסה:** 1.0.0  
**עדכון אחרון:** דצמבר 2024  
**סטטוס:** ✅ Production Ready

