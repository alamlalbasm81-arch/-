import React, { useState } from 'react';
import { Copy, Check, X, Share2, MessageCircle } from 'lucide-react';
import { DayRecord, PeriodTiming, DutyStatus } from '../types';
import { ALL_ROOMS, STATUS_CONFIG } from '../constants';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  dayName: string;
  field: string;
  dayData: DayRecord;
  periods: PeriodTiming[];
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  dayName,
  field,
  dayData,
  periods,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Gather stats & alert items
  const activePeriods = periods.filter(
    (p) => p[0] !== 'الطابور' && p[0] !== 'الفسحة'
  );

  const alerts: { period: string; room: string; status: string; note: string }[] = [];
  let totalChecked = 0;
  let totalRegular = 0;

  activePeriods.forEach(([pName]) => {
    ALL_ROOMS.forEach((room) => {
      const k = `${pName}|${room}`;
      const entry = dayData.entries?.[k];
      if (entry && entry.status && entry.status !== 'لم تتم المتابعة') {
        totalChecked++;
        if (entry.status === 'منتظم') {
          totalRegular++;
        } else if (
          ['تأخر المعلمة', 'غياب المعلمة', 'الطلاب دون إشراف', 'ملاحظة'].includes(
            entry.status
          )
        ) {
          alerts.push({
            period: pName,
            room,
            status: entry.status,
            note: entry.note || '',
          });
        }
      }
    });
  });

  const totalPossible = activePeriods.length * ALL_ROOMS.length;
  const completionRate =
    totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;

  let reportText = `🌿 *تقرير متابعة المناوبة اليومية بين الحصص*\n`;
  reportText += `🏫 *مدرسة جيل السلام (1–4)*\n`;
  reportText += `---------------------------------\n`;
  reportText += `📅 *اليوم والتاريخ:* ${dayName} (${dateStr})\n`;
  reportText += `🎯 *المجال المناوب:* ${field}\n`;
  reportText += `👩‍🏫 *المعلمة المناوبة:* ${dayData.teacher || 'غير محدد'}\n`;
  reportText += `📊 *نسبة إنجاز المتابعة:* ${totalChecked} / ${totalPossible} (${completionRate}%)\n`;
  reportText += `✅ *الفصول المنتظمة:* ${totalRegular}\n`;

  if (alerts.length > 0) {
    reportText += `\n⚠️ *الحالات المرصودة والملاحظات (${alerts.length}):*\n`;
    alerts.forEach((item, i) => {
      reportText += `${i + 1}. [${item.period}] فصل ${item.room}: *${item.status}*`;
      if (item.note) reportText += ` (${item.note})`;
      reportText += `\n`;
    });
  } else {
    reportText += `\n✨ *الحالات المرصودة:* لم تُسجل أي حالات تأخر أو غياب، انضباط تام بحمد الله.\n`;
  }

  if (dayData.general?.trim()) {
    reportText += `\n📝 *ملاحظات عامة:*\n${dayData.general.trim()}\n`;
  }

  reportText += `---------------------------------\n`;
  reportText += `معا نصنع جيلا واعيا لمستقبل أفضل 🌱`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppWeb = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-[#cdd9e7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-100 to-[#dff2f8] p-4 px-6 border-b border-[#cdd9e7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-[#172b53]">
              مشاركة تقرير المناوبة عبر الواتساب
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

        {/* Text Preview */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[#53647d]">
            تم تنسيق التقرير بشكل احترافي جاهز للإرسال في مجموعة الواتساب المدرسية أو حفظه في السجلات الإدارية:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-[#172b53] whitespace-pre-wrap max-h-72 overflow-y-auto custom-scrollbar select-all">
            {reportText}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-[#172b53] border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">تم النسخ بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#214e81]" />
                  <span>نسخ النص للحافظة</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppWeb}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>فتح في واتساب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
