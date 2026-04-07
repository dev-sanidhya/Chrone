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

const STORAGE_KEY = 'chrone-notes-v2';
const DARK_KEY    = 'chrone-dark-mode';

export default function WallCalendar() {
  const [currentDate,   setCurrentDate]   = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate,     setHoverDate]     = useState<Date | null>(null);
  const [notes,         setNotes]         = useState<Note[]>([]);
  const [darkMode,      setDarkMode]      = useState(false);
  const [direction,     setDirection]     = useState(0);
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start');

  /* ── Persist notes ── */
  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setNotes(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => {
    try { const dm = localStorage.getItem(DARK_KEY); if (dm === 'true') setDarkMode(true); } catch {}
  }, []);

  const persistNotes = useCallback((next: Note[]) => {
    setNotes(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const toggleDark = () => {
    setDarkMode(d => {
      localStorage.setItem(DARK_KEY, String(!d));
      return !d;
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

  const theme = getMonthTheme(currentDate.getMonth());

  /* ── 3-D page-flip animation ── */
  const flipVariants = {
    enter: (d: number) => ({
      rotateY: d > 0 ? 42 : -42,
      opacity: 0.4,
      scale: 0.97,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (d: number) => ({
      rotateY: d > 0 ? -42 : 42,
      opacity: 0.4,
      scale: 0.97,
    }),
  };

  const outerBg = darkMode
    ? 'bg-zinc-950'
    : 'bg-gradient-to-br from-stone-200 via-zinc-100 to-stone-300';

  const cardShadow = darkMode
    ? '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 40px 80px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)';

  return (
    <div className={`min-h-screen flex items-start md:items-center justify-center transition-colors duration-500 ${outerBg} p-0 md:p-8`}>

      {/* Perspective wrapper for 3-D flip */}
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
              className={`w-full overflow-hidden rounded-none md:rounded-2xl transition-colors duration-500 ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}
              style={{ boxShadow: cardShadow }}
            >
              {/* Binding rings */}
              <BindingRings primaryColor={theme.primaryColor} />

              {/* Hero (image + diagonal overlay) */}
              <HeroPanel
                theme={theme}
                currentDate={currentDate}
                darkMode={darkMode}
                onToggleDarkMode={toggleDark}
              />

              {/* Body: Notes sidebar | Calendar grid */}
              <div className="flex flex-row" style={{ minHeight: 320 }}>
                <NotesPanel
                  selectedRange={selectedRange}
                  notes={notes}
                  onSaveNotes={persistNotes}
                  onClearSelection={clearSelection}
                  theme={theme}
                  darkMode={darkMode}
                />
                <CalendarGrid
                  currentDate={currentDate}
                  selectedRange={selectedRange}
                  hoverDate={hoverDate}
                  theme={theme}
                  direction={direction}
                  selectionStep={selectionStep}
                  darkMode={darkMode}
                  onDateClick={handleDateClick}
                  onDateHover={setHoverDate}
                  onDateLeave={() => setHoverDate(null)}
                  onPrevMonth={() => navigate(-1)}
                  onNextMonth={() => navigate(1)}
                  onGoToToday={goToToday}
                  onClearSelection={clearSelection}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
