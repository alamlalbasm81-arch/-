import React, { useState } from 'react';
import { PeriodTiming } from '../types';
import { calculateDuration } from '../utils/time';
import { Settings, Save, RotateCcw, X, Clock, AlertCircle } from 'lucide-react';
import { DEFAULT_TIMES } from '../constants';

interface TimingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  times: PeriodTiming[];
  eighthActive: boolean;
  onSaveTimes: (newTimes: PeriodTiming[], eighthActive: boolean) => void;
  onResetDefaults: () => void;
}

export const TimingSettingsModal: React.FC<TimingSettingsModalProps> = ({
  isOpen,
  onClose,
  times,
  eighthActive,
  onSaveTimes,
  onResetDefaults,
}) => {
  const [localTimes, setLocalTimes] = useState<PeriodTiming[]>(() =>
    structuredClone(times)
  );
  const [localEighth, setLocalEighth] = useState<boolean>(eighthActive);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when opened
  React.useEffect(() => {
    if (isOpen) {
      setLocalTimes(structuredClone(times));
      setLocalEighth(eighthActive);
      setErrorMessage(null);
    }
  }, [isOpen, times, eighthActive]);

  if (!isOpen) return null;

  const handleTimeChange = (index: number, fieldIndex: 1 | 2, value: string) => {
    setLocalTimes((prev) => {
      const copy = structuredClone(prev);
      copy[index][fieldIndex] = value;
      return copy;
    });
    setErrorMessage(null);
  };

  const handleSave = () => {
    // Validate period 8
    if (localEighth) {
      const eighthPeriod = localTimes.find((p) => p[0] === 'الثامنة');
      if (!eighthPeriod || !eighthPeriod[1] || !eighthPeriod[2]) {
        setErrorMessage('يرجى تحديد وقت بداية ونهاية الحصة الثامنة لتفعيلها');
        return;
      }
    }

    // Validate valid duration for each required period
    for (const [name, start, end] of localTimes) {
      if (name === 'الثامنة' && !localEighth) continue;
      if (!start || !end) {
        setErrorMessage(`يرجى إكمال توقيت الفترة "${name}"`);
        return;
      }
      const dur = calculateDuration(start, end);
      if (dur === null || dur <= 0) {
        setErrorMessage(`وقت نهاية الفترة "${name}" يجب أن يكون بعد وقت البداية`);
        return;
      }
    }

    onSaveTimes(localTimes, localEighth);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('هل أنتِ متأكدة من استعادة التوقيت المدرسي الأصلي؟')) {
      onResetDefaults();
      setLocalTimes(structuredClone(DEFAULT_TIMES));
      setLocalEighth(false);
      setErrorMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl border border-[#cdd9e7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#dff2f8] to-[#fbe3ee] p-4 px-6 border-b border-[#cdd9e7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#214e81]" />
            <h2 className="text-lg font-bold text-[#172b53]">
              تعديل أوقات الحصص والفترات المدرسية
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

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#dcebf8] text-[#172b53] text-xs font-bold">
                  <th className="p-2.5 text-right rounded-r-lg">الفترة</th>
                  <th className="p-2.5 text-center">من (البداية)</th>
                  <th className="p-2.5 text-center">إلى (النهاية)</th>
                  <th className="p-2.5 text-center rounded-l-lg">المدة بالدقائق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localTimes.map((period, idx) => {
                  const isEighth = period[0] === 'الثامنة';
                  const disabled = isEighth && !localEighth;
                  const dur = calculateDuration(period[1], period[2]);

                  return (
                    <tr
                      key={period[0]}
                      className={`hover:bg-slate-50 ${
                        disabled ? 'opacity-40 bg-slate-50/50' : ''
                      }`}
                    >
                      <td className="p-2.5 font-bold text-[#172b53]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#214e81]" />
                          <span>{period[0]}</span>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="time"
                          value={period[1]}
                          disabled={disabled}
                          onChange={(e) =>
                            handleTimeChange(idx, 1, e.target.value)
                          }
                          className="px-2 py-1 bg-white border border-[#cdd9e7] rounded-lg text-xs font-medium text-[#172b53] focus:outline-none focus:ring-1 focus:ring-[#214e81]"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="time"
                          value={period[2]}
                          disabled={disabled}
                          onChange={(e) =>
                            handleTimeChange(idx, 2, e.target.value)
                          }
                          className="px-2 py-1 bg-white border border-[#cdd9e7] rounded-lg text-xs font-medium text-[#172b53] focus:outline-none focus:ring-1 focus:ring-[#214e81]"
                        />
                      </td>
                      <td className="p-2 text-center font-bold text-xs text-[#53647d]">
                        {dur !== null ? `${dur} دقيقة` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Toggle Eighth Period */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-[#172b53] p-2 hover:bg-[#edf5fc] rounded-xl transition-colors">
              <input
                type="checkbox"
                checked={localEighth}
                onChange={(e) => setLocalEighth(e.target.checked)}
                className="w-4 h-4 text-[#214e81] rounded focus:ring-[#214e81]"
              />
              <span>تفعيل الحصة الثامنة في الجدول المدرسي</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            استعادة التوقيت الأصلي
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#214e81] hover:bg-[#183a62] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              حفظ التوقيت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
