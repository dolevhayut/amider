# 🚀 הוראות פריסה (Deployment)

## Vercel Deployment

### קבצים להפצה:

1. **vercel.json** - הגדרות Vercel
   - ✅ Routing ל-SPA
   - ✅ Cache headers לאסטים
   - ✅ Build command
   - ✅ Output directory

2. **manifest.json** - PWA Support
   - ✅ תמיכה ב-Progressive Web App
   - ✅ אייקונים
   - ✅ תצוגת standalone
   - ✅ RTL support

3. **index.html** - Meta Data
   - ✅ SEO tags
   - ✅ Open Graph
   - ✅ Twitter Cards
   - ✅ Apple Meta Tags
   - ✅ PWA Meta Tags

---

## 📋 צעדים לפריסה ב-Vercel

### 1. התקנה ראשונית
```bash
# התקן Vercel CLI (אם עדיין לא)
npm i -g vercel

# התחבר לחשבון Vercel
vercel login
```

### 2. הגדרת משתני סביבה
לפני הפריסה, הגדר את משתני הסביבה ב-Vercel:

```bash
# דרך CLI
vercel env add VITE_SUPABASE_URL
# הזן: https://flmtdtkegepwbvxyemwp.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# הזן: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**או דרך Vercel Dashboard:**
1. Project Settings → Environment Variables
2. הוסף:
   - `VITE_SUPABASE_URL` = `https://flmtdtkegepwbvxyemwp.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbXRkdGtlZ2Vwd2J2eHllbXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDIxODgsImV4cCI6MjA4MTkxODE4OH0.PssXkNyHknvHJ-wtnuGQbnZNnDqdYlR7ozN93W_xjTM`

### 3. פריסה
```bash
# פריסה לפרודקשן
vercel --prod

# או פריסה לסביבת preview
vercel
```

---

## 🔧 הגדרות Vercel Dashboard

### Build & Development Settings:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Root Directory:
- `.` (שורש הפרויקט)

### Node.js Version:
- `18.x` (או גרסה עדכנית יותר)

---

## 🌐 הגדרת דומיין

### דומיין מותאם אישית:
1. Vercel Dashboard → Domains
2. הוסף: `ami-dar.co.il` או `app.ami-dar.co.il`
3. עדכן DNS records:
   - Type: `CNAME`
   - Name: `app` (או `@` לדומיין ראשי)
   - Value: `cname.vercel-dns.com`

### SSL Certificate:
- ✅ Vercel מספק SSL אוטומטית
- ✅ Let's Encrypt
- ✅ Auto-renewal

---

## 🔐 אבטחה בפרודקשן

### 1. Supabase RLS (Row Level Security)
⚠️ **חובה להפעיל RLS לפני פרודקשן!**

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tefillin_stands ENABLE ROW LEVEL SECURITY;

-- Create policies (דוגמאות)
-- Messengers can only see their own data
CREATE POLICY "Messengers can view own data" ON messengers
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can see everything
CREATE POLICY "Admins can view all" ON messengers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. Environment Variables
- ✅ אל תשמור keys ב-git
- ✅ השתמש בהם רק דרך Vercel
- ⚠️ אל תחשוף service_role key

### 3. CORS & Security Headers
```json
// vercel.json - הוסף אם צריך
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## ✅ Checklist לפני פריסה

- [ ] Build עובר בהצלחה (`npm run build`)
- [ ] אין שגיאות lint
- [ ] משתני סביבה מוגדרים ב-Vercel
- [ ] RLS מופעל ב-Supabase
- [ ] Policies מוגדרות
- [ ] דומיין מוגדר
- [ ] SSL פעיל
- [ ] נבדק במובייל וטאבלט
- [ ] נבדק בדפדפנים שונים
- [ ] הסר כפתורי התחברות מהירה (או הסתר בפרודקשן)

---

## 🔄 CI/CD - Automatic Deployment

Vercel מתחבר אוטומטית ל-Git:

### Git Integration:
1. חבר את ה-repository ל-Vercel
2. כל push ל-`main` = deployment אוטומטי לפרודקשן
3. כל PR = preview deployment אוטומטי

### Preview Deployments:
- כל PR מקבל URL ייעודי
- ניתן לבדוק שינויים לפני merge
- אוטומטית מסתנכרן עם Git

---

## 📊 Monitoring

### Supabase Dashboard:
- מעקב אחרי queries
- לוגים של Auth
- מעקב אחרי errors

---

## 🐛 פתרון בעיות

### Build נכשל?
1. בדוק שכל התלויות מותקנות
2. בדוק `package.json`
3. הרץ `npm run build` לוקלית

### משתני סביבה לא עובדים?
1. ודא שהם מתחילים ב-`VITE_`
2. ודא שהם מוגדרים ב-Vercel
3. הגדר אותם לכל הסביבות (Production, Preview, Development)

### Routing לא עובד?
1. בדוק ש-`vercel.json` קיים
2. ודא ש-rewrites מוגדרים נכון
3. נסה redeploy

### SSL/HTTPS לא עובד?
1. המתן עד 24 שעות לאחר הגדרת הדומיין
2. בדוק DNS records
3. בדוק ב-Vercel Dashboard → Domains

---

## 📞 תמיכה

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **React Router:** https://reactrouter.com/

---

## 🎉 המערכת מוכנה לפריסה!

כל הקבצים הנדרשים קיימים:
- ✅ vercel.json
- ✅ manifest.json  
- ✅ index.html (עם meta tags)
- ✅ .env.local (לפיתוח)

פשוט הרץ `vercel --prod` והמערכת תעלה לאוויר! 🚀

