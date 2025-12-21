# הגדרת Authentication - מערכת עמידר

## 👥 משתמשים במערכת

### 1. Admin (מנהל)
- **אימייל:** `amit@ami-dar.co.il`
- **ID:** `b6b43d8c-0073-48d2-8502-301513384c15`
- **תפקיד:** admin
- **גישה:** כל הדשבורד של המנהל

### 2. Messenger - דמו עם נתונים (שליח)
- **אימייל:** `messenger@example.com`
- **ID:** `11111111-1111-1111-1111-111111111111`
- **תפקיד:** messenger
- **Slug:** `yossi-cohen`
- **נתונים:** 5 תורמים, 5 תפילות, ₪85 בארנק

### 3. Messenger - אמיתי (שליח)
- **אימייל:** `dolevhayut1994@gmail.com`
- **ID:** `675d736a-d4f1-4cee-9e94-f5e3fb861574`
- **תפקיד:** messenger
- **Slug:** `dolev-hayut`
- **נתונים:** חדש, ללא נתונים

## 🔐 הגדרת סיסמאות

כדי שהמשתמשים יוכלו להתחבר, יש להגדיר להם סיסמאות ב-Supabase:

### דרך Supabase Dashboard:
1. היכנס ל-Supabase Dashboard
2. עבור ל-Authentication -> Users
3. בחר משתמש
4. לחץ על "Reset Password" או "Update User"
5. הגדר סיסמה

### דרך SQL:
```sql
-- הגדר סיסמה למשתמש דמו (messenger)
-- הפקודה הזו דורשת הרשאות מיוחדות ב-Supabase
-- מומלץ להשתמש ב-Dashboard
```

## 📝 הוראות התחברות

### התחברות רגילה:
1. פתח את `http://localhost:5173/login`
2. הזן אימייל וסיסמה
3. לחץ "התחבר"

### משתמשי דמו מומלצים:

#### שליח עם נתונים (לבדיקות):
```
אימייל: messenger@example.com
סיסמה: demo123456
```

#### מנהל:
```
אימייל: amit@ami-dar.co.il
סיסמה: [הסיסמה שהגדרת ב-Supabase]
```

#### שליח חדש:
```
אימייל: dolevhayut1994@gmail.com
סיסמה: [הסיסמה שהגדרת ב-Supabase]
```

## 🔧 איך זה עובד

### 1. Supabase Auth
- משתמשים מאומתים דרך `supabase.auth.signInWithPassword()`
- Session נשמר אוטומטית
- Auth state מסונכרן אוטומטית

### 2. קישור לטבלת Users
- לאחר התחברות מוצלחת, המערכת שולפת את פרטי המשתמש מטבלת `users`
- ה-ID מ-Supabase Auth תואם ל-ID בטבלת `users`
- Role נקבע לפי הטבלה שלנו (admin/messenger/member)

### 3. משתמשי Messenger
- כל messenger מקבל רשומה בטבלת `messengers`
- הרשומה כוללת: landing_page_slug, wallet_balance, plan_type וכו'
- מקושר ל-user_id

## 🛠️ פתרון בעיות

### משתמש לא מצליח להתחבר?
1. ודא שהמשתמש קיים ב-Supabase Auth
2. ודא שיש לו סיסמה מוגדרת
3. ודא שהמשתמש קיים בטבלת `users` עם אותו ID
4. בדוק את ה-console בדפדפן לשגיאות

### משתמש מתחבר אבל רואה שגיאה?
1. ודא שה-role נכון בטבלת `users`
2. אם זה messenger - ודא שיש לו רשומה בטבלת `messengers`
3. בדוק את ה-console logs

### איך ליצור משתמש חדש?
1. צור משתמש ב-Supabase Auth (Authentication -> Users)
2. הוסף רשומה בטבלת `users` עם אותו ID
3. אם זה messenger - הוסף רשומה בטבלת `messengers`

## 📊 דוגמאות SQL

### הוספת משתמש חדש:
```sql
-- 1. יצירת User Record
INSERT INTO users (id, email, full_name, phone, role)
VALUES (
  'YOUR-UUID-FROM-SUPABASE-AUTH',
  'user@example.com',
  'שם משתמש',
  '050-1234567',
  'messenger'
);

-- 2. אם זה messenger - יצירת Messenger Record
INSERT INTO messengers (
  id,
  user_id,
  plan_type,
  landing_page_slug,
  wallet_balance,
  is_active
)
VALUES (
  gen_random_uuid(),
  'YOUR-UUID-FROM-SUPABASE-AUTH',
  '18',
  'user-slug',
  0.00,
  true
);
```

### בדיקת משתמשים:
```sql
-- כל המשתמשים עם פרטים
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  m.landing_page_slug,
  m.wallet_balance
FROM users u
LEFT JOIN messengers m ON m.user_id = u.id
ORDER BY u.role, u.created_at;
```

## 🔒 אבטחה

- ✅ Authentication דרך Supabase Auth
- ⚠️ RLS (Row Level Security) - יש להגדיר!
- ⚠️ Policies - יש להגדיר לכל טבלה
- ✅ JWT Tokens מנוהלים אוטומטית
- ✅ Session management אוטומטי

## 📚 קריאה נוספת
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

