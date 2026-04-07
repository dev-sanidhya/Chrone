'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, getDaysInMonth, differenceInDays } from 'date-fns';
import { Moon, Sun, Calendar } from 'lucide-react';
import type { MonthTheme } from '@/lib/types';
import { getNextHoliday } from '@/lib/holidays';
import Particles from './Particles';

interface HeroPanelProps {
  theme: MonthTheme;
  currentDate: Date;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function HeroPanel({ theme, currentDate, darkMode, onToggleDarkMode }: HeroPanelProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const today = new Date();
  const daysInMonth = getDaysInMonth(currentDate);
  const dayOfMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
    ? today.getDate()
    : 0;
  const progressPct = dayOfMonth > 0 ? Math.round((dayOfMonth / daysInMonth) * 100) : 0;

  const nextHoliday = getNextHoliday(today);
  const daysUntil = nextHoliday ? differenceInDays(nextHoliday.date, today) : null;

  return (
    <div
      className="relative w-full lg:w-[340px] xl:w-[380px] min-h-[260px] lg:min-h-full overflow-hidden flex-shrink-0"
      style={{
        background: `linear-gradient(150deg, ${theme.heroGradientFrom} 0%, ${theme.heroGradientVia} 55%, ${theme.heroGradientTo} 100%)`,
      }}
    >
      {/* Animated particles */}
      <Particles type={theme.particles} />

      {/* Radial glow orbs */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.primaryColor}, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.accentColor}, transparent 70%)` }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-7 text-white">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <div className="text-xs font-mono opacity-60 tabular-nums tracking-wider">{time}</div>
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.15)' }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* Big emoji */}
        <AnimatePresence mode="wait">
          <motion.div
            key={theme.emoji + theme.name}
            initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0, rotate: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="text-6xl xl:text-7xl mb-4 select-none"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
          >
            {theme.emoji}
          </motion.div>
        </AnimatePresence>

        {/* Month name */}
        <AnimatePresence mode="wait">
          <motion.div
            key={theme.name}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-none uppercase">
              {theme.name}
            </h1>
            <p className="text-xl xl:text-2xl font-light opacity-70 mt-0.5">
              {format(currentDate, 'yyyy')}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Coloured divider */}
        <motion.div
          key={theme.primaryColor}
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="h-1 rounded-full mt-4 mb-5"
          style={{ backgroundColor: theme.primaryColor, width: 64 }}
        />

        {/* Progress bar (days elapsed this month) */}
        {dayOfMonth > 0 && (
          <div className="mb-5">
            <div className="flex justify-between text-[10px] opacity-60 mb-1.5">
              <span>Day {dayOfMonth}</span>
              <span>{daysInMonth - dayOfMonth} days left</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
            </div>
          </div>
        )}

        {/* Quote */}
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={theme.quote}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[11px] xl:text-xs opacity-75 italic leading-relaxed"
          >
            &ldquo;{theme.quote}&rdquo;
            <footer className="mt-1.5 text-[10px] opacity-60 not-italic">
              — {theme.author}
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        {/* Next holiday pill */}
        {nextHoliday && daysUntil !== null && daysUntil <= 30 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-auto pt-4 flex items-center gap-2"
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            >
              <Calendar size={10} />
              <span>
                {nextHoliday.emoji} {nextHoliday.name} in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
