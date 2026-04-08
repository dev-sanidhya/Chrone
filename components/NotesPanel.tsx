'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Pin, Trash2 } from 'lucide-react';
import type { DateRange, Note, NoteCategory, NoteColor, MonthTheme } from '@/lib/types';
import { CATEGORY_META } from '@/lib/monthArtifacts';

const NOTE_COLORS: { value: NoteColor; dot: string; bg: string; bgDark: string }[] = [
  { value: 'yellow',  dot: '#eab308', bg: '#fefce8', bgDark: '#422006' },
  { value: 'rose',    dot: '#f43f5e', bg: '#fff1f2', bgDark: '#4c0519' },
  { value: 'sky',     dot: '#38bdf8', bg: '#f0f9ff', bgDark: '#0c4a6e' },
  { value: 'emerald', dot: '#22c55e', bg: '#f0fdf4', bgDark: '#14532d' },
  { value: 'violet',  dot: '#a855f7', bg: '#f5f3ff', bgDark: '#2e1065' },
  { value: 'amber',   dot: '#f59e0b', bg: '#fffbeb', bgDark: '#451a03' },
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
  const [memoDraft,  setMemoDraft]  = useState(monthMemo);
  const [noteDraft,  setNoteDraft]  = useState('');
  const [category,   setCategory]   = useState<NoteCategory>('memory');
  const [color,      setColor]      = useState<NoteColor>('yellow');
  const [savedState, setSavedState] = useState<'memo' | 'note' | null>(null);

  useEffect(() => { setMemoDraft(monthMemo); }, [monthMemo, currentDate]);

  const hasSelection   = !!selectedRange.start;
  const selectionStart = selectedRange.start;
  const selectionEnd   = selectedRange.end ?? selectedRange.start;
  const selectionLabel = selectionStart && selectionEnd
    ? selectionStart.getTime() === selectionEnd.getTime()
      ? format(selectionStart, 'MMM d, yyyy')
      : `${format(selectionStart, 'MMM d')} – ${format(selectionEnd, 'MMM d')}`
    : '';

  const currentMonthNotes = useMemo(() => {
    const monthKey = format(currentDate, 'yyyy-MM');
    return notes
      .filter(n => n.rangeStart.startsWith(monthKey))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [currentDate, notes]);

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
      rangeEnd:   selectionEnd.toISOString(),
      content:    noteDraft.trim(),
      color,
      createdAt:  new Date().toISOString(),
      title:      selectionLabel,
      category,
    };
    onSaveNotes([...notes, next]);
    setNoteDraft('');
    setSavedState('note');
    setTimeout(() => setSavedState(null), 1400);
  };

  const deleteNote = (id: string) => onSaveNotes(notes.filter(n => n.id !== id));

  const shell = darkMode ? 'bg-zinc-900' : 'bg-[#fffdf8]';
  const card  = darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-black/8';
  const muted = darkMode ? 'text-zinc-400' : 'text-zinc-500';
  const txt   = darkMode ? 'text-zinc-200' : 'text-zinc-700';

  /* ─── compact = desktop non-mobile ─────────── */
  const compact = !isMobile;

  return (
    <aside
      className={`flex-shrink-0 min-h-0 flex flex-col ${isMobile ? 'border-t overflow-y-auto' : 'border-r overflow-hidden'} ${darkMode ? 'border-zinc-800' : 'border-black/5'} ${shell}`}
      style={isMobile ? undefined : { width: 292, minWidth: 292 }}
    >
      {/* ════ scrollable content area ════ */}
      <div className={`flex flex-col gap-2 ${compact ? 'p-3' : 'p-4'} flex-1 min-h-0 ${compact ? 'overflow-y-auto scrollbar-thin' : ''}`}>

        {/* ── Month Memo ── */}
        <section className={`rounded-xl border ${compact ? 'p-2.5' : 'p-4'} shadow-[0_8px_18px_rgba(15,23,42,0.07)] flex-shrink-0 ${card}`}>
          <div className="flex items-center justify-between">
            <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${muted}`}>Month Memo</p>
            <Pin size={11} style={{ color: theme.primaryColor }} />
          </div>

          <textarea
            value={memoDraft}
            onChange={e => setMemoDraft(e.target.value)}
            rows={compact ? 2 : 5}
            placeholder={compact ? 'Monthly headline or theme…' : 'Write a monthly headline, reminder, or personal theme…'}
            className={`mt-2 w-full resize-none rounded-lg border ${compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-4 py-3 text-sm'} leading-relaxed focus:outline-none ${
              darkMode
                ? 'border-zinc-800 bg-zinc-900 text-zinc-200 placeholder-zinc-600'
                : 'border-black/8 bg-[#fffdf8] text-zinc-700 placeholder-zinc-400'
            }`}
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Always visible</span>
            <button
              onClick={saveMemo}
              className="rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {savedState === 'memo' ? '✓ Saved' : 'Save memo'}
            </button>
          </div>
        </section>

        {/* ── Selection Note ── */}
        <section className={`rounded-xl border ${compact ? 'p-2.5' : 'p-4'} shadow-[0_8px_18px_rgba(15,23,42,0.07)] flex-shrink-0 ${card}`}>
          <div className="flex items-center justify-between">
            <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${muted}`}>Selection Note</p>
            {hasSelection && (
              <button onClick={onClearSelection} className={`text-[9px] font-bold uppercase tracking-[0.2em] ${muted} hover:text-red-400 transition-colors`}>
                Clear
              </button>
            )}
          </div>

          {/* Date label */}
          <AnimatePresence mode="wait">
            {hasSelection ? (
              <motion.p
                key="sel"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-1.5 text-[11px] font-semibold truncate`}
                style={{ color: theme.primaryColor }}
              >
                {selectionLabel}
              </motion.p>
            ) : (
              <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className={`mt-1.5 text-[11px] ${muted}`}>
                Tap a date on the grid to begin
              </motion.p>
            )}
          </AnimatePresence>

          {/* Category chips — single scrolling row */}
          <div className="mt-2 flex gap-1 flex-wrap">
            {CATEGORY_ORDER.map(item => {
              const active = category === item;
              return (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] transition-colors ${darkMode ? 'border-zinc-800' : 'border-black/8'}`}
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
            onChange={e => setNoteDraft(e.target.value)}
            rows={compact ? 2 : 4}
            placeholder="What happened, what mattered…"
            className={`mt-2 w-full resize-none rounded-lg border ${compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-4 py-3 text-sm'} leading-relaxed focus:outline-none ${
              darkMode
                ? 'border-zinc-800 bg-zinc-900 text-zinc-200 placeholder-zinc-600'
                : 'border-black/8 bg-[#fffdf8] text-zinc-700 placeholder-zinc-400'
            }`}
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            {/* Colour swatches */}
            <div className="flex gap-1.5">
              {NOTE_COLORS.map(entry => (
                <button
                  key={entry.value}
                  onClick={() => setColor(entry.value)}
                  className="h-3 w-3 rounded-full transition-transform"
                  style={{
                    backgroundColor: entry.dot,
                    transform: color === entry.value ? 'scale(1.3)' : 'scale(1)',
                    boxShadow: color === entry.value ? `0 0 0 1.5px white, 0 0 0 3px ${entry.dot}` : 'none',
                  }}
                />
              ))}
            </div>
            <button
              onClick={saveSelectionNote}
              disabled={!hasSelection || !noteDraft.trim()}
              className="rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-35"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {savedState === 'note' ? '✓ Saved' : 'Save note'}
            </button>
          </div>
        </section>

        {/* ── Memory Shelf ── */}
        <section className={`flex-shrink-0 border-t ${darkMode ? 'border-zinc-800' : 'border-black/5'} ${compact ? 'pt-2 pb-1' : 'pt-4 pb-4 px-1'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${muted}`}>Memory Shelf</p>
            <Bookmark size={11} style={{ color: theme.primaryColor }} />
          </div>

          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {currentMonthNotes.length > 0 ? (
                currentMonthNotes.map(note => {
                  const cm = NOTE_COLORS.find(e => e.value === note.color) ?? NOTE_COLORS[0];
                  const catLabel = CATEGORY_META[note.category ?? 'memory'].short;
                  return (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      className={`rounded-xl border ${compact ? 'p-2.5' : 'p-3'}`}
                      style={{ backgroundColor: darkMode ? cm.bgDark : cm.bg, borderColor: `${cm.dot}44` }}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]"
                              style={{ backgroundColor: `${cm.dot}22`, color: cm.dot }}>
                              {catLabel}
                            </span>
                            <span className={`text-[8px] font-semibold uppercase tracking-[0.1em] ${muted}`}>
                              {format(new Date(note.rangeStart), 'MMM d')}
                              {note.rangeEnd !== note.rangeStart ? ` → ${format(new Date(note.rangeEnd), 'MMM d')}` : ''}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-snug line-clamp-2" style={{ color: cm.dot }}>{note.title}</p>
                        </div>
                        <button onClick={() => deleteNote(note.id)}
                          className="flex-shrink-0 rounded-full p-0.5 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          aria-label="Delete">
                          <Trash2 size={10} />
                        </button>
                      </div>
                      <p className={`mt-1 text-[11px] leading-snug line-clamp-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {note.content}
                      </p>
                    </motion.div>
                  );
                })
              ) : (
                <p className={`rounded-xl border border-dashed ${compact ? 'p-2.5 text-[10px]' : 'p-4 text-sm'} ${darkMode ? 'border-zinc-800 text-zinc-500' : 'border-black/10 text-zinc-400'}`}>
                  Saved memories will appear here.
                </p>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </aside>
  );
}
