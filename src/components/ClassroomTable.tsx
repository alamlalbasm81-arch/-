import React from 'react';
import {
  STATUS_LIST,
  STATUS_CONFIG,
  QUICK_NOTE_SUGGESTIONS,
} from '../constants';
import { DutyStatus, RoomEntry } from '../types';
import { Check, AlertCircle, MessageSquarePlus, Tag } from 'lucide-react';

interface ClassroomTableProps {
  floorTitle: string;
  floorNumber: string;
  rooms: string[];
  entries: Record<string, RoomEntry>; // key is `${period}|${room}`
  selectedPeriod: string;
  isViewerMode: boolean;
  onUpdateStatus: (room: string, status: DutyStatus) => void;
  onUpdateNote: (room: string, note: string) => void;
}

export const ClassroomTable: React.FC<ClassroomTableProps> = ({
  floorTitle,
  floorNumber,
  rooms,
  entries,
  selectedPeriod,
  isViewerMode,
  onUpdateStatus,
  onUpdateNote,
}) => {
  const [activeNoteMenuRoom, setActiveNoteMenuRoom] = React.useState<string | null>(null);

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#cdd9e7] text-center text-[#64748b] text-sm">
        لا توجد فصول مطابقة للبحث في هذا الدور.
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#cdd9e7] shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-[#172b53] flex items-center gap-2">
          <span>🏫</span>
          <span>{floorTitle}</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#edf5fc] text-[#214e81] border border-[#cdd9e7]">
            {rooms.length} فصول
          </span>
        </h2>
        <span className="text-xs text-[#64748b] hidden sm:inline">
          الحصة: <strong className="text-[#214e81]">{selectedPeriod}</strong>
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar -mx-2 sm:mx-0">
        <table className="w-full min-w-[620px] border-separate border-spacing-y-2 border-spacing-x-0">
          <thead>
            <tr className="text-xs font-bold text-[#172b53] text-center">
              <th className="py-2 px-3 bg-[#dcebf8] rounded-r-xl w-32">الفصل</th>
              <th className="py-2 px-3 bg-[#dcebf8] w-48">حالة المتابعة</th>
              <th className="py-2 px-3 bg-[#dcebf8]">الملاحظات</th>
              {!isViewerMode && (
                <th className="py-2 px-3 bg-[#dcebf8] rounded-l-xl w-24">إجراء سريع</th>
              )}
            </tr>
          </thead>
          <tbody className="text-sm">
            {rooms.map((room) => {
              const entryKey = `${selectedPeriod}|${room}`;
              const entry = entries[entryKey] || {};
              const currentStatus = (entry.status as DutyStatus) || 'لم تتم المتابعة';
              const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['لم تتم المتابعة'];
              const currentNote = entry.note || '';

              return (
                <tr
                  key={room}
                  className={`transition-colors ${cfg.bg} border-y border-[#dce5ef] shadow-2xs`}
                >
                  {/* Classroom name cell - with the signature pink school tint */}
                  <td className="py-2.5 px-3 rounded-r-xl bg-[#fbe4ef] font-extrabold text-[#9c276a] text-center border-r border-[#f3cadf]">
                    <div className="flex items-center justify-center gap-1.5">
                      <span>{room}</span>
                    </div>
                  </td>

                  {/* Status Dropdown cell */}
                  <td className="py-2 px-3 text-center">
                    <select
                      value={currentStatus}
                      disabled={isViewerMode}
                      onChange={(e) => onUpdateStatus(room, e.target.value as DutyStatus)}
                      className={`w-full py-1.5 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#214e81]/30 disabled:opacity-60 disabled:cursor-not-allowed ${cfg.border} ${cfg.badgeBg}`}
                    >
                      {STATUS_LIST.map((st) => (
                        <option key={st} value={st} className="bg-white text-[#172b53]">
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Note Input cell with Quick Tags */}
                  <td className="py-2 px-3 text-right relative">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={currentNote}
                        disabled={isViewerMode}
                        onChange={(e) => onUpdateNote(room, e.target.value)}
                        placeholder="اكتبي ملاحظة إن وجدت..."
                        className="w-full py-1.5 px-3 bg-white border border-[#cdd9e7] rounded-lg text-xs font-medium text-[#172b53] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#214e81]/30 focus:border-[#214e81] disabled:bg-slate-50 disabled:cursor-not-allowed"
                      />

                      {!isViewerMode && (
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            title="إدراج ملاحظة سريعة"
                            onClick={() =>
                              setActiveNoteMenuRoom(
                                activeNoteMenuRoom === room ? null : room
                              )
                            }
                            className="p-1.5 bg-[#edf5fc] hover:bg-[#dcebf8] text-[#214e81] border border-[#cdd9e7] rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>

                          {activeNoteMenuRoom === room && (
                            <div className="absolute left-0 top-8 z-30 w-56 bg-white border border-[#cdd9e7] shadow-xl rounded-xl p-2 space-y-1">
                              <div className="text-[11px] font-bold text-[#53647d] px-2 py-1 border-b border-slate-100 flex items-center justify-between">
                                <span>ملاحظات سريعة</span>
                                <button
                                  type="button"
                                  onClick={() => setActiveNoteMenuRoom(null)}
                                  className="text-slate-400 hover:text-slate-600 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="max-h-48 overflow-y-auto space-y-0.5">
                                {QUICK_NOTE_SUGGESTIONS.map((tag) => (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                      const newNote = currentNote ? `${currentNote} - ${tag}` : tag;
                                      onUpdateNote(room, newNote);
                                      setActiveNoteMenuRoom(null);
                                    }}
                                    className="w-full text-right text-xs px-2.5 py-1.5 hover:bg-[#edf5fc] rounded-lg text-[#172b53] transition-colors cursor-pointer block"
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Fast Action (Toggle Regular) */}
                  {!isViewerMode && (
                    <td className="py-2 px-3 rounded-l-xl text-center">
                      {currentStatus === 'منتظم' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded-md">
                          <Check className="w-3 h-3" /> تم
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(room, 'منتظم')}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-md text-[11px] font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                        >
                          منتظم
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
