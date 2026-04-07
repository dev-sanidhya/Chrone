import type { Holiday } from './types';

export const HOLIDAYS: Holiday[] = [
  { month: 0, day: 1,  name: "New Year's Day",       type: 'federal',     emoji: '🎊' },
  { month: 0, day: 15, name: "MLK Jr. Day",           type: 'federal',     emoji: '✊' },
  { month: 1, day: 2,  name: "Groundhog Day",         type: 'fun',         emoji: '🦔' },
  { month: 1, day: 14, name: "Valentine's Day",       type: 'observance',  emoji: '💝' },
  { month: 2, day: 17, name: "St. Patrick's Day",     type: 'observance',  emoji: '☘️' },
  { month: 2, day: 20, name: "Spring Equinox",        type: 'fun',         emoji: '🌱' },
  { month: 3, day: 1,  name: "April Fools' Day",      type: 'fun',         emoji: '🃏' },
  { month: 3, day: 22, name: "Earth Day",             type: 'observance',  emoji: '🌍' },
  { month: 4, day: 4,  name: "Star Wars Day",         type: 'fun',         emoji: '⚔️' },
  { month: 4, day: 5,  name: "Cinco de Mayo",         type: 'observance',  emoji: '🎉' },
  { month: 4, day: 26, name: "Memorial Day (est.)",   type: 'federal',     emoji: '🎖️' },
  { month: 5, day: 19, name: "Juneteenth",            type: 'federal',     emoji: '✊' },
  { month: 5, day: 21, name: "Summer Solstice",       type: 'fun',         emoji: '☀️' },
  { month: 6, day: 4,  name: "Independence Day",      type: 'federal',     emoji: '🎆' },
  { month: 8, day: 1,  name: "Labor Day (est.)",      type: 'federal',     emoji: '👷' },
  { month: 8, day: 22, name: "Autumn Equinox",        type: 'fun',         emoji: '🍂' },
  { month: 9, day: 14, name: "Columbus Day (est.)",   type: 'federal',     emoji: '⚓' },
  { month: 9, day: 31, name: "Halloween",             type: 'observance',  emoji: '🎃' },
  { month: 10, day: 11, name: "Veterans Day",         type: 'federal',     emoji: '🎖️' },
  { month: 10, day: 27, name: "Thanksgiving (est.)",  type: 'federal',     emoji: '🦃' },
  { month: 11, day: 21, name: "Winter Solstice",      type: 'fun',         emoji: '❄️' },
  { month: 11, day: 24, name: "Christmas Eve",        type: 'observance',  emoji: '🎄' },
  { month: 11, day: 25, name: "Christmas Day",        type: 'federal',     emoji: '🎁' },
  { month: 11, day: 31, name: "New Year's Eve",       type: 'fun',         emoji: '🥂' },
];

export function getHolidayForDate(month: number, day: number): Holiday | undefined {
  return HOLIDAYS.find(h => h.month === month && h.day === day);
}

export function getHolidaysForMonth(month: number): Holiday[] {
  return HOLIDAYS.filter(h => h.month === month);
}

export function getNextHoliday(from: Date): Holiday & { date: Date } | null {
  const year = from.getFullYear();
  for (const h of HOLIDAYS) {
    const hDate = new Date(year, h.month, h.day);
    if (hDate > from) return { ...h, date: hDate };
  }
  // Try next year
  const first = HOLIDAYS[0];
  return { ...first, date: new Date(year + 1, first.month, first.day) };
}
