export type DutyStatus =
  | 'لم تتم المتابعة'
  | 'منتظم'
  | 'تأخر المعلمة'
  | 'غياب المعلمة'
  | 'الطلاب دون إشراف'
  | 'ملاحظة'
  | 'لا ينطبق';

export interface RoomEntry {
  status?: DutyStatus | string;
  note?: string;
  updatedAt?: string;
}

export interface DayRecord {
  teacher: string;
  general: string;
  entries: Record<string, RoomEntry>; // key is `${period}|${room}`
}

export type PeriodTiming = [string, string, string]; // [name, startTime, endTime]

export interface DutyState {
  days: Record<string, DayRecord>; // key: YYYY-MM-DD
  times: PeriodTiming[];
  eighth: boolean;
  teacherList?: string[];
}
