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
    <div className="relative h-full">
      <div className="absolute -left-1 top-3 h-14 w-10 rotate-[-8deg] rounded-sm bg-stone-100/90 shadow-[0_12px_22px_rgba(0,0,0,0.14)]" />
      <div className="absolute right-7 top-0 h-12 w-20 rotate-[6deg] rounded-sm bg-stone-100/75 shadow-[0_12px_22px_rgba(0,0,0,0.12)]" />

      <motion.div
        initial={{ opacity: 0, y: 14, rotate: -0.9 }}
        animate={{ opacity: 1, y: 0, rotate: -0.9 }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        className="relative h-full rounded-[2rem] bg-[#f6efe4] p-4 shadow-[0_28px_55px_rgba(15,23,42,0.22)]"
      >
        <div className="flex h-full flex-col rounded-[1.6rem] border border-black/10 bg-[#fffdfa] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div
            className="relative flex-1 overflow-hidden rounded-[1.2rem] border border-black/8"
            style={{
              backgroundColor: SEASON_BACKDROPS[theme.season],
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.35)',
            }}
          >
            <div className="absolute inset-3 rounded-[1rem] bg-white/60" />
            <div
              className="absolute inset-5 overflow-hidden rounded-[0.95rem]"
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

            <div className="absolute left-6 top-6 rounded-full border border-white/35 bg-black/18 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.26em] text-white/90 backdrop-blur-sm">
              {artifact.label}
            </div>

            <div className="absolute right-6 top-6 rounded-full bg-white/18 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
              {format(currentDate, 'MMM yyyy')}
            </div>
          </div>

          <div className="grid shrink-0 gap-3 border-t border-dashed border-stone-300 px-1 pb-1 pt-3 text-stone-700 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-stone-500">
                {artifact.location}
              </p>
              <h2 className="mt-1 text-[1.85rem] font-black uppercase leading-[0.92] text-stone-900">
                {artifact.title}
              </h2>
              <p className="mt-1.5 text-sm italic leading-relaxed text-stone-600" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                {artifact.caption}
              </p>
            </div>

            <div className="rounded-2xl bg-stone-100 px-3 py-2 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-stone-500">
              Mounted Print
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
