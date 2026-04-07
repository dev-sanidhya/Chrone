'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { Trash2 } from 'lucide-react';
import type { DateRange, Note, NoteColor, MonthTheme } from '@/lib/types';

const NOTE_COLORS: { value: NoteColor; dot: string; bg: string; bgDark: string }[] = [
  { value: 'yellow',  dot: '#eab308', bg: '#fefce8', bgDark: '#422006' },
  { value: 'rose',    dot: '#f43f5e', bg: '#fff1f2', bgDark: '#4c0519' },
  { value: 'sky',     dot: '#38bdf8', bg: '#f0f9ff', bgDark: '#0c4a6e' },
  { value: 'emerald', dot: '#22c55e', bg: '#f0fdf4', bgDark: '#14532d' },
  { value: 'violet',  dot: '#a855f7', bg: '#f5f3ff', bgDark: '#2e1065' },
  { value: 'amber',   dot: '#f59e0b', bg: '#fffbeb', bgDark: '#451a03' },
];

const LINE_COUNT = 5;

interface NotesPanelProps {
  selectedRange: DateRange;
  notes: Note[];
  onSaveNotes: (n: Note[]) => void;
  onClearSelection: () => void;
  theme: MonthTheme;
  darkMode: boolean;
}

export default function NotesPanel({
  selectedRange,
  notes,
  onSaveNotes,
  onClearSelection,
  theme,
  darkMode,
}: NotesPanelProps) {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [lineTexts, setLineTexts] = useState<string[]>(Array(LINE_COUNT).fill(''));
  const [color, setColor] = useState<NoteColor>('yellow');
  const [saved, setSaved] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const hasStart = !!selectedRange.start;
  const hasRange = hasStart && !!selectedRange.end;

  const rangeLabel = hasRange
    ? `${format(selectedRange.start!, 'MMM d')} – ${format(selectedRange.end!, 'MMM d')}`
    : hasStart
    ? format(selectedRange.start!, 'MMM d, yyyy')
    : '';

  const handleSave = () => {
    const content = lineTexts.filter(Boolean).join('\n');
    if (!content || !selectedRange.start) return;
    const newNote: Note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      rangeStart: selectedRange.start.toISOString(),
      rangeEnd: (selectedRange.end ?? selectedRange.start).toISOString(),
      content,
      color,
      createdAt: new Date().toISOString(),
      title: rangeLabel,
    };
    onSaveNotes([...notes, newNote]);
    setLineTexts(Array(LINE_COUNT).fill(''));
    setActiveLine(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => onSaveNotes(notes.filter(n => n.id !== id));

  const bg = darkMode ? 'bg-zinc-900' : 'bg-white';
  const border = darkMode ? 'border-zinc-800' : 'border-zinc-100';
  const headingColor = darkMode ? 'text-zinc-400' : 'text-zinc-500';
  const lineColor = darkMode ? '#3f3f46' : '#e5e7eb';
  const inputText = darkMode ? 'text-zinc-300 placeholder-zinc-600' : 'text-zinc-700 placeholder-zinc-300';

  return (
    <div className={`flex flex-col ${bg} border-r ${border} transition-colors duration-300`}
         style={{ width: 185, minWidth: 185, flexShrink: 0 }}>
      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* ── "NOTES" heading ── */}
        <p className={`text-[9px] font-black tracking-[0.3em] uppercase ${headingColor}`}>
          Notes
        </p>

        {/* ── Range label (if selection) ── */}
        <AnimatePresence>
          {hasStart && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="text-[10px] font-semibold truncate" style={{ color: theme.primaryColor }}>
                {rangeLabel}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Lined notepad ── */}
        <div className="flex flex-col gap-0 flex-1">
          {Array.from({ length: LINE_COUNT }).map((_, i) => (
            <div key={i} className="relative group">
              <input
                ref={el => { inputRefs.current[i] = el; }}
                value={lineTexts[i]}
                onChange={e => {
                  const next = [...lineTexts];
                  next[i] = e.target.value;
                  setLineTexts(next);
                }}
                onFocus={() => setActiveLine(i)}
                onBlur={() => setActiveLine(null)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && i < LINE_COUNT - 1) {
                    inputRefs.current[i + 1]?.focus();
                  }
                }}
                placeholder="tap to write..."
                maxLength={40}
                className={`w-full bg-transparent text-[11px] py-2 px-0 focus:outline-none transition-colors font-handwriting ${inputText}`}
                style={{ fontFamily: "'Patrick Hand', 'Caveat', cursive" }}
              />
              {/* Ruled line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[1px] transition-colors"
                style={{
                  backgroundColor: activeLine === i ? theme.primaryColor : lineColor,
                  opacity: activeLine === i ? 0.8 : 1,
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Colour swatches + save ── */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {NOTE_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              title={c.value}
              className="w-4 h-4 rounded-full transition-transform"
              style={{
                backgroundColor: c.dot,
                transform: color === c.value ? 'scale(1.4)' : 'scale(1)',
                boxShadow: color === c.value ? `0 0 0 2px white, 0 0 0 3px ${c.dot}` : 'none',
              }}
            />
          ))}
        </div>

        {/* ── Save button ── */}
        {hasStart && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleSave}
            disabled={!lineTexts.some(Boolean)}
            className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white transition-all
                       hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-35 disabled:cursor-not-allowed"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {saved ? '✓ Saved!' : 'Save Note'}
          </motion.button>
        )}
      </div>

      {/* ── Saved notes (scrollable mini cards) ── */}
      {notes.length > 0 && (
        <div className={`border-t ${border} p-3 max-h-36 overflow-y-auto scrollbar-thin flex flex-col gap-2`}>
          <p className={`text-[8px] font-black tracking-[0.3em] uppercase ${headingColor}`}>Saved</p>
          <AnimatePresence initial={false}>
            {[...notes].reverse().map(note => {
              const c = NOTE_COLORS.find(x => x.value === note.color) ?? NOTE_COLORS[0];
              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14, height: 0 }}
                  className="rounded-md p-2 relative group flex-shrink-0"
                  style={{ backgroundColor: darkMode ? c.bgDark : c.bg, borderLeft: `2.5px solid ${c.dot}` }}
                >
                  <p className="text-[9px] font-bold truncate" style={{ color: c.dot }}>{note.title}</p>
                  <p className={`text-[9px] mt-0.5 line-clamp-2 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {note.content}
                  </p>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
                    aria-label="Delete"
                  >
                    <Trash2 size={9}/>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
