'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addMonths, subMonths, format } from 'date-fns';
import { getMonthTheme } from '@/lib/themes';
import type { DateRange, Note } from '@/lib/types';
import HeroPanel from './HeroPanel';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import BindingRings from './BindingRings';
import YearView from './YearView';
import Confetti from './Confetti';

const STORAGE_KEY   = 'chrone-notes-v2';
const EVENTS_KEY    = 'chrone-events-v1';
const DARK_KEY      = 'chrone-dark-mode';

const STICKERS = [
  '🎉','🎂','🎁','🎊','🥳','🎈',
  '✈️','🏖️','🏔️','🗺️','🚗','🏕️',
  '💼','📊','💻','📅','⏰','📝',
  '🏥','💊','🏃','🧘','💪','🥗',
  '🍽️','☕','🍕','🎬','🎵','🎮',
  '❤️','🌹','🥂','🤝','🌟','🔥',
];

export default function WallCalendar() {
  const [currentDate,      setCurrentDate]      = useState(new Date());
  const [selectedRange,    setSelectedRange]    = useState<DateRange>({ start: null, end: null });
  const [hoverDate,        setHoverDate]        = useState<Date | null>(null);
  const [notes,            setNotes]            = useState<Note[]>([]);
  const [events,           setEvents]           = useState<Record<string, string>>({});
  const [darkMode,         setDarkMode]         = useState(false);
  const [direction,        setDirection]        = useState(0);
  const [selectionStep,    setSelectionStep]    = useState<'start' | 'end'>('start');
  const [showYearView,     setShowYearView]     = useState(false);
  const [confettiTrigger,  setConfettiTrigger]  = useState(0);
  const [mobileTab,        setMobileTab]        = useState<'calendar' | 'notes'>('calendar');
  const [stickerPickerDate, setStickerPickerDate] = useState<string | null>(null);

  /* ── Hydrate from localStorage ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
    try {
      const ev = localStorage.getItem(EVENTS_KEY);
      if (ev) setEvents(JSON.parse(ev));
    } catch {}
    try {
      if (localStorage.getItem(DARK_KEY) === 'true') setDarkMode(true);
    } catch {}
  }, []);

  const persistNotes = useCallback((next: Note[]) => {
    setNotes(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    // Fire confetti when a new note is saved
    if (next.length > notes.length) setConfettiTrigger(t => t + 1);
  }, [notes.length]);

  const toggleDark = () => {
    setDarkMode(d => {
      const next = !d;
      try { localStorage.setItem(DARK_KEY, String(next)); } catch {}
      return next;
    });
  };

  /* ── Navigation ── */
  const navigate = (delta: 1 | -1) => {
    setDirection(delta);
    setCurrentDate(d => delta === 1 ? addMonths(d, 1) : subMonths(d, 1));
  };

  const goToToday = () => {
    const t = new Date();
    const diff = (t.getFullYear() - currentDate.getFullYear()) * 12 + t.getMonth() - currentDate.getMonth();
    setDirection(diff >= 0 ? 1 : -1);
    setCurrentDate(t);
  };

  const handleSelectMonth = (month: number, year: number) => {
    const next = new Date(year, month, 1);
    const diff = (year - currentDate.getFullYear()) * 12 + month - currentDate.getMonth();
    setDirection(diff >= 0 ? 1 : -1);
    setCurrentDate(next);
  };

  /* ── Date selection ── */
  const handleDateClick = (date: Date) => {
    if (selectionStep === 'start') {
      setSelectedRange({ start: date, end: null });
      setSelectionStep('end');
    } else {
      setSelectedRange(prev =>
        prev.start && date < prev.start
          ? { start: date, end: prev.start }
          : { ...prev, end: date }
      );
      setSelectionStep('start');
    }
  };

  const clearSelection = () => {
    setSelectedRange({ start: null, end: null });
    setSelectionStep('start');
    setHoverDate(null);
  };

  /* ── Sticker system ── */
  const handleOpenStickerPicker = (dateKey: string) => {
    setStickerPickerDate(dateKey);
  };

  const handlePickSticker = (emoji: string) => {
    if (!stickerPickerDate) return;
    const next = { ...events };
    if (next[stickerPickerDate] === emoji) {
      delete next[stickerPickerDate]; // toggle off same sticker
    } else {
      next[stickerPickerDate] = emoji;
    }
    setEvents(next);
    try { localStorage.setItem(EVENTS_KEY, JSON.stringify(next)); } catch {}
    setStickerPickerDate(null);
    setConfettiTrigger(t => t + 1);
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

  /* ── 3-D page-flip ── */
  const flipVariants = {
    enter: (d: number) => ({ rotateY: d > 0 ? 42 : -42, opacity: 0.4, scale: 0.97 }),
    center: { rotateY: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ rotateY: d > 0 ? -42 : 42, opacity: 0.4, scale: 0.97 }),
  };

  /* ── Ambient background that shifts with month theme ── */
  const outerBg = darkMode
    ? 'bg-zinc-950'
    : `bg-gradient-to-br from-stone-200 via-zinc-100 to-stone-300`;

  const cardShadow = darkMode
    ? '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 40px 80px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)';

  /* ── Shared calendar grid props ── */
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
    onOpenStickerPicker: handleOpenStickerPicker,
  };

  return (
    <div
      className={`min-h-screen flex items-start md:items-center justify-center transition-colors duration-500 ${outerBg} p-0 md:p-8`}
      style={{ '--theme-primary': theme.primaryColor } as React.CSSProperties}
    >
      {/* ── Confetti layer ── */}
      <Confetti trigger={confettiTrigger} />

      {/* ── Year-view overlay ── */}
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

      {/* ── Sticker picker modal ── */}
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
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.88, opacity: 0, y: 24  }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className={`relative w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-4 pt-4 pb-2">
                <p className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                  Add sticker to{' '}
                  <span style={{ color: theme.primaryColor }}>
                    {format(new Date(stickerPickerDate + 'T12:00:00'), 'MMM d, yyyy')}
                  </span>
                </p>
                <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Tap to place · tap same again to remove
                </p>
              </div>

              {/* Sticker grid */}
              <div className="grid grid-cols-6 gap-1 p-4 pt-2">
                {STICKERS.map(emoji => {
                  const isActive = events[stickerPickerDate] === emoji;
                  return (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePickSticker(emoji)}
                      className="flex items-center justify-center text-xl rounded-xl py-1.5 transition-colors"
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

              {/* Remove button */}
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

      {/* ── Perspective wrapper for 3-D flip ── */}
      <div style={{ perspective: '1400px', perspectiveOrigin: 'center center', width: '100%', maxWidth: 480 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={format(currentDate, 'yyyy-MM')}
            custom={direction}
            variants={flipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'center top' }}
            className="w-full"
          >
            {/* ── Calendar card ── */}
            <div
              className={`w-full overflow-hidden rounded-none md:rounded-2xl transition-colors duration-500 paper-texture ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}
              style={{ boxShadow: cardShadow }}
            >
              {/* Binding rings */}
              <BindingRings primaryColor={theme.primaryColor} />

              {/* Hero panel */}
              <HeroPanel
                theme={theme}
                currentDate={currentDate}
                darkMode={darkMode}
                onToggleDarkMode={toggleDark}
                onOpenYearView={() => setShowYearView(true)}
              />

              {/* ════ DESKTOP body: Notes | Calendar ════ */}
              <div className="hidden sm:flex flex-row" style={{ minHeight: 320 }}>
                <NotesPanel
                  selectedRange={selectedRange}
                  notes={notes}
                  onSaveNotes={persistNotes}
                  onClearSelection={clearSelection}
                  theme={theme}
                  darkMode={darkMode}
                />
                <CalendarGrid {...calendarGridProps} />
              </div>

              {/* ════ MOBILE body: tab-switched ════ */}
              <div className="sm:hidden flex flex-col">
                {/* Mobile tab bar */}
                <div
                  className={`flex border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-100'}`}
                >
                  {(['calendar', 'notes'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setMobileTab(tab)}
                      className="flex-1 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-colors relative"
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

                {/* Mobile tab content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileTab}
                    initial={{ opacity: 0, x: mobileTab === 'calendar' ? -16 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {mobileTab === 'calendar' ? (
                      <CalendarGrid {...calendarGridProps} isMobile />
                    ) : (
                      <NotesPanel
                        selectedRange={selectedRange}
                        notes={notes}
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
  );
}
