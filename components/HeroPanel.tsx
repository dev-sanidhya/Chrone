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

      <div className="relative mb-2 flex items-center justify-between gap-2 sm:mb-3 sm:gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-lg shadow-[0_8px_16px_rgba(15,23,42,0.12)] sm:h-12 sm:w-12 sm:text-xl">
            {theme.emoji}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.36em] text-zinc-500">
              Gallery Calendar
            </p>
            <p className={`text-[13px] sm:text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{time}</p>
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

      <div className="grid items-start gap-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)] sm:gap-4">
        <GalleryPrint theme={theme} currentDate={currentDate} artifact={artifact} />

        <motion.aside
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.06 }}
          className={`flex flex-col rounded-[1.4rem] border p-3 shadow-[0_16px_32px_rgba(15,23,42,0.12)] sm:rounded-[1.8rem] sm:p-4 ${
            darkMode ? 'border-zinc-800 bg-zinc-900/92' : 'border-black/10 bg-white/76'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-zinc-500">
                Monthly Edition
              </p>
              <h1 className="mt-1.5 text-[1.9rem] font-black uppercase leading-none sm:text-[2.4rem]">
                {format(currentDate, 'MMMM')}
              </h1>
              <p className="mt-1 text-[12px] text-zinc-500">{format(currentDate, 'yyyy')}</p>
            </div>
            <div
              className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white sm:px-3 sm:text-[10px] sm:tracking-[0.26em]"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {artifact.label}
            </div>
          </div>

          <p
            className={`mt-2 text-[13px] leading-snug sm:text-sm ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {artifact.memoryPrompt}
          </p>

          <div
            className={`mt-2 rounded-xl border px-3 py-2 sm:mt-3 ${
              darkMode ? 'border-zinc-800 bg-zinc-950' : 'border-black/10 bg-[#faf7f1]'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">
              Month Memo
            </p>
            <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {monthMemo.trim()
                ? monthMemo
                : 'The memo rail below stays visible all month as your handwritten margin.'}
            </p>
          </div>

          <div
            className={`mt-2 rounded-xl border px-3 py-2 ${
              darkMode ? 'border-zinc-800 bg-zinc-950' : 'border-black/10 bg-[#faf7f1]'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">
              Next Marker
            </p>
            <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {showHoliday && nextHoliday
                ? `${nextHoliday.emoji} ${nextHoliday.name}${diffDays === 0 ? ' is today.' : ` lands in ${diffDays} days.`}`
                : 'No nearby holiday marker. The month stays open for your own plans and saved memories.'}
            </p>
          </div>

          <div className="mt-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-black/8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                `${format(currentDate, 'MMMM')} print`,
                'tear-off page flip',
                'month memo',
                'selection memory',
              ].map((label) => (
                <span
                  key={label}
                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${
                    darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-stone-100 text-zinc-600'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>

      <div className="relative mt-2 h-3">
        <div className="absolute inset-x-0 top-1 border-t border-dashed border-black/15" />
      </div>
    </section>
  );
}
