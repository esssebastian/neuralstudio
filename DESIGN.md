---
name: Neural Studio
description: AI-native creative studio — a deep-space void lit by living violet signal
colors:
  void-black: "#080912"
  void-black-2: "#0c0d1c"
  surface: "rgba(255,255,255,0.03)"
  border: "rgba(255,255,255,0.07)"
  border-light: "rgba(255,255,255,0.12)"
  electric-violet: "#7c5cfc"
  electric-violet-dim: "rgba(124,92,252,0.14)"
  electric-violet-glow: "rgba(124,92,252,0.3)"
  signal-cyan: "#22d3ee"
  text: "#f0f4ff"
  muted: "rgba(240,244,255,0.5)"
  muted-2: "rgba(240,244,255,0.3)"
typography:
  display:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "clamp(3.2rem, 9vw, 8rem)"
    fontWeight: 400
    lineHeight: 0.93
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "clamp(2rem, 4.5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.03
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    letterSpacing: "0.18em"
rounded:
  sm: "12px"
  md: "20px"
  pill: "999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "2rem"
  lg: "4rem"
  xl: "7rem"
  section: "9rem"
components:
  button-primary:
    backgroundColor: "{colors.electric-violet}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.9rem 2rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0.9rem 2rem"
  input-field:
    backgroundColor: "rgba(255,255,255,0.04)"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1rem"
---

# Design System: Neural Studio

## Overview

**Creative North Star: "The Deep Space Studio"**

Neural Studio's world is a void-black creative studio where light itself is the only warmth. The background isn't neutral gray or off-white — it's near-total darkness (#080912), and everything that matters emits or reflects an electric violet glow against it. A live particle canvas drifts behind the hero, connection lines flickering between points like signal finding signal — atmosphere, not literal AI iconography. This is the visual expression of the brand's core tension: cold technology made to feel human through warmth of light, emotion in the copy ("We make AI products feel human"), and a materiality that reads more like a photography studio at night than a SaaS dashboard.

Density is generous and unhurried — 9rem section padding, wide line-heights on body copy, headlines that take real vertical space. Nothing is cramped; the studio has room to breathe. The aesthetic rejects flat "AI product" conventions (bright gradients everywhere, glassy blue, corporate sans-serif at uniform weight) in favor of one dominant hue used with intention and a heavier, blacker canvas than typical dark-mode UI.

**Key Characteristics:**
- Near-black void background, not charcoal or navy-gray
- One dominant accent (Electric Violet) doing almost all of the color work; Signal Cyan appears only in gradients and rare secondary accents
- Oversized, condensed display type (Archivo Black) contrasted against a humane, readable body face (Plus Jakarta Sans)
- Depth from glow and blur only — no hard drop shadows
- A living particle-network canvas as ambient hero atmosphere, echoed by soft blurred color orbs deeper in the page

## Colors

The palette is monochrome-dark with a single confident accent; color is rare and therefore meaningful.

### Primary
- **Electric Violet** (#7c5cfc): The one true accent. Carries every primary CTA, active state, badge dot, section-label underline, focus ring, and glow. Used at full saturation only on small, high-intent elements (buttons, badges, active dots) — never as a large fill.

### Secondary
- **Signal Cyan** (#22d3ee): Appears almost exclusively as the second stop in the `gradient-text` treatment (135deg, violet → cyan) and in the hero's secondary ambient orb. It is a highlight of the highlight, not an independent accent — it never appears alone on an interactive element in the current system.

### Neutral
- **Void Black** (#080912): Page background. The base of everything.
- **Void Black 2** (#0c0d1c): A secondary near-black, for subtly differentiated dark surfaces.
- **Text** (#f0f4ff, "starlight white"): Primary text color — cool white, not pure `#fff`.
- **Muted** (rgba(240,244,255,.5)): Secondary body copy, descriptions, subheads.
- **Muted 2** (rgba(240,244,255,.3)): Tertiary text — footer copy, scroll hint, timestamps.
- **Surface** (rgba(255,255,255,.02–.04)): Near-invisible white overlays used for card fills and input backgrounds; the surface is felt more than seen.
- **Border** (rgba(255,255,255,.07–.14)): Hairline dividers and card edges, always translucent white over black, never a flat gray.

### Named Rules
**The One Accent Rule.** Electric Violet is the only color allowed to command attention. Signal Cyan exists solely inside gradients and blurred ambient orbs — the moment it appears as a flat, standalone accent (e.g. a cyan button or cyan badge), the system has drifted.

**The Whisper-Surface Rule.** Card and input backgrounds are never opaque dark grays; they are translucent white (2–4% opacity) over the void, so the background always shows through faintly. This is what keeps the studio feeling like depth rather than a stack of solid panels.

## Typography

**Display Font:** Archivo Black (with sans-serif fallback)
**Body Font:** Plus Jakarta Sans, weights 300–700 (with system-ui fallback)

**Character:** Archivo Black is heavy, condensed, and geometric — used at low letter-spacing (down to -.04em) so oversized headlines feel compressed and confident rather than loud. Plus Jakarta Sans is warm and humanist by contrast, carrying every sentence of actual explanation. The pairing is the typographic version of the brand thesis: a bold, almost blunt technological voice softened by an approachable, conversational one.

### Hierarchy
- **Display** (400, `clamp(3.2rem,9vw,8rem)`, line-height .93): Hero `<h1>` only. Archivo Black, tight tracking (-.04em).
- **Headline** (400, `clamp(2rem,4.5vw,3.75rem)`, line-height 1.03): Section `<h2>`s (About, Work, Contact). Archivo Black, -.025em tracking.
- **Title** (400, 1.2–1.75rem): Card and component headings (`.vis-card h3`, `.process-step h3`, `.form-success h3`). Archivo Black.
- **Body** (400, .95–.98rem, line-height 1.6–1.8): Paragraph copy. Plus Jakarta Sans. Kept fairly narrow (max-width 400–520px) so lines don't run long despite the generous line-height.
- **Label** (700, .65–.72rem, letter-spacing .1–.18em, uppercase): Section labels, tags, form field labels, process step numbers. Always paired with the violet accent color.

### Named Rules
**The Compression Rule.** The bigger the Archivo Black type gets, the tighter the tracking and line-height go (hero: -.04em / .93 line-height; body headings: -.02em / 1.08). Scale and compression move together.

## Layout

Single-column centered container, `max-width: 1160px`, `padding: 0 2rem`. Sections stack vertically with generous rhythm: `9rem` top/bottom padding per section on desktop, separated by a single hairline `border-top`. No section backgrounds differ from the page void — separation comes entirely from whitespace and the hairline, not color blocking.

Two-column grids (About, Contact) split roughly 1:1 or 1:1.15 with a wide `7rem` gap, collapsing to a single stacked column under 1024px. The portfolio grid (`.cp-grid`) is the one place density flexes per-project: 4-column, 7-column, square, and landscape aspect variants coexist to fit different campaign media.

Responsive breakpoints: 1024px (grid collapse), 768px (nav links hidden, section padding halved to ~5rem), 520px (hero type drops to a smaller clamp floor, hero scroll hint hidden), 380px (button stacks vertical). Padding and font-size clamps compress at each step rather than jumping.

## Elevation & Depth

This system has **no hard drop shadows**. Depth is built from two techniques only: colored glow (`box-shadow` using the violet's own rgba, e.g. `0 0 32px rgba(124,92,252,.3)`) on interactive/active elements, and frosted glass (`backdrop-filter: blur()`) on elevated surfaces like the nav bar and the About section's floating card. Ambient ombré orbs (large, heavily blurred radial gradients) simulate atmospheric depth behind hero and about content rather than any surface casting a literal shadow.

### Shadow Vocabulary
- **cta-glow-rest** (`box-shadow: 0 0 20px–32px rgba(124,92,252,.3)`): Resting state for primary buttons, nav CTA, form submit — the accent visibly emits light.
- **cta-glow-hover** (`box-shadow: 0 0 35px–56px rgba(124,92,252,.55)`): Hover state — the glow widens and intensifies rather than the element gaining a drop shadow.
- **card-ambient** (`box-shadow: 0 24px 64px rgba(0,0,0,.4)`): The one neutral (non-colored) shadow in the system, used only under the frosted glass About card to ground it against the void.

### Named Rules
**The Light-Not-Shadow Rule.** Elevation reads as things *emitting* violet light, not casting dark shadows. If a new component needs to feel "raised," reach for glow or blur before reaching for a conventional drop shadow.

## Shapes

Two radius steps only: a small `12px` (`--radius-sm`, inputs, small controls) and a larger `20px` (`--radius`, cards, portfolio tiles, elevated surfaces). Interactive controls that carry weight (buttons, badges, nav CTA, dots) go fully pill-shaped (`999px`) instead of using the card radius — the shape language distinguishes "things you press" (pills) from "things you contain content in" (20px-rounded rectangles). Borders throughout are 1px, translucent white, never a flat opaque gray line.

## Components

### Buttons
- **Shape:** Fully pill (`border-radius: 999px`).
- **Primary:** Solid Electric Violet fill, white text, `.9rem 2rem` padding, violet glow shadow at rest, wider/brighter glow + 2px lift on hover, slight scale-down on active (`scale(.97)`).
- **Outline:** Transparent background, 1px translucent white border, text-colored label; hover brightens the border and adds a faint white wash — no violet involved in the outline variant.
- **Nav CTA:** Same primary treatment, scaled down (`.55rem 1.35rem`).

### Cards / Containers
- **Corner Style:** 20px radius (large `--radius`).
- **Background:** Whisper-surface white-on-black (2–4% opacity), never opaque.
- **Shadow Strategy:** Frosted glass blur + the one neutral ambient shadow (see Elevation).
- **Border:** 1px translucent white, brighter (10%) than the base border (7%) to read as a distinct edge against the void.
- **Internal Padding:** ~2rem, tightened per component.

### Inputs / Fields
- **Style:** Whisper-surface background (4% white), 1px translucent border (9%), `12px` small radius.
- **Focus:** Border brightens to violet at 50% opacity plus a soft 3px violet focus ring (`box-shadow: 0 0 0 3px rgba(124,92,252,.1)`) — no glow, a quieter focus treatment than buttons.
- **Placeholder:** Very low-opacity white (20%), barely-there.

### Navigation
- Fixed, full-bleed bar with heavy blur (`backdrop-filter: blur(24px)`) over a semi-opaque void background — glass-over-void, not a solid bar. Logo is Archivo Black with the violet accent isolated to the flanking dot characters (`·NS·`). Link text is muted by default, brightens to full text-white on hover; the CTA is the one pill-shaped, glowing element in the bar. Mobile collapses nav links entirely, keeping only logo and (implicitly) the CTA reachable via scroll.

### Portfolio Tile (signature component)
The recurring unit for showcasing client work: a `.wi` (work item) is a 20px-rounded, hairline-bordered, near-invisible-background frame around an `img`/`video` that fills it via `object-fit: cover`. On hover, the media scales up 1.03x over a slow 0.55s ease — a restrained zoom, not a flip or overlay reveal. Aspect ratio varies per campaign (3:4 default, 16:9 for landscape sets, 1:1 for square grids) so the tile adapts to whatever the actual deliverable shape is, but the frame treatment (radius, border, hover-zoom) stays constant.

## Do's and Don'ts

### Do:
- **Do** keep the background near-black (#080912/#0c0d1c) — never lighten it toward charcoal or navy-gray to "soften" the UI.
- **Do** build depth with glow (colored box-shadow) and blur (`backdrop-filter`), per the Light-Not-Shadow Rule.
- **Do** keep card and input surfaces translucent (2–9% white opacity), per the Whisper-Surface Rule, so the void always shows through.
- **Do** use pill shape (999px) for anything pressable, and 20px/12px rounded rectangles for anything containing content.
- **Do** pair Archivo Black display type with tight tracking at large sizes, per the Compression Rule.

### Don't:
- **Don't** introduce Signal Cyan as a standalone flat accent (button, badge, solid fill) — it only appears inside gradients and blurred ambient orbs, per the One Accent Rule.
- **Don't** add hard, neutral drop shadows to buttons or badges — the only neutral (non-colored) shadow in the system is the single ambient card shadow under the About visual.
- **Don't** treat `index-en.html`, `index2.html`, `leads.html`, or `subscribe.html` as sources of truth for this system — they carry a divergent cyan/gold or light-theme palette from an earlier or parallel iteration and are out of scope for this DESIGN.md (confirmed with the user; index.html + webinar.html are canonical).
- **Don't** fill large areas with the violet accent — it is reserved for small, high-intent elements per the One Accent Rule; large surfaces stay void-black or whisper-surface.
