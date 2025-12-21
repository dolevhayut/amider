import { HDate } from '@hebcal/core';

/**
 * המרת תאריך לועזי לתאריך עברי (פורמט מלא)
 */
export function getHebrewDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('he-IL-u-ca-hebrew', {
    dateStyle: 'full'
  }).format(date);
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
  
  // חילוץ שם החודש מהתאריך המלא
  const parts = fullDate.split(' ');
  // הפורמט הוא: יום [שם], [יום בחודש] ב[חודש] [שנה]
  // לדוגמה: יום ראשון, א׳ בטבת תשפ״ו
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
  return new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { weekday: 'long' }).format(date);
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
  return new Intl.DateTimeFormat('he-IL-u-ca-hebrew', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

