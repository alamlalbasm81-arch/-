import React, { useRef } from 'react';
import {
  Save,
  Printer,
  Download,
  Upload,
  Calendar,
  User,
  Eye,
  Edit3,
  Share2,
  History,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';

interface ToolbarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  teacherName: string;
  onTeacherChange: (name: string) => void;
  teacherSuggestions: string[];
  isViewerMode: boolean;
  onModeChange: (isViewer: boolean) => void;
  onManualSave: () => void;
  lastSavedAt: Date | null;
  onPrint: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onOpenWhatsApp: () => void;
  onOpenHistory: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedDate,
  onDateChange,
  onPrevDay,
  onNextDay,
  onToday,
  teacherName,
  onTeacherChange,
  teacherSuggestions,
  isViewerMode,
  onModeChange,
  onManualSave,
  lastSavedAt,
  onPrint,
  onExportJson,
  onImportJson,
  onOpenWhatsApp,
  onOpenHistory,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      // reset input so the same file can be re-imported if needed
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#cdd9e7] shadow-sm space-y-4">
      {/* Primary inputs row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
        {/* Date Selector with shortcuts */}
        <div className="lg:col-span-4 space-y-1.5">
          <label className="block text-sm font-bold text-[#172b53] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#214e81]" />
              تاريخ المتابعة
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onNextDay}
                title="اليوم السابق (زمنياً)"
                className="p-1 hover:bg-[#edf5fc] rounded text-[#214e81] border border-[#cdd9e7] text-xs font-normal"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onToday}
                className="px-2 py-0.5 text-xs font-semibold text-[#214e81] hover:bg-[#edf5fc] rounded border border-[#cdd9e7]"
              >
                اليوم
              </button>
              <button
                type="button"
                onClick={onPrevDay}
                title="اليوم التالي (زمنياً)"
                className="p-1 hover:bg-[#edf5fc] rounded text-[#214e81] border border-[#cdd9e7] text-xs font-normal"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full h-10 px-3 bg-white border border-[#cdd9e7] rounded-xl text-[#172b53] text-sm focus:outline-none focus:ring-2 focus:ring-[#214e81]/30 focus:border-[#214e81] font-medium"
          />
        </div>

        {/* Teacher / Duty Supervisor Name with Datalist */}
        <div className="lg:col-span-5 space-y-1.5">
          <label className="block text-sm font-bold text-[#172b53] flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#214e81]" />
            اسم المناوبة / المعلمة
          </label>
          <div className="relative">
            <input
              type="text"
              list="teacher-suggestions"
              value={teacherName}
              disabled={isViewerMode}
              onChange={(e) => onTeacherChange(e.target.value)}
              placeholder="اسم المعلمة المناوبة المشرفة على الدور"
              className="w-full h-10 px-3 bg-white border border-[#cdd9e7] rounded-xl text-[#172b53] text-sm focus:outline-none focus:ring-2 focus:ring-[#214e81]/30 focus:border-[#214e81] placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400 font-medium"
            />
            {teacherSuggestions.length > 0 && (
              <datalist id="teacher-suggestions">
                {teacherSuggestions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            )}
          </div>
        </div>

        {/* Usage Mode Selector */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="block text-sm font-bold text-[#172b53] flex items-center gap-1.5">
            {isViewerMode ? (
              <Eye className="w-4 h-4 text-[#214e81]" />
            ) : (
              <Edit3 className="w-4 h-4 text-[#214e81]" />
            )}
            وضع الاستخدام
          </label>
          <select
            value={isViewerMode ? 'viewer' : 'editor'}
            onChange={(e) => onModeChange(e.target.value === 'viewer')}
            className="w-full h-10 px-3 bg-white border border-[#cdd9e7] rounded-xl text-[#172b53] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#214e81]/30 focus:border-[#214e81]"
          >
            <option value="editor">تسجيل ومتابعة (تحرير)</option>
            <option value="viewer">عرض فقط (قراءة)</option>
          </select>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* Save Button */}
          <button
            type="button"
            onClick={onManualSave}
            disabled={isViewerMode}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#214e81] hover:bg-[#193c64] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            حفظ البيانات
          </button>

          {/* Print / PDF Button */}
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#e5eef7] hover:bg-[#d8e7f5] text-[#17365b] rounded-xl text-sm font-semibold transition-all border border-[#cdd9e7] cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#214e81]" />
            طباعة / PDF
          </button>

          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={onOpenWhatsApp}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-sm font-semibold transition-all border border-emerald-200 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            تقرير الواتساب
          </button>

          {/* History / Archive Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#edf5fc] hover:bg-[#dcebf8] text-[#17365b] rounded-xl text-sm font-semibold transition-all border border-[#cdd9e7] cursor-pointer"
          >
            <History className="w-4 h-4 text-[#214e81]" />
            سجل الأيام
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* JSON Export */}
          <button
            type="button"
            onClick={onExportJson}
            title="تصدير نسخة احتياطية من جميع السجلات كملف JSON"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            تصدير JSON
          </button>

          {/* JSON Import */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="استيراد نسخة احتياطية JSON سابقة"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            استيراد JSON
          </button>

          {lastSavedAt && (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              محفوظ تلقائياً
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
