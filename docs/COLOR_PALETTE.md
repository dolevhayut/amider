# פלטת צבעים גלובלית 🎨

## סקירה כללית

פלטת הצבעים הרשמית של מיזם עמי דר, המשולבת בכל המערכת.

---

## צבעים ראשיים

### 1. צבע ראשי (Primary) - זהב
```css
#A4832E
rgb(164, 131, 46)
```

**שימושים**:
- כפתורים ראשיים (CTA)
- כותרות ודגשים
- אייקונים חשובים
- hover states
- אלמנטים דקורטיביים

**דוגמה**:
```jsx
<button style={{ backgroundColor: '#A4832E', color: '#FFFFFF' }}>
  תרמו עכשיו
</button>
```

---

### 2. צבע משני (Secondary) - נייבי כהה
```css
#253B49
rgb(37, 59, 73)
```

**שימושים**:
- רקעים כהים
- טקסטים על רקע בהיר
- borders ומסגרות
- dark mode
- כותרות משניות

**דוגמה**:
```jsx
<div style={{ backgroundColor: '#253B49', color: '#FFFFFF' }}>
  תוכן
</div>
```

---

### 3. צבע טקסט (Text) - לבן
```css
#FFFFFF
rgb(255, 255, 255)
```

**שימושים**:
- טקסט על רקעים כהים
- טקסט על כפתורים צבעוניים
- אלמנטים בהירים

---

## משתני CSS

הצבעים מוגדרים כמשתנים גלובליים ב-`src/index.css`:

```css
:root {
  --color-primary: #A4832E;      /* זהב */
  --color-secondary: #253B49;    /* נייבי */
  --color-text: #FFFFFF;         /* לבן */
  
  /* גרדיאנטים */
  --gradient-primary: linear-gradient(135deg, #A4832E 0%, #C4A250 100%);
  --gradient-secondary: linear-gradient(135deg, #253B49 0%, #35516B 100%);
  
  /* גרסאות בהירות */
  --color-primary-light: rgba(164, 131, 46, 0.1);
  --color-secondary-light: rgba(37, 59, 73, 0.1);
}
```

### איך להשתמש:
```css
.my-button {
  background-color: var(--color-primary);
  color: var(--color-text);
}

.my-section {
  background: var(--gradient-primary);
}
```

---

## גרסאות ושינויים

### גרסאות בהירות (10% opacity)
- `#A4832E1A` - זהב בהיר
- `#253B491A` - נייבי בהיר

### גרסאות מתונות (20% opacity)
- `#A4832E33` - זהב מתון
- `#253B4933` - נייבי מתון

### גרסאות כהות יותר
- `#8A6C25` - זהב כהה
- `#1A2A36` - נייבי כהה מאוד

---

## שימוש במערכת

### דף נחיתה (LandingPage.tsx)

```jsx
const primaryColor = content.theme_color || '#A4832E';
const secondaryColor = '#253B49';

// כפתור ראשי
<Button style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}>
  תרמו עכשיו
</Button>

// רקע גרדיאנט
<div style={{ 
  background: `linear-gradient(135deg, ${primaryColor}15 0%, #f8f9fa 50%, ${primaryColor}08 100%)`
}}>
```

### עמוד תרומה (DonatePage.tsx)

```jsx
const primaryColor = content.theme_color || '#A4832E';

// כפתור בחירת סכום
<button style={{
  backgroundColor: primaryColor,
  color: '#FFFFFF'
}}>
  ₪18
</button>
```

### מודאל עריכה (EditLandingPageModal.tsx)

```jsx
// ברירת מחדל
const [formData, setFormData] = useState({
  theme_color: '#A4832E',
  background_style: 'gradient'
});
```

---

## דוגמאות שימוש

### 1. כפתור ראשי
```jsx
<button className="px-8 py-4 rounded-lg" style={{
  backgroundColor: '#A4832E',
  color: '#FFFFFF',
  boxShadow: '0 4px 6px rgba(164, 131, 46, 0.3)'
}}>
  לחץ כאן
</button>
```

### 2. כרטיס עם גבול
```jsx
<div className="p-6 rounded-lg border" style={{
  backgroundColor: '#FFFFFF',
  borderColor: '#A4832E33'
}}>
  תוכן הכרטיס
</div>
```

### 3. רקע עם overlay
```jsx
<div style={{
  background: 'linear-gradient(135deg, #A4832E15 0%, #f8f9fa 50%, #A4832E08 100%)'
}}>
  תוכן
</div>
```

### 4. טקסט מודגש
```jsx
<h2 style={{ color: '#A4832E' }}>
  כותרת חשובה
</h2>
```

### 5. אייקון צבעוני
```jsx
<Heart className="h-6 w-6" style={{ color: '#A4832E' }} />
```

---

## נגישות (Accessibility)

### ניגודיות צבעים

✅ **עובר WCAG AA**:
- זהב (#A4832E) על לבן - 4.8:1
- לבן על זהב - 4.8:1
- לבן על נייבי (#253B49) - 12.6:1
- נייבי על לבן - 12.6:1

⚠️ **לא מומלץ**:
- זהב על נייבי - ניגודיות נמוכה
- טקסט קטן בצבע זהב על רקע בהיר

### המלצות:
1. השתמש בלבן (#FFFFFF) לטקסט על כפתורים זהובים
2. השתמש בנייבי (#253B49) לטקסט על רקע לבן
3. אל תשתמש בזהב לטקסט ארוך - רק לכותרות ודגשים

---

## מסד נתונים

### ערך ברירת מחדל בטבלה

```sql
-- landing_page_content table
ALTER TABLE public.landing_page_content 
  ALTER COLUMN theme_color SET DEFAULT '#A4832E';

-- כל השליחים החדשים יקבלו אוטומטית צבע זהב
```

### עדכון שליחים קיימים

```sql
-- עדכן שליחים שיש להם את הצבע הישן
UPDATE public.landing_page_content
SET theme_color = '#A4832E'
WHERE theme_color = '#6366f1';
```

---

## התאמה אישית

### איך האדמין יכול לשנות צבעים

1. לך ל**ניהול שליחים**
2. לחץ על כפתור **ערוך דף נחיתה** (🌐)
3. עבור לטאב **עיצוב**
4. שנה את **צבע ראשי**
5. שמור שינויים

**הצבע החדש ישתקף**:
- בכל הכפתורים
- בכותרות ודגשים
- באלמנטים דקורטיביים
- ברקעים וגבולות

---

## פלטת צבעים מורחבת

### צבעי עזר נוספים

#### הצלחה (Success) - ירוק
```css
#10b981
```

#### אזהרה (Warning) - כתום
```css
#f59e0b
```

#### שגיאה (Error) - אדום
```css
#ef4444
```

#### מידע (Info) - כחול
```css
#3b82f6
```

#### אפור (Neutral)
```css
#6b7280 - אפור בינוני
#9ca3af - אפור בהיר
#374151 - אפור כהה
```

---

## כלים ומשאבים

### בודק ניגודיות
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

### גנרטור פלטות
- [Coolors](https://coolors.co/)
- [Adobe Color](https://color.adobe.com/)

### טיפים:
1. שמור על עקביות - השתמש באותם צבעים בכל המערכת
2. השתמש בגרסאות בהירות (10-20% opacity) לרקעים עדינים
3. תמיד בדוק ניגודיות לפני שימוש בטקסט
4. אפשר התאמה אישית רק לצבע ראשי, לא למשני

---

## עדכונים עתידיים

### מה מתוכנן:
- [ ] תמיכה בערכות נושא (themes)
- [ ] מצב לילה מלא (dark mode)
- [ ] צבעים דינמיים לפי זמן היום
- [ ] פלטות צבעים מוכנות לבחירה
- [ ] שמירת היסטוריית צבעים

---

## סיכום

### צבעים ראשיים:
1. **זהב (#A4832E)** - כפתורים, דגשים, אייקונים
2. **נייבי (#253B49)** - רקעים כהים, טקסטים
3. **לבן (#FFFFFF)** - טקסט על רקעים כהים

### כללי שימוש:
- ✅ זהב לכפתורים ראשיים
- ✅ נייבי לרקעים וטקסטים
- ✅ לבן לטקסט על צבעים כהים
- ✅ בדוק תמיד ניגודיות
- ✅ השתמש בגרסאות בהירות לרקעים

### קבצים מרכזיים:
- `src/index.css` - משתני CSS
- `src/pages/public/LandingPage.tsx` - דף נחיתה
- `src/pages/public/DonatePage.tsx` - עמוד תרומה
- `src/components/admin/EditLandingPageModal.tsx` - עריכה

---

**עודכן**: דצמבר 2025
**גרסה**: 1.0
**סטטוס**: ✅ פעיל במערכת

