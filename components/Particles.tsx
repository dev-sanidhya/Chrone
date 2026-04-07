'use client';

import { useEffect, useState } from 'react';
import type { ParticleType } from '@/lib/types';

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  emoji: string;
  drift: number;
}

const PARTICLE_CONFIG: Record<ParticleType, { emojis: string[]; count: number }> = {
  snow:     { emojis: ['❄', '❅', '❆', '·', '✦', '·', '·'], count: 22 },
  petals:   { emojis: ['✿', '❀', '✾', '·', '❁'], count: 18 },
  sparkles: { emojis: ['✦', '✧', '⋆', '·', '★', '✩', '·'], count: 20 },
  leaves:   { emojis: ['🍁', '🍂', '·', '·', '·'], count: 16 },
};

export default function Particles({ type }: { type: ParticleType }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const { emojis, count } = PARTICLE_CONFIG[type];
    const generated: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 110 - 5,
      size: 0.55 + Math.random() * 1.2,
      delay: Math.random() * 12,
      duration: 8 + Math.random() * 12,
      opacity: 0.15 + Math.random() * 0.55,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      drift: (Math.random() - 0.5) * 60,
    }));
    setParticles(generated);
  }, [type]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {particles.map(p => (
        <span
          key={p.id}
          className="particle-fall absolute top-0 will-change-transform"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}rem`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
