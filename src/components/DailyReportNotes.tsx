import React from 'react';
import { FileText, CheckCircle2, Share2, Tag } from 'lucide-react';

interface DailyReportNotesProps {
  generalNotes: string;
  onGeneralNotesChange: (notes: string) => void;
  isViewerMode: boolean;
  onOpenWhatsApp: () => void;
  teacherName: string;
  totalAlerts: number;
}

const COMMON_DAILY_NOTES = [
  'انضباط تام وهدوء عام في الممرات بين جميع الحصص.',
  'تم إشراف المناوبة بكفاءة وتواجد المعلمات في الوقت المحدد.',
  'ملاحظة حركة سريعة للطلاب عند الدرج أثناء انتهاء الفسحة وتم توجيههم.',
  'تمت معالجة تأخر بعض الفصول بالتنسيق مع معلمات الاحتياط.',
  'الالتزام بقواعد السلامة والنظام في جميع فصول الدورين.',
];

export const DailyReportNotes: React.FC<DailyReportNotesProps> = ({
  generalNotes,
  onGeneralNotesChange,
  isViewerMode,
  onOpenWhatsApp,
  teacherName,
  totalAlerts,
}) => {
  return (
    <section className="bg-white rounded-2xl p-5 border border-[#cdd9e7] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#172b53]">
              التقرير اليومي والملاحظات العامة
            </h2>
            <p className="text-xs text-[#53647d]">
              تدوين الملاحظات الشاملة حول المناوبة، الانضباط، والسلامة المدرسية
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenWhatsApp}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
          نسخ تقرير اليوم للمشاركة
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-[#172b53]">
          ملاحظات عامة حول سير اليوم الدراسي
        </label>
        <textarea
          rows={3}
          value={generalNotes}
          disabled={isViewerMode}
          onChange={(e) => onGeneralNotesChange(e.target.value)}
          placeholder="اكتبي تقريراً مختصراً عن حالة الانضباط، الحصص البديلة، وأي ملاحظات تستدعي متابعة الإدارة المدرسية..."
          className="w-full p-3 bg-white border border-[#cdd9e7] rounded-xl text-sm font-medium text-[#172b53] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#214e81]/30 focus:border-[#214e81] disabled:bg-slate-50 disabled:cursor-not-allowed resize-y"
        />

        {/* Quick predefined notes chips */}
        {!isViewerMode && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-[#53647d] ml-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#214e81]" />
              اقتراحات سريعة:
            </span>
            {COMMON_DAILY_NOTES.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => {
                  const combined = generalNotes
                    ? `${generalNotes}\n• ${text}`
                    : `• ${text}`;
                  onGeneralNotesChange(combined);
                }}
                className="text-[11px] px-2.5 py-1 bg-[#edf5fc] hover:bg-[#dcebf8] text-[#17365b] rounded-lg border border-[#cdd9e7] transition-colors cursor-pointer font-medium"
              >
                + {text.slice(0, 32)}...
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-[#64748b] border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span>المعلمة المناوبة:</span>
          <strong className="text-[#172b53]">{teacherName || 'لم يُحدد الاسم بعد'}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span>الحالات المرصودة اليوم:</span>
          <strong className={totalAlerts > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700'}>
            {totalAlerts} حالة
          </strong>
        </div>
      </div>
    </section>
  );
};
