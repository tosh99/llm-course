# DeepLearn — Project Guidelines

## Project Overview

A self-study curriculum app tracing the historical development of ML and LLMs. Built as a Vite + React + TypeScript SPA with shadcn/ui components and Tailwind CSS v4.

## Stack

- **Runtime**: React 19, React Router 7
- **Build**: Vite 7, TypeScript 5.9
- **Styling**: Tailwind CSS v4, shadcn/ui (base-nova style, zinc base color)
- **Icons**: Hugeicons (`@hugeicons/react`)
- **Font (global)**: Geist Variable (sans-serif, loaded via `@fontsource-variable/geist`)
- **Package manager**: Bun

## File Conventions

- Pages go in `src/pages/` as `.tsx` files — never standalone HTML.
- Page-specific styles go in a co-located `.css` file (e.g. `home-page.css`, `chapter-0.css`).
- Shared UI primitives go in `src/components/ui/` (shadcn components).
- Shared layout components (nav, header) go in `src/components/`.

## Design Language

The app has a **dark academic / scholarly** aesthetic — dark backgrounds, warm amber accents, and a mix of serif display + monospace type. Every page uses a consistent custom property palette defined locally on the root element.

### Color Palette (CSS Variables)

All pages define these variables on their root class (`.hp`, `.ch0`, etc.):

| Variable         | Value     | Usage                                  |
|------------------|-----------|----------------------------------------|
| `--ch-bg`        | `#0d0d10` | Page background                        |
| `--ch-panel`     | `#111115` | Header, sidebar, panel backgrounds     |
| `--ch-card`      | `#17171d` | Card / elevated surface                |
| `--ch-border`    | `#252530` | Borders and dividers                   |
| `--ch-amber`     | `#e8a838` | Primary accent — labels, stats, CTAs   |
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

- **Header**: 52px tall, sticky, `background: var(--ch-panel)`, `border-bottom: 1px solid var(--ch-border)`. Contains title (Playfair Display) + separator + monospace sub-label + right-aligned badge.
- **Chapter pages**: CSS grid with `grid-template-rows: 52px 1fr` and `grid-template-columns: 224px 1fr` (sidebar + main). `height: 100dvh; overflow: hidden`.
- **Home page**: Single column, flex column, `min-height: 100dvh`.
- **Bottom nav** (`<BottomNav>`): Fixed, `sm:hidden` — only shown on mobile. Hidden on chapter pages (fullscreen routes starting with `/chapter/`).

### Borders & Radius

- Default border color: `var(--ch-border)` (`#252530`)
- Border radius for tags/badges: `3px`
- Border radius for cards: `4px`
- The global Tailwind radius scale: `--radius: 0.45rem` with sm/md/lg/xl variants scaled from it.

### Interactive States

- Available chapters: cursor pointer, amber accent on chapter number, green status dot, amber-tinted hover background (`rgba(232, 168, 56, 0.04)`).
- Locked chapters: cursor default, dimmed amber (`--ch-amber-dim`) on number, gray status dot.
- Hover on available chapter: expands horizontally with negative margin trick, fades border bottom.

### Status Indicators

- Green dot (`--ch-green: #5ab98c`) = available/complete
- Gray dot (`--ch-border`) = locked/not started

### Markdown Content

Markdown-rendered content uses the `.markdown` class (defined in `src/index.css`). It uses `text-sm`, relaxed line-height, and scoped heading hierarchy (h1–h4 with border separators on h2).

## Naming Conventions

- CSS classes use a BEM-like prefix pattern per page: `.hp-*` for home page, `.ch0-*` for chapter 0, etc.
- Data is defined as typed `const` arrays/objects above the component (preceded by `// ── Data ──` comment banners).
- Section comments use `// ── Label ──` style separators.

## Component Guidelines

- Prefer custom CSS classes over Tailwind utilities for page-specific layout — Tailwind is used in shared/generic components like `<BottomNav>`.
- Use `cn()` from `@/lib/utils` when conditionally composing Tailwind classes.
- Icons: use Hugeicons for any new icons. Inline SVG is acceptable for one-off icons.
- Do not add `shadcn` components unless needed — the existing set is: `accordion`, `badge`, `button`, `card`.