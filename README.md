# PROPER Developments — corporate website

A premium, static, multi-page website for **PROPER Developments**, a MIDRAR company.
Brand statement: *Building Intelligent Environments. Enabling Tomorrow.*

No frameworks, no build tooling beyond one Python script: fast to load, easy to host anywhere
(GitHub Pages, any web server, S3/CloudFront, Netlify).

## Pages
| Page | File |
|---|---|
| Home (cinematic intro, capabilities, HQ, partners; projects live on their own page) | `index.html` |
| About Us | `about.html` |
| Our Capabilities (overview) | `capabilities.html` |
| Technology & Intelligent Infrastructure | `capabilities/technology.html` |
| Audiovisual & Integrated Solutions | `capabilities/audiovisual.html` |
| Construction & Development | `capabilities/construction.html` |
| Museums & Immersive Experiences | `capabilities/museums.html` |
| Exhibition & Equipment Rental | `capabilities/rental.html` |
| Technology Partners | `partners.html` |
| Projects | `projects.html` |
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
- The live operations wall, the contact email and the project viewer are also localised (in `assets/js/site.js`).

**Please verify (Arabic):**
- **Company names:** "PROPER Developments" and "MIDRAR" are kept in Latin script, because no official Arabic names were
  available (the current site has no Arabic content). Supply the official Arabic names if they should be used.
- **Proper names:** the Headquarters Business Park is written as «ذا هيدكوارترز بزنس بارك». Project names are translated or
  transliterated (Aramco Sail, High Mark, KEC and Tewergi are kept in Latin). Confirm them with the project owners.
- Have a native-speaking reviewer proofread the copy before launch.

## Editing content
All text, capabilities, projects and partners live in **`tools/build.py`**. Edit the data at the top,
then regenerate every page:

```bash
python3 tools/build.py
```

Styles: `assets/css/site.css` · Behaviour: `assets/js/site.js`.

## The cinematic hero
The home page opens with a ~9-second, three-shot aerial sequence:
1. **High altitude:** descending through cloud over a city skyline, with the "A MIDRAR company" title card.
2. **Drone dive:** a top-down view onto modern towers with a slight camera yaw.
3. **Architectural flyover:** a golden-hour glass façade that pans in as the letterbox opens and the logo,
   statement and calls to action are revealed. It then drifts slowly and the film loops.

- On desktop it plays as a **film** (`assets/video/hero-film.mp4`, 1920×1080, 16 s loop, ~4.4 MB) kept in sync with the
  intro text. The film is rendered from the aerial photos by `tools/render_hero_film.py` (needs Pillow, NumPy, ffmpeg).
- Phones, data-saver connections and reduce-motion users get the lighter CSS photo sequence instead (same shots and timing).
- It plays once per browser session; repeat views open on the façade shot. There's a **Skip intro** button.
- The hero imagery is illustrative; it does not depict the Headquarters Business Park. The real Headquarters photo
  appears in the "Our home" section further down the page.

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

1. **Headquarters photography (optional).** The "Our home" section uses the only HQ photo available (1024×529).
   A high-resolution photo would let it run full-width again.
2. **PUDU logo.** Not on the current site; a typographic placeholder is shown. Supply the official logo (SVG preferred).
3. **Partner logos in SVG/high resolution.** VOD, CTF, LG, Samsung and SOLUM are 165–205 px wide images
   from the current site.
4. **Project photography for AI & robotics, command & control, NOC/SOC and museums.** No verified projects in
   these categories exist on the current site, so none are shown. Add them to `PROJECTS` with real photos.
5. **MIDRAR details.** Logo, a short description and a link, if MIDRAR should appear more prominently.

## Imagery
- **Capability pages, About, Partners, Projects and Capabilities headers** use high-resolution photography
  (2560px, with 1280px versions served to phones) from **Unsplash**, which is free for commercial use and needs
  no attribution. Credits are listed below as a courtesy. These photos are illustrative and are never presented
  as PROPER projects.
- **Projects** show only real project photography (Aramco Sail, Lexus and the construction portfolio). Their
  resolution is limited to what the current site holds; supply originals to sharpen them.
- **Home hero** uses three illustrative aerial/architectural photos; the **Headquarters section** uses the real HQ photo.

| File (assets/img/hd/) | Photographer on Unsplash |
|---|---|
| video-wall | Frederic Köberl |
| control-room-blue | Ana Garnica |
| server-rack | Kevin Ache |
| robotic-arm | ZHENYU LUO |
| led-curved | Arno Senoner |
| led-panels | Kier in Sight Archives |
| stage-purple | Danny Pérez |
| stage-lights | Samuel Fyfe |
| towers-sunset | Eugene Chystiakov |
| lobby | Aalo Lens |
| workplace-interior | Don Kaveen |
| architecture | Andrew Whitmore |
| immersive-projection | Redd Francisco |
| light-installation | Rodolfo Cuadros |
| museum-gallery | Mustafa Yiğit |
| gallery-hall | Darya Tryfanava |
| network-cables | Taylor Vick |
| jeddah-corniche | Asim Alghamdi |
| aerial-city | Datingscout |
| aerial-dive | Kate Trysh |
| facade-golden | Joakim Honkasalo |

To swap in AI-generated visuals (e.g. Higgsfield) later, save them in `assets/img/hd/` as `name.jpg` (2560px wide)
plus `name-1280.jpg`, then reference `hd/name.jpg` in `tools/build.py`.

## Please verify
- **Project descriptions and categories** in `PROJECTS`: they're kept deliberately short, but the
  Aramco Sail and Lexus wording describes what's visible in the photos and should be confirmed.
- **Design visualisations** (control room, immersive dome, 360° room, executive lounge) come from the current
  site's media library and are captioned "design visualisation". Confirm they may be published.
- **Partner roles** (e.g. "Service & delivery robotics" for PUDU, "Distribution partner" for VOD and SOLUM).
- **Contact details** are carried over from the current site.

## Technical notes
- Cross-page fade transitions use the browser's View Transitions API (Chrome/Edge/Safari 18+), with no effect elsewhere.
- Each page has its own title, description, canonical URL and Open Graph tags; the home page includes
  Organization structured data (with MIDRAR as parent organisation). `SITE` in `tools/build.py` sets the domain.
- Accessible: skip link, landmark structure, keyboard-operable menu, capability list and project viewer,
  visible focus states, alt text, reduced-motion support.
- The contact form opens the visitor's email app (mailto). Connect it to a form service or CRM for
  direct submissions.
- The Arabic version from the previous site isn't part of this redesign; it can be added back as a parallel `/ar/` build.
