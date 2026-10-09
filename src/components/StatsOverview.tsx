import React from 'react';
import {
  CheckCheck,
  AlertTriangle,
  Layers,
  Clock,
  Sparkles,
} from 'lucide-react';

interface StatsOverviewProps {
  totalRooms: number;
  completedRooms: number;
  alertCount: number;
  selectedPeriod: string;
  isViewerMode: boolean;
  onAutoFillRemainingRegular: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalRooms,
  completedRooms,
  alertCount,
  selectedPeriod,
  isViewerMode,
  onAutoFillRemainingRegular,
}) => {
  const percent = totalRooms > 0 ? Math.round((completedRooms / totalRooms) * 100) : 0;
  const hasRemaining = completedRooms < totalRooms;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Classrooms */}
        <div className="bg-[#edf5ff] border border-[#d6e5f7] rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-[#53647d]">
            <span>إجمالي الفصول</span>
            <Layers className="w-4 h-4 text-[#214e81]" />
          </div>
          <div className="mt-1">
            <span className="text-2xl font-extrabold text-[#172b53]">{totalRooms}</span>
            <span className="text-xs text-[#53647d] mr-1">فصلاً دراسياً</span>
          </div>
        </div>

        {/* Completed Inspections */}
        <div className="bg-[#edf5ff] border border-[#d6e5f7] rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-[#53647d]">
            <span>المتابعة المكتملة</span>
            <CheckCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-1">
            <span className="text-2xl font-extrabold text-[#172b53]">
              {completedRooms} <span className="text-sm font-semibold text-[#53647d]">/ {totalRooms}</span>
            </span>
            <div className="w-full bg-[#dcebf8] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Needs Review / Alerts */}
        <div className={`rounded-xl p-3.5 flex flex-col justify-between border ${
          alertCount > 0
            ? 'bg-amber-50/80 border-amber-200'
            : 'bg-[#edf5ff] border-[#d6e5f7]'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-[#53647d]">
            <span>حالات تستدعي المراجعة</span>
            <AlertTriangle className={`w-4 h-4 ${alertCount > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className={`text-2xl font-extrabold ${alertCount > 0 ? 'text-amber-900' : 'text-[#172b53]'}`}>
              {alertCount}
            </span>
            <span className="text-xs text-[#64748b]">
              {alertCount > 0 ? 'تأخر / غياب / ملاحظة' : 'لا توجد ملاحظات'}
            </span>
          </div>
        </div>

        {/* Active Period */}
        <div className="bg-[#edf5ff] border border-[#d6e5f7] rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-[#53647d]">
            <span>الفترة المحددة</span>
            <Clock className="w-4 h-4 text-[#214e81]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-[#172b53]">
              الحصة {selectedPeriod}
            </span>
            <span className="text-xs font-semibold text-[#214e81] bg-white/70 px-2 py-0.5 rounded">
              {percent}% منجز
            </span>
          </div>
        </div>
      </div>

      {/* Quick completion action bar */}
      {!isViewerMode && hasRemaining && (
        <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-dashed border-[#cdd9e7] text-xs">
          <span className="text-[#53647d]">
            يتبقى <strong className="text-[#172b53]">{totalRooms - completedRooms}</strong> فصول لم تسجل لها حالة بعد في الحصة {selectedPeriod}.
          </span>
          <button
            type="button"
            onClick={onAutoFillRemainingRegular}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            تعيين المتبقي كـ "منتظم" دفعة واحدة
          </button>
        </div>
      )}
    </div>
  );
};
