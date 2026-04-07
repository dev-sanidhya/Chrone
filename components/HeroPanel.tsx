'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, getDaysInMonth } from 'date-fns';
import { Moon, Sun, LayoutGrid, RefreshCw } from 'lucide-react';
import type { MonthTheme } from '@/lib/types';
import { getNextHoliday } from '@/lib/holidays';
import Particles from './Particles';
import SeasonScene from './SeasonScene';

/* ─── Mock weather per month ─────────────────────────────── */
const WEATHER: Record<number, { temp: string; feel: string; icon: string }> = {
  0:  { temp: '34°F', feel: 'Freezing',   icon: '🌨️' },
  1:  { temp: '38°F', feel: 'Cold',        icon: '☁️'  },
  2:  { temp: '52°F', feel: 'Breezy',      icon: '🌬️' },
  3:  { temp: '62°F', feel: 'Mild',        icon: '⛅'  },
  4:  { temp: '72°F', feel: 'Pleasant',    icon: '🌤️' },
  5:  { temp: '80°F', feel: 'Warm',        icon: '☀️'  },
  6:  { temp: '88°F', feel: 'Hot',         icon: '🌡️' },
  7:  { temp: '86°F', feel: 'Sunny',       icon: '☀️'  },
  8:  { temp: '74°F', feel: 'Crisp',       icon: '🍂'  },
  9:  { temp: '60°F', feel: 'Spooky',      icon: '🎃'  },
  10: { temp: '46°F', feel: 'Foggy',       icon: '🌫️' },
  11: { temp: '34°F', feel: 'Festive',     icon: '❄️'  },
};

/* ─── Multiple quotes per month ──────────────────────────── */
const QUOTES: Record<number, { text: string; author: string }[]> = {
  0:  [
    { text: 'In the depth of winter, I finally learned that there was in me an invincible summer.', author: 'Albert Camus' },
    { text: 'January — the month of new beginnings, clean slates, and fresh starts.', author: 'Unknown' },
    { text: 'Snow was falling, so much like stars filling the dark trees.', author: 'Wendell Berry' },
  ],
  1:  [
    { text: 'The best and most beautiful things cannot be seen or touched — they must be felt with the heart.', author: 'Helen Keller' },
    { text: 'Love is not something you find. Love is something that finds you.', author: 'Loretta Young' },
  ],
  2:  [
    { text: 'No winter lasts forever; no spring skips its turn.', author: 'Hal Borland' },
    { text: 'In every walk with nature, one receives far more than he seeks.', author: 'John Muir' },
  ],
  3:  [
    { text: 'April hath put a spirit of youth in everything.', author: 'William Shakespeare' },
    { text: 'Spring is nature\'s way of saying "Let\'s party!"', author: 'Robin Williams' },
  ],
  4:  [
    { text: 'May holds promise gently in its petals, the sweetest month of all.', author: 'Unknown' },
    { text: 'Bloom where you are planted.', author: 'Mary Englebreit' },
  ],
  5:  [
    { text: 'What is one to say about June, the time of perfect young summer.', author: 'Gertrude Jekyll' },
    { text: 'In June, as many as a dozen species may burst their buds on a single day.', author: 'Hal Borland' },
  ],
  6:  [
    { text: 'July is the heart of summer — full of warmth, light, and the freedom of endless blue skies.', author: 'Unknown' },
    { text: 'Hot July brings cooling showers, apricots and gillyflowers.', author: 'Sara Coleridge' },
  ],
  7:  [
    { text: 'Ah, summer, what power you have to make us suffer and like it.', author: 'Russell Baker' },
    { text: 'August rain: the best of the summer gone, and the new fall not yet born.', author: 'Sylvia Plath' },
  ],
  8:  [
    { text: 'September is the most beautiful of words — the most musical, the most meaningful.', author: 'Cornell Woolrich' },
    { text: 'Every leaf speaks bliss to me, fluttering from the autumn tree.', author: 'Emily Brontë' },
  ],
  9:  [
    { text: 'October is the month for dreaming.', author: 'Richelle Goodrich' },
    { text: 'Autumn is a second spring when every leaf is a flower.', author: 'Albert Camus' },
  ],
  10: [
    { text: 'November always seems to me the Norway of the year.', author: 'Emily Dickinson' },
    { text: 'I\'m so glad I live in a world where there are Octobers.', author: 'L.M. Montgomery' },
  ],
  11: [
    { text: "December's wintery breath is already clouding the pond, frosting the pane, obscuring summer's memory.", author: 'John Geddes' },
    { text: 'At Christmas, all roads lead home.', author: 'Marjorie Holmes' },
  ],
};

interface HeroPanelProps {
  theme: MonthTheme;
  currentDate: Date;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenYearView: () => void;
}

export default function HeroPanel({ theme, currentDate, darkMode, onToggleDarkMode, onOpenYearView }: HeroPanelProps) {
  const [time,      setTime]      = useState('');
  const [quoteIdx,  setQuoteIdx]  = useState(0);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Reset quote index when month changes
  useEffect(() => { setQuoteIdx(0); }, [currentDate.getMonth()]);

  const cycleQuote = useCallback(() => {
    const quotes = QUOTES[currentDate.getMonth()] ?? [];
    setQuoteIdx(i => (i + 1) % quotes.length);
  }, [currentDate]);

  const today = new Date();
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();
  const daysInMonth = getDaysInMonth(currentDate);
  const progressPct = isCurrentMonth ? Math.round((today.getDate() / daysInMonth) * 100) : 0;

  const quotes = QUOTES[currentDate.getMonth()] ?? [];
  const quote  = quotes[quoteIdx] ?? quotes[0];

  const nextHoliday = getNextHoliday(today);
  const diffDays = nextHoliday
    ? Math.round((nextHoliday.date.getTime() - today.getTime()) / 86400000)
    : null;
  const showHoliday = diffDays !== null && diffDays >= 0 && diffDays <= 14;

  const weather = WEATHER[currentDate.getMonth()];

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '5/3' }}>
      {/* SVG seasonal illustration */}
      <SeasonScene season={theme.season} month={theme.month} primaryColor={theme.primaryColor} />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <Particles type={theme.particles} />
      </div>

      {/* ── Top controls ── */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-3 z-20">
        <span className="text-[10px] font-mono text-white/60 tabular-nums tracking-wider bg-black/25 px-2 py-1 rounded-lg backdrop-blur-sm">
          {time}
        </span>

        <div className="flex items-center gap-2">
          {/* Year-view button */}
          <button
            onClick={onOpenYearView}
            className="p-1.5 rounded-full backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
            style={{ background: 'rgba(0,0,0,0.28)' }}
            aria-label="Year overview"
          >
            <LayoutGrid size={13} className="text-white" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-full backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
            style={{ background: 'rgba(0,0,0,0.28)' }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={13} className="text-yellow-300" /> : <Moon size={13} className="text-white" />}
          </button>
        </div>
      </div>

      {/* ── Diagonal dark band ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ clipPath: 'polygon(0 58%, 100% 40%, 100% 100%, 0 100%)' }}
        aria-hidden
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(4,8,22,0.88) 30%, rgba(4,8,22,0.95))' }} />
      </div>

      {/* ── Accent triangle (bottom-left) ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ clipPath: 'polygon(0 72%, 42% 100%, 0 100%)' }}
        aria-hidden
      >
        <div className="absolute inset-0" style={{ backgroundColor: theme.primaryColor }} />
      </div>

      {/* ── Weather badge ── */}
      <div className="absolute bottom-12 left-4 z-20 flex items-center gap-1.5">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
        >
          <span>{weather.icon}</span>
          <span>{weather.temp}</span>
          <span className="opacity-60">·</span>
          <span className="opacity-80">{weather.feel}</span>
        </div>
      </div>

      {/* ── Month / Year text ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme.name}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-5 right-5 z-20 text-right text-white"
        >
          <p className="text-xs font-light opacity-70 tracking-[0.22em]">{format(currentDate, 'yyyy')}</p>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-widest leading-none"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}
          >
            {format(currentDate, 'MMMM').toUpperCase()}
          </h1>
        </motion.div>
      </AnimatePresence>

      {/* ── Holiday pill ── */}
      {showHoliday && nextHoliday && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-5 left-4 z-20"
        >
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white"
            style={{ background: `${theme.primaryColor}cc`, backdropFilter: 'blur(8px)' }}
          >
            {nextHoliday.emoji} {nextHoliday.name}{diffDays === 0 ? ' Today!' : ` in ${diffDays}d`}
          </div>
        </motion.div>
      )}

      {/* ── Month progress bar ── */}
      {isCurrentMonth && (
        <div className="absolute bottom-1.5 left-0 right-0 z-20 px-4">
          <div className="w-full h-[2px] rounded-full bg-white/15 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
          </div>
        </div>
      )}

      {/* ── Quote strip (below diagonal, inside bottom of hero) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${theme.name}-${quoteIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-[28px] left-[48%] right-5 z-20 hidden sm:flex items-center gap-1.5"
        >
          <p
            className="text-[9px] text-white/60 italic leading-tight line-clamp-2"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            &ldquo;{quote.text}&rdquo;
          </p>
          {quotes.length > 1 && (
            <button
              onClick={cycleQuote}
              className="flex-shrink-0 p-0.5 rounded text-white/40 hover:text-white/80 transition-colors"
              aria-label="Next quote"
            >
              <RefreshCw size={8} />
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
