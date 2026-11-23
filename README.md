# PROPER Developments — corporate website

A premium, static, multi-page website for **PROPER Developments**, a MIDRAR company.
Brand statement: *Building Intelligent Environments. Enabling Tomorrow.*

No frameworks, no build tooling beyond one Python script: fast to load, easy to host anywhere
(GitHub Pages, any web server, S3/CloudFront, Netlify).

## Pages
| Page | File |
|---|---|
| Home (cinematic intro, introduction, capabilities, partners) | `index.html` |
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

## The cinematic hero
The home page opens with a ~9-second, three-shot aerial sequence (Higgsfield-generated imagery):
1. **High altitude:** descending through cloud over a city skyline, with the "A MIDRAR company" title card.
2. **Drone dive:** a top-down view onto modern towers with a slight camera yaw.
3. **Architectural flyover:** a golden-hour glass façade that pans in as the letterbox opens and the logo,
   statement and calls to action are revealed. It then drifts slowly and the film loops.

- On desktop it plays as a **film** (`assets/video/hero-film.mp4`, 1920×1080, 16 s loop, ~4.4 MB) kept in sync with the
  intro text. The film is rendered from the aerial photos by `tools/render_hero_film.py` (needs Pillow, NumPy, ffmpeg).
- Phones, data-saver connections and reduce-motion users get the lighter CSS photo sequence instead (same shots and timing).
- It plays once per browser session; repeat views open on the façade shot. There's a **Skip intro** button.
- The hero imagery is illustrative; it does not depict the Headquarters Business Park.

**Real drone footage:** export it as MP4 (H.264, 1920×1080, 10–16 s, ideally under 6 MB, no audio), save it over
`assets/video/hero-film.mp4` and rebuild. Keep the first cut around 3 s and the final shot from ~6 s so the text still lands.

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

3. **Partner logos in SVG/high resolution.** PUDU now uses its official SVG logo (from pudurobotics.com); VOD, CTF, LG, Samsung and SOLUM are 165–205 px wide images
   from the current site.
4. **About and Partners headers** still use stock photos; generate replacements with Higgsfield if wanted.
6. **MIDRAR details.** Logo, a short description and a link, if MIDRAR should appear more prominently.

## Imagery
- **Home page and the five disciplines** use **AI-generated imagery made with Higgsfield** (Cinema Studio Image 2.5,
  plus Nano Banana Pro for the home façade): 23 images generated at 5504×3072 and saved as 2560px with 1280px phone
  versions. Prompts are in `docs/higgsfield-prompts.md`. They are illustrative environments, never presented as PROPER
  projects, and contain no logos, readable text or recognisable landmarks.
- **About and Partners headers** still use two Unsplash photos (free for commercial use; credited below as a courtesy).
- The home opening film (`assets/video/hero-film.mp4`) is rendered from the three Higgsfield home shots by
  `tools/render_hero_film.py`. Re-run it if those images change.
- The full-resolution originals stay in the Higgsfield account (Presales workspace).
- Home façade prompt (Nano Banana Pro, 4K, 16:9): *"Golden-hour architectural photograph, low angle, of a premium contemporary
  office building in Riyadh with floor-to-ceiling glass and slender vertical bronze fins. The setting sun rakes warm amber light
  across the bronze fins, with long soft shadows; the sky is a deep gradient from dusky blue to warm amber. The building rises
  along the right two thirds of the frame; the left third is open darkening sky, leaving space for a headline. A single building
  only, no other towers or spires, no famous landmarks, no text, no logos, no people. Premium corporate campaign photography,
  charcoal and bronze palette, high dynamic range, sharp detail."* All other prompts: `tools/higgsfield_generate.py`.

| File (assets/img/hd/) | Source |
|---|---|
| home-altitude, home-dive, home-facade | Higgsfield (home opening shots) |
| tech-hero, tech-gpu, tech-robotics, tech-noc | Higgsfield (Technology & Intelligent Infrastructure; tech-noc also heads Our Capabilities) |
| av-hero, av-boardroom, av-control-room, av-led-wall | Higgsfield (Audiovisual & Integrated Solutions) |
| construction-hero, construction-fitout, construction-site, construction-infrastructure | Higgsfield (Construction & Development) |
| museum-hero, museum-gallery, museum-interactive, museum-dome | Higgsfield (Museums & Immersive Experiences) |
| rental-hero, rental-kinetic-wall, rental-interactive-floor, rental-led-cube | Higgsfield (Exhibition & Equipment Rental) |
| rental-ai-host | Higgsfield Cinema Studio 2.5, 4K: AI digital host on a portrait LED display at an exhibition stand (computer-generated presenter, not a real person) |
| jeddah-corniche | Asim Alghamdi on Unsplash (About) |
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
