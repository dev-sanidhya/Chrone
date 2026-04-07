'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addMonths, subMonths, format } from 'date-fns';
import { getMonthTheme } from '@/lib/themes';
import type { DateRange, MonthMemoMap, Note } from '@/lib/types';
import HeroPanel from './HeroPanel';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import BindingRings from './BindingRings';
import YearView from './YearView';
import Confetti from './Confetti';

const STORAGE_KEY = 'chrone-notes-v3';
const MEMO_KEY = 'chrone-month-memos-v1';
const EVENTS_KEY = 'chrone-events-v1';
const DARK_KEY = 'chrone-dark-mode';
const DESKTOP_FRAME = { width: 980, height: 742 };

const STICKERS = [
  '🎉','🎂','🎁','🎊','🥳','🎈',
  '✈️','🏖️','🏔️','🗺️','🚗','🏕️',
  '💼','📊','💻','📅','⏰','📝',
  '🏥','💊','🏃','🧘','💪','🥗',
  '🍽️','☕','🍕','🎬','🎵','🎮',
  '❤️','🌹','🥂','🤝','🌟','🔥',
];

export default function WallCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [monthMemos, setMonthMemos] = useState<MonthMemoMap>({});
  const [events, setEvents] = useState<Record<string, string>>({});
  const [darkMode, setDarkMode] = useState(false);
  const [direction, setDirection] = useState(0);
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start');
  const [showYearView, setShowYearView] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [mobileTab, setMobileTab] = useState<'calendar' | 'notes'>('calendar');
  const [stickerPickerDate, setStickerPickerDate] = useState<string | null>(null);
  const [desktopScale, setDesktopScale] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Note[];
        setNotes(parsed);
      }
    } catch {}

    try {
      const raw = localStorage.getItem(MEMO_KEY);
      if (raw) setMonthMemos(JSON.parse(raw));
    } catch {}

    try {
      const ev = localStorage.getItem(EVENTS_KEY);
      if (ev) setEvents(JSON.parse(ev));
    } catch {}

    try {
      if (localStorage.getItem(DARK_KEY) === 'true') setDarkMode(true);
    } catch {}
  }, []);

  useEffect(() => {
    const updateFrame = () => {
      const desktop = window.innerWidth >= 640;
      setIsDesktop(desktop);

      if (!desktop) {
        setDesktopScale(1);
        return;
      }

      const availableWidth = window.innerWidth - 40;
      const availableHeight = window.innerHeight - 36;
      setDesktopScale(
        Math.min(
          1,
          availableWidth / DESKTOP_FRAME.width,
          availableHeight / DESKTOP_FRAME.height,
        ),
      );
    };

    updateFrame();
    window.addEventListener('resize', updateFrame);
    return () => window.removeEventListener('resize', updateFrame);
  }, []);

  useEffect(() => {
    if (selectedRange.start) {
      setMobileTab('notes');
    }
  }, [selectedRange.start]);

  const currentMonthKey = format(currentDate, 'yyyy-MM');
  const monthMemo = monthMemos[currentMonthKey] ?? '';

  const persistNotes = useCallback((next: Note[]) => {
    setNotes(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    if (next.length > notes.length) setConfettiTrigger((value) => value + 1);
  }, [notes.length]);

  const persistMonthMemo = useCallback((content: string) => {
    setMonthMemos((previous) => {
      const next = { ...previous, [currentMonthKey]: content };
      try { localStorage.setItem(MEMO_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [currentMonthKey]);

  const toggleDark = () => {
    setDarkMode((value) => {
      const next = !value;
      try { localStorage.setItem(DARK_KEY, String(next)); } catch {}
      return next;
    });
  };

  const navigate = (delta: 1 | -1) => {
    setDirection(delta);
    setCurrentDate((value) => delta === 1 ? addMonths(value, 1) : subMonths(value, 1));
  };

  const goToToday = () => {
    const today = new Date();
    const diff =
      (today.getFullYear() - currentDate.getFullYear()) * 12 +
      today.getMonth() -
      currentDate.getMonth();
    setDirection(diff >= 0 ? 1 : -1);
    setCurrentDate(today);
  };

  const handleSelectMonth = (month: number, year: number) => {
    const next = new Date(year, month, 1);
    const diff = (year - currentDate.getFullYear()) * 12 + month - currentDate.getMonth();
    setDirection(diff >= 0 ? 1 : -1);
    setCurrentDate(next);
  };

  const handleDateClick = (date: Date) => {
    if (selectionStep === 'start') {
      setSelectedRange({ start: date, end: null });
      setSelectionStep('end');
      return;
    }

    setSelectedRange((previous) =>
      previous.start && date < previous.start
        ? { start: date, end: previous.start }
        : { ...previous, end: date },
    );
    setSelectionStep('start');
  };

  const clearSelection = () => {
    setSelectedRange({ start: null, end: null });
    setSelectionStep('start');
    setHoverDate(null);
  };

  const handlePickSticker = (emoji: string) => {
    if (!stickerPickerDate) return;
    const next = { ...events };

    if (next[stickerPickerDate] === emoji) {
      delete next[stickerPickerDate];
    } else {
      next[stickerPickerDate] = emoji;
    }

    setEvents(next);
    try { localStorage.setItem(EVENTS_KEY, JSON.stringify(next)); } catch {}
    setStickerPickerDate(null);
    setConfettiTrigger((value) => value + 1);
  };

  const handleRemoveSticker = () => {
    if (!stickerPickerDate) return;
    const next = { ...events };
    delete next[stickerPickerDate];
    setEvents(next);
    try { localStorage.setItem(EVENTS_KEY, JSON.stringify(next)); } catch {}
    setStickerPickerDate(null);
  };

  const theme = getMonthTheme(currentDate.getMonth());

  const calendarGridProps = {
    currentDate,
    selectedRange,
    hoverDate,
    theme,
    direction,
    selectionStep,
    darkMode,
    events,
    onDateClick: handleDateClick,
    onDateHover: setHoverDate,
    onDateLeave: () => setHoverDate(null),
    onPrevMonth: () => navigate(-1),
    onNextMonth: () => navigate(1),
    onGoToToday: goToToday,
    onClearSelection: clearSelection,
    onOpenStickerPicker: (dateKey: string) => setStickerPickerDate(dateKey),
  };

  const frameStyle = useMemo(() => {
    if (!isDesktop) return { width: '100%', height: '100%' };

    return {
      width: `${DESKTOP_FRAME.width * desktopScale}px`,
      height: `${DESKTOP_FRAME.height * desktopScale}px`,
    };
  }, [desktopScale, isDesktop]);

  const cardStyle = useMemo(() => {
    if (!isDesktop) return { width: '100%', height: '100%' };

    return {
      width: `${DESKTOP_FRAME.width}px`,
      height: `${DESKTOP_FRAME.height}px`,
      transform: `scale(${desktopScale})`,
      transformOrigin: 'top center',
    };
  }, [desktopScale, isDesktop]);

  const outerBg = darkMode
    ? 'bg-zinc-950'
    : 'bg-[radial-gradient(circle_at_top,_#f8f0e0,_#ebe7de_44%,_#d7d2cb_100%)]';

  const cardShadow = darkMode
    ? '0 40px 80px rgba(0,0,0,0.82), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 40px 90px rgba(0,0,0,0.18), 0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)';

  const flipVariants = {
    enter: (value: number) => ({ rotateY: value > 0 ? 34 : -34, opacity: 0.45, scale: 0.98 }),
    center: { rotateY: 0, opacity: 1, scale: 1 },
    exit: (value: number) => ({ rotateY: value > 0 ? -34 : 34, opacity: 0.45, scale: 0.98 }),
  };

  return (
    <div
      className={`h-[100dvh] overflow-hidden flex items-center justify-center transition-colors duration-500 ${outerBg} p-0 sm:p-4`}
      style={{ '--theme-primary': theme.primaryColor } as React.CSSProperties}
    >
      <Confetti trigger={confettiTrigger} />

      <AnimatePresence>
        {showYearView && (
          <YearView
            year={currentDate.getFullYear()}
            currentMonth={currentDate.getMonth()}
            notes={notes}
            darkMode={darkMode}
            onSelectMonth={handleSelectMonth}
            onClose={() => setShowYearView(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stickerPickerDate && (
          <motion.div
            key="sticker-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4"
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setStickerPickerDate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 18 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className={`relative w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="px-4 pt-4 pb-2">
                <p className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                  Add sticker to{' '}
                  <span style={{ color: theme.primaryColor }}>
                    {format(new Date(stickerPickerDate + 'T12:00:00'), 'MMM d, yyyy')}
                  </span>
                </p>
                <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Tap to place. Tap the same sticker again to remove it.
                </p>
              </div>

              <div className="grid grid-cols-6 gap-1 p-4 pt-2">
                {STICKERS.map((emoji) => {
                  const isActive = events[stickerPickerDate] === emoji;
                  return (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePickSticker(emoji)}
                      className="flex items-center justify-center rounded-xl py-1.5 text-xl transition-colors"
                      style={{
                        background: isActive ? `${theme.primaryColor}30` : 'transparent',
                        boxShadow: isActive ? `0 0 0 2px ${theme.primaryColor}` : 'none',
                      }}
                    >
                      {emoji}
                    </motion.button>
                  );
                })}
              </div>

              {events[stickerPickerDate] && (
                <div className="px-4 pb-4">
                  <button
                    onClick={handleRemoveSticker}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${darkMode ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                  >
                    Remove sticker
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-full w-full items-center justify-center">
        <div
          className="flex items-center justify-center"
          style={{
            ...frameStyle,
            perspective: '1500px',
            perspectiveOrigin: 'center center',
          }}
        >
          <div style={cardStyle}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={format(currentDate, 'yyyy-MM')}
                custom={direction}
                variants={flipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ transformStyle: 'preserve-3d', transformOrigin: 'center top' }}
                className="h-full w-full"
              >
                <div
                  className={`calendar-card flex h-full w-full flex-col overflow-hidden rounded-none sm:rounded-[2rem] paper-texture ${darkMode ? 'bg-zinc-900' : 'bg-[#fdf9f1]'}`}
                  style={{ boxShadow: cardShadow }}
                >
                  <BindingRings primaryColor={theme.primaryColor} />

                  <HeroPanel
                    theme={theme}
                    currentDate={currentDate}
                    darkMode={darkMode}
                    monthMemo={monthMemo}
                    onToggleDarkMode={toggleDark}
                    onOpenYearView={() => setShowYearView(true)}
                  />

                  <div className="hidden min-h-0 flex-1 sm:flex">
                    <NotesPanel
                      currentDate={currentDate}
                      selectedRange={selectedRange}
                      notes={notes}
                      monthMemo={monthMemo}
                      onSaveMonthMemo={persistMonthMemo}
                      onSaveNotes={persistNotes}
                      onClearSelection={clearSelection}
                      theme={theme}
                      darkMode={darkMode}
                    />
                    <CalendarGrid {...calendarGridProps} />
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col sm:hidden">
                    <div className={`flex border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                      {(['calendar', 'notes'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setMobileTab(tab)}
                          className="relative flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors"
                          style={{
                            color: mobileTab === tab ? theme.primaryColor : darkMode ? '#71717a' : '#a1a1aa',
                          }}
                        >
                          {tab}
                          {mobileTab === tab && (
                            <motion.div
                              layoutId="mobile-tab-indicator"
                              className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                              style={{ backgroundColor: theme.primaryColor }}
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={mobileTab}
                        initial={{ opacity: 0, x: mobileTab === 'calendar' ? -16 : 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="min-h-0 flex-1"
                      >
                        {mobileTab === 'calendar' ? (
                          <CalendarGrid {...calendarGridProps} isMobile />
                        ) : (
                          <NotesPanel
                            currentDate={currentDate}
                            selectedRange={selectedRange}
                            notes={notes}
                            monthMemo={monthMemo}
                            onSaveMonthMemo={persistMonthMemo}
                            onSaveNotes={persistNotes}
                            onClearSelection={clearSelection}
                            theme={theme}
                            darkMode={darkMode}
                            isMobile
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
