# PoC Prototype HTML Scaffold

> Single-file React prototype that opens in any browser, no build step. The Codech pattern.

## Goals

- **Zero installation** — opens in any modern browser
- **shadcn aesthetic** — without `npm install` (replicated with Tailwind utility classes)
- **Framer Motion choreography** — page transitions, list stagger, modal springs, status timelines
- **Locale-appropriate content** — Trad Chinese for HK projects, etc.
- **Real-feeling data** — local farm names, plausible numbers, believable Cantonese chatbot

## Tech stack (CDN-only)

| Layer | Source | Purpose |
|---|---|---|
| React 18 | `https://esm.sh/react@18.3.1` | Framework |
| ReactDOM | `https://esm.sh/react-dom@18.3.1/client` | Mount |
| JSX Runtime | `https://esm.sh/react@18.3.1/jsx-runtime` | Required by FM/Lucide |
| Framer Motion 11 | `https://esm.sh/framer-motion@11.5.4?external=react` | Animation |
| Lucide Icons | `https://esm.sh/lucide-react@0.453.0?external=react` | SVG icons |
| Tailwind CSS 3 | `https://cdn.tailwindcss.com` | Styling (Play CDN) |
| **Babel Standalone** | `https://unpkg.com/@babel/standalone@7.25.6/babel.min.js` | **REQUIRED — compiles JSX** |
| Google Fonts | `fonts.googleapis.com` | Noto Sans TC + Inter + JetBrains Mono |

The `?external=react` query on FM and Lucide tells esm.sh to leave React as external so all packages share the React instance. Skip it and you get duplicate-React errors.

## File skeleton

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{{ Project }} — Interactive Prototype</title>

<!-- Tailwind Play CDN with custom config -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand:   { 50:'...', ..., 900:'...' },  /* generated from brand primary */
          gold:    { ... },                        /* accent palette */
          bg:       '#FAFAFA',
          card:     '#FFFFFF',
          border:   '#E5E7EB',
          muted:    '#F1F5F9',
          'muted-fg':'#64748B',
          fg:       '#0F172A',
          success:  '#16A34A',
          warning:  '#EAB308',
          danger:   '#DC2626',
        },
        fontFamily: {
          sans: ['"Noto Sans TC"','"PingFang TC"','"Microsoft JhengHei"','"Inter"','sans-serif'],
          mono:['"JetBrains Mono"','ui-monospace','SFMono-Regular','monospace'],
        },
        boxShadow: {
          'card': '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
          'pop':  '0 10px 30px -10px rgba(0,0,0,0.18)',
        },
      }
    }
  };
</script>

<!-- Pre-connect to Google Fonts (faster first paint) -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<style>
  /* Custom CSS: scrollbar, focus rings, device frame, etc. */
  html, body { font-family: 'Noto Sans TC', 'Inter', sans-serif; background: #FAFAFA; }
  *:focus-visible { outline: 2px solid #2E7D32; outline-offset: 2px; }
  /* ... */
</style>

<!-- IMPORTANT: importmap must come BEFORE Babel script -->
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
    "framer-motion": "https://esm.sh/framer-motion@11.5.4?external=react",
    "lucide-react": "https://esm.sh/lucide-react@0.453.0?external=react"
  }
}
</script>

<!-- Babel Standalone — REQUIRED for JSX -->
<script src="https://unpkg.com/@babel/standalone@7.25.6/babel.min.js"></script>

</head>
<body class="antialiased">
<div id="root"></div>

<!-- CRITICAL: type + data-type + data-presets -->
<script type="text/babel" data-type="module" data-presets="react">
import React, { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, ShoppingCart, /* ... */
} from "lucide-react";

// === Helpers
const cx = (...args) => args.filter(Boolean).join(" ");

// === Sample Data
const SAMPLE_CUSTOMERS = [ ... ];
const SAMPLE_ORDERS = [ ... ];

// === Atom Components (shadcn-style)
const Button = React.forwardRef(({ variant="default", size="md", className, ...p }, ref) => {
  const variants = { default: "...", outline: "...", ghost: "...", danger: "..." };
  const sizes = { sm: "h-8 px-3 text-xs", md: "h-9 px-4 text-sm", lg: "h-10 px-5 text-sm", icon: "h-9 w-9 p-0" };
  return <button ref={ref}
    className={cx("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all active:scale-[0.98]",
      variants[variant], sizes[size], className)}
    {...p}/>;
});
const Card = ({ className, ...p }) => <div className={cx("rounded-xl border border-border bg-card shadow-card", className)} {...p}/>;
const Badge = ({ variant="default", ...p }) => { /* ... */ };
const Input = ({ className, ...p }) => <input className={cx("h-9 w-full rounded-md border border-border bg-white px-3 text-sm placeholder:text-muted-fg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none", className)} {...p}/>;
const Avatar = ({ name="?", className }) => <div className={cx("inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold w-8 h-8", className)}>{name.slice(0,1)}</div>;

// === Layout
const Sidebar = ({ view, setView, collapsed, setCollapsed }) => { /* ... */ };
const TopBar = ({ onLogout }) => { /* ... */ };
const PageHeader = ({ title, subtitle, breadcrumb, actions }) => { /* ... */ };

// === Screens (one function per view)
function LoginScreen({ onLogin }) { /* ... */ }
function DashboardScreen() { /* ... */ }
function PosOrderListScreen() { /* ... */ }
// ... 20+ screens

// === Chatbot Widget (floating overlay)
function ChatbotWidget({ open, setOpen }) { /* ... */ }

// === Root App
function App() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState("dashboard");
  // ... view + sub-view state

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)}/>;

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar view={view} setView={setView} {...sidebarProps}/>
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar onLogout={() => setAuthed(false)}/>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={viewKey}
              initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-4}}
              transition={{duration:0.22, ease:"easeOut"}}>
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <ChatbotWidget open={chatOpen} setOpen={setChatOpen}/>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App/>);
</script>
</body>
</html>
```

## Critical script tag attributes

```html
<script type="text/babel" data-type="module" data-presets="react">
```

| Attribute | Required | Why |
|---|---|---|
| `type="text/babel"` | YES | Tells Babel to intercept this script |
| `data-type="module"` | YES | Tells Babel to output a module (so import/importmap work) |
| `data-presets="react"` | YES | Enables JSX transform |

If ANY of these is missing, you get a blank page. See `gotchas.md`.

## Required atom components

Implement these in every prototype (reused across screens):

| Component | Variants | Usage |
|---|---|---|
| `Button` | default, outline, ghost, secondary, danger, gold | All clickable actions |
| `Card`, `CardHeader`, `CardTitle`, `CardContent` | n/a | Container for any boxed content |
| `Badge` | default, brand, gold, success, warning, danger, info | Status pills, tags |
| `Input` | n/a | Text inputs |
| `Label` | n/a | Form labels |
| `Avatar` | with size className | User initials |
| `Skeleton` | n/a | Loading state |
| `Divider` | n/a | Visual separator |
| `Tabs` | with active animation | Sub-views within a screen |

## Layout components

| Component | Purpose |
|---|---|
| `Sidebar` | Collapsible left nav; sticky brand block; nav items with `layoutId` animated active indicator |
| `TopBar` | Search bar + right cluster (language toggle, bell, user pill, logout); use `ml-auto` on right cluster |
| `PageHeader` | Breadcrumb + title + badge + actions; placed at top of every main screen |

## State-based router pattern

```jsx
const [view, setView] = useState("dashboard");
const [posView, setPosView] = useState("list");  // sub-view per module
const [selectedOrder, setSelectedOrder] = useState(null);

// Reset sub-view when switching main view:
useEffect(() => {
  if (view === "pos") setPosView("list");
}, [view]);

const renderView = () => {
  switch (view) {
    case "dashboard": return <DashboardScreen/>;
    case "pos":
      if (posView === "new")    return <PosNewSaleScreen goBack={()=>setPosView("list")}/>;
      if (posView === "detail") return <PosOrderDetailScreen order={selectedOrder} goBack={()=>setPosView("list")}/>;
      return <PosOrderListScreen goNewSale={()=>setPosView("new")}/>;
    // ...
  }
};

const viewKey = `${view}-${posView}`;  // for AnimatePresence
```

## Framer Motion patterns (most used)

### Page transition

```jsx
<AnimatePresence mode="wait">
  <motion.div key={viewKey}
    initial={{opacity:0, y:8}}
    animate={{opacity:1, y:0}}
    exit={{opacity:0, y:-4}}
    transition={{duration:0.22, ease:"easeOut"}}>
    {renderView()}
  </motion.div>
</AnimatePresence>
```

### Stagger list reveal

```jsx
<motion.div
  initial="hidden" animate="show"
  variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
  {items.map(item => (
    <motion.div key={item.id} variants={{
      hidden: { opacity: 0, y: 14 },
      show:   { opacity: 1, y: 0 }
    }}>
      <Card>...</Card>
    </motion.div>
  ))}
</motion.div>
```

### Active nav indicator (layout animation)

```jsx
{active && (
  <motion.div layoutId="nav-active"
    className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-brand-600"/>
)}
```

### Modal spring

```jsx
<motion.div
  initial={{scale:0.94, opacity:0, y:14}}
  animate={{scale:1, opacity:1, y:0}}
  exit={{scale:0.95, opacity:0}}
  transition={{type:"spring", stiffness:280, damping:24}}
  className="bg-white rounded-2xl shadow-pop">
```

### Chatbot streaming (token-by-token)

```jsx
const [streamText, setStreamText] = useState("");
useEffect(() => {
  let i = 0;
  const interval = setInterval(() => {
    i += Math.random() > 0.5 ? 2 : 1;
    setStreamText(fullText.slice(0, i));
    if (i >= fullText.length) clearInterval(interval);
  }, 40);
  return () => clearInterval(interval);
}, [fullText]);

// In render:
<div className="chat-bubble cursor-blink">{streamText}</div>
```

CSS:
```css
@keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
.cursor-blink::after { content:'▊'; margin-left:1px; animation:blink 1s steps(1) infinite; }
```

### Status timeline (sequential reveal)

```jsx
{timeline.map((t, i) => (
  <Fragment key={i}>
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: i * 0.12, type:"spring", stiffness: 300 }}>
      <Icon/>
    </motion.div>
    {i < timeline.length-1 && (
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: i * 0.12 + 0.08, duration: 0.3 }}
        className="connector origin-left"/>
    )}
  </Fragment>
))}
```

## Chatbot widget pattern

A floating bottom-right widget that opens a chat panel. Required parts:

1. **Floating button** with sparkle/bot icon
2. **Panel** (spring scale-up from bottom-right corner)
3. **Header** with gradient + bot avatar + status dot
4. **Messages area** (scrollable)
5. **Streaming bubble** with token-by-token reveal
6. **Tool call visualization** (gray monospace pill showing `tool › get_order_status(...)`)
7. **Identity verification** sub-flow (phone → 4-digit code)
8. **Input area** with disabled send + retention notice

Scripted conversation example (for HK ag project):
```jsx
const CHAT_SCRIPT = [
  { who:"bot",  text:"您好！我係合作社小助手 🌱 請問有咩可以幫到您？" },
  { who:"user", text:"我想知我有冇未付嘅單" },
  { who:"bot",  text:"為咗保障您嘅個人資料，請提供登記嘅電話號碼。" },
  { who:"user", text:"9123 4567" },
  { who:"bot",  text:"已發送 4 位驗證碼到您嘅 WhatsApp，請輸入。",
                tool:"send_verification_code(+852 9123 4567)" },
  // ...
];
```

## Screen list (for full module tour)

Reference list — implement what the project needs:

| Group | Screens |
|---|---|
| Auth | Login, 2FA Verification |
| Home | Dashboard (KPIs + chart + alerts + recent activity) |
| Module 1 (e.g., POS) | List, Detail, New (form), Receipt Modal |
| Module 2 (e.g., Seedling/Procurement) | List, Detail |
| Module 3 | Pipeline (Kanban), Detail |
| ... | ... |
| Reports | Library, Detail (≥1 with chart) |
| Notifications | Queue with approve/reject |
| Admin | Users, Settings (tabbed), Audit log, Backup |
| Special | Public mobile view (in device frame) |
| Overlay | AI Chatbot Widget |

Target: 20+ navigable views for "full tour" scope (Option C in `SKILL.md` Phase 4).

## Sample data conventions

Use REAL-feeling names and numbers from the client's actual industry/locale:

- HK agriculture: 紀強小農, 翠園農場, 綠田農莊 (not Foo Farm, Bar Co.)
- Receipt numbers: real format from existing receipts (e.g., `RG48-NNNNNNN`)
- Phone format: `+852 NNNN NNNN` for HK
- Realistic monetary values (not 100, 200, 300 — use 280, 580, 1240)
- Real supplier names from the requirements doc
- Realistic dates within the past month

## File size targets

| Metric | Target |
|---|---|
| Total HTML size | 80–150 KB (uncompressed) |
| Lines of code | 2,000–3,500 |
| First paint | < 2 seconds on fast Wi-Fi |
| Time to interactive | < 3 seconds |
| Concurrent CDN requests | ~6 (React, RD, FM, Lucide, Tailwind, Babel) |

## What NOT to include

- ❌ Form validation with zod (this is a prototype; validation can be cosmetic)
- ❌ Real authentication (all logins succeed)
- ❌ Real backend calls (all data is in-memory)
- ❌ Print stylesheets (the PoC is for screen review; printing comes in production)
- ❌ Accessibility audit (basic semantics OK; full WCAG comes in production)
- ❌ Comprehensive error states (happy path + 1-2 error examples is enough)
- ❌ TypeScript (Babel can compile it, but JSX-only is simpler for prototyping)

## Quality bar

Before considering the prototype "done":

- [ ] All planned screens are navigable from the sidebar
- [ ] Login flow works (mock 2FA accepted)
- [ ] At least one form has live state (e.g., add line items in New Sale)
- [ ] At least one transition uses `AnimatePresence` (page change)
- [ ] At least one stagger list (e.g., card grid or table rows)
- [ ] At least one spring modal
- [ ] Chatbot widget has scripted streaming + at least 1 tool call visualization
- [ ] No console errors when loading or navigating
- [ ] Renders correctly in Chrome AND Safari AND Edge
- [ ] Sample data uses locale-appropriate names and numbers
- [ ] Performance is smooth (no jank during transitions)
