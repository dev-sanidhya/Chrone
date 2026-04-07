import type { Metadata } from 'next';
import { Inter, Playfair_Display, Patrick_Hand } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-patrick',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chrone — Interactive Wall Calendar',
  description:
    'A stunning interactive wall calendar with day-range selection, seasonal themes, integrated notes, and smooth animations.',
  keywords: ['calendar', 'planner', 'wall calendar', 'date picker', 'notes'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${patrickHand.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
