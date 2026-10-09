import React from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentDayName?: string;
  dutyField?: string;
  activePeriod?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentDayName,
  dutyField,
  activePeriod,
}) => {
  return (
    <header className="rounded-2xl p-6 bg-gradient-to-r from-[#dff2f8] via-[#eef6fc] to-[#fbe3ee] border border-[#d6e3f0] shadow-sm mb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" role="img" aria-label="sprout">🌿</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#172b53] tracking-tight">
              مناوبتي | مدرسة جيل السلام (1–4)
            </h1>
          </div>
          <p className="text-sm md:text-base text-[#53647d] font-medium">
            نظام متابعة المناوبة الأسبوعية بين الحصص · معا نصنع جيلا واعيا لمستقبل أفضل
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
          {activePeriod && (
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-800 font-semibold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>الحصة الجارية الآن: {activePeriod}</span>
            </div>
          )}

          {currentDayName && dutyField && (
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#cdd9e7] text-[#172b53] font-medium shadow-xs">
              <Calendar className="w-4 h-4 text-[#214e81]" />
              <span>{currentDayName}: <strong className="text-[#d95d92]">{dutyField}</strong></span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
