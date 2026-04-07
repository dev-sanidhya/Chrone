/** Moon phase calculator anchored to Jan 17 2024 new moon */
export function getMoonPhase(date: Date): {
  emoji: string;
  name: string;
  show: boolean;
} {
  const anchor = new Date(2024, 0, 17);
  const period = 29.53058867;
  const diff = (date.getTime() - anchor.getTime()) / 86400000;
  const phase = ((diff % period) + period) % period;

  if (phase < 1.85) return { emoji: '🌑', name: 'New Moon',       show: true  };
  if (phase < 7.38) return { emoji: '🌒', name: 'Waxing Crescent', show: false };
  if (phase < 9.22) return { emoji: '🌓', name: 'First Quarter',   show: true  };
  if (phase < 14.7) return { emoji: '🌔', name: 'Waxing Gibbous',  show: false };
  if (phase < 16.6) return { emoji: '🌕', name: 'Full Moon',       show: true  };
  if (phase < 22.1) return { emoji: '🌖', name: 'Waning Gibbous',  show: false };
  if (phase < 24.0) return { emoji: '🌗', name: 'Last Quarter',    show: true  };
  return               { emoji: '🌘', name: 'Waning Crescent',  show: false };
}
