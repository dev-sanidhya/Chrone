'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isToday, startOfWeek, endOfWeek, getISOWeek, getDaysInMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react';
import type { DateRange, MonthTheme } from '@/lib/types';
import { getHolidayForDate, getHolidaysForMonth } from '@/lib/holidays';
import DayCell from './DayCell';

const DAYS = ['S','M','T','W','T','F','S'];

interface CalendarGridProps {
  currentDate: Date;
  selectedRange: DateRange;
  hoverDate: Date | null;
  theme: MonthTheme;
  direction: number;
  selectionStep: 'start' | 'end';
  darkMode: boolean;
  events: Record<string, string>;
  isMobile?: boolean;
  onDateClick: (d: Date) => void;
  onDateHover: (d: Date) => void;
  onDateLeave: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onClearSelection: () => void;
  onOpenStickerPicker: (dateKey: string) => void;
}

export default function CalendarGrid({
  currentDate, selectedRange, hoverDate, theme,
  direction, selectionStep, darkMode, events, isMobile,
  onDateClick, onDateHover, onDateLeave,
  onPrevMonth, onNextMonth, onGoToToday, onClearSelection,
  onOpenStickerPicker,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd   = endOfMonth(currentDate);
  const calDays    = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });

  // Effective range with hover preview
  const pStart = selectionStep === 'end' && hoverDate && selectedRange.start
    ? (hoverDate < selectedRange.start ? hoverDate : selectedRange.start)
    : selectedRange.start;
  const pEnd = selectionStep === 'end' && hoverDate && selectedRange.start
    ? (hoverDate >= selectedRange.start ? hoverDate : selectedRange.start)
    : selectedRange.end;

  const isStart   = (d: Date) => !!pStart && isSameDay(d, pStart);
  const isEnd     = (d: Date) => !!pEnd   && isSameDay(d, pEnd);
  const isInRange = (d: Date) => !!pStart && !!pEnd && d > pStart && d < pEnd;
  const isPreview = (d: Date) =>
    selectionStep === 'end' && !!hoverDate && !!selectedRange.start &&
    !selectedRange.end && d > selectedRange.start && d < hoverDate;

  const daysSelected = selectedRange.start && selectedRange.end
    ? Math.round((selectedRange.end.getTime() - selectedRange.start.getTime()) / 86400000) + 1
    : null;

  const totalDays   = getDaysInMonth(currentDate);
  const weekendDays = calDays.filter(d =>
    d.getMonth() === currentDate.getMonth() && (d.getDay() === 0 || d.getDay() === 6)
  ).length;
  const holidays = getHolidaysForMonth(currentDate.getMonth()).length;

  const dimText  = darkMode ? 'text-zinc-500' : 'text-zinc-400';
  const baseText = darkMode ? 'text-zinc-100' : 'text-zinc-800';
  const hoverBg  = darkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100';

  return (
    <div className={`relative flex flex-col flex-1 overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
      <div className={`flex flex-col gap-2 flex-1 ${isMobile ? 'p-4' : 'p-3'}`}>

        {/* ── Month navigation ── */}
        <div className="flex items-center justify-between">
          <button onClick={onPrevMonth}
            className={`p-2 rounded-xl ${hoverBg} transition-all hover:scale-105 active:scale-95 touch-manipulation ${dimText}`}
            aria-label="Previous month">
            <ChevronLeft size={isMobile ? 18 : 16}/>
          </button>

          <div className="text-center flex-1">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.p
                key={format(currentDate, 'yyyy-MM')}
                custom={direction}
                variants={{
                  enter: (d:number) => ({ y: d>0?10:-10, opacity:0 }),
                  center: { y:0, opacity:1 },
                  exit:  (d:number) => ({ y: d<0?10:-10, opacity:0 }),
                }}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.18 }}
                className={`${isMobile ? 'text-base' : 'text-sm'} font-bold ${baseText}`}
              >
                {format(currentDate, 'MMMM yyyy')}
              </motion.p>
            </AnimatePresence>
            <p className={`text-[9px] ${dimText}`}>
              {selectionStep === 'end' ? '→ pick end date' :
               selectionStep === 'start' && !selectedRange.start ? 'Tap a date to begin' : ''}
            </p>
          </div>

          <button onClick={onNextMonth}
            className={`p-2 rounded-xl ${hoverBg} transition-all hover:scale-105 active:scale-95 touch-manipulation ${dimText}`}
            aria-label="Next month">
            <ChevronRight size={isMobile ? 18 : 16}/>
          </button>
        </div>

        {/* ── Month stats ── */}
        <div className={`flex items-center gap-2 ${isMobile ? 'text-[11px]' : 'text-[10px]'} font-medium ${dimText}`}>
          <span>{totalDays} days</span>
          <span className="opacity-40">·</span>
          <span>{weekendDays} weekend</span>
          {holidays > 0 && <>
            <span className="opacity-40">·</span>
            <span>{holidays} holiday{holidays!==1?'s':''}</span>
          </>}
        </div>

        {/* ── Selection pill ── */}
        <AnimatePresence>
          {selectedRange.start && (
            <motion.div
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }}
              className="overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-3 py-2 rounded-xl text-[10px]"
                style={{ backgroundColor: `${theme.primaryColor}18` }}
              >
                <span className="font-semibold" style={{ color: theme.primaryColor }}>
                  {daysSelected
                    ? `${daysSelected} day${daysSelected!==1?'s':''} · ${format(selectedRange.start,'MMM d')} → ${format(selectedRange.end!,'MMM d, yyyy')}`
                    : `From ${format(selectedRange.start,'MMM d, yyyy')}`}
                </span>
                <button onClick={onClearSelection} style={{ color: theme.primaryColor }} aria-label="Clear selection">
                  <X size={11}/>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Day-of-week headers ── */}
        <div className="grid grid-cols-7">
          {DAYS.map((d, i) => (
            <div key={i} className={`text-center ${isMobile ? 'text-[11px]' : 'text-[10px]'} font-bold py-0.5 ${i===0||i===6 ? 'text-blue-400' : dimText}`}>
              {d}
            </div>
          ))}
        </div>

        {/* ── Date grid ── */}
        <div className="relative flex-1">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={format(currentDate, 'yyyy-MM')}
              custom={direction}
              variants={{
                enter: (d:number) => ({ x: d>0?220:-220, opacity:0 }),
                center: { x:0, opacity:1 },
                exit:  (d:number) => ({ x: d<0?220:-220, opacity:0 }),
              }}
              initial="enter" animate="center" exit="exit"
              transition={{ type:'spring', stiffness:340, damping:34 }}
              className="grid grid-cols-7"
            >
              {calDays.map((date, idx) => {
                const holiday  = getHolidayForDate(date.getMonth(), date.getDate());
                const dateKey  = format(date, 'yyyy-MM-dd');
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
                    sticker={events[dateKey]}
                    theme={theme}
                    darkMode={darkMode}
                    onClick={() => onDateClick(date)}
                    onDoubleClick={() => onOpenStickerPicker(dateKey)}
                    onHover={() => onDateHover(date)}
                    onLeave={onDateLeave}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onGoToToday}
            className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 touch-manipulation"
            style={{ color: theme.primaryColor, backgroundColor: `${theme.primaryColor}15` }}
          >
            <RotateCcw size={10}/> Today
          </button>
          <span className={`text-[9px] font-mono ${dimText}`}>
            Wk {getISOWeek(currentDate)}
          </span>
        </div>

        {/* ── Double-tap hint ── */}
        <p className={`text-center text-[8px] ${dimText} mt-0`}>
          Double-tap a date to add a sticker
        </p>
      </div>
    </div>
  );
}
