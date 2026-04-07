'use client';

import { format } from 'date-fns';
import type { MonthTheme, Holiday } from '@/lib/types';
import { getMoonPhase } from '@/lib/utils';

interface DayCellProps {
  date: Date;
  currentMonth: number;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isRangePreview: boolean;
  holiday?: Holiday;
  theme: MonthTheme;
  darkMode: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
}

export default function DayCell({
  date,
  currentMonth,
  isToday,
  isStart,
  isEnd,
  isInRange,
  isRangePreview,
  holiday,
  theme,
  darkMode,
  onClick,
  onHover,
  onLeave,
}: DayCellProps) {
  const isCurrentMonth = date.getMonth() === currentMonth;
  const day = format(date, 'd');
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isEdge = isStart || isEnd;
  const hasRange = isInRange || isRangePreview;

  // Moon phase — only show significant ones
  const moon = getMoonPhase(date);

  // Connector halves for range highlight
  const leftConn  = (hasRange || isEnd)   && !isStart;
  const rightConn = (hasRange || isStart) && !isEnd;
  const connBg = isRangePreview ? `${theme.primaryColor}15` : `${theme.primaryColor}22`;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: 36 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {leftConn  && <div className="absolute left-0  top-1/2 -translate-y-1/2 w-1/2 h-7 pointer-events-none" style={{ backgroundColor: connBg }}/>}
      {rightConn && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-7 pointer-events-none" style={{ backgroundColor: connBg }}/>}

      <button
        onClick={onClick}
        title={[
          format(date, 'EEEE, MMMM d'),
          holiday ? `${holiday.emoji} ${holiday.name}` : '',
          moon.show ? moon.name : '',
        ].filter(Boolean).join(' · ')}
        className={[
          'relative z-10 flex flex-col items-center justify-center',
          'w-8 h-8 rounded-full text-[11px] transition-all duration-150',
          'hover:scale-110 active:scale-95 focus:outline-none select-none',
          !isEdge && !hasRange && !isToday
            ? darkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'
            : '',
        ].join(' ')}
        style={{
          backgroundColor: isEdge ? theme.primaryColor : undefined,
          boxShadow: isEdge
            ? `0 2px 10px ${theme.primaryColor}55`
            : isToday
            ? `0 0 0 1.5px ${theme.primaryColor}`
            : undefined,
          color: isEdge
            ? 'white'
            : !isCurrentMonth
            ? darkMode ? '#52525b' : '#d4d4d8'
            : isWeekend
            ? darkMode ? '#93c5fd' : '#3b82f6'
            : darkMode ? '#e4e4e7' : '#27272a',
          fontWeight: isToday || isEdge ? 700 : 400,
        }}
      >
        <span className="leading-none">{day}</span>

        {/* Indicators row */}
        <span className="flex items-center gap-[1px] leading-none" style={{ fontSize: '6px', marginTop: '1px', height: '7px' }}>
          {holiday && <span role="img" aria-label={holiday.name} style={{ fontSize: '6px' }}>{holiday.emoji}</span>}
          {moon.show && isCurrentMonth && (
            <span role="img" aria-label={moon.name} style={{ fontSize: '6px' }}>{moon.emoji}</span>
          )}
        </span>

        {/* Today dot */}
        {isToday && !isEdge && (
          <span
            className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full"
            style={{ backgroundColor: theme.primaryColor }}
          />
        )}
      </button>
    </div>
  );
}
