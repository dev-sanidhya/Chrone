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
      {/* Decorative paper sheets behind the card */}
      <div className="absolute -left-1 top-2 h-8 w-6 rotate-[-8deg] rounded-sm bg-stone-100/90 shadow-[0_8px_14px_rgba(0,0,0,0.12)]" />
      <div className="absolute right-3 top-0 h-7 w-12 rotate-[6deg] rounded-sm bg-stone-100/75 shadow-[0_8px_14px_rgba(0,0,0,0.1)]" />

      {/* Polaroid outer frame — slight tilt for physical feel */}
      <motion.div
        initial={{ opacity: 0, y: 14, rotate: -0.9 }}
        animate={{ opacity: 1, y: 0,  rotate: -0.9 }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        className="relative h-full rounded-[1.2rem] bg-[#f6efe4] p-2 shadow-[0_18px_36px_rgba(15,23,42,0.2)]"
      >
        {/* Inner white mat */}
        <div className="h-full overflow-hidden rounded-[1rem] border border-black/10 bg-[#fffdfa] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">

          {/* Art area — fills full height with no caption stealing space */}
          <div
            className="relative h-full overflow-hidden rounded-[0.85rem] border border-black/8"
            style={{
              backgroundColor: SEASON_BACKDROPS[theme.season],
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.3)',
            }}
          >
            {/* White mat inset */}
            <div className="absolute inset-1.5 rounded-[0.6rem] bg-white/55" />

            {/* Gradient backdrop + SeasonScene */}
            <div
              className="absolute inset-2.5 overflow-hidden rounded-[0.6rem]"
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
              {/* Bottom darkening for overlay text legibility */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 38%, transparent 68%)',
                }}
              />
            </div>

            {/* Top-left: edition label */}
            <div className="absolute left-3 top-3 z-10">
              <span className="rounded-full border border-white/30 bg-black/22 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                {artifact.label}
              </span>
            </div>

            {/* Top-right: month + year */}
            <div className="absolute right-3 top-3 z-10">
              <span className="rounded-full bg-white/18 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                {format(currentDate, 'MMM yyyy')}
              </span>
            </div>

            {/* Bottom overlay: location + title */}
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <p className="text-[8px] uppercase tracking-[0.26em] text-white/60">
                {artifact.location}
              </p>
              <h2 className="mt-0.5 text-[1.05rem] font-black uppercase leading-tight text-white"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
                {artifact.title}
              </h2>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
