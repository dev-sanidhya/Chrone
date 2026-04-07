'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { FileText, Save, Trash2, X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { DateRange, Note, NoteColor, MonthTheme } from '@/lib/types';

const NOTE_COLORS: { value: NoteColor; bg: string; bgDark: string; border: string; label: string }[] = [
  { value: 'yellow',  bg: '#fefce8', bgDark: '#422006', border: '#eab308', label: 'Yellow'  },
  { value: 'rose',    bg: '#fff1f2', bgDark: '#4c0519', border: '#f43f5e', label: 'Rose'    },
  { value: 'sky',     bg: '#f0f9ff', bgDark: '#0c4a6e', border: '#38bdf8', label: 'Sky'     },
  { value: 'emerald', bg: '#f0fdf4', bgDark: '#14532d', border: '#22c55e', label: 'Emerald' },
  { value: 'violet',  bg: '#f5f3ff', bgDark: '#2e1065', border: '#a855f7', label: 'Violet'  },
  { value: 'amber',   bg: '#fffbeb', bgDark: '#451a03', border: '#f59e0b', label: 'Amber'   },
];

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
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<NoteColor>('yellow');
  const [saved, setSaved] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const hasStart = !!selectedRange.start;
  const hasRange = hasStart && !!selectedRange.end;

  const rangeLabel = hasRange
    ? `${format(selectedRange.start!, 'MMM d')} – ${format(selectedRange.end!, 'MMM d, yyyy')}`
    : hasStart
    ? format(selectedRange.start!, 'MMMM d, yyyy')
    : '';

  const days = hasRange ? differenceInDays(selectedRange.end!, selectedRange.start!) + 1 : 1;

  const handleSave = () => {
    if (!content.trim() || !selectedRange.start) return;

    if (editId) {
      onSaveNotes(notes.map(n => n.id === editId ? { ...n, content: content.trim(), title: title.trim() || rangeLabel, color } : n));
      setEditId(null);
    } else {
      const newNote: Note = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        rangeStart: selectedRange.start.toISOString(),
        rangeEnd: (selectedRange.end ?? selectedRange.start).toISOString(),
        content: content.trim(),
        color,
        createdAt: new Date().toISOString(),
        title: title.trim() || rangeLabel,
      };
      onSaveNotes([...notes, newNote]);
    }

    setContent('');
    setTitle('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleEdit = (note: Note) => {
    setEditId(note.id);
    setContent(note.content);
    setTitle(note.title);
    setColor(note.color);
    setTimeout(() => textRef.current?.focus(), 100);
  };

  const handleDelete = (id: string) => {
    onSaveNotes(notes.filter(n => n.id !== id));
    if (editId === id) { setEditId(null); setContent(''); setTitle(''); }
  };

  const panelBg = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100';
  const cardBg = darkMode ? 'bg-zinc-800' : 'bg-white';
  const inputCls = `w-full text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 transition-all resize-none ${
    darkMode
      ? 'bg-zinc-700 border-zinc-600 text-zinc-200 placeholder-zinc-500 focus:ring-zinc-500'
      : 'bg-zinc-50 border-zinc-200 text-zinc-700 placeholder-zinc-400 focus:ring-zinc-300'
  }`;

  return (
    <div className={`border-t ${panelBg} transition-colors duration-300`}>
      {/* ── Section header ── */}
      <div className="max-w-6xl mx-auto px-6 pt-4 pb-2 flex items-center gap-2">
        <FileText size={15} style={{ color: theme.primaryColor }} />
        <h3 className={`text-sm font-bold ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
          Notes &amp; Memos
        </h3>
        {notes.length > 0 && (
          <span
            className="ml-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
          >
            {notes.length}
          </span>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`ml-auto p-1 rounded-lg transition-colors ${darkMode ? 'hover:bg-zinc-700 text-zinc-500' : 'hover:bg-zinc-200 text-zinc-400'}`}
          aria-label={collapsed ? 'Expand notes' : 'Collapse notes'}
        >
          {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
        </button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* ── Editor ── */}
              <AnimatePresence mode="wait">
                {hasStart ? (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    className={`rounded-2xl p-4 shadow-sm border ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'}`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className={`text-[10px] font-medium ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          {days} day{days !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm font-bold mt-0.5" style={{ color: theme.primaryColor }}>
                          {rangeLabel}
                        </p>
                      </div>
                      <button
                        onClick={() => { onClearSelection(); setEditId(null); setContent(''); setTitle(''); }}
                        className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-zinc-700 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'}`}
                        aria-label="Clear selection"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    {/* Title */}
                    <input
                      type="text"
                      placeholder="Note title (optional)"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className={`${inputCls} mb-2 font-medium`}
                    />

                    {/* Textarea */}
                    <textarea
                      ref={textRef}
                      placeholder={`Jot something down for ${rangeLabel}…`}
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      rows={4}
                      className={inputCls}
                    />

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Color swatches */}
                      <div className="flex gap-1.5 flex-wrap">
                        {NOTE_COLORS.map(c => (
                          <button
                            key={c.value}
                            onClick={() => setColor(c.value)}
                            title={c.label}
                            className="w-5 h-5 rounded-full transition-transform"
                            style={{
                              backgroundColor: darkMode ? c.bgDark : c.bg,
                              border: `2.5px solid ${c.border}`,
                              transform: color === c.value ? 'scale(1.3)' : 'scale(1)',
                              boxShadow: color === c.value ? `0 0 0 2px ${c.border}40` : 'none',
                            }}
                          />
                        ))}
                      </div>

                      {/* Character count + save */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] tabular-nums ${darkMode ? 'text-zinc-600' : 'text-zinc-300'}`}>
                          {content.length}/500
                        </span>
                        <button
                          onClick={handleSave}
                          disabled={!content.trim()}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white
                                     transition-all hover:opacity-90 hover:scale-105 active:scale-95
                                     disabled:opacity-35 disabled:cursor-not-allowed disabled:scale-100"
                          style={{ backgroundColor: theme.primaryColor }}
                        >
                          {saved ? (
                            <motion.span
                              initial={{ scale: 0.6 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-1"
                            >
                              ✓ Saved!
                            </motion.span>
                          ) : (
                            <>
                              <Save size={12} />
                              {editId ? 'Update' : 'Save'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`rounded-2xl p-6 flex flex-col items-center justify-center text-center border-2 border-dashed ${
                      darkMode ? 'border-zinc-700 text-zinc-600' : 'border-zinc-200 text-zinc-400'
                    }`}
                  >
                    <Plus size={20} className="mb-2 opacity-40" />
                    <p className="text-sm">Select a date to add a note</p>
                    <p className="text-[11px] mt-1 opacity-60">Or select a range for a trip / event</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Saved notes list ── */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                <AnimatePresence initial={false}>
                  {notes.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.45 }}
                      className={`text-sm text-center py-10 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}
                    >
                      No notes saved yet
                    </motion.div>
                  ) : (
                    [...notes].reverse().map(note => {
                      const c = NOTE_COLORS.find(x => x.value === note.color) ?? NOTE_COLORS[0];
                      return (
                        <motion.div
                          key={note.id}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0, paddingBottom: 0 }}
                          transition={{ duration: 0.22 }}
                          className="rounded-xl p-3 relative group cursor-pointer"
                          style={{
                            backgroundColor: darkMode ? c.bgDark : c.bg,
                            borderLeft: `3px solid ${c.border}`,
                          }}
                          onClick={() => handleEdit(note)}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold truncate" style={{ color: c.border }}>
                                {note.title}
                              </p>
                              <p className={`text-xs mt-0.5 line-clamp-2 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                {note.content}
                              </p>
                              <p className={`text-[9px] mt-1 opacity-50 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                {format(new Date(note.createdAt), 'MMM d, yyyy · h:mm a')}
                              </p>
                            </div>
                            <button
                              onClick={e => { e.stopPropagation(); handleDelete(note.id); }}
                              className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg
                                         hover:bg-red-100 dark:hover:bg-red-900/40 text-red-400 transition-all"
                              aria-label="Delete note"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
