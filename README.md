# PROPER Developments — corporate website

A premium, static, multi-page website for **PROPER Developments**, a MIDRAR company.
Brand statement: *Building Intelligent Environments. Enabling Tomorrow.*

No frameworks, no build tooling beyond one Python script: fast to load, easy to host anywhere
(GitHub Pages, any web server, S3/CloudFront, Netlify).

## Pages
| Page | File |
|---|---|
| Home (cinematic Headquarters intro) | `index.html` |
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

## Editing content
All text, capabilities, projects and partners live in **`tools/build.py`**. Edit the data at the top,
then regenerate every page:

```bash
python3 tools/build.py
```

Styles: `assets/css/site.css` · Behaviour: `assets/js/site.js`.

## The cinematic hero
The home page opens with a ~9-second, three-shot aerial sequence built from high-resolution photography:
1. **High altitude:** a misty city skyline, slowly descending, with the "A MIDRAR company" title card.
2. **Drone dive:** a top-down view onto modern towers with a slight camera yaw.
3. **Architectural flyover:** a golden-hour glass façade that pans in as the letterbox opens and the logo,
   statement and calls to action are revealed.

- It plays once per browser session; repeat views go straight to the final frame. There's a **Skip intro** button.
- Shots 1 and 2 load **only** when the intro plays, so repeat visits download just the final image.
- Visitors with *reduce motion* switched on see the final frame only.
- Built with CSS and a few lines of JavaScript, with no video download.
- The hero imagery is illustrative; it does not depict the Headquarters Business Park. The real Headquarters photo
  appears in the "Our home" section further down the page.

**Drone film slot:** when real aerial footage is available, export it as MP4 (H.264, 1920×1080,
8–15 seconds, ideally under 6 MB, no audio), save it as `assets/video/hq-aerial.mp4`, set
`"hero_video": "assets/video/hq-aerial.mp4"` in `tools/build.py` and rebuild. The film then plays behind the
same text sequence, with the photo as poster and fallback. It is skipped on phones, on data-saver connections
and for reduce-motion users.

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
