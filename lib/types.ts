export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string;
  rangeStart: string;
  rangeEnd: string;
  content: string;
  color: NoteColor;
  createdAt: string;
  title: string;
  category?: NoteCategory;
}

export type NoteColor = 'yellow' | 'rose' | 'sky' | 'emerald' | 'violet' | 'amber';
export type NoteCategory = 'memory' | 'trip' | 'focus' | 'celebration' | 'personal';
export type MonthMemoMap = Record<string, string>;

export type Season = 'winter' | 'spring' | 'summer' | 'fall';
export type ParticleType = 'snow' | 'petals' | 'sparkles' | 'leaves';

export interface MonthTheme {
  month: number;
  name: string;
  heroGradientFrom: string;
  heroGradientVia: string;
  heroGradientTo: string;
  primaryColor: string;
  accentColor: string;
  ringColor: string;
  particles: ParticleType;
  quote: string;
  author: string;
  emoji: string;
  season: Season;
}

export interface Holiday {
  month: number;
  day: number;
  name: string;
  type: 'federal' | 'observance' | 'fun';
  emoji: string;
}
