---
name: PROPER Developments
description: Charcoal-and-brushed-metal corporate site for a Saudi technology, construction and immersive-experience company.
colors:
  charcoal: "#0d0e10"
  charcoal-raised: "#131518"
  graphite: "#191b1f"
  graphite-raised: "#22252a"
  steel: "#2e3238"
  hairline: "rgba(255, 255, 255, 0.10)"
  hairline-strong: "rgba(255, 255, 255, 0.18)"
  warm-white: "#f3f2ef"
  silver-text: "#c9ccd1"
  mist-grey: "#9399a2"
  dim-grey: "#868c95"
  stone: "#ebe9e4"
  stone-deep: "#dedbd4"
  ink-on-stone: "#15171a"
  slate-on-stone: "#5d636b"
  brushed-metal: "#c3bcad"
typography:
  display-xl:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(44px, 7.2vw, 112px)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.035em"
  display:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(36px, 4.6vw, 68px)"
    fontWeight: 300
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(30px, 3vw, 44px)"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(24px, 2.2vw, 30px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 300
    lineHeight: 1.5
  body:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
  accent-serif:
    fontFamily: "Instrument Serif, Times New Roman, serif"
    fontSize: "1.06em"
    fontWeight: 400
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
  "20": "80px"
  "24": "96px"
  "30": "120px"
  "40": "160px"
components:
  button-metal:
    backgroundColor: "{colors.brushed-metal}"
    textColor: "{colors.charcoal}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "56px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.warm-white}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "56px"
  button-line-hover:
    backgroundColor: "rgba(255, 255, 255, 0.06)"
    textColor: "{colors.warm-white}"
  button-sm:
    typography: "{typography.small}"
    padding: "0 16px"
    height: "40px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.silver-text}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  chip-active:
    backgroundColor: "{colors.warm-white}"
    textColor: "{colors.charcoal}"
  tag:
    textColor: "{colors.silver-text}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.warm-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 0"
  eyebrow:
    textColor: "{colors.mist-grey}"
    typography: "{typography.label}"
---

<!-- Reviewed 2026-11-23 (Impeccable document + taste-skill system checks). Values here are the reviewed target.
     assets/css/site.css still carries the pre-review values; migrate it to these tokens before relying on parity. -->

# Design System: PROPER Developments

## Overview

**Creative North Star: "Charcoal & Brushed Metal"**

A dark, architectural corporate system: deep charcoal grounds, warm off-white type and a single brushed-metal accent that
reads like anodised aluminium in a lobby. Large light-weight sans display type carries authority; one word per heading
turns into an Instrument Serif italic (in Arabic, Amiri) as the human accent. Photography is full-bleed and cinematic;
the interface stays square, quiet and hairline-ruled so the imagery and the work lead.

Density is low. Sections breathe on a long vertical rhythm, and light **stone** sections interrupt the dark run to pace
the page. Motion is slow and eased (one custom curve), never bouncy.

**Key Characteristics:**
- Dark-first, with stone (light) sections as deliberate pauses.
- One accent material, brushed metal, as a gradient on primary buttons and as a flat tone for numbers and rules.
- Square corners everywhere in the interface; hairline borders instead of shadows.
- Light (300) display weights with tight negative tracking; uppercase tracked labels.
- Fully mirrored right-to-left for Arabic; letter-spacing and uppercase switch off in Arabic.

## Colors

A near-monochrome warm-grey palette with one metallic accent.

### Primary
- **Brushed Metal** (`brushed-metal`): numbers, eyebrow rules, focus rings and accent hairlines; as a gradient
  (`linear-gradient(115deg, #8e8879 0%, #d9d3c5 28%, #a9a293 48%, #ece8de 66%, #9b9586 100%)`) it fills the primary
  button and the accent word in the hero title. Never body text on a light ground (1.6:1 on stone).

### Neutral (dark grounds)
- **Charcoal** (`charcoal`): page ground, footer.
- **Charcoal Raised** (`charcoal-raised`): glass cards and the mega menu panel.
- **Graphite** (`graphite`): dark sections, CTA band, image placeholders.
- **Graphite Raised** (`graphite-raised`): the lightest dark surface that may carry text.
- **Steel** (`steel`): non-text fills only.
- **Hairline / Hairline Strong** (`hairline`, `hairline-strong`): dividers, card and chip borders, button outlines.
- **Warm White** (`warm-white`): headings and primary text on dark.
- **Silver Text** (`silver-text`): secondary text that must stay bright: nav, captions on photos, tags, footer links.
- **Mist Grey** (`mist-grey`): supporting paragraphs and eyebrows on dark.
- **Dim Grey** (`dim-grey`): the quietest text tier on dark: footer headings and copyright, form notes, field labels in
  lists, menu numbers. Passes 4.5:1 on every dark surface (4.54:1 on Graphite Raised, 5.70:1 on Charcoal).

### Neutral (stone grounds)
- **Stone** (`stone`): light sections (intro, partners, values, trust).
- **Stone Deep** (`stone-deep`): non-text fills only on stone sections.
- **Ink on Stone** (`ink-on-stone`): headings and body on stone.
- **Slate on Stone** (`slate-on-stone`): supporting text on stone and on white cards (5.00:1 on Stone, 6.07:1 on white).

### Named Rules
**The Two-Ground Rule.** Text colours are paired with their ground family: Warm White, Silver, Mist and Dim Grey on dark
grounds; Ink and Slate on Stone. Mist Grey, Dim Grey and Brushed Metal never set text on Stone.

**The 4.5 Floor.** Every text tier, including the quietest, clears 4.5:1 on the lightest surface it is allowed on.
Brushed Metal is exempt only as a non-text mark (rules, the oversized quote glyph).

## Typography

**Display Font:** Inter Tight (with Helvetica Neue, Arial)
**Body Font:** Inter Tight
**Accent Font:** Instrument Serif italic, for one emphasised phrase per heading
**Arabic:** IBM Plex Sans Arabic for text, Amiri (upright) for the accent phrase; line height 1.35 on display sizes.

**Character:** a contemporary grotesk set light and large for an architectural, engineered voice, with a classical serif
italic as the one warm, human note.

### Hierarchy
Nine levels; each step is at least 1.16× the one below at every viewport width from 320px to 1920px, so no two read as the same level.

- **Display XL** (300, clamp 44→112px, 1.0): the home hero statement and page heroes. Phones: 44px minimum.
- **Display** (300, clamp 36→68px, 1.04): section headings (h2), contact headline, hero title card.
- **Headline** (300, clamp 30→44px, 1.12): section sub-headings, key figures, footer statement, feature card titles, viewer and story titles.
- **Title** (400, clamp 24→30px, 1.2): card titles, service, pillar, value and step names, capability list rows.
- **Lead** (300, 20px, 1.5): intro paragraphs under headings, page-hero subtitles, discipline taglines.
- **Body** (400, 17px, 1.6, at every width): paragraphs, form inputs. Max line length 60ch.
- **Small** (400 or 500, 14px, 1.5): buttons, links, nav, chips, tags, captions, card meta, footer links, list labels.
- **Label** (500, 12px, +0.14em, uppercase): eyebrows, form labels, footer headings, image captions, small meta, data labels.
- **Accent Serif** (Instrument Serif italic, 1.06em of its heading): the emphasised phrase inside a display heading.

### Named Rules
**The One Small Size Rule.** Interface text below body is either Small (14px) or Label (12px). No 13, 13.5, 14.5, 15 or
half-pixel sizes.

**The Light Display Rule.** Display XL, Display and Headline are always weight 300 with negative tracking; never bold.

## Layout

- **Container:** max 1320px, fluid side gutter clamp(16px, 4vw, 48px); every section's content sits on the same edges.
- **Spacing base: 4px.** All padding, margin and gap values come from the spacing scale (4, 8, 12, 16, 20, 24, 32, 40, 48,
  64, 80, 96, 120, 160). Fluid values clamp between two scale steps.
- **Section rhythm:** standard section padding clamp(80px, 10vw, 160px) top and bottom; tight sections
  clamp(64px, 8vw, 120px); the first section under a fixed header adds the header height.
- **Heading block:** eyebrow, then 24px to the heading, 24px to its lead, clamp(32px, 4vw, 48px) to the content.
- **Grids:** two-column splits gap clamp(40px, 6vw, 96px); card grids gap 24px (16px on phones); tag and chip rows gap 8px.
- **Header:** 84px tall, 72px once scrolled.
- **Breakpoints:** 980px (navigation collapses to a full-screen menu, splits stack) and 640px (single column).

### Named Rules
**The Four-Pixel Rule.** No spacing value outside the 4px scale. Optical nudges (1px hairline offsets, a 2px focus inset)
are the only exceptions.

## Elevation & Depth

Flat, layered by tone and hairline rather than shadow. Depth comes from stepping charcoal → graphite → graphite raised,
from frosted glass (backdrop blur 16–18px on the header, mega menu and HQ card) and from photography gradients.

### Shadow Vocabulary
- **Focus halo** (`box-shadow: 0 0 0 4px rgba(195, 188, 173, 0.2)`): around focused form controls.
- **Floating panel** (`box-shadow: 0 40px 120px -40px rgba(0, 0, 0, 0.8)`): the operations-wall panel only.
- **Status glow** (`box-shadow: 0 0 10px currentColor`): live status dots.
- **Handle lift** (`box-shadow: 0 0 18px rgba(0, 0, 0, 0.5)`): the before/after slider handle over photos.

**The Flat-By-Default Rule.** Cards and sections never carry drop shadows; separation is a hairline or a tone step.

## Shapes

Square and architectural. Interface elements (buttons, chips, tags, inputs, cards, dialogs) have 0px corners. A small 4px
radius softens only photographic frames inside dense components (story stage, before/after, story images); 8px and 12px are
reserved for data-panel chrome (operations wall). Circles (full) are for status dots, pagination handles and the scroll cue.
Borders are 1px hairlines; inputs are a single bottom rule.

## Components

### Buttons
Engineered and calm: a metal slab or a hairline outline.
- **Shape:** square (0px).
- **Metal (primary):** brushed-metal gradient, charcoal text, Small 500, 56px tall, 24px side padding, arrow icon after the
  label with a 12px gap. Hover slides the gradient across (background-position 0 → 100%) over 350ms.
- **Line (secondary):** transparent with a Hairline Strong border, warm-white text; hover brightens the border to warm white
  and adds a 6% white wash.
- **Small:** 40px tall, 16px side padding (header "Contact Us").
- **Arrow icon:** nudges 4px forward on hover (mirrored in Arabic).

### Text link
Small 500 with a 1px underline at 40% opacity, 8px below the text; the underline turns solid on hover; arrow nudges 4px.

### Chips and tags
- **Filter chip:** transparent, hairline border, Silver text, 12px × 20px padding; hover Hairline Strong + white text;
  active = warm-white fill with charcoal text.
- **Tag:** static hairline box, Silver text, 8px × 12px padding.

### Cards / Containers

### Inputs / Fields
- **Style:** transparent, bottom hairline only, Body text, 12px vertical padding; Label above, 8px gap.
- **Focus:** bottom rule turns warm white; the global focus ring is a 2px brushed-metal outline offset 4px.
- **Error:** invalid fields keep the same shape and add an error rule; the first invalid field takes focus.

### Navigation
Fixed header over the hero, transparent until scroll, then charcoal glass at 72px. Links are Small in Silver with a 1px
underline that draws from the inline start on hover and stays under the current page. Capabilities opens a 380px mega
panel listing the five disciplines with their numbers. Under 980px a full-screen charcoal menu with Title-size links. The
language switch (العربية / English) sits before the header button.

### Eyebrow
Label in Mist Grey (Slate on Stone) preceded by a 32px brushed-metal rule with a 16px gap; 24px below to the heading.

### Signature components
- **Cinematic hero:** full-viewport three-shot aerial sequence with letterbox bars, title card and a timed reveal of logo,
  Display XL statement, Lead and two buttons; plays once per session, with a "Skip intro" control.
- **Capabilities accordion:** a numbered list of the five disciplines beside a crossfading image; the active row extends a
  brushed-metal rule and reveals its services as tags.
- **Operations wall:** a dark data panel (map, KPIs, chart, cameras, GPU bars, log); the one place 8–12px radii, monospace
  type and the floating-panel shadow appear.

## Do's and Don'ts

### Do:
- **Do** pair every text colour with its ground family (The Two-Ground Rule) and keep every text tier at 4.5:1 or above.
- **Do** take every spacing value from the 4px scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160).
- **Do** keep interface text to Small (14px) and Label (12px) below body, and display headings at weight 300.
- **Do** put exactly one Accent Serif phrase in a display heading, at the end of the line.
- **Do** keep corners square on buttons, chips, inputs, cards and dialogs.
- **Do** mirror layout, arrows and gradients in Arabic, and drop letter-spacing and uppercase there.

### Don't:
- **Don't** set Mist Grey, Dim Grey or Brushed Metal text on Stone or white.
- **Don't** introduce half-pixel or in-between type sizes (13, 13.5, 14.5, 15, 15.5, 18px).
- **Don't** add drop shadows to cards or sections; use a hairline or a tone step.
- **Don't** use a second accent colour; Brushed Metal is the only one.
- **Don't** add rounded corners to interface controls.
