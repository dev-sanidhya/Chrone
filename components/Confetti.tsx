'use client';

import { useEffect, useState } from 'react';

const COLORS = ['#ff595e','#ffca3a','#6a4c93','#1982c4','#8ac926','#ff924c','#c77dff','#f72585','#4cc9f0'];

interface Piece {
  id: number; x: number; color: string; size: number;
  delay: number; duration: number; drift: number; shape: 'rect' | 'circle' | 'triangle';
}

export default function Confetti({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!trigger) return;
    setPieces(Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      color: COLORS[i % COLORS.length],
      size: 5 + Math.random() * 8,
      delay: Math.random() * 0.7,
      duration: 1.6 + Math.random() * 1.4,
      drift: (Math.random() - 0.5) * 120,
      shape: (['rect','circle','triangle'] as const)[i % 3],
    })));
    const t = setTimeout(() => setPieces([]), 3500);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!pieces.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" aria-hidden>
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute confetti-piece"
          style={{
            left: `${p.x}%`,
            top: -12,
            width:  p.shape === 'triangle' ? 0 : p.size,
            height: p.shape === 'triangle' ? 0 : p.size,
            backgroundColor: p.shape !== 'triangle' ? p.color : 'transparent',
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            borderLeft:   p.shape === 'triangle' ? `${p.size/2}px solid transparent` : undefined,
            borderRight:  p.shape === 'triangle' ? `${p.size/2}px solid transparent` : undefined,
            borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
