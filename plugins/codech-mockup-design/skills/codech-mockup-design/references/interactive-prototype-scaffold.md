# Interactive Prototype Scaffold Reference

Quick-start commands and file templates for Phase 7 (interactive prototype).

## Setup commands

```bash
# From project root
pnpm create vite prototype --template react-ts
cd prototype
pnpm install

# Tailwind
pnpm add tailwindcss @tailwindcss/vite -D

# Framer Motion + icons
pnpm add framer-motion lucide-react

# shadcn/ui
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card badge separator input tabs \
  sheet dialog command scroll-area avatar tooltip accordion

# Run
pnpm dev
```

## vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## src/lib/tokens.ts (template — customize per project)

```ts
export const tokens = {
  colors: {
    bg: '#FAFAFA',
    surface: '#FFFFFF',
    border: '#E7E5E4',
    borderStrong: '#D6D3D1',
    fg: '#0A0A0B',
    fgMuted: '#57534E',
    fgSubtle: '#A8A29E',
    accent: '#F97316',
    accentHover: '#EA580C',
    accentSubtle: '#FFEDD5',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  fonts: {
    display: "'General Sans', system-ui, sans-serif",
    serif: "'Instrument Serif', Georgia, serif",
    mono: "'JetBrains Mono', Menlo, monospace",
  },
  gradients: {
    ai: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 33%, #F97316 66%, #FBBF24 100%)',
  },
} as const;
```

## src/lib/animations.ts (reusable Framer Motion variants)

```ts
import type { Variants, Transition } from 'framer-motion';

// The locked easing curve from the design system
export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6,
} as const;

// Entrance — fade + slide up (most common)
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slower, ease },
  },
};

// Entrance — fade + scale (for hero moments)
export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slower, ease },
  },
};

// Stagger container (wrap around a list of children)
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Stagger child (each item in the staggered list)
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

// Card hover — lift + shadow
export const cardHover = {
  y: -4,
  transition: { duration: duration.fast, ease } as Transition,
};

// Button tap — subtle scale down
export const tapScale = { scale: 0.98 };

// Scroll-triggered section entrance
export const sectionViewport = {
  once: true,
  margin: '-100px' as const,
};
```

## Component pattern (every section follows this)

```tsx
'use client';

import { motion } from 'framer-motion';
import {
  fadeInUp,
  staggerContainer,
  staggerChild,
  sectionViewport,
} from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Step {
  num: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { num: 1, title: 'Browse & fall in love', description: '...' },
  { num: 2, title: 'Buy & deploy in 60s', description: '...' },
  { num: 3, title: 'Customize with AI', description: '...' },
];

export function HowItWorks() {
  return (
    <section className="px-8 md:px-12 py-16 bg-white">
      <motion.div
        className="max-w-4xl mx-auto text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={fadeInUp}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
          How it works
        </p>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
          Three steps. <em className="font-serif font-normal">That's it.</em>
        </h2>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={staggerContainer}
      >
        {steps.map((step) => (
          <motion.div key={step.num} variants={staggerChild}>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl font-semibold text-orange-600">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

## Page routing (App.tsx)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from '@/pages/Landing';
import { Marketplace } from '@/pages/Marketplace';
import { Detail } from '@/pages/Detail';
import { Dashboard } from '@/pages/Dashboard';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Marketplace />} />
        <Route path="/site/:slug" element={<Detail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Add `react-router-dom` if using page routing:

```bash
pnpm add react-router-dom
```

## Mock data (src/lib/mock-data.ts)

Hardcode the same sites from the static showcase so the prototype matches:

```ts
export const mockSites = [
  {
    slug: 'maren-holistic-studio',
    title: 'Maren Holistic Studio',
    category: 'Wellness',
    style: 'Minimal',
    tier: 'limited' as const,
    editionCap: 25,
    editionsSold: 7,
    priceTemplate: 79,
    priceLimited: 299,
    priceExclusive: 899,
    monthlyFee: 29,
    status: 'available' as const,
    isNew: true,
    isAIRecommended: true,
    previewGradient: 'from-stone-100 to-stone-200',
  },
  // ... add more from the showcase
];
```

## Simulated AI chat

For the AI chat, don't build a real backend — simulate responses with delayed state updates:

```tsx
const simulateAIResponse = (userMessage: string) => {
  // Show typing indicator
  setIsTyping(true);

  // Simulate delay
  setTimeout(() => {
    setIsTyping(false);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: getResponseForPrompt(userMessage),
    }]);
  }, 1500);
};
```