import { HDate, HebrewCalendar, months } from '@hebcal/core';

/**
 * המרת תאריך לועזי לתאריך עברי
 */
export function getHebrewDate(date: Date = new Date()): string {
  const hDate = new HDate(date);
  return hDate.render('he');
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
  
  return {
    day: hDate.getDate(),
    monthName: hDate.getMonthName('he'),
    year: hDate.getFullYear(),
    fullDate: hDate.render('he'),
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
 * פורמט תאריך עברי (רק יום וחודש, בלי שנה)
 */
export function formatHebrewDateFull(date: Date = new Date()): string {
  const hDate = new HDate(date);
  const day = hDate.getDate();
  const month = hDate.getMonthName('he');
  
  // המרה למספר עברי (א', ב', ג' וכו')
  const hebrewNumerals: Record<number, string> = {
    1: 'א׳', 2: 'ב׳', 3: 'ג׳', 4: 'ד׳', 5: 'ה׳', 6: 'ו׳', 7: 'ז׳', 8: 'ח׳', 9: 'ט׳', 10: 'י׳',
    11: 'י״א', 12: 'י״ב', 13: 'י״ג', 14: 'י״ד', 15: 'ט״ו', 16: 'ט״ז', 17: 'י״ז', 18: 'י״ח', 19: 'י״ט', 20: 'כ׳',
    21: 'כ״א', 22: 'כ״ב', 23: 'כ״ג', 24: 'כ״ד', 25: 'כ״ה', 26: 'כ״ו', 27: 'כ״ז', 28: 'כ״ח', 29: 'כ״ט', 30: 'ל׳'
  };
  
  const hebrewDay = hebrewNumerals[day] || day.toString();
  
  return `${hebrewDay} ב${month}`;
}

/**
 * פורמט תאריך קצר בעברית (רק תאריך עברי)
 */
export function formatHebrewDateShort(date: Date = new Date()): string {
  const hDate = new HDate(date);
  const day = hDate.getDate();
  const month = hDate.getMonthName('he');
  const year = hDate.getFullYear();
  
  return `${day} ${month} ${year}`;
}

