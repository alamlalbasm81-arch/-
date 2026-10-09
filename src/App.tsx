import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ROOMS_FLOOR_1,
  ROOMS_FLOOR_2,
  ALL_ROOMS,
  DEFAULT_TIMES,
  STATUS_LIST,
} from './constants';
import { DutyState, DutyStatus, PeriodTiming, RoomEntry } from './types';
import {
  getInitialState,
  saveStateToStorage,
  getOrCreateDayRecord,
} from './utils/storage';
import {
  toLocalDateString,
  getDutyDayInfo,
  getNextSchoolDay,
  parseDateString,
  getActivePeriodName,
} from './utils/time';
import { Header } from './components/Header';
import { WeeklyDaysNav } from './components/WeeklyDaysNav';
import { Toolbar } from './components/Toolbar';
import { StatsOverview } from './components/StatsOverview';
import { PeriodNav } from './components/PeriodNav';
import { ClassroomTable } from './components/ClassroomTable';
import { FullDayMatrix } from './components/FullDayMatrix';
import { DailyReportNotes } from './components/DailyReportNotes';
import { TimingSettingsModal } from './components/TimingSettingsModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { HistoryArchiveModal } from './components/HistoryArchiveModal';
import { PrintReportView } from './components/PrintReportView';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // Load initial persistent state
  const [state, setState] = useState<DutyState>(getInitialState);

  // Initialize date: default to today or next school day if weekend
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const dow = today.getDay();
    if (dow === 5 || dow === 6) {
      // If Friday or Saturday, jump to next Sunday
      return toLocalDateString(getNextSchoolDay(today));
    }
    return toLocalDateString(today);
  });

  // Selected period
  const [selectedPeriod, setSelectedPeriod] = useState<string>('الأولى');

  // Filters & display modes
  const [floorFilter, setFloorFilter] = useState<'all' | '1' | '2'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'single' | 'matrix'>('single');
  const [isViewerMode, setIsViewerMode] = useState<boolean>(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Auto-save & Toast indicator
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Clock tick for current active period
  const [currentActivePeriod, setCurrentActivePeriod] = useState<string | null>(
    () => getActivePeriodName(state.times, state.eighth)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivePeriod(getActivePeriodName(state.times, state.eighth));
    }, 30000); // check every 30 seconds
    return () => clearInterval(interval);
  }, [state.times, state.eighth]);

  // Save changes to localStorage whenever state changes
  const persistState = useCallback((nextState: DutyState) => {
    saveStateToStorage(nextState);
    setLastSavedAt(new Date());
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({
      id: String(Date.now()),
      type,
      message,
    });
  };

  // Current day data
  const currentDayData = useMemo(() => {
    return getOrCreateDayRecord(state, selectedDate);
  }, [state, selectedDate]);

  // Duty day info (e.g. الأحد, المجال الثاني)
  const dutyInfo = useMemo(() => {
    return getDutyDayInfo(selectedDate);
  }, [selectedDate]);

  // Weekday navigation handler (syncs date to that weekday in current selected week)
  const handleSelectDayIndex = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex > 4) return;
    const currentDayIdx = dutyInfo.dayIndex;
    const dt = parseDateString(selectedDate);

    if (currentDayIdx >= 0) {
      const diff = targetIndex - currentDayIdx;
      dt.setDate(dt.getDate() + diff);
    } else {
      // If currently weekend, adjust to Sunday + targetIndex
      const dow = dt.getDay();
      const diffToSunday = dow === 5 ? 2 : 1;
      dt.setDate(dt.getDate() + diffToSunday + targetIndex);
    }

    setSelectedDate(toLocalDateString(dt));
  };

  // Date step shortcuts
  const handleNextDay = () => {
    const d = parseDateString(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(toLocalDateString(d));
  };

  const handlePrevDay = () => {
    const d = parseDateString(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(toLocalDateString(d));
  };

  const handleToday = () => {
    setSelectedDate(toLocalDateString(new Date()));
  };

  // Update teacher name
  const handleTeacherChange = (name: string) => {
    setState((prev) => {
      const nextDays = { ...prev.days };
      const dayRec = { ...(nextDays[selectedDate] || { entries: {}, general: '' }) };
      dayRec.teacher = name;
      nextDays[selectedDate] = dayRec;

      // Also remember teacher in suggestions list
      let nextList = prev.teacherList || [];
      if (name.trim() && !nextList.includes(name.trim())) {
        nextList = [...nextList, name.trim()].slice(-15);
      }

      const next = { ...prev, days: nextDays, teacherList: nextList };
      persistState(next);
      return next;
    });
  };

  // Update general report notes
  const handleGeneralNotesChange = (notes: string) => {
    setState((prev) => {
      const nextDays = { ...prev.days };
      const dayRec = { ...(nextDays[selectedDate] || { entries: {}, teacher: '' }) };
      dayRec.general = notes;
      nextDays[selectedDate] = dayRec;
      const next = { ...prev, days: nextDays };
      persistState(next);
      return next;
    });
  };

  // Update entry status
  const handleUpdateStatus = (room: string, status: DutyStatus) => {
    if (isViewerMode) return;
    setState((prev) => {
      const nextDays = { ...prev.days };
      const dayRec = { ...(nextDays[selectedDate] || { teacher: '', general: '', entries: {} }) };
      const nextEntries = { ...dayRec.entries };
      const k = `${selectedPeriod}|${room}`;
      nextEntries[k] = {
        ...(nextEntries[k] || {}),
        status,
        updatedAt: new Date().toISOString(),
      };
      dayRec.entries = nextEntries;
      nextDays[selectedDate] = dayRec;
      const next = { ...prev, days: nextDays };
      persistState(next);
      return next;
    });
  };

  // Update entry note
  const handleUpdateNote = (room: string, note: string) => {
    if (isViewerMode) return;
    setState((prev) => {
      const nextDays = { ...prev.days };
      const dayRec = { ...(nextDays[selectedDate] || { teacher: '', general: '', entries: {} }) };
      const nextEntries = { ...dayRec.entries };
      const k = `${selectedPeriod}|${room}`;
      nextEntries[k] = {
        ...(nextEntries[k] || {}),
        note,
        updatedAt: new Date().toISOString(),
      };
      dayRec.entries = nextEntries;
      nextDays[selectedDate] = dayRec;
      const next = { ...prev, days: nextDays };
      persistState(next);
      return next;
    });
  };

  // Auto-fill all uninspected rooms in current period as "منتظم"
  const handleAutoFillRemainingRegular = () => {
    if (isViewerMode) return;
    setState((prev) => {
      const nextDays = { ...prev.days };
      const dayRec = { ...(nextDays[selectedDate] || { teacher: '', general: '', entries: {} }) };
      const nextEntries = { ...dayRec.entries };

      let updatedCount = 0;
      ALL_ROOMS.forEach((room) => {
        const k = `${selectedPeriod}|${room}`;
        const cur = nextEntries[k]?.status;
        if (!cur || cur === 'لم تتم المتابعة') {
          nextEntries[k] = {
            ...(nextEntries[k] || {}),
            status: 'منتظم',
            updatedAt: new Date().toISOString(),
          };
          updatedCount++;
        }
      });

      dayRec.entries = nextEntries;
      nextDays[selectedDate] = dayRec;
      const next = { ...prev, days: nextDays };
      persistState(next);
      showToast('success', `تم تعيين ${updatedCount} فصول كـ "منتظم" بنجاح.`);
      return next;
    });
  };

  // Manual save trigger
  const handleManualSave = () => {
    persistState(state);
    showToast('success', 'تم حفظ جميع البيانات في المتصفح بنجاح.');
  };

  // Clear current day records
  const handleClearDay = () => {
    if (
      window.confirm(
        `هل أنتِ متأكدة من مسح جميع سجلات يوم ${selectedDate}؟ لا يمكن التراجع عن هذا الإجراء.`
      )
    ) {
      setState((prev) => {
        const nextDays = { ...prev.days };
        delete nextDays[selectedDate];
        const next = { ...prev, days: nextDays };
        persistState(next);
        showToast('info', 'تم مسح سجلات اليوم المحدد.');
        return next;
      });
    }
  };

  // Delete day from history archive
  const handleDeleteDayFromArchive = (dateToDel: string) => {
    setState((prev) => {
      const nextDays = { ...prev.days };
      delete nextDays[dateToDel];
      const next = { ...prev, days: nextDays };
      persistState(next);
      showToast('info', `تم حذف سجل يوم ${dateToDel}.`);
      return next;
    });
  };

  // Save period timings
  const handleSaveTimes = (newTimes: PeriodTiming[], eighthActive: boolean) => {
    setState((prev) => {
      const next = { ...prev, times: newTimes, eighth: eighthActive };
      persistState(next);
      showToast('success', 'تم حفظ التوقيت المدرسي الجديد بنجاح.');
      return next;
    });
  };

  // Reset period timings
  const handleResetDefaults = () => {
    setState((prev) => {
      const next = {
        ...prev,
        times: structuredClone(DEFAULT_TIMES),
        eighth: false,
      };
      persistState(next);
      showToast('info', 'تمت استعادة التوقيت الأصلي.');
      return next;
    });
  };

  // Export state to JSON file
  const handleExportJson = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `monawabati-jilalsalam-${selectedDate}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('success', 'تم تصدير النسخة الاحتياطية بنجاح.');
    } catch (err) {
      showToast('error', 'فشل تصدير الملف.');
    }
  };

  // Import JSON backup
  const handleImportJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed || typeof parsed !== 'object' || !parsed.days || !Array.isArray(parsed.times)) {
        throw new Error('صيغة الملف غير متوافقة');
      }

      if (
        window.confirm(
          'هل تريدين استبدال بيانات التطبيق بالبيانات الموجودة في ملف النسخة الاحتياطية؟'
        )
      ) {
        const nextState: DutyState = {
          days: parsed.days || {},
          times: parsed.times,
          eighth: Boolean(parsed.eighth),
          teacherList: Array.isArray(parsed.teacherList) ? parsed.teacherList : state.teacherList,
        };
        setState(nextState);
        persistState(nextState);
        showToast('success', 'تم استيراد النسخة الاحتياطية بنجاح.');
      }
    } catch (err) {
      showToast('error', 'الملف المحدد غير صالح أو تالف.');
    }
  };

  // Printing
  const handlePrint = () => {
    window.print();
  };

  // Compute stats for current selected period
  const { periodCompletedCount, periodAlertCount, totalAlertsDay } = useMemo(() => {
    let completed = 0;
    let alerts = 0;
    ALL_ROOMS.forEach((room) => {
      const k = `${selectedPeriod}|${room}`;
      const st = currentDayData.entries?.[k]?.status;
      if (st && st !== 'لم تتم المتابعة') {
        completed++;
      }
      if (['تأخر المعلمة', 'غياب المعلمة', 'الطلاب دون إشراف', 'ملاحظة'].includes(st || '')) {
        alerts++;
      }
    });

    let dayAlerts = 0;
    Object.values(currentDayData.entries || {}).forEach((entry) => {
      if (
        ['تأخر المعلمة', 'غياب المعلمة', 'الطلاب دون إشراف', 'ملاحظة'].includes(
          entry.status || ''
        )
      ) {
        dayAlerts++;
      }
    });

    return {
      periodCompletedCount: completed,
      periodAlertCount: alerts,
      totalAlertsDay: dayAlerts,
    };
  }, [currentDayData, selectedPeriod]);

  // Filtered rooms for ClassroomTable
  const filterRooms = (roomList: string[]) => {
    return roomList.filter((room) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (!room.toLowerCase().includes(q)) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        const k = `${selectedPeriod}|${room}`;
        const st = currentDayData.entries?.[k]?.status || 'لم تتم المتابعة';
        if (statusFilter === 'alerts') {
          return ['تأخر المعلمة', 'غياب المعلمة', 'الطلاب دون إشراف', 'ملاحظة'].includes(st);
        }
        if (statusFilter === 'pending') {
          return st === 'لم تتم المتابعة';
        }
        if (st !== statusFilter) return false;
      }

      return true;
    });
  };

  const filteredFloor1 = useMemo(
    () => filterRooms(ROOMS_FLOOR_1),
    [ROOMS_FLOOR_1, searchQuery, statusFilter, selectedPeriod, currentDayData]
  );
  const filteredFloor2 = useMemo(
    () => filterRooms(ROOMS_FLOOR_2),
    [ROOMS_FLOOR_2, searchQuery, statusFilter, selectedPeriod, currentDayData]
  );

  return (
    <div className="min-h-screen bg-[#f4f8fc] text-[#172b53] selection:bg-[#fbe3ee] selection:text-[#d95d92]">
      {/* Toast feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Main Container */}
      <main className="max-w-[1450px] mx-auto p-4 sm:p-6 lg:p-8 space-y-5">
        {/* Header */}
        <Header
          currentDayName={dutyInfo.dayName}
          dutyField={dutyInfo.field}
          activePeriod={currentActivePeriod}
        />

        {/* Toolbar & Controls */}
        <section className="noprint">
          <Toolbar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onPrevDay={handlePrevDay}
            onNextDay={handleNextDay}
            onToday={handleToday}
            teacherName={currentDayData.teacher || ''}
            onTeacherChange={handleTeacherChange}
            teacherSuggestions={state.teacherList || []}
            isViewerMode={isViewerMode}
            onModeChange={setIsViewerMode}
            onManualSave={handleManualSave}
            lastSavedAt={lastSavedAt}
            onPrint={handlePrint}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        </section>

        {/* Weekly Duty Assignment & Stats Panel */}
        <section className="bg-white rounded-2xl p-5 border border-[#cdd9e7] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#172b53] flex items-center gap-2">
              <span>📅</span>
              <span>المناوبة الأسبوعية والمجالات</span>
            </h2>
            <span className="text-xs font-semibold text-[#53647d] bg-[#edf5fc] px-2.5 py-1 rounded-lg border border-[#cdd9e7]">
              {selectedDate}
            </span>
          </div>

          <WeeklyDaysNav
            selectedDayIndex={dutyInfo.dayIndex}
            assignmentText={
              dutyInfo.isSchoolDay
                ? `${dutyInfo.dayName} — ${dutyInfo.field}`
                : dutyInfo.field
            }
            onSelectDayIndex={handleSelectDayIndex}
          />

          <StatsOverview
            totalRooms={ALL_ROOMS.length}
            completedRooms={periodCompletedCount}
            alertCount={periodAlertCount}
            selectedPeriod={selectedPeriod}
            isViewerMode={isViewerMode}
            onAutoFillRemainingRegular={handleAutoFillRemainingRegular}
          />
        </section>

        {/* Period Selector & View Filters */}
        <section className="noprint">
          <PeriodNav
            periods={state.times}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
            floorFilter={floorFilter}
            onFloorFilterChange={setFloorFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onClearDay={handleClearDay}
            isViewerMode={isViewerMode}
            activeLivePeriod={currentActivePeriod}
          />
        </section>

        {/* Classroom Monitoring Area */}
        {viewMode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Floor 1 */}
            {(floorFilter === 'all' || floorFilter === '1') && (
              <ClassroomTable
                floorTitle="الدور الأول"
                floorNumber="1"
                rooms={filteredFloor1}
                entries={currentDayData.entries || {}}
                selectedPeriod={selectedPeriod}
                isViewerMode={isViewerMode}
                onUpdateStatus={handleUpdateStatus}
                onUpdateNote={handleUpdateNote}
              />
            )}

            {/* Floor 2 */}
            {(floorFilter === 'all' || floorFilter === '2') && (
              <div
                className={
                  floorFilter === '2' ? 'lg:col-span-2' : ''
                }
              >
                <ClassroomTable
                  floorTitle="الدور الثاني"
                  floorNumber="2"
                  rooms={filteredFloor2}
                  entries={currentDayData.entries || {}}
                  selectedPeriod={selectedPeriod}
                  isViewerMode={isViewerMode}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateNote={handleUpdateNote}
                />
              </div>
            )}
          </div>
        ) : (
          /* Full Day Matrix View */
          <FullDayMatrix
            periods={state.times}
            entries={currentDayData.entries || {}}
            floorFilter={floorFilter}
            searchQuery={searchQuery}
            onSelectPeriod={setSelectedPeriod}
            onSwitchToSingleView={(p) => {
              setSelectedPeriod(p);
              setViewMode('single');
            }}
          />
        )}

        {/* Daily Report & General Notes */}
        <DailyReportNotes
          generalNotes={currentDayData.general || ''}
          onGeneralNotesChange={handleGeneralNotesChange}
          isViewerMode={isViewerMode}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          teacherName={currentDayData.teacher || ''}
          totalAlerts={totalAlertsDay}
        />

        {/* Footer info notice */}
        <footer className="text-center text-xs text-[#64748b] py-3 noprint">
          <p>
            تطبيق مناوبتي · مدرسة جيل السلام (1–4) · تُحفظ البيانات محلياً في هذا المتصفح وتتوفر خيارات النسخ الاحتياطي والطباعة والمشاركة الفورية.
          </p>
        </footer>
      </main>

      {/* Official Print Layout (Invisible on screen, prints on paper / PDF) */}
      <PrintReportView
        dateStr={selectedDate}
        dayName={dutyInfo.dayName}
        dutyField={dutyInfo.field}
        selectedPeriod={selectedPeriod}
        dayData={currentDayData}
        periods={state.times}
      />

      {/* Modals */}
      <TimingSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        times={state.times}
        eighthActive={state.eighth}
        onSaveTimes={handleSaveTimes}
        onResetDefaults={handleResetDefaults}
      />

      <WhatsAppShareModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        dateStr={selectedDate}
        dayName={dutyInfo.dayName}
        field={dutyInfo.field}
        dayData={currentDayData}
        periods={state.times}
      />

      <HistoryArchiveModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        state={state}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onDeleteDay={handleDeleteDayFromArchive}
      />
    </div>
  );
}
