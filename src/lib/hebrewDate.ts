import { HDate } from '@hebcal/core';

const hebrewNumerals: Record<number, string> = {
  1: 'א׳', 2: 'ב׳', 3: 'ג׳', 4: 'ד׳', 5: 'ה׳', 6: 'ו׳', 7: 'ז׳', 8: 'ח׳', 9: 'ט׳', 10: 'י׳',
  11: 'י״א', 12: 'י״ב', 13: 'י״ג', 14: 'י״ד', 15: 'ט״ו', 16: 'ט״ז', 17: 'י״ז', 18: 'י״ח', 19: 'י״ט', 20: 'כ׳',
  21: 'כ״א', 22: 'כ״ב', 23: 'כ״ג', 24: 'כ״ד', 25: 'כ״ה', 26: 'כ״ו', 27: 'כ״ז', 28: 'כ״ח', 29: 'כ״ט', 30: 'ל׳'
};

const hebrewMonthMap: Record<string, string> = {
  'Tishrei': 'תשרי',
  'Cheshvan': 'חשון',
  'Kislev': 'כסלו',
  'Tevet': 'טבת',
  'Shvat': 'שבט',
  'Adar': 'אדר',
  'Adar I': 'אדר א׳',
  'Adar II': 'אדר ב׳',
  'Nisan': 'ניסן',
  'Iyyar': 'אייר',
  'Sivan': 'סיון',
  'Tamuz': 'תמוז',
  'Av': 'אב',
  'Elul': 'אלול'
};

/**
 * המרת שנה למספר עברי (תומך בשנים הנוכחיות)
 */
function getHebrewYearNumeral(year: number): string {
  if (year === 5784) return 'תשפ״ד';
  if (year === 5785) return 'תשפ״ה';
  if (year === 5786) return 'תשפ״ו';
  if (year === 5787) return 'תשפ״ז';
  if (year === 5788) return 'תשפ״ח';
  return year.toString();
}

/**
 * המרת תאריך לועזי לתאריך עברי (פורמט מלא)
 */
export function getHebrewDate(date: Date = new Date()): string {
  const hDate = new HDate(date);
  const day = hDate.getDate();
  const year = hDate.getFullYear();
  const monthNameEnglish = hDate.getMonthName();
  const monthName = hebrewMonthMap[monthNameEnglish] || monthNameEnglish;
  
  const hebrewDay = hebrewNumerals[day] || day.toString();
  const hebrewYear = getHebrewYearNumeral(year);
  const dayOfWeek = getHebrewDayOfWeek(date);
  
  return `יום ${dayOfWeek}, ${hebrewDay} ב${monthName} ${hebrewYear}`;
}

/**
 * קבלת תאריך עברי מפורט
 */
export function getHebrewDateDetailed(date: Date = new Date()): {
  day: number;
  monthName: string;
  year: number;
  fullDate: string;
} {
  const hDate = new HDate(date);
  const fullDate = getHebrewDate(date);
  const parts = fullDate.split(' ');
  const monthName = parts[parts.length - 2].replace(/^ב/, '');
  
  return {
    day: hDate.getDate(),
    monthName: monthName,
    year: hDate.getFullYear(),
    fullDate: fullDate,
  };
}

/**
 * בדיקה האם היום הוא יום הולדת עברי
 */
export function isHebrewBirthday(birthDate: Date, checkDate: Date = new Date()): boolean {
  const birthHDate = new HDate(birthDate);
  const checkHDate = new HDate(checkDate);
  
  return (
    birthHDate.getDate() === checkHDate.getDate() &&
    birthHDate.getMonth() === checkHDate.getMonth()
  );
}

/**
 * קבלת השם העברי של היום בשבוע
 */
export function getHebrewDayOfWeek(date: Date = new Date()): string {
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return days[date.getDay()];
}

/**
 * פורמט תאריך עברי מלא (יום בשבוע, יום בחודש, חודש ושנה)
 */
export function formatHebrewDateFull(date: Date = new Date()): string {
  return getHebrewDate(date);
}

/**
 * פורמט תאריך קצר בעברית (רק תאריך עברי)
 */
export function formatHebrewDateShort(date: Date = new Date()): string {
  const hDate = new HDate(date);
  const day = hDate.getDate();
  const year = hDate.getFullYear();
  const monthNameEnglish = hDate.getMonthName();
  const monthName = hebrewMonthMap[monthNameEnglish] || monthNameEnglish;
  
  return `${hebrewNumerals[day] || day} ${monthName} ${getHebrewYearNumeral(year)}`;
}

