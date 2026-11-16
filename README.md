# Proper Developments — new website (proper-sa.com)

A static, dependency-free, bilingual (English / Arabic, full RTL) website for Proper Developments.
Open `index.html` in a browser, or upload the whole folder to any web host (cPanel, Netlify, S3, Nginx…).

## Structure
```
index.html              single-page site (all sections)
assets/css/style.css    styles; brand colors are CSS variables at the top (:root)
assets/js/main.js       interactions + PROJECTS list (edit to add/rename projects)
assets/js/i18n-ar.js    Arabic translations (keys match data-i18n attributes)
assets/img/             logo, projects, services, partner & client logos (from the current site)
```

## Sections
Top bar & language toggle · Hero · At a glance (stats) · About (history, vision, mission, expanding goal) ·
What we do (Technology / Development, Construction & Supply tabs) · **Control Room Solutions** ·
**AI Enablement** · **Exhibitions & Experiential** · How we work · Sectors · Projects (filter + lightbox) ·
Clients & partners · Core values & Vision 2030 · Contact (form + map) · Footer · WhatsApp button.

## Before going live — please review
- **Stats** (`At a glance`): 2007, 20+ years, 9 business lines, 16+ brands, 30+ clients. The 16 brands and
  ~30 clients are counted from the logos on the current site; adjust if you have exact figures.
- **Project categories & descriptions** in `assets/js/main.js` are inferred from the project photos/names;
  confirm them (especially Aramco Sail and Lexus scope).
- **New service copy** (Control Rooms, AI Enablement, Exhibitions, Sectors, How we work) is new marketing
  text written for this site; confirm it matches what you actually offer.
- **Footer links** (Company Profile, Policy, Privacy, Terms) point to `#` — link them to the real PDFs/pages.
- **Contact form** opens the visitor's email client (mailto). For server-side submission, point the form at
  a handler (e.g. Formspree or your CRM).
- Language can be forced via URL: `index.html?lang=ar`.

## Interactive & immersive experience
Plain HTML/CSS/JavaScript: no 3D, no WebGL, no libraries, and no build step.
- **Hero "worlds":** four cinematic scenes (Control Rooms, AI, Exhibitions, Development) that cross-fade
  automatically or on click, with a slow zoom, mouse parallax, cursor spotlight and a word-by-word headline reveal.
- **Live operations wall** (Control Rooms): network map of the Kingdom, live throughput chart, ticking KPIs,
  camera feed and event stream. Click a panel to focus it. *Illustrative data, generated in the browser.*
- **"See what AI sees"** (AI Enablement): drag the slider to compare the camera view with AI detection boxes or a heatmap.
- **Project tour** (`#tour`): vertical scrolling drives a horizontal walk through all 12 projects (desktop).
  On phones it becomes a swipeable carousel.
- **Project viewer:** full-screen viewer with previous/next buttons, keyboard arrows, swipe and a counter.
- Process timeline that fills as you scroll, a scroll progress bar and a cursor glow on dark sections.
- Respects "reduce motion": auto-play, the guided slider sweep and the scroll-pinned tour are switched off.
- All projects come from `PROJECTS` in `assets/js/main.js`; event-stream texts are in `FEED` in the same file.
