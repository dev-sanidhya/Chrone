'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Pin, StickyNote, Trash2 } from 'lucide-react';
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

type Tab = 'memo' | 'note' | 'shelf';

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
  const [tab,        setTab]        = useState<Tab>('memo');
  const [memoDraft,  setMemoDraft]  = useState(monthMemo);
  const [noteDraft,  setNoteDraft]  = useState('');
  const [category,   setCategory]   = useState<NoteCategory>('memory');
  const [color,      setColor]      = useState<NoteColor>('yellow');
  const [savedState, setSavedState] = useState<'memo' | 'note' | null>(null);

  useEffect(() => { setMemoDraft(monthMemo); }, [monthMemo, currentDate]);

  // Auto-switch to NOTE tab when user selects a date
  useEffect(() => {
    if (selectedRange.start) setTab('note');
  }, [selectedRange.start]);

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
    onSaveNotes([...notes, {
      id:         `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      rangeStart: selectionStart.toISOString(),
      rangeEnd:   selectionEnd.toISOString(),
      content:    noteDraft.trim(),
      color,
      createdAt:  new Date().toISOString(),
      title:      selectionLabel,
      category,
    }]);
    setNoteDraft('');
    setSavedState('note');
    setTimeout(() => setSavedState(null), 1400);
    setTab('shelf');
  };

  const deleteNote = (id: string) => onSaveNotes(notes.filter(n => n.id !== id));

  const shell = darkMode ? 'bg-zinc-900' : 'bg-[#fffdf8]';
  const muted = darkMode ? 'text-zinc-400' : 'text-zinc-500';
  const inputCls = `w-full resize-none rounded-xl border px-3 py-2.5 text-[12px] leading-relaxed focus:outline-none ${
    darkMode
      ? 'border-zinc-700 bg-zinc-800 text-zinc-200 placeholder-zinc-500'
      : 'border-black/10 bg-white text-zinc-700 placeholder-zinc-400'
  }`;

  const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'memo',  label: 'Memo',  icon: <Pin size={11} /> },
    { id: 'note',  label: 'Note',  icon: <StickyNote size={11} />, badge: hasSelection ? 1 : undefined },
    { id: 'shelf', label: 'Shelf', icon: <Bookmark size={11} />,  badge: currentMonthNotes.length || undefined },
  ];

  return (
    <aside
      className={`flex-shrink-0 flex flex-col min-h-0 border-r ${darkMode ? 'border-zinc-800' : 'border-black/5'} ${shell}`}
      style={isMobile ? undefined : { width: 292, minWidth: 292 }}
    >
      {/* ── Tab bar — mimics the ruled edge just below the binding rings ── */}
      <div
        className={`flex border-b flex-shrink-0 ${darkMode ? 'border-zinc-800' : 'border-black/8'}`}
        style={{ boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="relative flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
            style={{ color: tab === t.id ? theme.primaryColor : darkMode ? '#71717a' : '#a1a1aa' }}
          >
            {t.icon}
            {t.label}
            {t.badge !== undefined && (
              <span
                className="absolute right-2.5 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {t.badge}
              </span>
            )}
            {tab === t.id && (
              <motion.div
                layoutId="notes-tab-indicator"
                className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content — page-flip from top, like a wall calendar tear-off ── */}
      <div
        className="flex-1 min-h-0 overflow-hidden relative"
        style={{ perspective: '700px', perspectiveOrigin: 'top center' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ rotateX: -72, opacity: 0, scale: 0.97 }}
            animate={{ rotateX: 0,   opacity: 1, scale: 1    }}
            exit={{    rotateX:  72, opacity: 0, scale: 0.97 }}
            transition={{
              rotateX: { type: 'spring', stiffness: 260, damping: 28 },
              opacity: { duration: 0.18 },
              scale:   { duration: 0.22 },
            }}
            style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
            className="absolute inset-0 overflow-y-auto scrollbar-thin p-3 flex flex-col gap-3"
          >

            {/* ════ MEMO TAB ════ */}
            {tab === 'memo' && (
              <>
                <div>
                  <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${muted}`}>
                    {format(currentDate, 'MMMM yyyy')} — Monthly Memo
                  </p>
                  <p className={`mt-1 text-[11px] ${muted}`}>
                    A persistent note visible all month in the hero panel.
                  </p>
                </div>

                <textarea
                  value={memoDraft}
                  onChange={e => setMemoDraft(e.target.value)}
                  rows={isMobile ? 8 : 7}
                  placeholder="Write a monthly headline, theme, reminder, or intention…"
                  className={inputCls}
                />

                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${muted}`}>
                    Always visible
                  </span>
                  <button
                    onClick={saveMemo}
                    className="rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {savedState === 'memo' ? '✓ Saved' : 'Save memo'}
                  </button>
                </div>

                {monthMemo.trim() && (
                  <div className={`rounded-xl border px-3 py-2.5 ${darkMode ? 'border-zinc-700 bg-zinc-800' : 'border-black/8 bg-white'}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5 ${muted}`}>Current</p>
                    <p className={`text-[12px] leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {monthMemo}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ════ NOTE TAB ════ */}
            {tab === 'note' && (
              <>
                {hasSelection ? (
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-semibold" style={{ color: theme.primaryColor }}>
                      {selectionLabel}
                    </p>
                    <button
                      onClick={onClearSelection}
                      className={`text-[9px] font-bold uppercase tracking-[0.18em] ${muted} hover:text-red-400 transition-colors`}
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <p className={`text-[11px] ${muted}`}>
                    Tap a date or drag a range on the calendar, then write your note here.
                  </p>
                )}

                {/* Category */}
                <div className="flex flex-wrap gap-1">
                  {CATEGORY_ORDER.map(item => {
                    const active = category === item;
                    return (
                      <button
                        key={item}
                        onClick={() => setCategory(item)}
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] transition-colors ${darkMode ? 'border-zinc-700' : 'border-black/10'}`}
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
                  rows={isMobile ? 7 : 6}
                  placeholder="What happened, what mattered, what you want to remember…"
                  className={inputCls}
                />

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {NOTE_COLORS.map(entry => (
                      <button
                        key={entry.value}
                        onClick={() => setColor(entry.value)}
                        className="h-3.5 w-3.5 rounded-full transition-transform"
                        style={{
                          backgroundColor: entry.dot,
                          transform: color === entry.value ? 'scale(1.35)' : 'scale(1)',
                          boxShadow: color === entry.value ? `0 0 0 1.5px white, 0 0 0 3px ${entry.dot}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={saveSelectionNote}
                    disabled={!hasSelection || !noteDraft.trim()}
                    className="rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-35 transition-opacity hover:opacity-90"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {savedState === 'note' ? '✓ Saved' : 'Save note'}
                  </button>
                </div>
              </>
            )}

            {/* ════ SHELF TAB ════ */}
            {tab === 'shelf' && (
              <>
                <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${muted}`}>
                  {format(currentDate, 'MMMM yyyy')} — {currentMonthNotes.length} saved
                </p>

                {currentMonthNotes.length === 0 ? (
                  <div className={`rounded-xl border border-dashed p-4 text-center ${darkMode ? 'border-zinc-700 text-zinc-500' : 'border-black/10 text-zinc-400'}`}>
                    <Bookmark size={18} className="mx-auto mb-2 opacity-30" />
                    <p className="text-[11px]">No notes for this month yet.</p>
                    <button
                      onClick={() => setTab('note')}
                      className="mt-2 text-[10px] font-semibold"
                      style={{ color: theme.primaryColor }}
                    >
                      Add one →
                    </button>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {currentMonthNotes.map(note => {
                      const cm = NOTE_COLORS.find(e => e.value === note.color) ?? NOTE_COLORS[0];
                      const catLabel = CATEGORY_META[note.category ?? 'memory'].short;
                      return (
                        <motion.div
                          key={note.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          className="rounded-xl border p-3"
                          style={{ backgroundColor: darkMode ? cm.bgDark : cm.bg, borderColor: `${cm.dot}44` }}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]"
                                style={{ backgroundColor: `${cm.dot}22`, color: cm.dot }}
                              >
                                {catLabel}
                              </span>
                              <span className={`text-[9px] font-medium ${muted}`}>
                                {format(new Date(note.rangeStart), 'MMM d')}
                                {note.rangeEnd !== note.rangeStart
                                  ? ` → ${format(new Date(note.rangeEnd), 'MMM d')}` : ''}
                              </span>
                            </div>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="flex-shrink-0 rounded-full p-0.5 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                          <p className={`text-[11px] leading-snug ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {note.content}
                          </p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
}
