import React from 'react';
import { DAY_NAMES, DAY_FIELDS } from '../constants';

interface WeeklyDaysNavProps {
  selectedDayIndex: number; // 0 to 4, or -1 if weekend
  assignmentText: string;
  onSelectDayIndex: (index: number) => void;
}

export const WeeklyDaysNav: React.FC<WeeklyDaysNavProps> = ({
  selectedDayIndex,
  assignmentText,
  onSelectDayIndex,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5">
        {DAY_NAMES.map((name, idx) => {
          const isActive = selectedDayIndex === idx;
          const field = DAY_FIELDS[idx];
          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectDayIndex(idx)}
              className={`flex-1 min-w-[130px] p-3 rounded-xl border text-center transition-all cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-[#d95d92] text-white border-[#c84d82] ring-2 ring-[#d95d92]/20 font-bold shadow-md transform scale-[1.02]'
                  : 'bg-white hover:bg-[#edf5fc] text-[#172b53] border-[#cdd9e7] font-medium'
              }`}
            >
              <div className="text-base font-bold">{name}</div>
              <div
                className={`text-xs mt-1 transition-colors ${
                  isActive ? 'text-pink-100 font-semibold' : 'text-[#64748b]'
                }`}
              >
                {field}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm py-1.5 px-3 bg-[#edf5fc] rounded-lg border border-[#cdd9e7]/70 text-[#172b53]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#214e81]">المناوبة المعينة:</span>
          <span className="font-bold text-[#d95d92]">{assignmentText}</span>
        </div>
        <span className="text-xs text-[#64748b] hidden sm:inline">
          متابعة مستمرة بين الحصص الدراسية
        </span>
      </div>
    </div>
  );
};
