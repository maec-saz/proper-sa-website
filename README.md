# PROPER Developments — corporate website

A premium, static, multi-page website for **PROPER Developments**, a MIDRAR company.
Brand statement: *Building Intelligent Environments. Enabling Tomorrow.*

No frameworks, no build tooling beyond one Python script: fast to load, easy to host anywhere
(GitHub Pages, any web server, S3/CloudFront, Netlify).

## Pages
| Page | File |
|---|---|
| Home (five-discipline image hero, capabilities, showcase reel, closing band) | `index.html` |
| About Us | `about.html` |
| Our Capabilities (overview) | `capabilities.html` |
| Technology & Intelligent Infrastructure | `capabilities/technology.html` |
| Audiovisual & Integrated Solutions | `capabilities/audiovisual.html` |
| Construction & Development | `capabilities/construction.html` |
| Museums & Immersive Experiences | `capabilities/museums.html` |
| Exhibition & Equipment Rental | `capabilities/rental.html` |
| Technology Partners | `partners.html` |
| Contact | `contact.html` |

Plus `404.html`, `sitemap.xml` and `robots.txt`.

**Arabic:** every page also exists in Arabic under `/ar/` (e.g. `ar/index.html`, `ar/capabilities/technology.html`),
laid out right-to-left. Each page has a language switch (العربية / English) linking to its counterpart, plus `hreflang` tags.

## Arabic version
- Built from the same templates as the English site, so the two can't drift apart. After the English page is rendered,
  every visible text and text attribute is translated using the dictionary in **`tools/i18n_ar.py`**.
- When you add or change English copy, run `python3 tools/build.py`: any string without an Arabic translation is
  listed, and stays in English until you add it to `tools/i18n_ar.py`.
- Typography: IBM Plex Sans Arabic for text, Amiri for the accent words (the English site's serif italics). Letter-spacing and
  capitalisation are switched off for Arabic, and arrows, gradients and layout are mirrored.
- The live operations wall and the contact email are also localised (in `assets/js/site.js`).

**Please verify (Arabic):**
- **Company names:** "PROPER Developments" and "MIDRAR" are kept in Latin script, because no official Arabic names were
  available (the current site has no Arabic content). Supply the official Arabic names if they should be used.
- **Proper names:** the Headquarters Business Park is written as «ذا هيدكوارترز بزنس بارك». (The Projects section, and its project names, have been removed.)
- Have a native-speaking reviewer proofread the copy before launch.

## Design tooling (for AI-assisted work on this repo)
Skills and MCP servers used when working on the site with Claude Code. The installed files aren't committed
(they're large and GitHub Pages would publish them); restore them in a new session with:

```bash
npx skills@latest experimental_install -y
npx impeccable@latest install -y --providers=claude --project
```

- `skills-lock.json` pins the taste-skill (`design-taste-frontend`) and Emil Kowalski's design/animation skills.
- Impeccable needs network access to `impeccable.style` (already allowed in the cloud environment).
- `.mcp.json` registers the Playwright MCP server (headless Chromium). Figma is connected as a claude.ai connector, not here.

## Editing content
All text, capabilities and partners live in **`tools/build.py`**. Edit the data at the top,
then regenerate every page:

```bash
python3 tools/build.py
```

Styles: `assets/css/site.css` · Behaviour: `assets/js/site.js`.

## The home hero: one image, six disciplines
The home page opens on one continuous photograph (`hd/hero-panorama.jpg`) showing all six disciplines side by side as
six strips. There is no intro sequence, no automatic advance and no hover effect: the hero changes only when the
visitor asks it to.

- **Click or tap a strip:** that discipline opens full screen as a mosaic of six images (Exhibition & Rental shows
  six installation clips), with its name, tagline and a link to its page at the bottom right.
- **Going back:** clicking the open mosaic again (or pressing Escape) returns
  to the six strips.
- **Arrows:** the round arrows at the bottom right step through the six disciplines, with a 01 / 06 counter.

## Live operations wall
The Technology page includes an animated operations-centre "video wall": a schematic site network across the Kingdom,
live KPIs, throughput chart, camera tiles, AI-cluster utilisation and an event log. **All data is simulated** in the
browser and the section is labelled as illustrative. It pauses when off-screen and is static for reduce-motion users.
Edit it in `ops_wall()` in `tools/build.py` (sites, cameras, KPIs) and the "Live operations wall" block in `assets/js/site.js` (events).

## Animated figures
The home-page key figures count up when they scroll into view: years of delivery (calculated from the founding year,
so it stays current), business verticals, technology partners and specialist services (all counted from the data in
`tools/build.py`).

## Assets needed before launch
The brief asks for real imagery only. These are the gaps:

1. **Partner logos in SVG/high resolution.** PUDU, LG and Samsung use official vector logos and CTF uses its official
   transparent logo (ctfconsoles.com); VOD and SOLUM are still 165–205 px wide images from the current site.
2. **Real project photography.** Generated and stock images are illustrative; replace them with PROPER's own project photos when available.
3. **MIDRAR details.** Logo, a short description and a link, if MIDRAR should appear more prominently.

## Imagery
- **Home page and the five disciplines** use **AI-generated imagery made with Higgsfield** (Cinema Studio Image 2.5,
  plus Nano Banana Pro for the home façade): 23 images generated at 5504×3072 and saved as 2560px with 1280px phone
  versions. Prompts are in `docs/higgsfield-prompts.md`. They are illustrative environments, never presented as PROPER
  projects, and contain no logos, readable text or recognisable landmarks.
- **About header:** a real photo of Jeddah's Corniche (Unsplash). **Partners header:** an Unsplash photo of network cabling.
- The full-resolution originals stay in the Higgsfield account (Presales workspace).
- Prompts: `tools/higgsfield_generate.py` (earlier images) and `docs/higgsfield-prompts.md`.

| File (assets/img/hd/) | Source |
|---|---|
| riyadh-kafd-night | Unsplash, Saif Aldhaher (unsplash.com/photos/vAkHAP27QMk): Riyadh at night |
| jeddah-corniche-hd | Unsplash, Asim Alghamdi (unsplash.com/photos/635VLTHmmdI): Jeddah Corniche |
| riyadh-dusk, riyadh-night | Unsplash, Oualid Lakhrouti (unsplash.com/photos/NCD37SPA2wk): Riyadh skyline, relit as dusk and night with Nano Banana Pro |
| hero-panorama | Higgsfield Nano Banana Pro: one continuous six-discipline photograph used by the home hero |
| realestate-hero, realestate-masterplan, realestate-residential, realestate-hospitality, construction-architecture | Higgsfield (Cinema Studio 2.5 / Nano Banana Pro) |
| projects/aramco-* | PROPER Holding company profile: Saudi Aramco project, Dammam (PROPER Developments) |
| maec/* | MAEC Architects & Engineers firm profile: selected projects (MIDRAR) |
| capabilities-hero, tech-hero, tech-noc, av-control-room | Higgsfield Nano Banana Pro, 4K, with CTF console product photos (ctfconsoles.com) as references |
| tech-hero, tech-gpu, tech-robotics, tech-noc | Higgsfield (Technology & Intelligent Infrastructure; tech-noc also heads Our Capabilities) |
| av-hero, av-boardroom, av-control-room, av-led-wall | Higgsfield (Audiovisual & Integrated Solutions) |
| construction-hero, construction-fitout, construction-site, construction-infrastructure | Higgsfield (Construction & Development) |
| museum-hero, museum-gallery, museum-interactive, museum-dome | Higgsfield (Museums & Immersive Experiences) |
| museum-immersive | Unsplash, Kwynett Bragado (unsplash.com/photos/FSPPPpLNlas): immersive multi-projection exhibition |
| museum-touch | Unsplash, Karen Grigorean (unsplash.com/photos/9D6UlCW38Ss): museum touchscreen |
| rental-hero | Higgsfield Cinema Studio 2.5, 4K: premium exhibition stand with a curved gold-and-sapphire LED wall, crowds and light beams |
| rental-kinetic-wall, rental-interactive-floor, rental-led-cube | Higgsfield (Exhibition & Equipment Rental) |
| rental-live-interaction | Unsplash, photo by Fujiphilm (unsplash.com/photos/pQh3wvcsWj4): real visitors at an interactive wall, illustrative, not a PROPER project |
| rental-anamorphic | Higgsfield Cinema Studio 2.5, 4K: anamorphic 3D corner LED wall at an exhibition stand, golden falcon |
| rental-ai-host | Unsplash, Enchanted Tools (unsplash.com/photos/sqj85Qm11yc): visitors interacting with an AI humanoid robot at an exhibition |
| network-cables | Taylor Vick on Unsplash (Partners) |

To regenerate an image, run its prompt with the Higgsfield CLI (`higgsfield generate create cinematic_studio_2_5 --resolution 4k --aspect_ratio 16:9 --prompt "…" --wait`),
save it in `assets/img/hd/` as `name.jpg` (2560px) plus `name-1280.jpg`, then reference `hd/name.jpg` in `tools/build.py`.

## Please verify
- **Design visualisations** (control room, immersive dome, 360° room, executive lounge) come from the current
  site's media library and are captioned "design visualisation". Confirm they may be published.
- **Partner roles** (e.g. "Service & delivery robotics" for PUDU, "Distribution partner" for VOD and SOLUM).
- **Contact details** are carried over from the current site.

## Technical notes
- Cross-page fade transitions use the browser's View Transitions API (Chrome/Edge/Safari 18+), with no effect elsewhere.
- Each page has its own title, description, canonical URL and Open Graph tags; the home page includes
  Organization structured data (with MIDRAR as parent organisation). `SITE` in `tools/build.py` sets the domain.
- Accessible: skip link, landmark structure, keyboard-operable menu and capability list,
  visible focus states, alt text, reduced-motion support.
- The contact form opens the visitor's email app (mailto). Connect it to a form service or CRM for
  direct submissions.
- The Arabic version from the previous site isn't part of this redesign; it can be added back as a parallel `/ar/` build.

## Removed sections
At the client's request the site no longer has a Projects section, an "Our home" (Headquarters Business Park) section or a Clients section; their images were deleted.

## About Us content sources
- **Group structure, Aramco project, 21 technology solutions:** PROPER Holding company profile (Proper profile v4).
- **Group track record:** MAEC Architects & Engineers firm profile; shown as MIDRAR's engineering practice, not as PROPER Developments projects.

## Exhibition & Rental: installation clips
The "In motion" section on the Exhibition & Rental page shows six short silent clips in `assets/video/`
(kinetic facade, kinetic wall, expandable LED sphere, kinetic ceiling, kinetic LED rings, rotating immersive room).
They are **original clips generated with Higgsfield** (a Nano Banana Pro still animated with Seedance 2.5), modelled
on installations in the PROPER Holding Technology Catalogue. They are illustrations, not footage of specific projects.
Clips are 1280×720 H.264 without audio, with a poster frame each; they load only when scrolled into view, play
muted on a loop while visible, and stay still when reduced motion is turned on.

## Interaction details (patterns from the 21st.dev library, rebuilt natively)
The site stays framework-free; these effects are written in plain CSS/JS after 21st.dev components:
- **Spotlight cards** ("Spotlight Card"): a soft light and lit edge follow the cursor over service cards, partner tiles,
  project cards and the group-structure tiles (pointer devices only).
- **Count-up figures** ("Count Up"): the About figures (7 / 100+ / 5.7M m²) and each discipline's service count
  count up when scrolled into view.
- **Border beam** ("Border Beam"): a gold light travels around the PROPER Holding card in the group structure.
- **Reading reveal** ("Reading Text Reveal"): each discipline's overview paragraph lights up word by word on scroll.
All four switch off with reduced motion.
