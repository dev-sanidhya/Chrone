'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, getDaysInMonth } from 'date-fns';
import { LayoutGrid, Moon, Sun } from 'lucide-react';
import type { MonthTheme } from '@/lib/types';
import { getNextHoliday } from '@/lib/holidays';
import { MONTH_ARTIFACTS } from '@/lib/monthArtifacts';
import GalleryPrint from './GalleryPrint';

interface HeroPanelProps {
  theme: MonthTheme;
  currentDate: Date;
  darkMode: boolean;
  monthMemo: string;
  onToggleDarkMode: () => void;
  onOpenYearView: () => void;
}

export default function HeroPanel({
  theme,
  currentDate,
  darkMode,
  monthMemo,
  onToggleDarkMode,
  onOpenYearView,
}: HeroPanelProps) {
  const [time, setTime] = useState('');
  const artifact = MONTH_ARTIFACTS[currentDate.getMonth()];

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      );

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const today = new Date();
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();
  const progressPct = isCurrentMonth
    ? Math.round((today.getDate() / getDaysInMonth(currentDate)) * 100)
    : 0;

  const nextHoliday = getNextHoliday(today);
  const diffDays = nextHoliday
    ? Math.round((nextHoliday.date.getTime() - today.getTime()) / 86400000)
    : null;
  const showHoliday = diffDays !== null && diffDays >= 0 && diffDays <= 14 && nextHoliday;

  return (
    <section
      className={`relative flex-shrink-0 overflow-hidden px-3 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4 ${
        darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-[#efe7db] text-zinc-900'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: darkMode
            ? `radial-gradient(circle at top left, ${theme.primaryColor}18, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 34%)`
            : `radial-gradient(circle at top left, ${theme.primaryColor}18, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.4), transparent 26%)`,
        }}
      />

      <div className="relative mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/70 text-base shadow-[0_4px_10px_rgba(15,23,42,0.1)]">
            {theme.emoji}
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.32em] text-zinc-500">Gallery Calendar</p>
            <p className={`text-[11px] ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{time}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenYearView}
            className={`rounded-full border px-2.5 py-2 transition-transform hover:scale-[1.04] active:scale-[0.98] sm:px-3 ${
              darkMode
                ? 'border-zinc-800 bg-zinc-900 text-zinc-200'
                : 'border-black/10 bg-white/70 text-zinc-700'
            }`}
            aria-label="Year overview"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={onToggleDarkMode}
            className={`rounded-full border px-2.5 py-2 transition-transform hover:scale-[1.04] active:scale-[0.98] sm:px-3 ${
              darkMode
                ? 'border-zinc-800 bg-zinc-900 text-yellow-300'
                : 'border-black/10 bg-white/70 text-zinc-700'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* ── Full-width illustration ── */}
      <GalleryPrint theme={theme} currentDate={currentDate} artifact={artifact} />

      {/* ── Compact info strip: month name | memo | holiday + progress ── */}
      <div className="mt-2.5 flex items-start justify-between gap-3">
        {/* Left: month + year + memory prompt */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h1 className={`text-[1.45rem] font-black uppercase leading-none ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              {format(currentDate, 'MMMM')}
            </h1>
            <span className={`text-xs font-semibold ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {format(currentDate, 'yyyy')}
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-white flex-shrink-0"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {artifact.label}
            </span>
          </div>
          <p
            className={`mt-0.5 text-[10px] leading-snug line-clamp-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {monthMemo.trim() ? `"${monthMemo}"` : artifact.memoryPrompt}
          </p>
        </div>

        {/* Right: holiday countdown + progress */}
        <div className="flex-shrink-0 text-right flex flex-col items-end gap-1">
          {showHoliday && nextHoliday && (
            <p className={`text-[10px] font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {nextHoliday.emoji} {diffDays === 0 ? 'Today!' : `${diffDays}d`}
            </p>
          )}
          {isCurrentMonth && (
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{progressPct}%</span>
              <div className="w-20 h-1 overflow-hidden rounded-full bg-black/8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative mt-2 h-2">
        <div className="absolute inset-x-0 top-0.5 border-t border-dashed border-black/12" />
      </div>
    </section>
  );
}
