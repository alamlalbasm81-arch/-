import React from 'react';
import {
  Settings,
  Trash2,
  Filter,
  Grid3X3,
  List,
  Search,
  Building,
  Clock,
} from 'lucide-react';
import { PeriodTiming } from '../types';

interface PeriodNavProps {
  periods: PeriodTiming[];
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
  floorFilter: 'all' | '1' | '2';
  onFloorFilterChange: (floor: 'all' | '1' | '2') => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  viewMode: 'single' | 'matrix';
  onViewModeChange: (mode: 'single' | 'matrix') => void;
  onOpenSettings: () => void;
  onClearDay: () => void;
  isViewerMode: boolean;
  activeLivePeriod: string | null;
}

export const PeriodNav: React.FC<PeriodNavProps> = ({
  periods,
  selectedPeriod,
  onSelectPeriod,
  floorFilter,
  onFloorFilterChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  viewMode,
  onViewModeChange,
  onOpenSettings,
  onClearDay,
  isViewerMode,
  activeLivePeriod,
}) => {
  // Periods excluding الطابور والفسحة for the primary duty classrooms tracking
  const selectablePeriods = periods.filter(
    (p) => p[0] !== 'الطابور' && p[0] !== 'الفسحة'
  );

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#cdd9e7] shadow-sm space-y-3.5">
      {/* Top row: Period Buttons & View switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Period Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-xs font-bold text-[#53647d] whitespace-nowrap ml-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#214e81]" />
            الحصص:
          </span>
          {selectablePeriods.map(([name, start, end]) => {
            const isSelected = selectedPeriod === name;
            const isLive = activeLivePeriod === name;

            return (
              <button
                key={name}
                type="button"
                onClick={() => onSelectPeriod(name)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#214e81] text-white shadow-sm ring-2 ring-[#214e81]/20'
                    : 'bg-[#edf5fc] hover:bg-[#dcebf8] text-[#17365b] border border-[#cdd9e7]'
                }`}
              >
                {isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
                <span>{name}</span>
                {start && end && (
                  <span
                    className={`text-[10px] font-normal ${
                      isSelected ? 'text-blue-100' : 'text-[#64748b]'
                    }`}
                  >
                    ({start})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: Single Period vs Full Matrix */}
        <div className="flex items-center bg-[#edf5fc] p-1 rounded-xl border border-[#cdd9e7] shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange('single')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'single'
                ? 'bg-white text-[#172b53] shadow-xs'
                : 'text-[#53647d] hover:text-[#172b53]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            عرض الحصة الحالية
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-white text-[#172b53] shadow-xs'
                : 'text-[#53647d] hover:text-[#172b53]'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            جدول اليوم الشامل (المصفوفة)
          </button>
        </div>
      </div>

      {/* Filter and settings bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* Floor selector */}
          <div className="flex items-center gap-1 text-xs font-semibold text-[#172b53]">
            <Building className="w-3.5 h-3.5 text-[#214e81]" />
            <select
              value={floorFilter}
              onChange={(e) => onFloorFilterChange(e.target.value as 'all' | '1' | '2')}
              className="h-8 px-2.5 bg-white border border-[#cdd9e7] rounded-lg text-xs font-medium text-[#172b53] focus:outline-none focus:ring-1 focus:ring-[#214e81]"
            >
              <option value="all">الدوران معاً (24 فصلاً)</option>
              <option value="1">الدور الأول (8 فصول)</option>
              <option value="2">الدور الثاني (16 فصلاً)</option>
            </select>
          </div>

          {/* Status quick filter */}
          <div className="flex items-center gap-1 text-xs font-semibold text-[#172b53]">
            <Filter className="w-3.5 h-3.5 text-[#214e81]" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="h-8 px-2.5 bg-white border border-[#cdd9e7] rounded-lg text-xs font-medium text-[#172b53] focus:outline-none focus:ring-1 focus:ring-[#214e81]"
            >
              <option value="all">جميع الحالات</option>
              <option value="alerts">التنبيهات والملاحظات فقط</option>
              <option value="pending">لم تتم المتابعة فقط</option>
              <option value="منتظم">منتظم فقط</option>
            </select>
          </div>

          {/* Search box for class */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="بحث عن فصل..."
              className="h-8 pr-8 pl-2.5 w-32 sm:w-40 bg-white border border-[#cdd9e7] rounded-lg text-xs font-medium text-[#172b53] focus:outline-none focus:ring-1 focus:ring-[#214e81]"
            />
          </div>
        </div>

        {/* Settings & Reset buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            disabled={isViewerMode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#edf5fc] hover:bg-[#dcebf8] disabled:opacity-50 text-[#17365b] rounded-lg text-xs font-semibold border border-[#cdd9e7] transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#214e81]" />
            إعدادات الحصص
          </button>

          <button
            type="button"
            onClick={onClearDay}
            disabled={isViewerMode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-[#b53b55] rounded-lg text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            مسح سجلات اليوم
          </button>
        </div>
      </div>
    </div>
  );
};
