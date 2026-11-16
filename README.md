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

## Immersive 3D layer
- **Hero:** real-time WebGL command-center scene (AI core, orbit rings, curved LED wall, data-grid floor, particles).
  It follows the mouse, moves with scroll and mirrors for Arabic.
- **Virtual Showroom** (`#showroom`): 360° room with the 12 projects on its walls. Drag / swipe / arrow keys to look
  around, click (or Enter) to open a project. The project list comes from `PROJECTS` in `assets/js/main.js`.
- **3D tilt + glare** on cards (desktop mouse only).
- Rendering pauses when off-screen; reduced-motion users get a calm version; no-WebGL browsers fall back to the
  static hero photo and hide the showroom.
- Source: `src/immersive.js`. Rebuild after editing: `npm install && npm run build` (outputs `assets/js/immersive.js`).
- Project photos appear on the 3D walls only when the site is served over http(s). Opened straight from disk
  (`file://`), the browser blocks images in WebGL, so the walls show branded placeholder art instead.
