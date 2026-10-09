import React from 'react';
import { PeriodTiming, RoomEntry, DutyStatus } from '../types';
import { STATUS_CONFIG, ROOMS_FLOOR_1, ROOMS_FLOOR_2 } from '../constants';
import { Grid3X3, Eye } from 'lucide-react';

interface FullDayMatrixProps {
  periods: PeriodTiming[];
  entries: Record<string, RoomEntry>;
  floorFilter: 'all' | '1' | '2';
  searchQuery: string;
  onSelectPeriod: (p: string) => void;
  onSwitchToSingleView: (p: string) => void;
}

export const FullDayMatrix: React.FC<FullDayMatrixProps> = ({
  periods,
  entries,
  floorFilter,
  searchQuery,
  onSelectPeriod,
  onSwitchToSingleView,
}) => {
  const activePeriods = periods.filter(
    (p) => p[0] !== 'الطابور' && p[0] !== 'الفسحة'
  );

  let targetRooms: { floor: string; list: string[] }[] = [];
  if (floorFilter === 'all' || floorFilter === '1') {
    targetRooms.push({ floor: 'الدور الأول', list: ROOMS_FLOOR_1 });
  }
  if (floorFilter === 'all' || floorFilter === '2') {
    targetRooms.push({ floor: 'الدور الثاني', list: ROOMS_FLOOR_2 });
  }

  const matchesSearch = (room: string) => {
    if (!searchQuery.trim()) return true;
    return room.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#cdd9e7] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#172b53] flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-[#214e81]" />
            مصفوفة اليوم الكاملة (متابعة جميع الحصص)
          </h2>
          <p className="text-xs text-[#53647d] mt-0.5">
            نظرة شمولية على انضباط جميع الفصول طوال ساعات اليوم الدراسي
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> منتظم
          </span>
          <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> تأخر
          </span>
          <span className="flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> غياب / تنبيه
          </span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[700px] border-collapse text-xs">
          <thead>
            <tr className="bg-[#dcebf8] text-[#172b53]">
              <th className="p-2.5 text-center font-bold border border-[#c5d8ec] rounded-r-lg w-28 sticky right-0 bg-[#dcebf8] z-10">
                الفصل
              </th>
              {activePeriods.map(([pName, pStart, pEnd]) => (
                <th
                  key={pName}
                  className="p-2 text-center font-bold border border-[#c5d8ec] hover:bg-[#cbe0f4] cursor-pointer transition-colors"
                  onClick={() => {
                    onSelectPeriod(pName);
                    onSwitchToSingleView(pName);
                  }}
                  title={`انقر لفتح الحصة ${pName}`}
                >
                  <div>{pName}</div>
                  {pStart && (
                    <div className="text-[10px] font-normal text-[#53647d]">
                      {pStart}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {targetRooms.map(({ floor, list }) => {
              const filteredList = list.filter(matchesSearch);
              if (filteredList.length === 0) return null;

              return (
                <React.Fragment key={floor}>
                  <tr>
                    <td
                      colSpan={activePeriods.length + 1}
                      className="bg-[#edf5fc] font-bold text-[#214e81] p-2 text-right border border-[#d6e5f7]"
                    >
                      🏫 {floor} ({filteredList.length} فصول)
                    </td>
                  </tr>
                  {filteredList.map((room) => (
                    <tr key={room} className="hover:bg-slate-50/80 transition-colors">
                      {/* Classroom title */}
                      <td className="p-2 text-center font-bold bg-[#fbe4ef] text-[#9c276a] border border-[#f3cadf] sticky right-0 z-10">
                        {room}
                      </td>

                      {/* Period columns */}
                      {activePeriods.map(([pName]) => {
                        const k = `${pName}|${room}`;
                        const entry = entries[k] || {};
                        const st = (entry.status as DutyStatus) || 'لم تتم المتابعة';
                        const cfg = STATUS_CONFIG[st] || STATUS_CONFIG['لم تتم المتابعة'];

                        return (
                          <td
                            key={pName}
                            onClick={() => {
                              onSelectPeriod(pName);
                              onSwitchToSingleView(pName);
                            }}
                            className={`p-1.5 text-center border border-slate-200 cursor-pointer transition-transform hover:scale-[1.02] ${cfg.bg}`}
                            title={`${room} - ${pName}: ${st}${entry.note ? ` (${entry.note})` : ''}`}
                          >
                            <div className="flex flex-col items-center justify-center min-h-[34px]">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold truncate max-w-[85px] ${cfg.badgeBg}`}
                              >
                                {st === 'لم تتم المتابعة' ? '—' : st}
                              </span>
                              {entry.note && (
                                <span className="text-[9px] text-[#53647d] truncate max-w-[85px] mt-0.5">
                                  {entry.note}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
