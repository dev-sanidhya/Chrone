'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  getISOWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react';
import type { DateRange, MonthTheme } from '@/lib/types';
import { getHolidayForDate } from '@/lib/holidays';
import DayCell from './DayCell';

interface CalendarGridProps {
  currentDate: Date;
  selectedRange: DateRange;
  hoverDate: Date | null;
  theme: MonthTheme;
  direction: number;
  selectionStep: 'start' | 'end';
  darkMode: boolean;
  onDateClick: (d: Date) => void;
  onDateHover: (d: Date) => void;
  onDateLeave: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onClearSelection: () => void;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 280 : -280, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 280 : -280, opacity: 0 }),
};

export default function CalendarGrid({
  currentDate,
  selectedRange,
  hoverDate,
  theme,
  direction,
  selectionStep,
  darkMode,
  onDateClick,
  onDateHover,
  onDateLeave,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onClearSelection,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  // Determine effective range (preview while selecting end)
  const previewEnd =
    selectionStep === 'end' && hoverDate && selectedRange.start
      ? hoverDate >= selectedRange.start
        ? hoverDate
        : selectedRange.start
      : selectedRange.end;
  const previewStart =
    selectionStep === 'end' && hoverDate && selectedRange.start
      ? hoverDate < selectedRange.start
        ? hoverDate
        : selectedRange.start
      : selectedRange.start;

  const isStart = (d: Date) => !!previewStart && isSameDay(d, previewStart);
  const isEnd = (d: Date) => !!previewEnd && isSameDay(d, previewEnd);
  const isInRange = (d: Date) =>
    !!previewStart && !!previewEnd && d > previewStart && d < previewEnd;
  const isPreview = (d: Date) =>
    selectionStep === 'end' &&
    !!hoverDate &&
    !!selectedRange.start &&
    !selectedRange.end &&
    d > selectedRange.start &&
    d < hoverDate;

  // Days selected label
  const daysSelected =
    selectedRange.start && selectedRange.end
      ? Math.round(
          (selectedRange.end.getTime() - selectedRange.start.getTime()) /
            86400000
        ) + 1
      : null;

  const btnBase = `p-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
    darkMode ? 'hover:bg-zinc-700 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-500'
  }`;

  return (
    <div className="flex flex-col gap-3 flex-1">
      {/* ── Month navigation ── */}
      <div className="flex items-center justify-between">
        <button onClick={onPrevMonth} className={btnBase} aria-label="Previous month">
          <ChevronLeft size={18} />
        </button>

        <div className="text-center min-w-[160px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.h2
              key={format(currentDate, 'yyyy-MM')}
              custom={direction}
              variants={{
                enter: (d: number) => ({ y: d > 0 ? 14 : -14, opacity: 0 }),
                center: { y: 0, opacity: 1 },
                exit: (d: number) => ({ y: d < 0 ? 14 : -14, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22 }}
              className={`text-lg font-bold ${darkMode ? 'text-zinc-100' : 'text-zinc-800'}`}
            >
              {format(currentDate, 'MMMM yyyy')}
            </motion.h2>
          </AnimatePresence>

          <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {selectionStep === 'start' && !selectedRange.start && 'Click a date to begin'}
            {selectionStep === 'end' && 'Now pick your end date'}
            {selectionStep === 'start' && selectedRange.start && !selectedRange.end && 'Start date set ✓'}
          </p>
        </div>

        <button onClick={onNextMonth} className={btnBase} aria-label="Next month">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Selection status bar ── */}
      <AnimatePresence>
        {(selectedRange.start || daysSelected) && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-3 py-2 rounded-xl text-sm"
              style={{ backgroundColor: `${theme.primaryColor}18` }}
            >
              <span className="font-semibold text-xs" style={{ color: theme.primaryColor }}>
                {daysSelected
                  ? `${daysSelected} day${daysSelected !== 1 ? 's' : ''} · ${format(selectedRange.start!, 'MMM d')} → ${format(selectedRange.end!, 'MMM d, yyyy')}`
                  : `From ${format(selectedRange.start!, 'MMMM d, yyyy')}`}
              </span>
              <button
                onClick={onClearSelection}
                className="p-0.5 rounded-md hover:opacity-70 transition-opacity"
                style={{ color: theme.primaryColor }}
                aria-label="Clear selection"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Day-of-week headers ── */}
      <div className="grid grid-cols-7">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[11px] font-semibold py-1 ${
              i === 0 || i === 6
                ? darkMode
                  ? 'text-blue-400'
                  : 'text-blue-400'
                : darkMode
                ? 'text-zinc-500'
                : 'text-zinc-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar days (animated) ── */}
      <div className="relative overflow-hidden flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={format(currentDate, 'yyyy-MM')}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="grid grid-cols-7"
          >
            {calDays.map((date, idx) => {
              const holiday = getHolidayForDate(date.getMonth(), date.getDate());
              return (
                <DayCell
                  key={idx}
                  date={date}
                  currentMonth={currentDate.getMonth()}
                  isToday={isToday(date)}
                  isStart={isStart(date)}
                  isEnd={isEnd(date)}
                  isInRange={isInRange(date)}
                  isRangePreview={isPreview(date)}
                  holiday={holiday}
                  theme={theme}
                  darkMode={darkMode}
                  onClick={() => onDateClick(date)}
                  onHover={() => onDateHover(date)}
                  onLeave={onDateLeave}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom toolbar ── */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onGoToToday}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95`}
          style={{ color: theme.primaryColor, backgroundColor: `${theme.primaryColor}15` }}
        >
          <RotateCcw size={11} />
          Today
        </button>

        <div className={`text-[10px] font-mono ${darkMode ? 'text-zinc-600' : 'text-zinc-300'}`}>
          {format(currentDate, 'MMM yyyy')} · Week {getISOWeek(currentDate)}
        </div>
      </div>
    </div>
  );
}
