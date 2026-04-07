# 🗓 Chrone — Interactive Wall Calendar

A polished, fully-responsive interactive wall calendar built with **Next.js 16**, **Tailwind CSS v4**, and **Framer Motion**. Designed to feel like a real physical wall calendar while delivering a rich, animated web experience.

---

## ✨ Features

### Core
| Feature | Details |
|---|---|
| **Wall Calendar Aesthetic** | Spiral binding rings, seasonal hero panel, paper-card layout |
| **Day Range Selector** | Click to set start → click to set end; real-time hover preview of the range |
| **Integrated Notes** | Color-coded notes attached to any date or range; persisted via `localStorage` |
| **Fully Responsive** | Desktop: side-by-side hero + grid. Mobile: stacked, touch-friendly |

### Visual & Creative Extras
- **12 Unique Month Themes** — Each month has its own colour palette, gradient, and seasonal emoji
- **Animated Particles** — Season-aware floating elements: ❄ snowflakes, ✿ petals, ✦ sparkles, 🍁 leaves
- **Smooth Month Transitions** — Spring-physics slide animation (Framer Motion `AnimatePresence`)
- **Live Clock** — Ticking HH:MM:SS display in the hero panel
- **Month Progress Bar** — Shows how many days of the month have elapsed
- **Holiday Markers** — 24 US/fun holidays shown as emoji dots on dates with tooltip titles
- **"Next Holiday" Pill** — Countdown badge in the hero when a holiday is ≤ 30 days away
- **Dark / Light Mode** — One-click toggle, preference saved to `localStorage`
- **ISO Week Number** — Shown in the calendar footer
- **Selection Status Bar** — Animated pill showing `N days · MMM d → MMM d` when a range is selected
- **Notes Panel** — Collapsible, supports edit / delete, 6 colour swatches, character count
- **Keyboard Accessible** — All interactive elements are focusable / operable by keyboard

---

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Date logic | date-fns v4 |
| Icons | Lucide React |
| Fonts | Inter + Playfair Display (Google Fonts via `next/font`) |
| Persistence | `localStorage` (no backend needed) |

---

## 🚀 Running Locally

```bash
# 1. Clone
git clone https://github.com/dev-sanidhya/Chrone.git
cd Chrone

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

```bash
# Production build
npm run build && npm start
```

---

## 📁 Project Structure

```
wall-calendar/
├── app/
│   ├── globals.css          # Tailwind v4 config + custom animations
│   ├── layout.tsx           # Root layout, Google Fonts
│   └── page.tsx             # Entry point
├── components/
│   ├── WallCalendar.tsx     # Root state container
│   ├── HeroPanel.tsx        # Seasonal left panel (gradient + particles + clock)
│   ├── CalendarGrid.tsx     # Month grid with animated transitions
│   ├── DayCell.tsx          # Individual day cell (all visual states)
│   ├── NotesPanel.tsx       # Collapsible notes editor + saved cards
│   ├── Particles.tsx        # CSS-animated floating seasonal particles
│   └── BindingRings.tsx     # Decorative spiral binding at the top
└── lib/
    ├── types.ts             # Shared TypeScript interfaces
    ├── themes.ts            # 12 month theme definitions
    └── holidays.ts          # Holiday data + helpers
```

---

## 🎨 Design Decisions

1. **No external images** — The hero panel uses CSS gradients + emoji + animated particles, ensuring zero broken images and a unique look per month.
2. **Inline styles for dynamic colours** — Theme primary/accent colours come from JS objects; Tailwind handles structural layout.
3. **`localStorage` only** — Keeps the project strictly frontend, as required. Notes survive page refreshes.
4. **Framer Motion `AnimatePresence`** — Month-change slide + hero emoji pop feel polished without heavy libraries.
5. **Particle drift** — Each particle has a randomised `--drift` CSS variable so the fall paths feel organic, not mechanical.

---

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dev-sanidhya/Chrone)

One-click deploy — no environment variables needed.
