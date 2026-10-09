import React from 'react';
import { DayRecord, PeriodTiming, DutyStatus } from '../types';
import { ROOMS_FLOOR_1, ROOMS_FLOOR_2 } from '../constants';

interface PrintReportViewProps {
  dateStr: string;
  dayName: string;
  dutyField: string;
  selectedPeriod: string;
  dayData: DayRecord;
  periods: PeriodTiming[];
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  dateStr,
  dayName,
  dutyField,
  selectedPeriod,
  dayData,
  periods,
}) => {
  const activePeriods = periods.filter(
    (p) => p[0] !== 'الطابور' && p[0] !== 'الفسحة'
  );

  return (
    <div className="hidden print:block print-area text-black font-sans p-2">
      {/* Formal Official Header */}
      <div className="text-center border-b-2 border-slate-800 pb-3 mb-3">
        <div className="flex justify-between items-center text-xs font-semibold">
          <div className="text-right">
            <div>سلطنة عُمان</div>
            <div>وزارة التربية والتعليم</div>
            <div>مدرسة جيل السلام (1–4)</div>
          </div>
          <div className="text-center">
            <h1 className="text-base font-extrabold text-black">
              استمارة متابعة المناوبة اليومية بين الحصص
            </h1>
            <div className="text-xs font-bold text-slate-700 mt-0.5">
              معاً نصنع جيلاً واعياً لمستقبل أفضل
            </div>
          </div>
          <div className="text-left text-xs">
            <div>العام الدراسي: 2026/2027م</div>
            <div>الفترة: {selectedPeriod}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs font-bold mt-3 bg-slate-100 p-2 rounded border border-slate-300">
          <div>اليوم: <span className="font-normal">{dayName}</span></div>
          <div>التاريخ: <span className="font-normal">{dateStr}</span></div>
          <div>المجال المناوب: <span className="font-normal">{dutyField}</span></div>
          <div>المعلمة المناوبة: <span className="font-normal">{dayData.teacher || '—'}</span></div>
        </div>
      </div>

      {/* Classroom Status Tables */}
      <div className="space-y-4">
        {/* Floor 1 */}
        <div>
          <h2 className="text-xs font-bold mb-1 border-r-4 border-slate-800 pr-1.5">
            الدور الأول (8 فصول)
          </h2>
          <table className="w-full text-[10px] border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-slate-400 p-1 text-center w-24">الفصل</th>
                <th className="border border-slate-400 p-1 text-center w-36">حالة المتابعة ({selectedPeriod})</th>
                <th className="border border-slate-400 p-1 text-right">الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {ROOMS_FLOOR_1.map((room) => {
                const k = `${selectedPeriod}|${room}`;
                const e = dayData.entries?.[k] || {};
                return (
                  <tr key={room}>
                    <td className="border border-slate-400 p-1 text-center font-bold bg-slate-50">
                      {room}
                    </td>
                    <td className="border border-slate-400 p-1 text-center">
                      {e.status || 'لم تتم المتابعة'}
                    </td>
                    <td className="border border-slate-400 p-1 text-right">
                      {e.note || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Floor 2 */}
        <div>
          <h2 className="text-xs font-bold mb-1 border-r-4 border-slate-800 pr-1.5">
            الدور الثاني (16 فصلاً)
          </h2>
          <table className="w-full text-[10px] border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-slate-400 p-1 text-center w-24">الفصل</th>
                <th className="border border-slate-400 p-1 text-center w-36">حالة المتابعة ({selectedPeriod})</th>
                <th className="border border-slate-400 p-1 text-right">الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {ROOMS_FLOOR_2.map((room) => {
                const k = `${selectedPeriod}|${room}`;
                const e = dayData.entries?.[k] || {};
                return (
                  <tr key={room}>
                    <td className="border border-slate-400 p-1 text-center font-bold bg-slate-50">
                      {room}
                    </td>
                    <td className="border border-slate-400 p-1 text-center">
                      {e.status || 'لم تتم المتابعة'}
                    </td>
                    <td className="border border-slate-400 p-1 text-right">
                      {e.note || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* General Notes */}
        {dayData.general && (
          <div className="border border-slate-300 p-2 rounded text-xs">
            <span className="font-bold block mb-1">الملاحظات العامة:</span>
            <p className="whitespace-pre-line text-slate-800">{dayData.general}</p>
          </div>
        )}

        {/* Signatures Footer */}
        <div className="pt-6 grid grid-cols-3 text-center text-xs font-bold">
          <div>
            <div>المعلمة المناوبة</div>
            <div className="mt-8 border-t border-slate-400 mx-6 pt-1 text-[11px] font-normal">
              {dayData.teacher || 'التوقيع'}
            </div>
          </div>
          <div>
            <div>مشرفة المناوبة اليومية</div>
            <div className="mt-8 border-t border-slate-400 mx-6 pt-1 text-[11px] font-normal">
              التوقيع
            </div>
          </div>
          <div>
            <div>إدارة المدرسة / المديرة</div>
            <div className="mt-8 border-t border-slate-400 mx-6 pt-1 text-[11px] font-normal">
              الختم والاعتماد
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
