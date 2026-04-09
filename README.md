# Chrone — Interactive Wall Calendar

A richly-animated, fully-responsive interactive wall calendar built as an internship assignment. Designed to feel exactly like a physical wall calendar — complete with spiral binding rings, seasonal gallery prints, page-flip animations, and a persistent notes system — while delivering a polished web experience with no backend required.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`, `@theme inline`) |
| Animation | Framer Motion 12 |
| Date logic | date-fns v4 |
| Icons | Lucide React |
| Fonts | Inter + Playfair Display (via `next/font/google`) |
| Persistence | `localStorage` — no backend, no environment variables |

---

## Features

### Wall Calendar Aesthetic

The entire UI is built around the metaphor of a real wall calendar hanging on a wall.

- **Spiral binding rings** rendered at the top of the card via `BindingRings.tsx`. Ring colour adapts to the active month theme.
- **Paper-card layout** with a warm off-white `#fdf9f1` background, subtle paper texture, and a multi-layer `box-shadow` that gives depth as if the calendar is raised off the wall.
- **No external images** — the hero illustration is generated entirely from CSS gradients, SVG shapes, emoji, and animated particles. Nothing can break or 404.
- The card is `h-screen overflow-hidden` on desktop, filling the viewport exactly — no scroll, no overflow.

### 12 Monthly Themes

Every month has a completely unique identity defined in `lib/themes.ts`:

| Month | Accent | Particle | Season |
|---|---|---|---|
| January | Blue | Snow ❄ | Winter |
| February | Rose | Petals ✿ | Winter |
| March | Green | Petals ✿ | Spring |
| April | Violet | Petals ✿ | Spring |
| May | Lime | Petals ✿ | Spring |
| June | Orange | Sparkles ✦ | Summer |
| July | Sky | Sparkles ✦ | Summer |
| August | Yellow | Sparkles ✦ | Summer |
| September | Amber | Leaves 🍁 | Fall |
| October | Burnt orange | Leaves 🍁 | Fall |
| November | Gold | Leaves 🍁 | Fall |
| December | Green | Snow ❄ | Winter |

Each theme carries a `primaryColor`, `accentColor`, `ringColor`, a three-stop hero gradient, and an inspirational `quote` + `author`. These values propagate to every component — the binding rings, tab underlines, selection highlights, and button accents all change colour automatically when you navigate months.

### Hero Panel (`HeroPanel.tsx`)

The left panel of the desktop layout (full-width on mobile):

- **Gallery print** (`GalleryPrint.tsx`) — a `clamp(130px, 22vw, 172px)` tall illustration card showing a `SeasonScene` (SVG + gradient landscape) for the current season. Overlaid with the month's collection title and an edition badge. The illustration fills the card completely with a dark gradient at the bottom for text legibility.
- **Caption card** — a frosted-glass info strip below the illustration displaying: month name, year, edition badge, days-remaining countdown, month progress bar (%), and the current month's curated `memoryPrompt` or saved Monthly Memo in italic Playfair Display.
- **Live clock** — ticking `HH:MM:SS` display, updated every second.
- **Year-view button** — grid icon opens a full-year overview (`YearView.tsx`) as a modal overlay.
- **Dark/Light mode toggle** — moon/sun icon, preference saved to `localStorage`.

### Calendar Grid (`CalendarGrid.tsx`)

The main calendar grid on the right side of the desktop (full-screen tab on mobile):

- **Month navigation** — `Today` button (left), current month + year (centre), `‹ ›` arrows + ISO week number (right). No overflow, no crowding.
- **Animated month transitions** — changing month triggers a `rotateY` spring animation (`AnimatePresence` + `motion.div` with `perspective: 1500px`). The calendar flips on the Y-axis, like turning a real calendar page.
- **Date cells** (`DayCell.tsx`) — each cell uses `h-full` with CSS `gridAutoRows: 1fr`, expanding evenly to fill all available vertical space. States:
  - Today — circled with the month's `primaryColor`
  - Selected range — highlighted fill between start and end
  - Hover preview — real-time range preview as you move the mouse before confirming the end date
  - Out-of-month days — dimmed
  - Weekend columns — coloured accent text
- **Holiday markers** — 24 US + observance + fun holidays from `lib/holidays.ts` rendered as emoji dots on the date cell. Hover shows the holiday name as a tooltip.
- **Moon phase markers** — approximate lunar phase emoji shown on relevant dates.
- **Sticker system** — double-tap any date to open the emoji sticker picker (36 stickers across 6 categories). Placed sticker appears on the date cell. Tap the same sticker again to remove it. Placement triggers a confetti burst.
- **Stats bar** — shows total days in month, number of weekend days, and number of holidays.
- **Selection hint** — "double-tap to sticker" shown until interaction begins.
- **Range selection pill** — once a start + end date is selected, an animated pill appears showing `N days · MMM d → MMM d` with a clear (×) button.

### Notes Panel — 3-Tab Architecture (`NotesPanel.tsx`)

The left panel on desktop (full-screen tab on mobile). Three tabs, each switching with a physical wall-calendar page-flip animation:

#### Memo tab (Pin icon)
A single persistent textarea for the current month. Saved text appears in the hero caption card. Visible "always" — the memo persists for the whole month and is displayed in the hero even when you're on other tabs. `SAVE MEMO` button triggers a confetti burst on save.

#### Note tab (StickyNote icon)
Activated automatically when you select a date range on the calendar. Write a note for the selected period:
- **Title** — optional, displayed in the shelf card header
- **Content** — free text, with live character count
- **Colour swatch** — 6 options: yellow, rose, sky, emerald, violet, amber. The saved card adopts the selected background colour.
- **Category tag** — 5 options: Memory, Trip, Focus Block, Celebration, Personal. Each displays as a coloured badge on the shelf card.
- `SAVE NOTE` navigates automatically to the Shelf tab after saving.

#### Shelf tab (Bookmark icon)
A scrollable archive of all saved notes, sorted by creation date. Each card shows:
- Date range it was attached to
- Title + category badge
- Full note content
- Trash icon to delete (with confirmation)

Badge counts on the tab bar show how many notes are saved.

### Physical Page-Flip Animation

The defining animation of the project. Used on both the Notes Panel tabs (Memo/Note/Shelf) and the mobile Calendar/Notes tab switch:

- **Exit** — current page snaps upward in 0.2s with an ease-in curve (`[0.4, 0, 1, 0.6]`), simulating quickly flicking a page over the binding rings. Opacity fades in 0.12s.
- **Enter** — new page starts folded away (`rotateX: 90°`) and falls into place driven by a spring (`stiffness: 220, damping: 18, mass: 1.1`). The higher mass + lower damping produces a noticeable overshoot — the page "slaps" down just like heavy paper landing against the calendar face.
- **Direction** — both exit endpoint and entry start point use `rotateX: 90°`. With `transformOrigin: 'top center'` (pivot at the binding rings), the motion is unidirectional: everything folds back into the wall and unfolds from behind it.
- **Perspective** — `1100px` at the container level gives enough depth that the 90° mid-flip looks like a clean edge-on disappearance rather than a skewed plane.

### Animated Particles (`Particles.tsx`)

Season-aware floating elements that drift across the hero panel:

| Season | Particle | Motion |
|---|---|---|
| Winter | ❄ Snowflakes | Slow drift downward with horizontal sway |
| Spring | ✿ Petals | Gentle diagonal fall |
| Summer | ✦ Sparkles | Float upward, fade out |
| Fall | 🍁 Leaves | Tumble and drift sideways |

Each particle has a randomised `--drift` CSS custom property so paths feel organic rather than mechanical. Rendered as CSS-only animations for zero JS overhead.

### Confetti System (`Confetti.tsx`)

A `confettiTrigger` counter in `WallCalendar.tsx` increments on:
- Saving a new note
- Placing a sticker on a date

Each trigger fires a burst of coloured confetti pieces that fall from the top of the viewport using `@keyframes confettiFall` defined in `globals.css`.

### Year View (`YearView.tsx`)

A 12-month grid overlay opened from the hero panel's grid icon. Shows all months for the current year. Months that have saved notes get a dot indicator. Click any month to navigate directly to it and close the overlay. Animated in/out with `AnimatePresence`.

### Dark Mode

One-click toggle between light and dark mode stored to `localStorage`. All components respect the `darkMode` boolean prop threaded from `WallCalendar.tsx`. Dark mode uses `bg-zinc-900` for the card and `bg-zinc-950` for the outer background.

### Mobile Responsiveness

- Below `640px` (`sm` breakpoint), the desktop side-by-side layout is replaced by a **tab bar** with two tabs: `CALENDAR` and `NOTES`.
- The tab bar uses an animated underline indicator (`layoutId="mobile-tab-indicator"`) that slides between tabs.
- Each tab fills all remaining vertical space below the hero using `flex-1 min-h-0` — the calendar grid is fully visible with all date rows, no scrolling required.
- The `AnimatePresence` content wrapper uses `absolute inset-0 flex flex-col` with `perspective: 1100px` for the same page-flip animation as desktop.
- Selecting a date range on the Calendar tab automatically switches to the Notes tab.
- The sticker picker modal anchors to the bottom of the screen on mobile (`items-end`), matching native mobile sheet behaviour.
- `GalleryPrint` illustration uses `clamp(130px, 22vw, 172px)` height — slightly shorter on narrow phones to give the calendar more room.

---

## Project Structure

```
wall-calendar/
├── app/
│   ├── globals.css          # Tailwind v4 config, confetti keyframes, scrollbar utilities
│   ├── layout.tsx           # Root layout — Google Fonts (Inter + Playfair Display)
│   └── page.tsx             # Entry point — renders <WallCalendar />
├── components/
│   ├── WallCalendar.tsx     # Root state container — all state, localStorage, event handlers
│   ├── HeroPanel.tsx        # Left panel: clock, gallery print, caption card, dark mode toggle
│   ├── GalleryPrint.tsx     # Monthly illustration card with season scene + text overlays
│   ├── SeasonScene.tsx      # SVG gradient landscape that changes by season
│   ├── CalendarGrid.tsx     # Month grid: nav, animated transitions, stats, selection pill
│   ├── DayCell.tsx          # Single date cell: all visual states (today, range, hover, holiday)
│   ├── NotesPanel.tsx       # 3-tab panel: Memo / Note editor / Shelf archive
│   ├── Particles.tsx        # CSS-animated seasonal floating particles
│   ├── BindingRings.tsx     # Decorative spiral binding rings at the top of the card
│   ├── YearView.tsx         # 12-month overview modal
│   └── Confetti.tsx         # Confetti burst triggered on note save and sticker placement
└── lib/
    ├── types.ts             # Shared TypeScript interfaces (DateRange, Note, MonthTheme, Holiday…)
    ├── themes.ts            # 12 MonthTheme definitions (colours, gradients, quotes, particles)
    ├── holidays.ts          # 24 holiday entries + lookup helpers (getHolidayForDate, getNextHoliday)
    └── monthArtifacts.ts    # Per-month gallery titles, captions, memory prompts, category metadata
```

---

## Running Locally

```bash
# 1. Clone
git clone https://github.com/dev-sanidhya/Chrone.git
cd Chrone

# 2. Install
npm install

# 3. Dev server (Turbopack)
npm run dev
```

Open **http://localhost:3000**.

```bash
# Production build
npm run build && npm start
```

No environment variables. No database. No API keys.

---

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dev-sanidhya/Chrone)

One-click deploy to Vercel. Everything is static-first and runs entirely client-side.

---

## Design Notes

**Viewport-fitted layout** — the outer container is `h-screen overflow-hidden`. The card is `h-full flex flex-col`. The body below the hero uses `flex-1 min-h-0` to take exactly the remaining space. Date cells use `gridAutoRows: 1fr` + `absolute inset-0` so all rows expand equally regardless of how much space is available.

**Dynamic colours via inline styles** — month theme colours (`primaryColor`, `accentColor`, etc.) are JavaScript values that change on navigation. Structural layout is all Tailwind; colours that need to be dynamic are applied via `style={{ color: theme.primaryColor }}`. A CSS custom property `--theme-primary` is also set on the outer container for any cases where Tailwind alone is insufficient.

**No external images** — the `SeasonScene` component generates the hero landscape from SVG paths and CSS gradients. The four seasonal scenes (winter, spring, summer, fall) cover all twelve months. This means the calendar looks correct in every environment, even offline.

**localStorage only** — notes, monthly memos, stickers, dark mode preference, and all user data are stored in `localStorage` under versioned keys (`chrone-notes-v3`, `chrone-month-memos-v1`, `chrone-events-v1`, `chrone-dark-mode`). No account, no server, no data ever leaves the browser.
