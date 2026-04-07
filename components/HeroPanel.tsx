'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, getDaysInMonth } from 'date-fns';
import { Moon, Sun } from 'lucide-react';
import type { MonthTheme } from '@/lib/types';
import { getNextHoliday } from '@/lib/holidays';
import Particles from './Particles';
import SeasonScene from './SeasonScene';

interface HeroPanelProps {
  theme: MonthTheme;
  currentDate: Date;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function HeroPanel({ theme, currentDate, darkMode, onToggleDarkMode }: HeroPanelProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const today = new Date();
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();
  const daysInMonth = getDaysInMonth(currentDate);
  const progressPct = isCurrentMonth ? Math.round((today.getDate() / daysInMonth) * 100) : 0;

  const nextHoliday = getNextHoliday(today);
  const monthName = format(currentDate, 'MMMM').toUpperCase();
  const year = format(currentDate, 'yyyy');

  return (
    /* Hero area — same aspect ratio as reference (~5:3) */
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '5/3' }}>
      {/* ── Seasonal SVG illustration ── */}
      <SeasonScene season={theme.season} month={theme.month} primaryColor={theme.primaryColor} />

      {/* ── Floating particles overlay ── */}
      <div className="absolute inset-0 pointer-events-none">
        <Particles type={theme.particles} />
      </div>

      {/* ── Top controls bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-3 z-20">
        {/* Live clock */}
        <span className="text-[10px] font-mono text-white/60 tabular-nums tracking-widest bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm">
          {time}
        </span>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.3)' }}
          aria-label="Toggle dark mode"
        >
          {darkMode
            ? <Sun  size={14} className="text-yellow-300" />
            : <Moon size={14} className="text-white"      />}
        </button>
      </div>

      {/* ── Diagonal overlay — DARK band (reference aesthetic) ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ clipPath: 'polygon(0 58%, 100% 40%, 100% 100%, 0 100%)' }}
        aria-hidden
      >
        {/* Dark gradient band */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(4,8,22,0.88) 30%, rgba(4,8,22,0.94))' }} />
      </div>

      {/* ── Diagonal accent color triangle (bottom-left) ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ clipPath: 'polygon(0 72%, 42% 100%, 0 100%)' }}
        aria-hidden
      >
        <div className="absolute inset-0" style={{ backgroundColor: theme.primaryColor }} />
      </div>

      {/* ── Month / Year text on dark band ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme.name}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-5 right-5 z-20 text-right text-white"
        >
          <p className="text-sm font-light opacity-75 tracking-[0.2em]">{year}</p>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-widest leading-none"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
          >
            {monthName}
          </h1>
        </motion.div>
      </AnimatePresence>

      {/* ── Progress bar (month elapsed) ── */}
      {isCurrentMonth && (
        <div className="absolute bottom-2 left-0 right-0 z-20 px-4">
          <div className="w-full h-[2px] rounded-full bg-white/15 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
          </div>
        </div>
      )}

      {/* ── Holiday pill (top-left, if upcoming) ── */}
      {nextHoliday && (() => {
        const diff = Math.round((nextHoliday.date.getTime() - today.getTime()) / 86400000);
        if (diff > 20 || diff < 0) return null;
        return (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-10 left-4 z-20"
          >
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white"
              style={{ background: `${theme.primaryColor}cc`, backdropFilter: 'blur(8px)' }}
            >
              {nextHoliday.emoji} {nextHoliday.name} in {diff}d
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
}
