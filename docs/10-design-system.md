◐ **Design System**
[Docs Home](README.md) · [← 09 Internationalization](09-internationalization.md) · **10** · [11 Setup & Operations →](11-setup-and-operations.md)

---

# ◐ Design System

**Pure black, pure white, and five colours that each mean exactly one thing.**

A brutalist-editorial system: pure monochrome ground, heavy geometric display type,
hairline rules, generous negative space, and five saturated accents used exclusively
as functional signals — never as decoration.

**Sources:** [`app/globals.css`](../app/globals.css) ·
[`tailwind.config.ts`](../tailwind.config.ts) ·
[`context/ThemeContext.tsx`](../context/ThemeContext.tsx) ·
[`app/layout.tsx`](../app/layout.tsx)

---

## ▸ The V0ICE Accent Palette — Five Letters, Five Roles, Five Colours

Five colours, one per letter of the wordmark, one per role in the pipeline. Declared
as CSS custom properties in [`app/globals.css`](../app/globals.css):

```css
:root {
  --system-black: #000000;
  --system-white: #ffffff;

  --accent-v: #8B5CF6;   /* V — violet */
  --accent-0: #3B82F6;   /* 0 — blue   */
  --accent-i: #22C55E;   /* I — green  */
  --accent-c: #EAB308;   /* C — yellow */
  --accent-e: #EF4444;   /* E — red    */
}
```

| Letter | Token | Hex | Role | Meaning |
|---|---|---|---|---|
| **V** | `--accent-v` | `#8B5CF6` | Spotter | Discovery, first sighting |
| **0** | `--accent-0` | `#3B82F6` | Analyst | Diagnostic triage |
| **I** | `--accent-i` | `#22C55E` | Vaccine Maker | Inoculation, safety |
| **C** | `--accent-c` | `#EAB308` | Field Worker | Broadcast, caution |
| **E** | `--accent-e` | `#EF4444` | Surveillance | Outbreak, warning |

The letter-to-role mapping is not arbitrary decoration — the same five colours carry
the herd-immunity gauge (green / yellow / red), so a reader who learns the wordmark has
already learned the status legend.

Fifteen utility classes are generated from the tokens:

```css
.accent-v  { color: var(--accent-v); }            /* × 5 */
.bg-accent-v { background-color: var(--accent-v); } /* × 5 */
.border-accent-v { border-color: var(--accent-v); } /* × 5 */
```

▲ These utility classes are declared but **never used**. Every consumer either inlines
the hex value — `ACCENT` in [`app/page.tsx`](../app/page.tsx), `LETTER_COLORS` in
[`MaskedHeroType`](../components/MaskedHeroType.tsx), `scoreColor()` in
[`LeafletMap`](../components/LeafletMap.tsx) — or reaches for a Tailwind equivalent
(`text-violet-500`, `bg-emerald-500`). The token layer exists and is bypassed.

### ▲ Two competing palettes

The role colours defined in [`context/RoleContext.tsx`](../context/RoleContext.tsx)
are **not** the V0ICE accents:

| Role | V0ICE accent | `RoleContext.color` | Match |
|---|---|---|---|
| Spotter | `#8B5CF6` violet | `#3B82F6` blue | × swapped |
| Analyst | `#3B82F6` blue | `#8B5CF6` violet | × swapped |
| Vaccine Maker | `#22C55E` green | `#10B981` emerald | × different green |
| Field Worker | `#EAB308` yellow | `#F59E0B` amber | × different yellow |
| Surveillance | `#EF4444` red | `#FFFFFF` white | × entirely different |

Spotter and Analyst are literally transposed. In practice the divergence is invisible
because `RoleContext.color` is never rendered — the navbar's role strip uses
black/white inversion for the active state, not the role colour. But the field is
there, populated, and wrong. Consolidating on the V0ICE palette and using
`roleInfo.color` in the navbar would fix both problems at once.

---

## ▸ Typography

Three faces, three jobs.

| Role | Family | Loaded via | CSS variable |
|---|---|---|---|
| Display & UI | **Manrope** | `next/font/google`, weights 300–800 | `--font-manrope` |
| Editorial accent | **Cormorant Garamond** | `next/font/google`, weights 300–700 + italic | `--font-cormorant` |
| Monospace | **JetBrains Mono** | ▲ system fallback only | — |

Both Google fonts use `display: "swap"` and are subset to `latin`.

▲ **Two typography gaps.**

**JetBrains Mono is never loaded.** [`tailwind.config.ts`](../tailwind.config.ts)
declares `mono: ["JetBrains Mono", "Courier New", "monospace"]`, but no `@font-face`
or `next/font` import exists. Unless a visitor has it installed locally, every
`font-mono` element — IDs, coordinates, telemetry labels, badges — renders in
**Courier New**. Given how heavily monospace is used for the "surveillance terminal"
character, this materially changes the design. Fix:

```ts
import { JetBrains_Mono } from "next/font/google";
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
// then in tailwind.config.ts:  mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"]
```

**`latin` subset only.** Neither Google font is subset for Cyrillic, Greek, Devanagari,
CJK, or Arabic. `RU`, `EL`, `HI`, `JA`, `ZH`, `KO`, and `AR` all fall through to the
system stack. Correct rendering, but the typographic identity is lost for a third of
the supported languages.

### Utility classes

Declared in [`app/globals.css`](../app/globals.css):

| Class | Family | Weight | Tracking |
|---|---|---|---|
| `.font-heading` `.font-display` `.font-manrope` | Manrope | 800 | `-0.03em` |
| `.font-heavy-grotesk` | Manrope | 800 | `-0.05em` |
| `.font-body` `.font-helvetica` | Helvetica Neue | 400 | — |
| `.font-cursive` `.font-editorial` `.font-cormorant` | Cormorant | 300 italic | `0.01em` |
| `.font-editorial-serif` | Cormorant | 400 upright | — |

`h1`–`h6` default to Manrope 800 at `-0.03em` via `@layer base`.

**`.font-heavy-grotesk` is the signature.** Tighter tracking than the base heading
class, used for every large uppercase display line — the hero wordmark, page titles,
console headers. The negative tracking at `19–22vw` in the hero is what produces the
dense, architectural letterform block.

**Cormorant carries the editorial voice.** Strain names, AI claim summaries, and
manifesto quotes render in serif — a deliberate register shift that separates
*human-authored narrative* from *machine telemetry* (monospace) and *interface*
(Manrope).

---

## ▸ Theme System

Class-based dark mode: `darkMode: "class"` in
[`tailwind.config.ts`](../tailwind.config.ts), toggled on `<html>` by
[`ThemeContext`](../context/ThemeContext.tsx).

| Surface | Dark | Light |
|---|---|---|
| Root background | `#000000` | `#fbfbfb` ▲ |
| Root text | `#ffffff` | `#0a0a0a` ▲ |
| Panels & cards | `bg-neutral-950` | `bg-neutral-50` |
| Borders | `border-white/[0.08]` | `border-black/[0.08]` |
| Hairline dividers | `border-white/[0.06]` | `border-black/[0.06]` |
| Selection | white on black | black on white |
| Scrollbar thumb | `#333333` → `#666666` hover | `#cccccc` → `#999999` hover |
| Navbar | `bg-black/85` + blur | `bg-white/90` + blur |
| D0MI terminal | `bg-neutral-950` | `bg-white` |

The `/[0.08]` and `/[0.06]` alpha borders are the system's structural signature — one
hairline weight for panels, a lighter one for internal dividers, with no solid rules
anywhere except the deliberately brutalist `border-2 border-black` on the role console
cards.

### ▲ The light-mode background discrepancy

Three sources disagree on what "light mode" means:

| Source | Value |
|---|---|
| [`app/globals.css`](../app/globals.css) `body` | `#ffffff` |
| [`ThemeContext.applyTheme`](../context/ThemeContext.tsx) inline style | `#fbfbfb` |
| [`README.md`](../README.md) | "Pure White `#FFFFFF`" |

The inline style wins — it is applied directly to `document.body.style` at the highest
specificity. The rendered light background is `#fbfbfb` (`studio-50`), a warm off-white,
not pure white. Text is `#0a0a0a`, not pure black.

Whether that is a bug or a refinement is a design call. It is currently undocumented
and contradicts two written specifications.

### ▲ Theme coverage

The "100% monochrome inversion" claim holds for the landing page and global chrome
only. The five role consoles pin themselves to a fixed palette and ignore the toggle
entirely:

| Route | Root classes | Responds to toggle |
|---|---|---|
| `/` | `bg-white dark:bg-black` | ● yes |
| `VoisNavbar` `VoisFooter` `DomiChat` `LeafletMap` `MaskedHeroType` | full `dark:` variants | ● yes |
| `/submit` | `bg-white text-black` | × locked light |
| `/analyst` | `bg-white text-black` | × locked light |
| `/vaccine` | `bg-white text-black` | × locked light |
| `/distribute` | `bg-white text-black` | × locked light |
| `/strains` | `bg-white text-black` | × locked light |
| `/map` | `bg-black text-white` | × locked dark |
| `/works`, `/works/[slug]` | `bg-white text-black` | × locked light |

A dark-mode visitor navigating `/` → `/submit` sees the page invert under them, while
the navbar and footer stay dark — a visible seam on the most common transition in the
app. Navigating `/submit` → `/map` inverts again.

Remedying this is mechanical but not trivial: every `text-black`, `bg-neutral-50`,
`border-black`, and `bg-white` inside the five consoles needs a `dark:` counterpart.
Roughly 200 class edits. Tracked as
[Design System](10-design-system.md#-theme-coverage).

### ▲ Theme flash

[`app/layout.tsx`](../app/layout.tsx) ships `<html className="dark …">` and
`<body className="bg-black text-white …">` in the server HTML. `ThemeProvider`
corrects it in a mount effect, so a light-mode visitor sees a dark frame first. Fix
with a blocking script in `<head>` — see
[Design System](10-design-system.md#-theme-flash).

Note also that the body's Tailwind classes are permanently overridden by
`ThemeContext`'s inline `document.body.style` writes, making them dead code.

---

## ▸ Motion

### Scroll reveal

Defined in [`app/globals.css`](../app/globals.css), driven by the `useScrollReveal`
hook in [`app/page.tsx`](../app/page.tsx).

| Class | From | To |
|---|---|---|
| `.reveal` | `opacity: 0`, `translateY(28px)` | visible, `translateY(0)` |
| `.reveal-left` | `opacity: 0`, `translateX(-24px)` | visible, `translateX(0)` |
| `.reveal-scale` | `opacity: 0`, `scale(0.96)` | visible, `scale(1)` |

Easing is `cubic-bezier(0.16, 1, 0.3, 1)` — a strong ease-out that decelerates late,
giving motion a weighted, architectural quality rather than a bouncy one. This same
curve appears on the navbar drawer (500 ms) and the hero letter entrance (900 ms),
making it the system's signature timing function.

Stagger utilities `.reveal-delay-1` through `.reveal-delay-5` add 0.1 s increments.

The `IntersectionObserver` uses `threshold: 0.1` and calls `unobserve` on first
intersection — animations play once and never replay on scroll-back.

### Tailwind keyframes

Declared in [`tailwind.config.ts`](../tailwind.config.ts):

| Animation | Duration | Used by |
|---|---|---|
| `marquee` / `marquee-reverse` | 25 s linear infinite | ○ `KineticMarquee` (orphaned) |
| `float-slow` | 6 s ease-in-out infinite | ○ `TactileObjectLayer` (orphaned) |
| `float-reverse` | 7 s ease-in-out infinite | ○ `TactileObjectLayer` (orphaned) |
| `pulse-glow` | 4 s ease-in-out infinite | ○ nothing |
| `spin-slow` | 20 s linear infinite | ○ nothing |

▲ **All five custom animations are dead.** Every one is consumed exclusively by
orphaned components ([Component Catalog](07-component-catalog.md#-orphaned-visual-components))
or by nothing at all. Live motion comes from stock Tailwind utilities —
`animate-pulse`, `animate-ping`, `animate-spin`, `animate-bounce` — plus the
hand-rolled `requestAnimationFrame` loop in
[`MaskedHeroType`](../components/MaskedHeroType.tsx).

### The hero lens

The most sophisticated motion in the project — a `clip-path` circle tracking the
cursor with exponential damping and a smoothstep proximity curve. Documented in full
at [Component Catalog · MaskedHeroType](07-component-catalog.md#-maskedherotype).

▲ No `prefers-reduced-motion` handling exists anywhere in the codebase. The scroll
reveals, the hero lens loop, and the pulsing indicators all run regardless. A
`@media (prefers-reduced-motion: reduce)` block disabling transitions and the rAF loop
would be a small, high-value accessibility addition.

---

## ▸ Extended Tailwind Theme

### Colour scales

```ts
studio: { 950: "#050505", 900: "#0a0a0a", 850: "#121212", 800: "#181818",
          700: "#242424", 600: "#383838", 400: "#888888", 300: "#b5b5b5",
          200: "#dcdcdc", 100: "#f0f0f0",  50: "#fbfbfb" }

chrome: { foil: "#e2e8f0", silver: "#cbd5e1", iridescent: "#a5b4fc", platinum: "#e2e8f0" }
```

▲ `studio-50` is the source of the `#fbfbfb` light background applied by
`ThemeContext` — the only place either scale reaches live output, and it does so via a
hardcoded hex string rather than the token. `studio-*` classes are otherwise used only
by the orphaned `KineticMarquee`; `chrome-*` likewise. Both scales are effectively
dead theme surface.

Live code uses stock Tailwind neutrals (`neutral-50`, `neutral-900`, `neutral-950`)
and stock semantic colours (`emerald-500`, `rose-600`, `violet-500`, `amber-400`).

### Letter spacing

```ts
letterSpacing: { 'ultra-wide': '0.3em', 'tight-heading': '-0.04em' }
```

▲ Neither is used. Tracking is applied through stock `tracking-tight`,
`tracking-tighter`, `tracking-wider`, `tracking-widest`, or through the
`.font-heavy-grotesk` class.

### ▲ Content globs omit `context/`

```ts
content: ["./pages/**/*", "./components/**/*", "./app/**/*"]
```

[`context/`](../context/) is not scanned. Any Tailwind class written inside a
translation value or a context file would be purged from the build. No current
translation contains class names, so this is latent rather than active — but it is a
trap for anyone adding styled strings to the dictionary.

---

## ▸ Layout Conventions

| Convention | Value |
|---|---|
| Max width — landing, navbar, footer | `max-w-[1440px]` |
| Max width — role consoles | `max-w-7xl` (1280 px) |
| Max width — spotter form | `max-w-4xl` (896 px) |
| Horizontal padding | `px-4 sm:px-8 lg:px-12` (chrome) · `px-6 sm:px-12 lg:px-20` (consoles) |
| Top padding for fixed navbar | `pt-28` |
| Section rhythm | `py-20` · `py-24 sm:py-32` · `py-28 sm:py-36` |
| Vertical stack rhythm | `space-y-12` (sections) · `space-y-6` (cards) · `space-y-4` (fields) |

### Z-index scale

| Layer | Value |
|---|---|
| Navbar header | `z-40` |
| Drawer backdrop, drawer, D0MI launcher, D0MI modal, page modals | `z-50` |
| Leaflet floating legend (orphaned) | `z-[400]` |

▲ The navbar drawer, the D0MI modal, and the page modals on `/analyst` and `/strains`
all sit at `z-50`. Stacking is therefore resolved by DOM order, not by intent. Opening
D0MI while the navbar drawer is open produces order-dependent overlap. A three-tier
scale — chrome `40`, overlays `50`, assistant `60` — would make it deterministic.

### Two visual registers

The system deliberately runs two card treatments:

**Architectural** — landing page, radar, navbar, footer, D0MI:
`rounded-2xl` / `rounded-3xl`, `border-black/[0.08]`, `shadow-sm`, generous padding.
Soft, premium, editorial.

**Brutalist** — the five role consoles: `border-2 border-black`, square corners,
`bg-neutral-50`, hard uppercase labels, monospace metadata.
Clinical, instrumental, laboratory.

This is a defensible choice — the marketing surface and the working surface should not
feel identical — but it is undocumented, which makes it read as inconsistency rather
than intent. Stating it explicitly (as here) resolves that.

---

## ▸ Iconography

[Lucide React](https://lucide.dev) `0.439.0` throughout. No custom SVG, no icon fonts.

Consistent semantic assignments across the app:

| Icon | Meaning | Appears in |
|---|---|---|
| `Eye` | Spotter / intake | `/submit`, `/map`, navbar |
| `Search` | Analyst / triage | `/analyst`, `/strains` |
| `FlaskConical` | Vaccine Maker / synthesis | `/vaccine`, landing |
| `Radio` | Field Worker / broadcast | `/distribute`, landing |
| `Activity` | Surveillance / telemetry | `/map`, landing |
| `ShieldCheck` | Protected / vaccinated | everywhere |
| `Sparkles` | AI operation in progress | `/submit`, `/analyst`, `/vaccine`, D0MI |
| `Bot` | D0MI | launcher pill |
| `RefreshCw` | Loading (with `animate-spin`) | `/submit`, `/analyst` |
| `Check` / `CheckCircle2` | Confirmed / distributed | throughout |
| `Terminal` | Code block | D0MI markdown renderer |
| `Info` | Blockquote callout | D0MI markdown renderer |

Sizing is uniform: `w-3.5 h-3.5` for inline chips, `w-4 h-4` for labels, `w-5 h-5` and
`w-6 h-6` for headers and modal controls.

---

## ▸ Accessibility Notes

| Area | Status |
|---|---|
| `aria-label` on icon-only buttons | ● present — theme toggle, menu, language, D0MI, drawer close |
| `title` attributes on ambiguous controls | ● present — theme toggle, D0MI language picker |
| Keyboard shortcut | ● `Ctrl/Cmd + K` with `preventDefault`, `Escape` to close |
| Semantic landmarks | ● `<header>`, `<main>`, `<footer>`, `<aside>`, `<nav>` |
| Form labels | ● every input labelled |
| Focus rings | ◐ inconsistent — `/submit` uses `focus:ring-2`, most controls use `focus:outline-none` with no replacement |
| Modal focus trap | × none — `/analyst`, `/strains`, and D0MI modals do not trap focus or restore it on close |
| `prefers-reduced-motion` | × none |
| RTL (`dir` attribute) | × none, despite Arabic support |
| `<html lang>` | ▲ hardcoded `"en"` regardless of selected language |
| Colour contrast | ◐ `text-black/40` on `bg-neutral-50` is roughly 3.4:1 — below WCAG AA 4.5:1 for body text |

The `focus:outline-none` pattern without a visible replacement is the most impactful
gap: keyboard users lose the focus indicator on most form controls and buttons. Adding
a consistent `focus-visible:ring-2 focus-visible:ring-offset-2` treatment across the
design system would close it in one pass.

---

## ▸ Design Tokens — Quick Reference

```css
/* ground */
--system-black: #000000;   --system-white: #ffffff;

/* accents */
--accent-v: #8B5CF6;  /* spotter    */
--accent-0: #3B82F6;  /* analyst    */
--accent-i: #22C55E;  /* vaccine    */
--accent-c: #EAB308;  /* field      */
--accent-e: #EF4444;  /* radar      */

/* type */
--font-manrope:    display, UI, headings
--font-cormorant:  editorial, quotes, strain names
/* mono: JetBrains Mono declared, not loaded ⚠ */

/* immunity bands */
score >= 70  →  #22C55E   stable
score >= 35  →  #EAB308   in progress
score <  35  →  #EF4444   critical
/* ⚠ MapComponent and HerdScoreBadge use 40, not 35 */

/* motion */
easing:  cubic-bezier(0.16, 1, 0.3, 1)
reveal:  0.7s scale · 0.8s Y · 0.9s X
drawer:  500ms
hero letters: 900ms, 90ms stagger

/* structure */
border:  black/[0.08] · white/[0.08]     panels
         black/[0.06] · white/[0.06]     dividers
         2px solid black                  brutalist console cards
radius:  rounded-full (pills) · rounded-2xl (cards) · rounded-3xl (panels) · none (consoles)
```

---

[Docs Home](README.md) · [← 09 Internationalization](09-internationalization.md) · **10** · [11 Setup & Operations →](11-setup-and-operations.md)
