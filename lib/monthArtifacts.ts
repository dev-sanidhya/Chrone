import type { NoteCategory, Season } from './types';

export interface MonthArtifact {
  title: string;
  label: string;
  location: string;
  caption: string;
  memoryPrompt: string;
}

export const MONTH_ARTIFACTS: MonthArtifact[] = [
  {
    title: 'Aurora Over Pine Ridge',
    label: 'Winter field print',
    location: 'January Collection',
    caption: 'A cold-start print with enough stillness to feel collectible on the wall.',
    memoryPrompt: 'Use January for resets, routines, and small deliberate beginnings.',
  },
  {
    title: 'Rose Window At Dusk',
    label: 'Gallery matte print',
    location: 'February Collection',
    caption: 'A softer print that makes the page feel intimate instead of merely functional.',
    memoryPrompt: 'A good month for meaningful notes, promises, and celebrations.',
  },
  {
    title: 'First Thaw Study',
    label: 'Season opener',
    location: 'March Collection',
    caption: 'The page opens into spring with a print that feels transitional and alive.',
    memoryPrompt: 'Best for early momentum, project kickoffs, and routine changes.',
  },
  {
    title: 'Cherry Bloom Horizon',
    label: 'Limited blossom edition',
    location: 'April Collection',
    caption: 'An expressive print meant to feel curated, framed, and worth lingering on.',
    memoryPrompt: 'Great for trips, long weekends, and memories worth pinning to a date range.',
  },
  {
    title: 'Glasshouse Light',
    label: 'Spring gallery plate',
    location: 'May Collection',
    caption: 'Green, optimistic, and quiet enough to support a thoughtful planning month.',
    memoryPrompt: 'Use May for growth notes, personal rituals, and lighter commitments.',
  },
  {
    title: 'Sunline Coast',
    label: 'Summer study',
    location: 'June Collection',
    caption: 'A travel-poster month built around bright air, distance, and anticipation.',
    memoryPrompt: 'Perfect for holidays, escape plans, and summer openings.',
  },
  {
    title: 'City Fireworks No. 7',
    label: 'Festival print',
    location: 'July Collection',
    caption: 'A celebratory plate designed to feel like a special-edition calendar page.',
    memoryPrompt: 'Save parties, milestones, reunions, and standout summer moments here.',
  },
  {
    title: 'Late Heat and Gold',
    label: 'Golden-hour print',
    location: 'August Collection',
    caption: 'Long daylight, warmer paper tones, and a more nostalgic end-of-summer feel.',
    memoryPrompt: 'Good for family plans, trips, and last-summer snapshots.',
  },
  {
    title: 'Amber Trail',
    label: 'Autumn preview',
    location: 'September Collection',
    caption: 'A transitional print that starts to shift the calendar back toward structure.',
    memoryPrompt: 'Use it for school rhythms, work sprints, and fresh routines.',
  },
  {
    title: 'Lantern Woods',
    label: 'Night print',
    location: 'October Collection',
    caption: 'A more theatrical monthly plate that gives the wall calendar a strong identity.',
    memoryPrompt: 'Best for themed events, celebrations, and visual memories.',
  },
  {
    title: 'Harvest Path',
    label: 'Studio autumn print',
    location: 'November Collection',
    caption: 'Deep, grounded, and designed for reflective planning and family movement.',
    memoryPrompt: 'Ideal for gatherings, travel windows, and reflective month notes.',
  },
  {
    title: 'Homecoming Lights',
    label: 'Holiday print',
    location: 'December Collection',
    caption: 'The last page should feel warm enough to keep hanging after the month ends.',
    memoryPrompt: 'Use December for gatherings, travel, and end-of-year memories.',
  },
];

export const CATEGORY_META: Record<NoteCategory, { label: string; short: string }> = {
  memory: { label: 'Memory', short: 'Memory' },
  trip: { label: 'Trip', short: 'Trip' },
  focus: { label: 'Focus Block', short: 'Focus' },
  celebration: { label: 'Celebration', short: 'Party' },
  personal: { label: 'Personal', short: 'Personal' },
};

export const SEASON_BACKDROPS: Record<Season, string> = {
  winter: '#e8eef7',
  spring: '#f7e8ef',
  summer: '#f7ecdd',
  fall: '#f2e4d7',
};
