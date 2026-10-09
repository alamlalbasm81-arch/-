import React from 'react';
import { History, Calendar, User, ArrowLeft, Trash2, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DutyState } from '../types';
import { formatArabicDateDisplay, getDutyDayInfo } from '../utils/time';

interface HistoryArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: DutyState;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onDeleteDay: (date: string) => void;
}

export const HistoryArchiveModal: React.FC<HistoryArchiveModalProps> = ({
  isOpen,
  onClose,
  state,
  selectedDate,
  onSelectDate,
  onDeleteDay,
}) => {
  if (!isOpen) return null;

  const dates = Object.keys(state.days || {}).sort((a, b) => b.localeCompare(a));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-xl border border-[#cdd9e7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#dff2f8] to-[#edf5fc] p-4 px-6 border-b border-[#cdd9e7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#214e81]" />
            <h2 className="text-lg font-bold text-[#172b53]">
              أرشيف وسجل الأيام المسجلة
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {dates.length === 0 ? (
            <div className="text-center py-12 text-[#64748b] space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">لا توجد أيام مسجلة بعد في هذا المتصفح.</p>
              <p className="text-xs">سيبدأ السجل بالحفظ فور إدخال بيانات المناوبة وحفظها.</p>
            </div>
          ) : (
            dates.map((dStr) => {
              const record = state.days[dStr];
              const duty = getDutyDayInfo(dStr);
              const isCurrent = dStr === selectedDate;

              // Calculate entries and alert count for this day
              const entries = Object.values(record.entries || {});
              const checkedCount = entries.filter(
                (e) => e.status && e.status !== 'لم تتم المتابعة'
              ).length;
              const alertCount = entries.filter((e) =>
                ['تأخر المعلمة', 'غياب المعلمة', 'الطلاب دون إشراف', 'ملاحظة'].includes(
                  e.status || ''
                )
              ).length;

              return (
                <div
                  key={dStr}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-blue-50/70 border-[#214e81] ring-1 ring-[#214e81]/30'
                      : 'bg-white hover:bg-slate-50 border-[#cdd9e7]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#172b53]">
                        {duty.dayName}
                      </span>
                      <span className="text-xs text-[#53647d] font-medium">
                        ({dStr})
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold bg-[#214e81] text-white px-2 py-0.5 rounded-full">
                          اليوم المعروض
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#53647d]">
                      <span className="font-semibold text-[#d95d92]">{duty.field}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {record.teacher || 'بدون اسم'}
                      </span>
                      <span>·</span>
                      <span>{checkedCount} فصل متابَع</span>
                      {alertCount > 0 && (
                        <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {alertCount} ملاحظة
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDate(dStr);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#edf5fc] hover:bg-[#dcebf8] text-[#17365b] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      عرض السجل
                    </button>
                    <button
                      type="button"
                      title="حذف هذا اليوم"
                      onClick={() => {
                        if (
                          window.confirm(
                            `هل ترغبين بالتأكيد في حذف سجل يوم ${dStr} نهائياً؟`
                          )
                        ) {
                          onDeleteDay(dStr);
                        }
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
