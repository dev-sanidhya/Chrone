'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { MONTH_THEMES } from '@/lib/themes';
import type { Note } from '@/lib/types';

interface YearViewProps {
  year: number;
  currentMonth: number;
  notes: Note[];
  darkMode: boolean;
  onSelectMonth: (month: number, year: number) => void;
  onClose: () => void;
}

export default function YearView({ year: initialYear, currentMonth, notes, darkMode, onSelectMonth, onClose }: YearViewProps) {
  const [viewYear, setViewYear] = useState(initialYear);

  const notesCountByMonth = (month: number, yr: number) =>
    notes.filter(n => {
      const d = new Date(n.rangeStart);
      return d.getMonth() === month && d.getFullYear() === yr;
    }).length;

  const bg = darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200';
  const text = darkMode ? 'text-zinc-100' : 'text-zinc-900';
  const sub  = darkMode ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <AnimatePresence>
      <motion.div
        key="year-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.55)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 24 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{    scale: 0.88, opacity: 0, y: 24  }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className={`relative w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden ${bg}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <button
              onClick={() => setViewYear(y => y - 1)}
              className={`p-1.5 rounded-lg hover:opacity-70 transition-opacity ${sub}`}
            >
              <ChevronLeft size={16}/>
            </button>

            <motion.h2
              key={viewYear}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-2xl font-black tracking-tight ${text}`}
            >
              {viewYear}
            </motion.h2>

            <button
              onClick={() => setViewYear(y => y + 1)}
              className={`p-1.5 rounded-lg hover:opacity-70 transition-opacity ${sub}`}
            >
              <ChevronRight size={16}/>
            </button>

            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-1.5 rounded-full hover:opacity-70 transition-opacity ${sub}`}
              aria-label="Close"
            >
              <X size={14}/>
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-4 gap-2 px-4 pb-5">
            {MONTH_THEMES.map((t, i) => {
              const isSelected = i === currentMonth && viewYear === initialYear;
              const nc = notesCountByMonth(i, viewYear);
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { onSelectMonth(i, viewYear); onClose(); }}
                  className="relative flex flex-col items-center gap-1 rounded-xl py-3 px-1 transition-colors overflow-hidden"
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${t.heroGradientFrom}, ${t.heroGradientVia})`
                      : darkMode ? '#27272a' : '#f4f4f5',
                    boxShadow: isSelected ? `0 4px 20px ${t.primaryColor}55` : 'none',
                  }}
                >
                  {/* Season indicator line */}
                  {!isSelected && (
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
                      style={{ backgroundColor: t.primaryColor, opacity: 0.5 }}
                    />
                  )}

                  <span className="text-xl leading-none select-none">{t.emoji}</span>
                  <span
                    className="text-[10px] font-black tracking-wide"
                    style={{ color: isSelected ? 'white' : darkMode ? '#a1a1aa' : '#52525b' }}
                  >
                    {t.name.slice(0, 3).toUpperCase()}
                  </span>

                  {/* Note dot */}
                  {nc > 0 && (
                    <span
                      className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] rounded-full text-[8px] font-bold flex items-center justify-center text-white"
                      style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.4)' : t.primaryColor }}
                    >
                      {nc}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Footer hint */}
          <p className={`text-center text-[10px] pb-3 ${sub}`}>
            Tap a month to jump to it
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
