# DeepLearn — Project Guidelines

## Project Overview

A self-study curriculum app tracing the historical development of ML and LLMs. Built as a Vite + React + TypeScript SPA with shadcn/ui components and Tailwind CSS v4.

## Stack

- **Runtime**: React 19, React Router 7
- **Build**: Vite 7, TypeScript 5.9
- **Styling**: Tailwind CSS v4, shadcn/ui (base-nova style, zinc base color)
- **Icons**: Hugeicons (`@hugeicons/react`)
- **Math rendering**: KaTeX (`katex`)
- **Syntax highlighting**: highlight.js
- **Font (global)**: Geist Variable (sans-serif, loaded via `@fontsource-variable/geist`)
- **Package manager**: Bun

## File Structure

```
src/
├── pages/
│   ├── home-page.tsx / home-page.css      # Home page
│   ├── chapter-X/
│   │   ├── index.tsx               # Chapter page component
│   │   ├── chapter-X.css         # Chapter-specific styles
│   │   ├── data.ts              # Topic definitions
│   │   ├── types.ts             # TypeScript types (TabId, TopicId)
│   │   ├── shared.tsx            # Shared components/helpers
│   │   └── topics/
│   │       ├── topic-name/
│   │       │   ├── tabs.tsx      # Tab content (named exports: TOPIC_TABS)
│   │       │   └── diagrams.tsx  # Optional SVG diagrams
│   └── chapter-shared.css       # Shared chapter styles (.ch-* classes)
├── components/
│   └── ui/                     # shadcn components
└── index.css                   # Global styles, Tailwind, markdown class
```

## Design Language

The app has a **dark academic / scholarly** aesthetic — dark backgrounds, warm amber accents, and a mix of serif display + monospace type. Every page uses a consistent custom property palette defined locally on the root element.

### Color Palette (CSS Variables)

All pages define these variables on their root class (`.hp`, `.ch`):

| Variable         | Value     | Usage                                  |
|------------------|-----------|----------------------------------------|
| `--ch-bg`        | `#0d0d10` | Page background                        |
| `--ch-panel`     | `#111115` | Header, sidebar, panel backgrounds     |
| `--ch-card`      | `#17171d` | Card / elevated surface                |
| `--ch-border`    | `#252530` | Borders and dividers                   |
| `--ch-amber`     | `#8a838` | Primary accent — labels, stats, CTAs   |
| `--ch-amber-dim` | `#7a5520` | Dimmed amber for inactive/locked items |
| `--ch-text`      | `#cdc9c0` | Primary body text                      |
| `--ch-muted`     | `#5e5b56` | Muted / secondary text                 |
| `--ch-soft`      | `#8e8a82` | Mid-tone text (descriptions)           |
| `--ch-green`     | `#5ab98c` | Available / complete status            |
| `--ch-blue`      | `#5a9ab9` | Informational accent                   |
| `--ch-purple`    | `#9b7fc7` | Tertiary accent                        |

### Background Texture

Every page has a subtle graph-paper grid overlay using a `::before` pseudo-element:

```css
.page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: linear-gradient(rgba(232, 168, 56, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232, 168, 56, 0.025) 1px, transparent 1px);
    background-size: 36px 36px;
    pointer-events: none;
    z-index: 0;
}
```

All content sits at `z-index: 1` or higher, above this texture.

### Typography

Three font families are used in a strict role hierarchy:

| Font                           | Role                                                       | CSS                                          |
|--------------------------------|------------------------------------------------------------|----------------------------------------------|
| **Playfair Display** (serif)   | Display headings, chapter titles, part titles, stats       | `font-family: 'Playfair Display', serif`     |
| **JetBrains Mono** (monospace) | Labels, badges, eyebrows, timestamps, metadata, topic tags | `font-family: 'JetBrains Mono', monospace`   |
| **Crimson Pro** (serif)        | Body / reading text, descriptions, appendix items          | `font-family: 'Crimson Pro', Georgia, serif` |

> Note: Geist Variable is the global Tailwind `font-sans` and is used in generic Tailwind utility classes, but the custom page CSS explicitly overrides with the three fonts above.

**Type scale examples:**

- Hero title: 38px Playfair Display, weight 600, line-height 1.18
- Part title: 20px Playfair Display, weight 500
- Chapter title: 17px Playfair Display, weight 500
- Eyebrow / label: 10–11px JetBrains Mono, `letter-spacing: 0.2em`, `text-transform: uppercase`
- Body description: 18px Crimson Pro, `line-height: 1.65`

### Layout

- **Header**: 52px tall, sticky, `background: var(--ch-panel)`, `border-bottom: 1px solid var(--ch-border)`. Contains chapter number (Playfair Display) + separator + monospace sub-label + right-aligned badge.
- **Chapter pages**: CSS grid with `grid-template-rows: 52px 1fr` and `grid-template-columns: 224px 1fr` (sidebar + main). `height: 100dvh; overflow: hidden`.
- **Home page**: Single column, flex column, `min-height: 100dvh`.

### Borders & Radius

- Default border color: `var(--ch-border)` (`#252530`)
- Border radius for tags/badges: `3px`
- Border radius for cards: `4px`
- The global Tailwind radius scale: `--radius: 0.45rem` with sm/md/lg/xl variants scaled from it.

## Component Guidelines

### Chapter Page Structure

Each chapter page has:
1. **Header** (`.ch-header`): Sticky header with chapter info
2. **Sidebar** (`.ch-sidebar`): Topic navigation with categories
3. **Main content** (`.ch-main`): Topic header + tabs + content area

### State Management

- `activeTopic: TopicId` — current sidebar topic selection
- `activeTab: TabId` — current tab in content area
- On topic change, reset `activeTab` to `"history"` (default)

### Shared Components (from `chapter-X/shared.tsx`)

| Component        | Props                                   | Purpose                          |
|-----------------|----------------------------------------|----------------------------------|
| `MathBlock`     | `tex: string`                           | Display math (KaTeX)              |
| `InlineMath`    | `tex: string`                           | Inline math (KaTeX)               |
| `CodeBlock`    | `code`, `filename`, `lang?`, `langLabel?`| Syntax-highlighted code           |
| `Analogy`      | `label`, `children`                      | Analogy callout                  |
| `DefBlock`     | `label`, `children`                     | Definition block                |
| `DiagramBlock` | `title`, `children`                     | Diagram container                |
| `pt(cx, cy, s)`| utility                                | Math coord → SVG pixel transform   |

### Content Block Styles (from `chapter-shared.css`)

| Class               | Purpose                                |
|--------------------|----------------------------------------|
| `.ch-timeline`     | Vertical timeline with year markers      |
| `.ch-analogy`      | Amber-left-border callout             |
| `.ch-def-block`   | Blue-left-border definition             |
| `.ch-callout`     | Purple callout                        |
| `.ch-math-block`  | Math rendering container              |
| `.ch-code-wrap`   | Code block with header                |
| `.ch-diagram-block`| Diagram SVG container                 |
| `.ch-neuron-diagram`| Neuron/gate diagram container        |
| `.ch-gate-diagram`| Gate diagram container                  |
| `.ch-arch-flow`   | Architecture flow text diagram        |
| `.ch-table`       | Generic data table                    |
| `.ch-truth-table` | Logic truth table                     |

### Interactive States

- Available chapters: cursor pointer, amber accent on chapter number, green status dot, amber-tinted hover background (`rgba(232, 168, 56, 0.04)`).
- Locked chapters: cursor default, dimmed amber (`--ch-amber-dim`) on number, gray status dot.
- Topic navigation: Left border highlight on hover/active.

### Status Indicators

- Green dot (`--ch-green: #5ab98c`) = ready/complete
- Gray dot (`--ch-border`) = not ready

## Data Structures

### Topic Definition (from `data.ts`)

```typescript
interface Topic {
    id: TopicId
    label: string
    category: string
    icon: string       // emoji or icon character
    ready?: boolean  // defaults to false
}
```

### Tab Definition (from `types.ts`)

```typescript
type TabId = "history" | "kid" | "highschool" | "maths" | "python" | "code"
```

### Topic Tabs Export (from `topics/*/tabs.tsx`)

Named export pattern: `const TOPIC_TABS: Record<TabId, React.ReactNode> = { ... }`

## Naming Conventions

- **CSS classes**:
  - `.hp-*` for home page
  - `.ch-*` for chapter shared (in `chapter-shared.css`)
  - `.chX-*` for chapter-specific (e.g., `.ch0-*`)
- **Data markers**: `// ── Data ──` comment banners
- **Section markers**: `// ── Label ──` separators
- **Component markers**: `// ── Component ──` etc.

## Markdown Content

Markdown-rendered content uses the `.markdown` class (defined in `src/index.css`). It uses `text-sm`, relaxed line-height, and scoped heading hierarchy (h1–h4 with border separators on h2).

## Code Highlighting

Uses highlight.js with dark amber theme. Registered languages: `typescript`, `python`.

## shadcn Components

The existing set: `accordion`, `badge`, `button`, `card`. Do not add new components unless needed.