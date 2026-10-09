import { STORAGE_KEY, DEFAULT_TIMES } from '../constants';
import { DutyState, DayRecord } from '../types';

export function getInitialState(): DutyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          days: parsed.days || {},
          times: Array.isArray(parsed.times) && parsed.times.length > 0 ? parsed.times : structuredClone(DEFAULT_TIMES),
          eighth: Boolean(parsed.eighth),
          teacherList: Array.isArray(parsed.teacherList) ? parsed.teacherList : [],
        };
      }
    }
  } catch (err) {
    console.error('Failed to parse state from localStorage', err);
  }

  return {
    days: {},
    times: structuredClone(DEFAULT_TIMES),
    eighth: false,
    teacherList: [],
  };
}

export function saveStateToStorage(state: DutyState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

export function getOrCreateDayRecord(state: DutyState, dateKey: string): DayRecord {
  if (!state.days[dateKey]) {
    return {
      teacher: '',
      general: '',
      entries: {},
    };
  }
  return state.days[dateKey];
}
