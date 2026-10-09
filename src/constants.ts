import { DutyStatus, PeriodTiming } from './types';

export const STORAGE_KEY = 'jilalsalam-duty-v1';

export const ROOMS_FLOOR_1 = [
  'أول/أول',
  'أول/ثاني',
  'أول/ثالث',
  'أول/رابع',
  'أول/خامس',
  'ثاني/أول',
  'ثاني/ثاني',
  'ثاني/ثالث',
];

export const ROOMS_FLOOR_2 = [
  'ثاني/رابع',
  'ثاني/خامس',
  'ثاني/سادس',
  'ثالث/أول',
  'ثالث/ثاني',
  'ثالث/ثالث',
  'ثالث/رابع',
  'ثالث/خامس',
  'ثالث/سادس',
  'رابع/أول',
  'رابع/ثاني',
  'رابع/ثالث',
  'رابع/رابع',
  'رابع/خامس',
  'رابع/سادس',
  'رابع/سابع',
];

export const ALL_ROOMS = [...ROOMS_FLOOR_1, ...ROOMS_FLOOR_2];

export const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

export const DAY_FIELDS = [
  'المجال الثاني',
  'المجال الرابع',
  'المجال الأول – المجموعة (1)',
  'المجال الأول – المجموعة (2)',
  'المجال الثالث',
];

export const DEFAULT_TIMES: PeriodTiming[] = [
  ['الطابور', '07:00', '07:10'],
  ['الأولى', '07:10', '07:45'],
  ['الثانية', '07:50', '08:25'],
  ['الثالثة', '08:30', '09:05'],
  ['الرابعة', '09:10', '09:45'],
  ['الفسحة', '09:45', '10:05'],
  ['الخامسة', '10:05', '10:40'],
  ['السادسة', '10:45', '11:20'],
  ['السابعة', '11:25', '12:00'],
  ['الثامنة', '', ''],
];

export const STATUS_LIST: DutyStatus[] = [
  'لم تتم المتابعة',
  'منتظم',
  'تأخر المعلمة',
  'غياب المعلمة',
  'الطلاب دون إشراف',
  'ملاحظة',
  'لا ينطبق',
];

export const STATUS_CONFIG: Record<
  DutyStatus,
  {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    label: string;
    isAlert: boolean;
  }
> = {
  'لم تتم المتابعة': {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-700',
    label: 'لم تتم المتابعة',
    isAlert: false,
  },
  'منتظم': {
    bg: 'bg-emerald-50/60',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    label: 'منتظم',
    isAlert: false,
  },
  'تأخر المعلمة': {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-900',
    label: 'تأخر المعلمة',
    isAlert: true,
  },
  'غياب المعلمة': {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-900',
    label: 'غياب المعلمة',
    isAlert: true,
  },
  'الطلاب دون إشراف': {
    bg: 'bg-red-50 font-medium',
    text: 'text-red-900',
    border: 'border-red-300',
    badgeBg: 'bg-red-100 text-red-900',
    label: 'الطلاب دون إشراف',
    isAlert: true,
  },
  'ملاحظة': {
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    border: 'border-sky-200',
    badgeBg: 'bg-sky-100 text-sky-800',
    label: 'ملاحظة',
    isAlert: true,
  },
  'لا ينطبق': {
    bg: 'bg-slate-50',
    text: 'text-slate-500',
    border: 'border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-600',
    label: 'لا ينطبق',
    isAlert: false,
  },
};

export const QUICK_NOTE_SUGGESTIONS = [
  'هدوء وانضباط تام',
  'تأخر 5 دقائق',
  'تأخر 10 دقائق',
  'تبديل حصة رسمي',
  'حصة احتياط',
  'استئذان رسمي',
  'نشاط في الساحة',
  'حصة في مصادر التعلم',
  'حصة في مختبر العلوم',
  'خروج لعيادة المدرسة',
];
