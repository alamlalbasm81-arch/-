import { DAY_NAMES, DAY_FIELDS } from '../constants';
import { PeriodTiming } from '../types';

export function padZero(n: number): string {
  return String(n).padStart(2, '0');
}

export function toLocalDateString(d: Date): string {
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
}

export function parseDateString(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getDayOfWeekIndex(dateStr: string): number {
  const date = parseDateString(dateStr);
  const day = date.getDay(); // 0 is Sunday, 1 Monday, ... 4 Thursday, 5 Friday, 6 Saturday
  if (day === 0) return 0; // الأحد
  if (day >= 1 && day <= 4) return day; // الاثنين إلى الخميس
  return -1; // Friday or Saturday (عطلة نهاية الأسبوع)
}

export function getDutyDayInfo(dateStr: string): {
  dayName: string;
  field: string;
  isSchoolDay: boolean;
  dayIndex: number;
} {
  const idx = getDayOfWeekIndex(dateStr);
  if (idx >= 0 && idx < 5) {
    return {
      dayName: DAY_NAMES[idx],
      field: DAY_FIELDS[idx],
      isSchoolDay: true,
      dayIndex: idx,
    };
  }
  const date = parseDateString(dateStr);
  const dow = date.getDay();
  const weekendName = dow === 5 ? 'الجمعة' : dow === 6 ? 'السبت' : 'يوم غير محدد';
  return {
    dayName: weekendName,
    field: 'عطلة نهاية الأسبوع (خارج أيام المناوبة المعتادة)',
    isSchoolDay: false,
    dayIndex: -1,
  };
}

export function calculateDuration(startTime: string, endTime: string): number | null {
  if (!startTime || !endTime) return null;
  const [h1, m1] = startTime.split(':').map(Number);
  const [h2, m2] = endTime.split(':').map(Number);
  if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return null;
  const diff = h2 * 60 + m2 - (h1 * 60 + m1);
  return diff > 0 ? diff : null;
}

export function getActivePeriodName(times: PeriodTiming[], eighthActive: boolean): string | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const [name, start, end] of times) {
    if (name === 'الثامنة' && !eighthActive) continue;
    if (!start || !end) continue;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const startMin = h1 * 60 + m1;
    const endMin = h2 * 60 + m2;
    if (currentMinutes >= startMin && currentMinutes <= endMin) {
      return name;
    }
  }
  return null;
}

export function getNextSchoolDay(date: Date = new Date()): Date {
  const d = new Date(date);
  const dow = d.getDay();
  // If Friday (5), jump to Sunday (+2)
  if (dow === 5) {
    d.setDate(d.getDate() + 2);
  } else if (dow === 6) {
    // If Saturday (6), jump to Sunday (+1)
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export function formatArabicDateDisplay(dateStr: string): string {
  try {
    const d = parseDateString(dateStr);
    return d.toLocaleDateString('ar-OM', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
