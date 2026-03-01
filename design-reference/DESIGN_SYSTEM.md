# Pharos AI — Design System Reference

> **Direction:** Apple macOS (light mode) — premium intelligence dashboard, not a news ticker.  
> **Reference files:** `pharos-apple-demo.html`, `pharos-apple-outlook.html`, `pharos-apple-settings.html`  
> **Stack:** CSS custom properties, Inter font (SF Pro fallback), Lucide Icons, no framework lock-in.

---

## 1. Philosophy

The UI should feel like a **first-party macOS app**, not a web dashboard. Key principles:

- **Vibrancy, not opacity** — surfaces blur what's behind them (`backdrop-filter: blur(20px) saturate(180%)`).
- **Hierarchy through weight, not color** — use label opacity levels (`--label`, `--label-2`, `--label-3`) rather than different hues.
- **Restraint** — separators are `0.5px`. Most borders are invisible. White space does the heavy lifting.
- **No emojis as UI** — use Lucide Icons (`unpkg.com/lucide@latest`). Every icon is stroked, consistent weight (18–20px at `stroke-width: 1.5`).
- **Light mode first** — Julius prefers light. Dark mode is a variant, not the default.
- **No red aesthetic** — avoid breaking-news CNN-style reds. Red is reserved for `--sys-red` danger states only.

---

## 2. Color Tokens

Define as CSS custom properties on `:root`. These mirror macOS semantic system colors.

```css
:root {
  /* Backgrounds */
  --window-bg:        #ECECEC;              /* Overall window chrome */
  --sidebar-bg:       rgba(238,238,238,0.88); /* Vibrancy sidebar */
  --toolbar-bg:       rgba(246,246,246,0.92); /* Vibrancy toolbar */
  --content-bg:       #FFFFFF;              /* Main content area */
  --panel-bg:         #F8F8F8;              /* Secondary panels, inset areas */

  /* Interactive states */
  --selected-bg:      #2F6EBA;             /* Focused selection (blue) */
  --selected-unfocused: rgba(0,0,0,0.08); /* Unfocused selection (gray) */
  --hover-bg:         rgba(0,0,0,0.04);   /* Row hover */

  /* Separators */
  --sep:              rgba(0,0,0,0.10);   /* Default hairline separator */
  --sep-strong:       rgba(0,0,0,0.16);   /* Stronger divider when needed */

  /* Labels (hierarchical text opacity) */
  --label:            rgba(0,0,0,0.88);   /* Primary text */
  --label-2:          rgba(0,0,0,0.55);   /* Secondary text / captions */
  --label-3:          rgba(0,0,0,0.30);   /* Tertiary / timestamps / hints */
  --label-4:          rgba(0,0,0,0.18);   /* Quaternary / disabled */
  --label-on-sel:     #FFFFFF;            /* Text on --selected-bg */

  /* System accent colors (use sparingly) */
  --sys-blue:         #007AFF;
  --sys-red:          #FF3B30;
  --sys-green:        #28CD41;
  --sys-orange:       #FF9500;
  --sys-purple:       #AF52DE;
  --sys-yellow:       #FFCC00;
  --sys-teal:         #59ADC4;
  --sys-gray:         #8E8E93;
}
```

**Rules:**
- Never hardcode text colors — use `var(--label)` and its variants.
- `--sys-red` is for danger/critical severity only. Not for branding.
- `--sys-blue` is for interactive affordances (links, active states, badges).
- Accent colors on badges should be `opacity: 0.12–0.15` fill + full-opacity text of the same hue.

---

## 3. Typography

```css
:root {
  --font:         -apple-system, "SF Pro Text", "Inter", "Helvetica Neue", sans-serif;
  --font-display: -apple-system, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif;
}

body {
  font-family: var(--font);
  font-size: 13px;
  line-height: 1.4;
  color: var(--label);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Type Scale

| Role | Size | Weight | Notes |
|---|---|---|---|
| Window title / Hero heading | 22–24px | 700 | `--font-display` |
| Section heading (reading pane) | 17–18px | 700 | `--font-display` |
| Sidebar section label | 11px | 600 | Uppercase, `letter-spacing: 0.04em`, `--label-3` |
| Row title | 13px | 400–500 | Goes to 600 when selected |
| Row subtitle / caption | 11.5–12px | 400 | `--label-2` |
| Timestamp / hint | 11px | 400 | `--label-3` |
| Badge / chip label | 11–11.5px | 500–600 | |
| Toolbar title | 13px | 600 | `letter-spacing: -0.01em` |

**Load Inter from Google Fonts (SF Pro approximation on web):**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## 4. Border Radius Tokens

```css
:root {
  --r-sm:  4px;   /* Tiny chips, inner elements */
  --r:     6px;   /* Buttons, input fields, small cards */
  --r-md: 10px;   /* Sidebar rows, grouped tables, popovers */
  --r-lg: 14px;   /* Large cards, sheets */
  --r-xl: 20px;   /* Modal dialogs, floating panels */
}
```

**Component reference:**
- Sidebar nav rows → `border-radius: var(--r-md)` (10px)
- Toolbar icon buttons → `border-radius: var(--r)` (6px)
- Severity/status badges (pill) → `border-radius: 20px`
- Grouped table blocks (Settings.app style) → `border-radius: var(--r-md)` (10px)
- Reading pane content sections (Mail.app style) → flat, no card radius — use separators only
- Avatar circles → `border-radius: 50%`

---

## 5. Layout Structure

### Three-Pane (primary layout — Mail.app pattern)

```
┌──────────────────────────────────────────────────────────────┐
│ Toolbar (38px, vibrancy)                                      │
├──────────┬────────────┬──────────────────────────────────────┤
│ Sidebar  │ List pane  │ Reading pane                         │
│ 220px    │ 310px      │ flex:1                               │
│ vibrancy │ white      │ white                                │
│ blur     │            │                                      │
└──────────┴────────────┴──────────────────────────────────────┘
```

```css
.app-body    { display: flex; flex: 1; overflow: hidden; }
.sidebar     { width: 220px; min-width: 220px; }
.list-pane   { width: 310px; min-width: 310px; border-right: 0.5px solid var(--sep); }
.reading-pane { flex: 1; overflow-y: auto; }
```

### Toolbar

```css
.toolbar {
  height: 38px;
  background: var(--toolbar-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 0.5px solid var(--sep);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
  -webkit-app-region: drag; /* if in Electron/Tauri */
}
```

**Traffic light buttons** (decorative in web, functional in native):
```css
.traffic-light { display: flex; gap: 7px; }
.tl-btn {
  width: 12px; height: 12px;
  border-radius: 50%;
  border: 0.5px solid rgba(0,0,0,0.12);
}
/* Colors: #FF5F57 close, #FFBD2E minimize, #28C840 maximize */
```

---

## 6. Sidebar

```css
.sidebar {
  background: var(--sidebar-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-right: 0.5px solid var(--sep);
  padding: 8px 0;
  overflow-y: auto;
}

/* Section headers */
.sb-section-title {
  padding: 10px 16px 3px;
  font-size: 11px;
  font-weight: 600;
  color: var(--label-3);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Nav rows */
.sb-row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 12px 6px 14px;
  border-radius: var(--r-md);
  margin: 1px 6px;
  cursor: default;
  color: var(--label);
  font-size: 13px;
  transition: background 0.08s;
}
.sb-row:hover { background: var(--hover-bg); }
.sb-row.active {
  background: var(--selected-bg);
  color: var(--label-on-sel);
}
.sb-row.active .sb-icon { color: white; }

/* Badge counts */
.sb-badge {
  margin-left: auto;
  background: var(--sys-blue);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  padding: 1px 6px;
  min-width: 18px;
  text-align: center;
}
.sb-row.active .sb-badge {
  background: rgba(255,255,255,0.3);
}
```

**Sidebar icon colors (when inactive):** Use Lucide at `16–18px`, color `var(--label-2)`. Each section can have a distinct tint — but this is subtle, not vibrant. Active rows flip to white.

**Colored SF Symbol–style icons:** Assign a color per section as a background pill behind the Lucide icon:
```css
.sb-icon-wrap {
  width: 22px; height: 22px;
  border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  background: var(--icon-color, var(--sys-blue));
  color: white;
  flex-shrink: 0;
}
```
Example icon colors: Blue for Overview, Orange for Events, Purple for Actors, Teal for Sources, Gray for Settings.

---

## 7. List Pane

```css
.list-pane {
  width: 310px;
  min-width: 310px;
  background: var(--content-bg);
  border-right: 0.5px solid var(--sep);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-pane-header {
  height: 38px;
  border-bottom: 0.5px solid var(--sep);
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
}

/* Event/article rows */
.ev-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 0.5px solid var(--sep);
  cursor: default;
  transition: background 0.08s;
}
.ev-row:hover { background: var(--hover-bg); }
.ev-row.active {
  background: var(--selected-bg);
  color: var(--label-on-sel);
}
.ev-row.active * { color: inherit !important; }

/* Severity dot */
.ev-severity-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  border: 0.5px solid transparent;
  flex-shrink: 0;
  margin-top: 4px;
}
```

---

## 8. Reading Pane

The reading pane follows the **Mail.app** pattern: flat white background, content separated by `0.5px` hairlines — **not** bordered cards.

```css
.reading-pane {
  flex: 1;
  background: var(--content-bg);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Article/report header */
.r-header {
  padding: 20px 28px 16px;
  border-bottom: 0.5px solid var(--sep);
}

/* Section title (Mail "From:", "Subject:" label style) */
.r-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--label-3);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

/* Content sections — flat, no card border */
.r-section {
  padding: 16px 28px;
  border-bottom: 0.5px solid var(--sep);
}

/* For Settings.app-style grouped tables (bordered block): */
.grouped-table {
  background: var(--content-bg);
  border: 0.5px solid var(--sep);
  border-radius: var(--r-md);
  overflow: hidden;
  margin-bottom: 24px;
}
.grouped-table-row {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 0.5px solid var(--sep);
}
.grouped-table-row:last-child { border-bottom: none; }
```

**Rule:** In reading/article views, do NOT wrap timeline, actor, or source sections in bordered cards. Use `border-bottom: 0.5px solid var(--sep)` on sections only. Bordered grouped tables are for Settings.app-style preference pages.

---

## 9. Badges & Severity Chips

### Severity (Critical / High / Medium / Low)

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;        /* pill */
  font-size: 11.5px;
  font-weight: 500;
  border: 0.5px solid;
}

/* Colors */
.badge-critical { background: rgba(255,59,48,0.10);  color: #CC2200; border-color: rgba(255,59,48,0.20); }
.badge-high     { background: rgba(255,149,0,0.10);  color: #B86800; border-color: rgba(255,149,0,0.20); }
.badge-medium   { background: rgba(255,204,0,0.10);  color: #8A6E00; border-color: rgba(255,204,0,0.20); }
.badge-low      { background: rgba(40,205,65,0.10);  color: #1A7A30; border-color: rgba(40,205,65,0.20); }

/* Category/tag chips (blue tint) */
.badge-tag {
  background: rgba(0,122,255,0.08);
  color: var(--sys-blue);
  border-color: rgba(0,122,255,0.15);
}
```

### Severity Dot (list pane)

```css
.dot-critical { background: var(--sys-red); }
.dot-high     { background: var(--sys-orange); }
.dot-medium   { background: var(--sys-yellow); }
.dot-low      { background: var(--sys-green); }
```

---

## 10. Buttons & Controls

```css
/* Ghost toolbar button */
.toolbar-btn {
  width: 28px; height: 28px;
  border-radius: var(--r);
  background: transparent;
  border: none;
  color: var(--label-2);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.08s;
}
.toolbar-btn:hover { background: var(--hover-bg); }

/* Primary action button */
.btn-primary {
  background: var(--sys-blue);
  color: white;
  border: none;
  border-radius: var(--r);
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.1s;
}
.btn-primary:hover { opacity: 0.85; }

/* Secondary / bordered button */
.btn-secondary {
  background: transparent;
  border: 0.5px solid var(--sep-strong);
  border-radius: var(--r);
  padding: 5px 13px;
  font-size: 13px;
  color: var(--label);
  cursor: pointer;
  transition: background 0.08s;
}
.btn-secondary:hover { background: var(--hover-bg); }
```

---

## 11. Search Field

```css
.search-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.07);
  border: 0.5px solid var(--sep);
  border-radius: 7px;
  padding: 4px 10px;
}
.search-wrap input {
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font);
  font-size: 12px;
  color: var(--label);
  width: 100%;
}
```

---

## 12. Icons

**Library:** [Lucide](https://unpkg.com/lucide@latest) — consistent stroke-based SVG icons.

```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>

<!-- Usage -->
<i data-lucide="globe" style="width:16px;height:16px;stroke-width:1.5"></i>
```

**Standard sizes:**
- Sidebar icons: 16px
- Toolbar icons: 16–18px
- Reading pane section icons: 14–16px
- Empty state icons: 48px, `opacity: 0.4`

**Never use:**
- Unicode symbols (⚡, 🌍) as icons
- Emoji as UI elements
- Font Awesome (inconsistent stroke weight)

---

## 13. Vibrancy / Backdrop Blur

Apply to sidebar and toolbar. Requires a non-opaque background to show through.

```css
.vibrancy {
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}
```

Reading pane AI chat sidebar (if present):
```css
.chat-sidebar {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-left: 0.5px solid var(--sep);
}
```

---

## 14. Separators

- **Default:** `border: 0.5px solid var(--sep)` — `rgba(0,0,0,0.10)`
- **Strong:** `border: 0.5px solid var(--sep-strong)` — `rgba(0,0,0,0.16)`
- **Use `border-bottom` not `border`** for row separators.
- Never use `1px` separators — always `0.5px`. On non-retina screens they look the same; on retina they look sharper and more native.

---

## 15. Spacing Scale

Follow an 8px base grid with 4px micro-adjustments.

| Token | Value | Use |
|---|---|---|
| 4px | micro | Icon padding, badge padding |
| 6px | xs | Gap between icon + label in rows |
| 8px | sm | Compact row padding, gap in toolbars |
| 10px | md | Standard row padding (vertical) |
| 12–14px | default | Standard row padding (horizontal) |
| 16px | lg | Section padding, toolbar padding |
| 20–24px | xl | Reading pane content padding |
| 28px | 2xl | Reading pane article padding |

---

## 16. Pharos Logo

The official Pharos lighthouse SVG, inline. Use `fill="#2D72D2"` on light backgrounds.

```html
<svg viewBox="0 0 1024 1024" width="24" height="24" fill="none">
  <!-- Main lighthouse shape -->
  <path fill="#2D72D2" d="M512 80 ... (full path from Header.tsx)"/>
  <!-- Interior detail -->
  <path fill="rgba(255,255,255,0.55)" d="..."/>
</svg>
```

On dark backgrounds, use `fill="white"` for the main shape and `fill="rgba(0,0,0,0.45)"` for the interior detail.

See `pharos-apple-demo.html` for the full inline SVG path data.

---

## 17. Anti-Patterns (What Not To Do)

| ❌ Don't | ✅ Do instead |
|---|---|
| Use red as a primary brand color | Reserve red (`--sys-red`) for critical severity only |
| Use emoji as UI icons | Use Lucide icons |
| Use `1px` borders | Use `0.5px solid var(--sep)` |
| Use opaque sidebar backgrounds | Use `rgba(...)` + `backdrop-filter` vibrancy |
| Wrap reading pane sections in bordered cards | Use flat sections with `border-bottom` separators only |
| Use many different font colors | Use `--label` / `--label-2` / `--label-3` only |
| Use `box-shadow` on rows for depth | Use background color changes on hover/select |
| Dark mode by default | Light mode first; dark is a variant |
| Use `font-weight: 800+` for display text | Max is 700 for headings |
| Use `border-radius > 20px` on anything that isn't a modal | Respect the token scale |
| Hardcode pixel colors (`#ccc`, `#333`) | Always use CSS custom property tokens |

---

## 18. Component Files Reference

| File | What it demonstrates |
|---|---|
| `pharos-apple-demo.html` | Full three-pane dashboard: sidebar + event list + reading pane with AI chat sidebar |
| `pharos-apple-outlook.html` | Daily outlook / longform reading view — article header, timeline, source grid |
| `pharos-apple-settings.html` | Preferences page — grouped tables (Settings.app style), toggle rows, section headers |

---

## 19. Implementation Notes (React / Next.js)

When migrating to the actual codebase (`pharos-ai-nextjs/`):

1. **Define all tokens in `src/styles/globals.css`** under `:root` — do not use Tailwind for semantic color tokens.
2. **Use Tailwind for layout/spacing utilities only** (`flex`, `gap-2`, `px-4`, etc.).
3. **Install Lucide React:** `npm install lucide-react` — use `<Globe size={16} strokeWidth={1.5} />` pattern.
4. **Inter font:** Add via `next/font/google` in `layout.tsx`.
5. **CSS Modules or Tailwind `@apply`** for component styles — avoid inline styles except for dynamic values.
6. **`clsx` or `cn()`** for conditional class composition on interactive states.
7. **Never use Tailwind's built-in color palette for semantic UI colors** — always reference `var(--token)`.

---

*Last updated: based on design sessions with Julius Olsson, Feb–Mar 2026. Reference `pharos-apple-demo.html` as the canonical visual prototype.*
