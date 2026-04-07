'use client';

import { format } from 'date-fns';
import type { MonthTheme, Holiday } from '@/lib/types';

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

  // Range connector background (runs full-width behind the circle)
  const showLeftConnector = (isInRange || isRangePreview || isEnd) && !isStart;
  const showRightConnector = (isInRange || isRangePreview || isStart) && !isEnd;

  const connectorBg = isRangePreview
    ? `${theme.primaryColor}18`
    : `${theme.primaryColor}28`;

  const circleBg = isEdge
    ? theme.primaryColor
    : isToday
    ? 'transparent'
    : 'transparent';

  const textClass = isEdge
    ? 'text-white font-bold'
    : !isCurrentMonth
    ? darkMode ? 'text-zinc-700' : 'text-zinc-300'
    : isWeekend
    ? darkMode ? 'text-blue-400' : 'text-blue-500'
    : darkMode
    ? 'text-zinc-200'
    : 'text-zinc-700';

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: 40 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Left connector half */}
      {showLeftConnector && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-7 pointer-events-none"
          style={{ backgroundColor: connectorBg }}
        />
      )}
      {/* Right connector half */}
      {showRightConnector && (
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-7 pointer-events-none"
          style={{ backgroundColor: connectorBg }}
        />
      )}

      <button
        onClick={onClick}
        title={holiday ? `${holiday.emoji} ${holiday.name}` : format(date, 'EEEE, MMMM d')}
        className={[
          'relative z-10 flex flex-col items-center justify-center',
          'w-9 h-9 rounded-full text-sm transition-all duration-150',
          'hover:scale-110 active:scale-95 focus:outline-none',
          !isEdge && !hasRange && !isToday
            ? darkMode
              ? 'hover:bg-zinc-700'
              : 'hover:bg-zinc-100'
            : '',
          textClass,
        ].join(' ')}
        style={{
          backgroundColor: circleBg || undefined,
          boxShadow: isEdge
            ? `0 2px 12px ${theme.primaryColor}60`
            : isToday
            ? `0 0 0 2px ${theme.primaryColor}`
            : undefined,
        }}
      >
        <span className="leading-none">{day}</span>

        {/* Holiday dot */}
        {holiday && (
          <span
            className="text-[7px] leading-none mt-[1px] select-none"
            role="img"
            aria-label={holiday.name}
          >
            {holiday.emoji}
          </span>
        )}

        {/* Today pulse dot */}
        {isToday && !isEdge && (
          <span
            className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
            style={{ backgroundColor: theme.primaryColor }}
          />
        )}
      </button>
    </div>
  );
}
