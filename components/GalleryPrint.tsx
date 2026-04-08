'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { MonthTheme } from '@/lib/types';
import type { MonthArtifact } from '@/lib/monthArtifacts';
import { SEASON_BACKDROPS } from '@/lib/monthArtifacts';
import SeasonScene from './SeasonScene';

interface GalleryPrintProps {
  theme: MonthTheme;
  currentDate: Date;
  artifact: MonthArtifact;
}

export default function GalleryPrint({ theme, currentDate, artifact }: GalleryPrintProps) {
  return (
    <div className="relative" style={{ height: 172 }}>
      <div className="absolute -left-1 top-2 h-8 w-6 rotate-[-8deg] rounded-sm bg-stone-100/90 shadow-[0_8px_14px_rgba(0,0,0,0.12)]" />
      <div className="absolute right-3 top-0 h-7 w-12 rotate-[6deg] rounded-sm bg-stone-100/75 shadow-[0_8px_14px_rgba(0,0,0,0.1)]" />

      <motion.div
        initial={{ opacity: 0, y: 14, rotate: -0.9 }}
        animate={{ opacity: 1, y: 0, rotate: -0.9 }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        className="relative h-full rounded-[1.2rem] bg-[#f6efe4] p-2 shadow-[0_18px_36px_rgba(15,23,42,0.18)]"
      >
        <div className="flex h-full flex-col rounded-[1rem] border border-black/10 bg-[#fffdfa] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div
            className="relative flex-1 overflow-hidden rounded-[1rem] border border-black/8 sm:rounded-[1.2rem]"
            style={{
              backgroundColor: SEASON_BACKDROPS[theme.season],
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.35)',
            }}
          >
            <div className="absolute inset-2.5 rounded-[0.8rem] bg-white/60 sm:inset-3 sm:rounded-[1rem]" />
            <div
              className="absolute inset-4 overflow-hidden rounded-[0.8rem] sm:inset-5 sm:rounded-[0.95rem]"
              style={{
                background: `linear-gradient(180deg, ${theme.heroGradientFrom}, ${theme.heroGradientVia})`,
              }}
            >
              <SeasonScene
                season={theme.season}
                month={theme.month}
                primaryColor={theme.primaryColor}
                fit="contain"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0) 32%, rgba(0,0,0,0.08) 100%)',
                }}
              />
            </div>

            <div className="absolute left-4 top-4 rounded-full border border-white/35 bg-black/18 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm sm:left-6 sm:top-6 sm:px-3 sm:text-[10px] sm:tracking-[0.26em]">
              {artifact.label}
            </div>

            <div className="absolute right-4 top-4 rounded-full bg-white/18 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:right-6 sm:top-6 sm:px-3 sm:text-[10px] sm:tracking-[0.24em]">
              {format(currentDate, 'MMM yyyy')}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-2 border-t border-dashed border-stone-300 px-1 pb-1 pt-2 text-stone-700">
            <div className="min-w-0">
              <p className="text-[8px] uppercase tracking-[0.24em] text-stone-400">{artifact.location}</p>
              <h2 className="mt-0.5 text-[0.95rem] font-black uppercase leading-tight text-stone-900 truncate">
                {artifact.title}
              </h2>
              <p className="mt-0.5 text-[10px] italic leading-snug text-stone-500 line-clamp-1" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                {artifact.caption}
              </p>
            </div>
            <div className="flex-shrink-0 rounded-xl bg-stone-100 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.14em] text-stone-400">
              Print
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
