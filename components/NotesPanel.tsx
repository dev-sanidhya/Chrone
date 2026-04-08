'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Pin, Trash2 } from 'lucide-react';
import type { DateRange, Note, NoteCategory, NoteColor, MonthTheme } from '@/lib/types';
import { CATEGORY_META } from '@/lib/monthArtifacts';

const NOTE_COLORS: { value: NoteColor; dot: string; bg: string; bgDark: string }[] = [
  { value: 'yellow', dot: '#eab308', bg: '#fefce8', bgDark: '#422006' },
  { value: 'rose', dot: '#f43f5e', bg: '#fff1f2', bgDark: '#4c0519' },
  { value: 'sky', dot: '#38bdf8', bg: '#f0f9ff', bgDark: '#0c4a6e' },
  { value: 'emerald', dot: '#22c55e', bg: '#f0fdf4', bgDark: '#14532d' },
  { value: 'violet', dot: '#a855f7', bg: '#f5f3ff', bgDark: '#2e1065' },
  { value: 'amber', dot: '#f59e0b', bg: '#fffbeb', bgDark: '#451a03' },
];

const CATEGORY_ORDER: NoteCategory[] = ['memory', 'trip', 'focus', 'celebration', 'personal'];

interface NotesPanelProps {
  currentDate: Date;
  selectedRange: DateRange;
  notes: Note[];
  monthMemo: string;
  onSaveMonthMemo: (value: string) => void;
  onSaveNotes: (next: Note[]) => void;
  onClearSelection: () => void;
  theme: MonthTheme;
  darkMode: boolean;
  isMobile?: boolean;
}

export default function NotesPanel({
  currentDate,
  selectedRange,
  notes,
  monthMemo,
  onSaveMonthMemo,
  onSaveNotes,
  onClearSelection,
  theme,
  darkMode,
  isMobile = false,
}: NotesPanelProps) {
  const [memoDraft, setMemoDraft] = useState(monthMemo);
  const [noteDraft, setNoteDraft] = useState('');
  const [category, setCategory] = useState<NoteCategory>('memory');
  const [color, setColor] = useState<NoteColor>('yellow');
  const [savedState, setSavedState] = useState<'memo' | 'note' | null>(null);

  useEffect(() => {
    setMemoDraft(monthMemo);
  }, [monthMemo, currentDate]);

  const hasSelection = !!selectedRange.start;
  const selectionStart = selectedRange.start;
  const selectionEnd = selectedRange.end ?? selectedRange.start;
  const selectionLabel = selectionStart && selectionEnd
    ? selectionStart.getTime() === selectionEnd.getTime()
      ? format(selectionStart, 'MMM d, yyyy')
      : `${format(selectionStart, 'MMM d')} – ${format(selectionEnd, 'MMM d')}`
    : '';

  const currentMonthNotes = useMemo(() => {
    const monthKey = format(currentDate, 'yyyy-MM');
    return notes
      .filter((note) => note.rangeStart.startsWith(monthKey))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [currentDate, isMobile, notes]);

  const saveMemo = () => {
    onSaveMonthMemo(memoDraft);
    setSavedState('memo');
    setTimeout(() => setSavedState(null), 1400);
  };

  const saveSelectionNote = () => {
    if (!selectionStart || !selectionEnd || !noteDraft.trim()) return;

    const next: Note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      rangeStart: selectionStart.toISOString(),
      rangeEnd: selectionEnd.toISOString(),
      content: noteDraft.trim(),
      color,
      createdAt: new Date().toISOString(),
      title: selectionLabel,
      category,
    };

    onSaveNotes([...notes, next]);
    setNoteDraft('');
    setSavedState('note');
    setTimeout(() => setSavedState(null), 1400);
  };

  const deleteNote = (id: string) => onSaveNotes(notes.filter((note) => note.id !== id));

  const shell = darkMode ? 'bg-zinc-900' : 'bg-[#fffdf8]';
  const card = darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-black/10';
  const muted = darkMode ? 'text-zinc-400' : 'text-zinc-500';
  const text = darkMode ? 'text-zinc-200' : 'text-zinc-700';

  return (
    <aside
      className={`flex-shrink-0 min-h-0 overflow-y-auto scrollbar-thin ${isMobile ? 'border-t' : 'border-r'} ${darkMode ? 'border-zinc-800' : 'border-black/5'} ${shell}`}
      style={isMobile ? undefined : { width: 300, minWidth: 300 }}
    >
      <div className={`grid gap-3 ${isMobile ? 'p-4' : 'p-4'}`}>
        <section className={`rounded-[1.7rem] border p-4 shadow-[0_20px_32px_rgba(15,23,42,0.08)] ${card}`}>
          <div className="flex items-center justify-between">
            <p className={`text-[10px] font-black uppercase tracking-[0.32em] ${muted}`}>Month Memo</p>
            <Pin size={14} style={{ color: theme.primaryColor }} />
          </div>
          <p className={`mt-2 text-sm ${text}`}>A permanent margin note for {format(currentDate, 'MMMM yyyy')}.</p>
          <textarea
            value={memoDraft}
            onChange={(event) => setMemoDraft(event.target.value)}
            rows={isMobile ? 6 : 5}
            placeholder="Write a monthly headline, reminder, or personal theme..."
            className={`mt-4 w-full resize-none rounded-[1.2rem] border px-4 py-3 text-sm leading-relaxed focus:outline-none ${darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-200 placeholder-zinc-600' : 'border-black/10 bg-[#fffdf8] text-zinc-700 placeholder-zinc-400'}`}
          />
          <div className={`mt-3 flex ${isMobile ? 'flex-col items-stretch gap-2.5' : 'items-center justify-between'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${muted}`}>Always visible</span>
            <button
              onClick={saveMemo}
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white ${isMobile ? 'w-full' : ''}`}
              style={{ backgroundColor: theme.primaryColor }}
            >
              {savedState === 'memo' ? 'Saved' : 'Save memo'}
            </button>
          </div>
        </section>

        <section className={`rounded-[1.7rem] border p-4 shadow-[0_20px_32px_rgba(15,23,42,0.08)] ${card}`}>
          <div className="flex items-center justify-between">
            <p className={`text-[10px] font-black uppercase tracking-[0.32em] ${muted}`}>Selection Note</p>
            {hasSelection && (
              <button
                onClick={onClearSelection}
                className={`text-[10px] font-bold uppercase tracking-[0.22em] ${muted}`}
              >
                Clear
              </button>
            )}
          </div>

          <div className={`mt-4 rounded-[1.2rem] border px-4 py-3 ${darkMode ? 'border-zinc-800 bg-zinc-900' : 'border-black/10 bg-[#fffdf8]'}`}>
            {hasSelection ? (
              <>
                <p className="text-sm font-semibold" style={{ color: theme.primaryColor }}>
                  {selectionLabel}
                </p>
                <p className={`mt-2 text-[11px] ${muted}`}>
                  {selectedRange.end ? 'Range selected' : 'Single date selected'}
                </p>
              </>
            ) : (
              <p className={`text-sm ${muted}`}>Select a date or range to attach a note.</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORY_ORDER.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${darkMode ? 'border-zinc-800' : 'border-black/10'}`}
                  style={{
                    backgroundColor: active ? `${theme.primaryColor}18` : undefined,
                    color: active ? theme.primaryColor : undefined,
                  }}
                >
                  {CATEGORY_META[item].short}
                </button>
              );
            })}
          </div>

          <textarea
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            rows={isMobile ? 5 : 4}
            placeholder="Write what happened, what matters, or what you want to remember..."
            className={`mt-4 w-full resize-none rounded-[1.2rem] border px-4 py-3 text-sm leading-relaxed focus:outline-none ${darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-200 placeholder-zinc-600' : 'border-black/10 bg-[#fffdf8] text-zinc-700 placeholder-zinc-400'}`}
          />

          <div className={`mt-4 flex gap-3 ${isMobile ? 'flex-col items-stretch' : 'items-center justify-between'}`}>
            <div className={`flex ${isMobile ? 'justify-center gap-3' : 'gap-2'}`}>
              {NOTE_COLORS.map((entry) => (
                <button
                  key={entry.value}
                  onClick={() => setColor(entry.value)}
                  className={`${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'} rounded-full transition-transform`}
                  style={{
                    backgroundColor: entry.dot,
                    transform: color === entry.value ? 'scale(1.22)' : 'scale(1)',
                    boxShadow: color === entry.value ? `0 0 0 2px white, 0 0 0 4px ${entry.dot}` : 'none',
                  }}
                />
              ))}
            </div>

            <button
              onClick={saveSelectionNote}
              disabled={!hasSelection || !noteDraft.trim()}
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white disabled:opacity-35 ${isMobile ? 'w-full' : ''}`}
              style={{ backgroundColor: theme.primaryColor }}
            >
              {savedState === 'note' ? 'Saved' : 'Save note'}
            </button>
          </div>
        </section>
      </div>

      <div className={`${isMobile ? '' : 'border-t'} ${darkMode ? 'border-zinc-800' : 'border-black/5'} ${isMobile ? 'px-4 pb-4 pt-0' : 'px-5 pb-5 pt-4'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.32em] ${muted}`}>Memory Shelf</p>
            <p className={`mt-1 text-sm ${text}`}>Recent saved notes for this month.</p>
          </div>
          <Bookmark size={14} style={{ color: theme.primaryColor }} />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {currentMonthNotes.length > 0 ? (
              currentMonthNotes.map((note) => {
                const colorMeta = NOTE_COLORS.find((entry) => entry.value === note.color) ?? NOTE_COLORS[0];
                const categoryLabel = CATEGORY_META[note.category ?? 'memory'].short;
                return (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="rounded-[1.2rem] border p-4 shadow-[0_14px_24px_rgba(15,23,42,0.08)]"
                    style={{
                      backgroundColor: darkMode ? colorMeta.bgDark : colorMeta.bg,
                      borderColor: `${colorMeta.dot}55`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap gap-1.5">
                          <span
                            className="rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em]"
                            style={{ backgroundColor: `${colorMeta.dot}22`, color: colorMeta.dot }}
                          >
                            {categoryLabel}
                          </span>
                          <span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${muted}`}>
                            {format(new Date(note.rangeStart), 'MMM d')}
                            {note.rangeEnd !== note.rangeStart ? ` → ${format(new Date(note.rangeEnd), 'MMM d')}` : ''}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-semibold" style={{ color: colorMeta.dot }}>
                          {note.title}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="rounded-full p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label="Delete note"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <p className={`mt-3 text-sm leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {note.content}
                    </p>
                  </motion.div>
                );
              })
            ) : (
              <div className={`rounded-[1.2rem] border border-dashed p-4 text-sm ${darkMode ? 'border-zinc-800 text-zinc-500' : 'border-black/10 text-zinc-500'}`}>
                Your saved memories will appear here.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
