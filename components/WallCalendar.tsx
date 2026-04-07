'use client';

import { useState, useEffect, useCallback } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { getMonthTheme } from '@/lib/themes';
import type { DateRange, Note } from '@/lib/types';
import HeroPanel from './HeroPanel';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import BindingRings from './BindingRings';

const STORAGE_KEY = 'chrone-calendar-notes-v1';

export default function WallCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [direction, setDirection] = useState(0);
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start');

  // Hydrate notes from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  // Persist dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('chrone-dark-mode');
    if (saved === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('chrone-dark-mode', String(darkMode));
  }, [darkMode]);

  const persistNotes = useCallback((next: Note[]) => {
    setNotes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const navigate = (delta: 1 | -1) => {
    setDirection(delta);
    setCurrentDate(d => (delta === 1 ? addMonths(d, 1) : subMonths(d, 1)));
  };

  const goToToday = () => {
    const t = new Date();
    const diff = t.getMonth() - currentDate.getMonth() + 12 * (t.getFullYear() - currentDate.getFullYear());
    setDirection(diff >= 0 ? 1 : -1);
    setCurrentDate(t);
  };

  const handleDateClick = (date: Date) => {
    if (selectionStep === 'start') {
      setSelectedRange({ start: date, end: null });
      setSelectionStep('end');
    } else {
      if (selectedRange.start && date < selectedRange.start) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange(prev => ({ ...prev, end: date }));
      }
      setSelectionStep('start');
    }
  };

  const clearSelection = () => {
    setSelectedRange({ start: null, end: null });
    setSelectionStep('start');
    setHoverDate(null);
  };

  const theme = getMonthTheme(currentDate.getMonth());

  return (
    <div
      className={`min-h-screen flex items-start sm:items-center justify-center transition-colors duration-500 p-0 sm:p-4 md:p-8 ${
        darkMode ? 'bg-zinc-950' : 'bg-gradient-to-br from-zinc-100 via-stone-50 to-zinc-200'
      }`}
    >
      {/* Calendar card */}
      <div
        className={`w-full sm:max-w-5xl xl:max-w-6xl rounded-none sm:rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500 ${
          darkMode ? 'bg-zinc-900 shadow-black/60' : 'bg-white shadow-zinc-400/30'
        }`}
        style={{
          boxShadow: darkMode
            ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)'
            : '0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      >
        {/* ── Binding rings ── */}
        <BindingRings primaryColor={theme.primaryColor} />

        {/* ── Main body (hero + calendar) ── */}
        <div className="flex flex-col lg:flex-row">
          {/* Hero panel */}
          <HeroPanel
            theme={theme}
            currentDate={currentDate}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(d => !d)}
          />

          {/* Calendar panel */}
          <div
            className={`flex-1 flex flex-col p-5 sm:p-7 lg:p-8 min-h-[520px] ${
              darkMode ? 'bg-zinc-900' : 'bg-white'
            }`}
          >
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

        {/* ── Notes panel ── */}
        <NotesPanel
          selectedRange={selectedRange}
          notes={notes}
          onSaveNotes={persistNotes}
          onClearSelection={clearSelection}
          theme={theme}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}
