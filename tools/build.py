#!/usr/bin/env python3
"""
PROPER Developments — static site generator.

All page content lives in this file (CAPABILITIES, PARTNERS, COMPANY).
Edit it, then run:   python3 tools/build.py
It writes every .html page, sitemap.xml and robots.txt into the site root.
No dependencies beyond the Python 3 standard library.
"""
from html import escape as e, unescape
import re
from pathlib import Path
import json

LANG = "en"          # set per build in main(): "en" or "ar"

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://proper-sa.com"          # used for canonical URLs, sitemap and social tags

COMPANY = {
    "name": "PROPER Developments",
    "parent": "MIDRAR",
    "statement": "Building Intelligent Environments.",
    "statement_em": "Enabling Tomorrow.",
    "founded": "2007",
    "phone": "+966 5499 662 66",
    "phone_href": "+966549966266",
    "email": "sales@properholding.com",
    "address": "The Headquarters Business Park, Al Corniche Road, P.O. Box 23511, Jeddah 2444, Kingdom of Saudi Arabia",
    "address_short": "Headquarters Business Park, Al Corniche Road, Jeddah",
    "hours": "Monday – Saturday, 7:00 – 17:00",
    "whatsapp": "https://wa.me/966549966266",
}

# --------------------------------------------------------------------------------------------
# Capabilities (six verticals). Images: prefer real project photos / design visualisations.
# --------------------------------------------------------------------------------------------
CAPABILITIES = [
    {
        "slug": "technology", "n": "01", "accent": "#8fa9c4",
        "name": "Technology & Intelligent Infrastructure", "short": "Technology",
        "tagline": "Intelligent systems for mission-critical operations.",
        "intro": "We design, supply and integrate the compute, AI and operations infrastructure that keeps organisations informed and in control — from GPU platforms and robotics to command centres that run around the clock.",
        "hero": "hd/tech-hero.jpg", "hero_caption": "",
        "services": [
            ("AI Enablement", "Readiness assessments, use-case delivery and the data foundations needed to put AI into production."),
            ("GPU Solutions", "High-performance GPU compute, storage and networking for AI training and inference — on-premise or hybrid."),
            ("Robotics", "Service and delivery robotics, integrated with your facilities, systems and day-to-day operations."),
            ("Command & Control Centres", "Real-time monitoring, analysis and decision-making environments for government and enterprise."),
            ("Network Operations Centres (NOC)", "Purpose-built NOCs combining visualisation, monitoring platforms and resilient infrastructure."),
            ("Security Operations Centres (SOC)", "SOC environments that bring analysts, processes and security tooling together in one space."),
        ],
        "gallery": [("hd/tech-gpu.jpg", "GPU & AI infrastructure"),
                    ("hd/tech-robotics.jpg", "Robotics"),
                    ("hd/tech-noc.jpg", "Operations centres")],
    },
    {
        "slug": "audiovisual", "n": "02", "accent": "#c9a978",
        "name": "Audiovisual & Integrated Solutions", "short": "Audiovisual",
        "tagline": "Display, sound and control — engineered as one system.",
        "intro": "From curved LED walls to operator consoles, we engineer audiovisual environments where every screen, signal and control surface works together — reliably, every day.",
        "hero": "hd/av-hero.jpg", "hero_caption": "",
        "services": [
            ("Professional AV Solutions", "Boardrooms, auditoria, briefing centres and collaboration spaces, designed and integrated end to end."),
            ("LED Display Solutions", "Fine-pitch and large-format LED, curved and bespoke walls, calibrated for colour and longevity."),
            ("Control Room Solutions", "Video walls, visualisation, KVM and signal management for 24/7 operations rooms."),
            ("Operator Consoles", "Ergonomic technical consoles and supervisor positions designed around the operator."),
            ("Integrated Technology Systems", "Unified control, scheduling and monitoring that bring AV, IT and building systems together."),
        ],
        "gallery": [("hd/av-boardroom.jpg", "Professional AV Solutions"),
                    ("hd/av-control-room.jpg", "Control Room Solutions"),
                    ("hd/av-led-wall.jpg", "LED display engineering")],
    },
    {
        "slug": "construction", "n": "03", "accent": "#b7a68b",
        "name": "Construction, Architecture & Engineering", "short": "Construction & Engineering",
        "tagline": "From design to completion — built to perform.",
        "intro": "We design, engineer and build commercial, residential, hospitality and specialised projects — bringing architecture, engineering, construction management and site expertise together under one accountable team, so environments are delivered as designed and built to last.",
        "hero": "hd/construction-hero.jpg", "hero_caption": "",
        "services": [
            ("Architectural Design", "Concept, schematic and detailed design for commercial, residential, hospitality and cultural buildings."),
            ("Engineering Design", "Structural, mechanical, electrical and infrastructure engineering, coordinated across disciplines."),
            ("Design & Construction Management", "Design reviews, value engineering, tendering and contract management that keep projects on time and on budget."),
            ("Construction", "Commercial buildings and specialised facilities, delivered with precision, quality and safety."),
            ("Construction Supervision", "Independent site supervision and quality control from mobilisation to handover."),
            ("Interior Fit-Out", "Workplace, hospitality and retail interiors, from design development to final handover."),
            ("Infrastructure Development", "Planning, engineering and delivery of the infrastructure that developments depend on."),
        ],
        "gallery": [("hd/construction-architecture.jpg", "Architecture & engineering design"),
                    ("hd/construction-site.jpg", "Construction"),
                    ("hd/construction-fitout.jpg", "Interior fit-out")],
    },
    {
        "slug": "real-estate", "n": "04", "accent": "#c9a27e",
        "name": "Real Estate Development", "short": "Real Estate",
        "tagline": "Places that create lasting value.",
        "intro": "We take developments from opportunity to operation — market and feasibility studies, masterplanning, development and portfolio management — shaping residential, hospitality, retail and mixed-use destinations across the Kingdom with the whole lifecycle in mind.",
        "hero": "hd/realestate-hero.jpg", "hero_caption": "",
        "services": [
            ("Market & Feasibility Studies", "Market research, highest-and-best-use analysis and financial feasibility that define the right development."),
            ("Masterplanning", "Land use, phasing and infrastructure strategies for communities and large mixed-use sites."),
            ("Development Management", "Leading a project on the owner’s behalf, from brief and approvals to design, delivery and launch."),
            ("Portfolio & Programme Management", "Coordinating several developments as one programme, with clear governance, reporting and controls."),
            ("Mixed-Use & Hospitality Development", "Residential, hospitality, retail and office destinations, including operator selection for hotels."),
            ("Value Engineering", "Design and cost optimisation that protects quality while improving project returns."),
        ],
        "gallery": [("hd/realestate-masterplan.jpg", "Masterplanning"),
                    ("hd/realestate-residential.jpg", "Residential communities"),
                    ("hd/realestate-hospitality.jpg", "Mixed-use & hospitality")],
    },
    {
        "slug": "museums", "n": "05", "accent": "#8fb3a5",
        "name": "Museums & Immersive Experiences", "short": "Museums & Immersive",
        "tagline": "Spaces where stories become places.",
        "intro": "We create museums, interactive exhibitions and immersive environments that hold attention — combining storytelling, architecture and technology into experiences visitors remember.",
        "hero": "hd/museum-hero.jpg", "hero_caption": "",
        "services": [
            ("Museum Development", "Galleries and visitor centres, from interpretive planning to fit-out and commissioning."),
            ("Interactive Exhibitions", "Touch, motion and sensor-driven exhibits that invite visitors to take part."),
            ("Immersive Experiences", "Projection, LED and spatial sound environments that surround the audience."),
            ("Exhibition Solutions", "Showcases, lighting, media and content integrated into a single coherent experience."),
        ],
        "gallery": [("hd/museum-immersive.jpg", "Museum development"),
                    ("hd/museum-touch.jpg", "Interactive Exhibitions"),
                    ("hd/museum-dome.jpg", "Immersive installations")],
    },
    {
        "slug": "rental", "n": "06", "accent": "#a9a6c4",
        "name": "Exhibition & Equipment Rental", "short": "Rental",
        "tagline": "Event technology and activations that draw the crowd.",
        "intro": "We engineer the technology that turns a stand, launch or conference into an experience people walk over to see — kinetic LED walls, anamorphic 3D content, interactive installations, AI-powered digital hosts, live interaction, custom games and complete AV — designed around your theme, programmed in-house and run on site by our own crews.",
        "hero": "hd/rental-hero.jpg", "hero_caption": "",
        "services": [
            ("Immersive Art Installations", "Kinetic structures, mechatronics and sensor-responsive pieces, built around your event theme to become the centrepiece of the space."),
            ("Interactive Installations", "Touchscreens, transparent OLED, motion and proximity sensing, rotating product-reveal platforms and motorised sliding screens that let visitors explore at their own pace."),
            ("Kinetic LED Walls", "LED walls whose tiles physically move in sync with the content, controlled from a tablet or triggered as visitors approach."),
            ("LED Floors, Cubes & Immersive Rooms", "Interactive LED floors that react underfoot, and walk-in LED cubes and rooms that surround visitors with your story."),
            ("Anamorphic 3D Content", "Naked-eye 3D content designed for corner and curved LED screens, so objects appear to leap out of the display, rendered to the exact screen geometry and viewing point for your stand, façade or venue."),
            ("AI Interaction & Digital Hosts", "AI-powered digital hosts with a lifelike face and natural voice that greet visitors, answer questions in Arabic and English and capture leads — on kiosks, LED totems and holographic displays."),
            ("Live Interaction", "Real-time experiences that respond to the people in front of them: face and gesture tracking, AI photo and video booths, live polls, social walls and content on the LED wall that reacts to the crowd."),
            ("Programming & Gaming Activations", "Custom applications and games for touchscreens, tablets and LED walls — built for events, quick to play and easy to update."),
            ("Exhibition Infrastructure", "Stands, structures and staging for exhibitions, conferences and launches."),
            ("AV Equipment Rental", "Flexible rental plans for sound, lighting, cameras, LED and control systems, with vetted equipment and on-site technical crews."),
            ("Display and Technology Rental", "LED walls, screens, kiosks and interactive displays for short- and long-term hire."),
        ],
        "gallery": [("hd/rental-kinetic-wall.jpg", "Kinetic LED Walls"),
                    ("hd/rental-interactive-floor.jpg", "Interactive Installations"),
                    ("hd/rental-led-cube.jpg", "LED Floors, Cubes & Immersive Rooms")],
        # Real-world reference photos (Unsplash licence), illustrative only, not PROPER projects.
        "gallery2": [("hd/rental-anamorphic.jpg", "Anamorphic 3D Content"),
                     ("hd/rental-live-interaction.jpg", "Live Interaction"),
                     ("hd/rental-ai-host.jpg", "AI Interaction & Digital Hosts")],
    },
]
CAP = {c["slug"]: c for c in CAPABILITIES}
SERVICE_COUNT = [s for c in CAPABILITIES for s in c["services"]]
YEARS = __import__("datetime").date.today().year - int(COMPANY["founded"])

# --------------------------------------------------------------------------------------------
# Technology partners & distribution (order as specified in the brief)
# logo=None → typographic placeholder until the official logo file is supplied.
# --------------------------------------------------------------------------------------------
PARTNERS = [
    {"name": "VOD", "logo": "partners/vod.png", "role": "Distribution partner"},
    {"name": "CTF", "logo": "partners/ctf.png", "role": "Technical consoles & control room furniture"},
    {"name": "PUDU", "logo": "partners/pudu.svg", "role": "Service & delivery robotics"},
    {"name": "LG", "logo": "partners/lg.svg", "role": "Commercial displays & LED"},
    {"name": "SAMSUNG", "logo": "partners/samsung.svg", "role": "Commercial displays & LED"},
    {"name": "SOLUM", "logo": "partners/solum.png", "role": "Distribution partner"},
    {"name": "TCL", "logo": "partners/tcl.png", "role": "Commercial displays"},
    {"name": "HUAWEI", "logo": "partners/huawei.png", "role": "Networking & enterprise ICT"},
    {"name": "MAXHUB", "logo": "partners/maxhub.png", "role": "Interactive displays & collaboration"},
    {"name": "HP", "logo": "partners/hp.png", "role": "Computing & printing"},
    {"name": "DELL", "logo": "partners/dell.png", "role": "Computing, servers & storage"},
    {"name": "Lenovo", "logo": "partners/lenovo.png", "role": "Computing & data centre"},
    {"name": "AOPEN", "logo": "partners/aopen.png", "role": "Digital signage players"},
    {"name": "SimSign", "logo": "partners/simsign.png", "role": "Digital signage software"},
    {"name": "BOE", "logo": "partners/boe.png", "role": "Display & LED technology"},
    {"name": "SHLED", "logo": "partners/shled.png", "role": "LED displays"},
    {"name": "Yealink", "light": True, "logo": "partners/yealink.png", "role": "Video conferencing & unified communications"},
    {"name": "PANPHONICS", "logo": "partners/panphonics.png", "role": "Directional audio"},
    {"name": "SHURE", "light": True, "logo": "partners/shure.png", "role": "Microphones & conferencing audio"},
    {"name": "Televes", "logo": "partners/televes.png", "role": "TV distribution & IPTV"},
    {"name": "HYPERSIGN", "light": True, "logo": "partners/hypersign.png", "role": "Digital signage software"},
    {"name": "KMXG", "logo": "partners/kmxg.png", "role": "Display technology"},
    {"name": "itC", "logo": "partners/itc.png", "role": "Public address & professional audio"},
    {"name": "biamp", "logo": "partners/biamp.png", "role": "Audio & conferencing systems"},
    {"name": "NAVORI", "logo": "partners/navori.png", "role": "Digital signage software"},
    {"name": "QSC", "logo": "partners/qsc.png", "role": "Audio, video & control"},
    {"name": "TRICOLOR", "logo": "partners/tricolor.png", "role": "Display technology"},
]


# Solution partners (software, AI, engineering and security specialists)
SOLUTION_PARTNERS = [
    {"name": "Gruve AI", "light": True, "logo": "partners/gruve.png", "role": "AIOC and AI enablement"},
    {"name": "Assystem", "logo": "partners/assystem.png", "role": "BIM, NRM2, PSOC, NOC and digital twin"},
    {"name": "Aarcalev", "light": True, "logo": "partners/aarcalev.png", "role": "Cybersecurity and SOC"},
    {"name": "Smart Solutions", "logo": "partners/smart-solutions.png", "role": "Data visualisation and integration design"},
]

NAV = [("index.html", "Home"), ("about.html", "About Us"), ("capabilities.html", "Our Capabilities"),
       ("partners.html", "Technology Partners"), ("contact.html", "Contact Us")]


# ============================================================================================
# Layout helpers
# ============================================================================================
def arrow():
    return '<svg class="i-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'


def header(r, active):
    links = []
    for href, label in NAV:
        cur = ' aria-current="page"' if href == active else ''
        if href == "capabilities.html":
            sub = "".join(f'<a href="{r}capabilities/{c["slug"]}.html"><span>{c["n"]}</span>{e(c["name"])}</a>' for c in CAPABILITIES)
            links.append(f'''<div class="nav__item has-mega">
          <a href="{r}{href}"{cur}>{label}</a>
          <button class="nav__toggle" type="button" aria-expanded="false" aria-label="Show capabilities"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
          <div class="mega"><div class="mega__inner">{sub}</div></div>
        </div>''')
        elif href == "contact.html":   # shown in the menu only where the header "Contact Us" button is hidden
            links.append(f'<div class="nav__item nav__item--contact"><a href="{r}{href}"{cur}>{label}</a></div>')
        else:
            links.append(f'<div class="nav__item"><a href="{r}{href}"{cur}>{label}</a></div>')
    return f'''<header class="site-header" id="siteHeader">
  <div class="wrap site-header__inner">
    <a class="brand" href="{r}index.html" aria-label="PROPER Developments — home">
      <img src="{r}assets/img/logo-white.png" alt="PROPER Developments" width="140" height="40">
    </a>
    <nav class="nav" id="siteNav" aria-label="Main">
      {''.join(links)}
    </nav>
    <a class="lang-switch" href="{{alt}}" hreflang="{"en" if LANG == "ar" else "ar"}" lang="{"en" if LANG == "ar" else "ar"}">{"English" if LANG == "ar" else "العربية"}</a>
    <a class="btn btn--line btn--sm header-cta" href="{r}contact.html"{' aria-current="page"' if active == "contact.html" else ""}>Contact Us</a>
    <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="siteNav"><span class="sr">Menu</span><i></i><i></i></button>
  </div>
</header>'''


def footer(r):
    caps = "".join(f'<li><a href="{r}capabilities/{c["slug"]}.html">{e(c["name"])}</a></li>' for c in CAPABILITIES)
    nav = "".join(f'<li><a href="{r}{h}">{l}</a></li>' for h, l in NAV)
    return f'''<footer class="site-footer">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <img src="{r}assets/img/logo-white.png" alt="PROPER Developments" width="140" height="40" loading="lazy">
        <p class="footer__parent">A {COMPANY["parent"]} company</p>
      </div>
      <div><h2 class="footer__h">Capabilities</h2><ul>{caps}</ul></div>
      <div><h2 class="footer__h">Company</h2><ul>{nav}</ul></div>
      <div><h2 class="footer__h">Headquarters</h2>
        <address>{e(COMPANY["address_short"])}<br>Kingdom of Saudi Arabia</address>
        <p><a href="tel:{COMPANY["phone_href"]}">{COMPANY["phone"]}</a><br><a href="mailto:{COMPANY["email"]}">{COMPANY["email"]}</a></p>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© <span data-year>2026</span> {COMPANY["name"]}. All rights reserved.</span>
      <span>A member of {COMPANY["parent"]}</span>
    </div>
  </div>
</footer>'''


# ============================================================================================
# Arabic build: every page is rendered from the same templates, then each visible text node and
# text attribute is translated with the dictionary in tools/i18n_ar.py. Anything left in English is
# reported when you build, so the Arabic site can't silently fall behind the English one.
# ============================================================================================
try:
    from i18n_ar import AR, AR_PATTERNS
except ImportError:                      # running from another directory
    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from i18n_ar import AR, AR_PATTERNS

MISSING = set()
KEEP = re.compile(r"^(?:[^A-Za-z]*|PROPER(?: Developments)?|PROPER OPS|MIDRAR|VOD|CTF|PUDU|LG|SAMSUNG|SOLUM|OPS|GPU \d+|CAM \d+|"
                  r"[\w.+-]+@[\w.-]+|\+?[\d\s]+|AI|NOC|SOC|LED|AV|GPU)$")


def tr(text):
    """Translate one visible string (already unescaped and trimmed)."""
    if text in AR:
        return AR[text]
    for pat, rep_ in AR_PATTERNS:
        m = re.fullmatch(pat, text)
        if m:
            return rep_(m) if callable(rep_) else m.expand(rep_)
    for sep in (" · ", " | ", " – ", "|"):
        if sep in text:
            return sep.join(tr(part) for part in text.split(sep))
    if KEEP.match(text):
        return text
    MISSING.add(text)
    return text


def _tr_node(m):
    raw = m.group(1)
    text = unescape(raw)
    core = text.strip()
    if not core:
        return m.group(0)
    lead, trail = text[:len(text) - len(text.lstrip())], text[len(text.rstrip()):]
    return ">" + e(lead + tr(core) + trail, quote=False) + "<"


def _tr_attr(m):
    name, val = m.group(1), unescape(m.group(2))
    return f'{name}="{e(tr(val.strip()))}"' if val.strip() else m.group(0)


def translate(doc):
    parts = re.split(r"(<script\b.*?</script>|<style\b.*?</style>)", doc, flags=re.S)
    out = []
    for part in parts:
        if not part.startswith("<script") and not part.startswith("<style"):
            part = re.sub(r">([^<>]+)<", _tr_node, part)
            part = re.sub(r'\b(alt|aria-label|title|placeholder|data-filter|data-cats)="([^"]*)"', _tr_attr, part)
            part = re.sub(r'(<meta (?:name="description"|property="og:(?:title|description)") content=)"([^"]*)"',
                          lambda m: m.group(1) + '"' + e(tr(unescape(m.group(2)))) + '"', part)
        out.append(part)
    return "".join(out)




# Cache-busting: a short hash of each file, so browsers always fetch the newest CSS/JS after an update.
import hashlib as _hl
_ROOT = __import__("pathlib").Path(__file__).resolve().parent.parent
ASSET_V = {k: _hl.md5((_ROOT / f).read_bytes()).hexdigest()[:8] for k, f in (("css", "assets/css/site.css"), ("js", "assets/js/site.js"))}


def page(path, title, desc, body, active, body_class="", image="hd/tech-hero.jpg", preload=None, jsonld=None):
    ar = LANG == "ar"
    full_path = ("ar/" if ar else "") + path
    root = "../" * full_path.count("/")          # site root (shared assets)
    r = "{r}"                                    # page links; resolved at the end (Arabic pages link to /ar/)
    url = lambda p: SITE + "/" + ("" if p == "index.html" else p.replace("/index.html", "/"))
    canonical = url(full_path)
    alt_href = root + ("" if ar else "ar/") + path
    hreflang = (f'<link rel="alternate" hreflang="en" href="{url(path)}">\n<link rel="alternate" hreflang="ar" href="{url("ar/" + path)}">\n'
                f'<link rel="alternate" hreflang="x-default" href="{url(path)}">')
    ld = f'<script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False)}</script>' if jsonld else ""
    pre = ""
    if preload:
        b = preload[:-4]
        pre = (f'<link rel="preload" as="image" href="{r}assets/img/{preload}" fetchpriority="high" imagesizes="100vw" '
               f'imagesrcset="{r}assets/img/{b}-640.jpg 640w, {r}assets/img/{b}-1280.jpg 1280w, {r}assets/img/{preload} 2560w">')
    full_title = title if path == "index.html" else f"{title} | PROPER Developments"
    doc = f'''<!doctype html>
<html lang="{"ar" if ar else "en"}" dir="{"rtl" if ar else "ltr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(full_title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{canonical}">
{hreflang}
<meta name="theme-color" content="#0d0e10">
<meta property="og:type" content="website">
<meta property="og:site_name" content="PROPER Developments">
<meta property="og:locale" content="{"ar_SA" if ar else "en_US"}">
<meta property="og:title" content="{e(full_title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE}/assets/img/{image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{r}assets/img/favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.add('js');</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600&family=Instrument+Serif:ital@0;1{"&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Amiri:wght@400;700" if ar else ""}&display=swap">
{pre}
<link rel="stylesheet" href="{r}assets/css/site.css?v={ASSET_V["css"]}">
<script src="{r}assets/js/site.js?v={ASSET_V["js"]}" defer></script>
{ld}
</head>
<body class="{body_class}">
<a class="skip" href="#main">Skip to content</a>
{header(r, active)}
<main id="main">
{body.replace("{r}", r)}
</main>
{footer(r)}
</body>
</html>
'''.replace("{alt}", alt_href)
    doc = doc.replace("{r}assets/", root + "assets/").replace("{r}", root + ("ar/" if ar else ""))
    return translate(doc) if ar else doc


# Non-hd images with smaller versions for phones: source → [(file, width px), …]
IMG_VARIANTS = {
}


def img(src, alt="", cls="", lazy=True, sizes="100vw"):
    """<img> tag. Images in assets/img/hd/ get a 640/1280/2560 srcset so phones load the smaller file."""
    attrs = f' class="{cls}"' if cls else ""
    attrs += ' loading="lazy"' if lazy else ' fetchpriority="high"'
    if src.startswith("hd/"):
        base = src[:-4]
        attrs += (f' srcset="{{r}}assets/img/{base}-640.jpg 640w, {{r}}assets/img/{base}-1280.jpg 1280w, {{r}}assets/img/{src} 2560w" sizes="{sizes}"')
    elif src in IMG_VARIANTS:
        attrs += ' srcset="' + ", ".join(f"{{r}}assets/img/{v} {w}w" for v, w in IMG_VARIANTS[src]) + f'" sizes="{sizes}"'
    return f'<img src="{{r}}assets/img/{src}" alt="{e(alt)}"{attrs} decoding="async">'


def eyebrow(text, light=False):
    return f'<p class="eyebrow{" eyebrow--light" if light else ""}">{e(text)}</p>'


def cta_band(title="Let’s build what’s next."):
    """A quiet closing line with one link — used once, at the end of the home page."""
    return f'''<section class="cta-band" data-reveal>
  <div class="wrap cta-band__inner">
    <h2 class="display-3">{title}</h2>
    <a class="link" href="{{r}}contact.html">Start a conversation {arrow()}</a>
  </div>
</section>'''


def image_band(src, kicker, title, text, link=None):
    """Full-bleed photograph with a statement over it; the photo drifts with a gentle parallax."""
    cta = f'<a class="link link--light" href="{{r}}{link[0]}">{link[1]} {arrow()}</a>' if link else ""
    return f'''<section class="iband">
  <div class="iband__media" data-parallax>{img(src, "", sizes="100vw")}</div>
  <div class="wrap iband__content" data-reveal>{eyebrow(kicker, True)}<h2 class="display-1">{title}</h2><p>{text}</p>{cta}</div>
</section>'''


REEL = [
    [("hd/tech-hero.jpg", "Command & Control Centres", "technology"), ("hd/av-hero.jpg", "LED Display Solutions", "audiovisual"),
     ("hd/rental-kinetic-wall.jpg", "Kinetic LED Walls", "rental"), ("hd/museum-hero.jpg", "Museum Development", "museums"),
     ("hd/construction-hero.jpg", "Construction", "construction"), ("hd/capabilities-hero.jpg", "Network Operations Centres (NOC)", "technology")],
    [("hd/tech-gpu.jpg", "GPU Solutions", "technology"), ("hd/museum-immersive.jpg", "Immersive Experiences", "museums"),
     ("hd/rental-anamorphic.jpg", "Anamorphic 3D Content", "rental"), ("hd/av-control-room.jpg", "Control Room Solutions", "audiovisual"),
     ("hd/tech-robotics.jpg", "Robotics", "technology"), ("hd/museum-touch.jpg", "Interactive Exhibitions", "museums"),
     ("hd/construction-infrastructure.jpg", "Infrastructure Development", "construction")],
]


def reel():
    """Two rows of large images gliding in opposite directions; each card links to its discipline."""
    def cards(items, hidden=False):
        extra = ' aria-hidden="true" tabindex="-1"' if hidden else ""
        out = ""
        for src, cap, slug in items:
            b = src[:-4]
            out += (f'<a class="reel__card" href="{{r}}capabilities/{slug}.html"{extra}>'
                    f'<img src="{{r}}assets/img/{b}-640.jpg" srcset="{{r}}assets/img/{b}-640.jpg 640w, {{r}}assets/img/{b}-1280.jpg 1280w" '
                    f'sizes="(max-width: 760px) 72vw, 34vw" alt="{"" if hidden else e(cap)}" loading="lazy" decoding="async">'
                    f'<span>{e(cap)}</span></a>')
        return out
    rows = "".join(f'<div class="reel__row{" reel__row--rev" if i else ""}"><div class="reel__track">{cards(r)}{cards(r, True)}</div></div>'
                   for i, r in enumerate(REEL))
    return f'''<section class="reel dark" aria-labelledby="reel-title">
  <div class="wrap sec-head" data-reveal>{eyebrow("In the field", True)}<h2 class="display-2" id="reel-title">Environments we <em>engineer.</em></h2></div>
  <div class="reel__rows">{rows}</div>
</section>'''


def partner_tile(p, big=False):
    inner = (f'<img src="{{r}}assets/img/{p["logo"]}" alt="{e(p["name"])}" loading="lazy">' if p["logo"]
             else f'<span class="logo-type" title="Placeholder — official logo to be supplied">{e(p["name"])}</span>')
    role = f'<span class="partner__role">{e(p["role"])}</span>' if big else ""
    return f'<li class="partner{" partner--big" if big else ""}{" partner--light" if p.get("light") else ""}" data-reveal><span class="partner__logo">{inner}</span>{role}</li>'


ORG_LD = {
    "@context": "https://schema.org", "@type": "Organization", "name": COMPANY["name"], "url": SITE,
    "logo": SITE + "/assets/img/logo-dark.png", "foundingDate": COMPANY["founded"], "slogan": f'{COMPANY["statement"]} {COMPANY["statement_em"]}',
    "parentOrganization": {"@type": "Organization", "name": COMPANY["parent"]},
    "email": COMPANY["email"], "telephone": COMPANY["phone_href"],
    "address": {"@type": "PostalAddress", "streetAddress": "The Headquarters Business Park, Al Corniche Road, P.O. Box 23511",
                "addressLocality": "Jeddah", "addressCountry": "SA"},
}


# ============================================================================================
# Pages
# ============================================================================================
def hero_panels():
    """Home hero strips: each shows its own part of one continuous six-discipline photograph
    (hd/hero-panorama.jpg); when a discipline opens full screen, its full-size photograph fades in."""
    out = ""
    for i, c in enumerate(CAPABILITIES):
        b = c["hero"][:-4]
        prio = 'fetchpriority="high"' if i == 0 else 'loading="eager"'
        out += (f'<a class="pv__s" href="{{r}}capabilities/{c["slug"]}.html" data-i="{i}" tabindex="-1" style="--i:{i}">'
                f'<img class="pv__z" src="{{r}}assets/img/hd/hero-panorama.jpg" alt="" {prio} decoding="async">'
                + (clip_mosaic("pv__hd pv__mosaic") if c["slug"] == "rental" else
                   f'<img class="pv__hd" src="{{r}}assets/img/{c["hero"]}" srcset="{{r}}assets/img/{b}-640.jpg 640w, '
                   f'{{r}}assets/img/{b}-1280.jpg 1280w, {{r}}assets/img/{c["hero"]} 2560w" sizes="100vw" alt="" loading="eager" decoding="async">')
                + '</a>')
    return out


def hero_caps():
    return "".join(f'<a class="hp__cap" data-i="{i}" href="{{r}}capabilities/{c["slug"]}.html" tabindex=-1>'
                   f'<span class="hp__cn">{c["n"]} / {len(CAPABILITIES):02d}</span>'
                   f'<span class="hp__cname">{e(c["name"])}</span><span class="hp__ctag">{e(c["tagline"])}</span></a>'
                   for i, c in enumerate(CAPABILITIES))


def home():
    caps = "".join(f'''
        <li class="capx__item{" is-active" if i == 0 else ""}" style="--accent:{c["accent"]}" data-cap="{i}">
          <div class="capx__head">
            <button type="button" class="capx__toggle" aria-expanded="{"true" if i == 0 else "false"}" aria-controls="capx-d{i}">
              <span class="capx__n">{c["n"]}</span>
              <span class="capx__name">{e(c["name"])}</span>
              <span class="capx__chev" aria-hidden="true"></span>
            </button>
            <a class="capx__go" href="{{r}}capabilities/{c["slug"]}.html" aria-label="{e(c["name"])}">{arrow()}</a>
          </div>
          <div class="capx__detail" id="capx-d{i}"><div>
            <p>{e(c["tagline"])}</p>
            <ul>{"".join(f"<li>{e(s[0])}</li>" for s in c["services"])}</ul>
          </div></div>
        </li>''' for i, c in enumerate(CAPABILITIES))
    cap_imgs = "".join(f'<figure class="capx__fig{" is-active" if i == 0 else ""}" data-cap-fig="{i}">{img(c["hero"], "", sizes="(max-width: 980px) 100vw, 50vw")}<figcaption>{e(c["name"])}</figcaption></figure>' for i, c in enumerate(CAPABILITIES))
    body = f'''
<section class="hero hero--pano" id="hero" data-pano>
  <div class="pv" aria-hidden="true">{hero_panels()}</div>
  <div class="hero__grade" aria-hidden="true"></div>

  <div class="wrap hero__content">
    <img class="hero__logo" src="{{r}}assets/img/logo-white.png" alt="" width="220" height="63">
    <h1 class="hero__title"><span class="line"><span>{COMPANY["statement"]}</span></span><span class="line"><em>{COMPANY["statement_em"]}</em></span></h1>
    <p class="hero__lead">Technology, construction, real estate development and immersive experiences — delivered by one multidisciplinary team.</p>
    <div class="hero__actions">
      <a class="btn btn--metal" href="{{r}}capabilities.html">Explore Our Capabilities {arrow()}</a>
      <a class="btn btn--line" href="{{r}}contact.html">Contact Us</a>
    </div>
  </div>

  <div class="hp__caps">{hero_caps()}</div>
  <div class="pv__nav">
    <button type="button" class="pv__arrow pv__arrow--prev" data-step="-1" aria-label="Previous discipline">{arrow()}</button>
    <span class="pv__count" aria-live="polite"><b>00</b> / {len(CAPABILITIES):02d}</span>
    <button type="button" class="pv__arrow pv__arrow--next" data-step="1" aria-label="Next discipline">{arrow()}</button>
  </div>
</section>

<section class="capx dark" id="capabilities" aria-labelledby="capx-title">
  <div class="wrap">
    <div class="sec-head" data-reveal>
      {eyebrow("Our Capabilities", True)}
      <h2 class="display-2" id="capx-title">Six disciplines. <em>One accountable team.</em></h2>
    </div>
    <div class="capx__grid">
      <ol class="capx__list">{caps}
      </ol>
      <div class="capx__media" aria-hidden="true">{cap_imgs}</div>
    </div>
  </div>
</section>

{reel()}

{image_band("hd/riyadh-kafd-night.jpg", "Built in the Kingdom", "Engineering the Kingdom’s <em>next chapter.</em>",
            "From Jeddah to Riyadh, we deliver the technology, infrastructure and experiences behind the places where people work, operate and gather — in step with Vision 2030.")}

{cta_band()}
'''
    return page("index.html", "PROPER Developments | Building Intelligent Environments. Enabling Tomorrow.",
                "PROPER Developments, a MIDRAR company, delivers technology & intelligent infrastructure, audiovisual, construction, architecture & engineering, real estate development, museums & immersive experiences and exhibition rental across Saudi Arabia.",
                body, "index.html", "has-hero is-home", image="hd/hero-panorama.jpg", preload=None, jsonld=ORG_LD)


# --------------------------------------------------------------------------------------------
# Live operations wall (Technology page): an animated, illustrative operations-centre interface.
# All figures are simulated in the browser by assets/js/site.js; nothing here is real client data.
# --------------------------------------------------------------------------------------------
OPS_SITES = [  # name, longitude, latitude (approximate city positions, used for the schematic network), is HQ
    ("Jeddah", 39.17, 21.54, True), ("Makkah", 39.83, 21.42, False), ("Madinah", 39.61, 24.47, False),
    ("Riyadh", 46.72, 24.71, False), ("Dammam", 50.10, 26.43, False), ("Tabuk", 36.57, 28.38, False),
    ("NEOM", 35.20, 28.00, False), ("Abha", 42.50, 18.22, False), ("Hail", 41.69, 27.52, False),
]
OPS_CAMS = [("CAM 01 · Lobby", "hd/tech-robotics-640.jpg"), ("CAM 04 · Plaza", "hd/riyadh-dusk-640.jpg"),
            ("CAM 07 · Data hall", "hd/tech-gpu-640.jpg"), ("CAM 12 · Perimeter", "hd/construction-infrastructure-640.jpg")]


def ops_wall():
    def xy(lon, lat):  # simple equirectangular projection into a 400×300 viewBox
        return round((lon - 34) / (52 - 34) * 360 + 20, 1), round((30 - lat) / (30 - 16) * 260 + 20, 1)
    hq = next(xy(lo, la) for n, lo, la, h in OPS_SITES if h)
    links, nodes = "", ""
    for i, (n, lo, la, h) in enumerate(OPS_SITES):
        x, y = xy(lo, la)
        if not h:
            links += f'<path class="ow-link" d="M{hq[0]},{hq[1]} Q{(hq[0] + x) / 2},{min(hq[1], y) - 30} {x},{y}" style="--d:{i * .37:.2f}s"/>'
        anchor, dx, dy = {"Jeddah": ("end", -9, 3.5), "Makkah": ("start", 8, 13), "NEOM": ("middle", 0, 15),
                          "Dammam": ("end", -9, 3.5)}.get(n, ("start", 9, 3.5))
        nodes += (f'<g class="ow-node{" is-hq" if h else ""}" style="--d:{i * .41:.2f}s"><circle class="ow-pulse" cx="{x}" cy="{y}" r="4"/>'
                  f'<circle cx="{x}" cy="{y}" r="{4 if h else 2.6}"/><text x="{x + dx}" y="{y + dy}" text-anchor="{anchor}">{n}{" · HQ" if h else ""}</text></g>')
    grid = "".join(f'<line x1="{x}" y1="10" x2="{x}" y2="290"/>' for x in range(20, 400, 40)) + \
           "".join(f'<line x1="10" y1="{y}" x2="390" y2="{y}"/>' for y in range(20, 300, 40))
    cams = "".join(f'<figure class="ow-cam"><img src="{{r}}assets/img/{src}" alt="" loading="lazy" decoding="async"><figcaption><i></i>{e(label)}<span data-ow-clock></span></figcaption></figure>' for label, src in OPS_CAMS)
    bars = "".join(f'<li><span>GPU {i + 1:02d}</span><b><i data-ow-bar></i></b><em data-ow-barv>0%</em></li>' for i in range(8))
    kpis = [("Platform availability", "99.98", "%", "2"), ("Connected sites", "48", "", "0"),
            ("Events processed today", "12840", "", "0"), ("Mean response", "42", "s", "0")]
    kp = "".join(f'<div class="ow-kpi"><span class="ow-kpi__v"><span data-count="{v}" data-dec="{d}" data-ow-kpi="{k}">{v}</span><small>{u}</small></span><span class="ow-kpi__l">{e(l)}</span></div>' for k, (l, v, u, d) in enumerate(kpis))
    return f'''<section class="section dark opswall-sec" aria-labelledby="ow-title">
  <div class="wrap">
    <div class="sec-head sec-head--split" data-reveal>
      <div>{eyebrow("Command & control", True)}<h2 class="display-3" id="ow-title">Inside an operations centre <em>we build.</em></h2></div>
      <p class="opswall-sec__lead">Video walls, monitoring platforms and the people who run them, designed as one environment. The wall below is a live illustration of the picture our command, network and security operations centres bring together.</p>
    </div>
    <div class="opswall" data-opswall data-reveal role="img" aria-label="Illustrative operations-centre video wall with a site network map, live metrics, camera feeds, GPU utilisation and an event log. All data is simulated.">
      <div class="ow-bar">
        <span class="ow-brand">PROPER <b>OPS</b> · Unified operations view</span>
        <span class="ow-status"><i></i>All systems nominal</span>
        <span class="ow-time"><span data-ow-clock>--:--:--</span> AST</span>
      </div>
      <div class="ow-grid">
        <div class="ow-tile ow-map"><h3>Site network <span>Kingdom of Saudi Arabia · schematic</span></h3>
          <svg viewBox="0 0 400 300" aria-hidden="true"><g class="ow-gridlines">{grid}</g>{links}{nodes}</svg>
        </div>
        <div class="ow-tile ow-kpis">{kp}</div>
        <div class="ow-tile ow-chart"><h3>Network throughput <span data-ow-tput>— Gbps</span></h3>
          <svg viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true"><path class="ow-area" data-ow-area/><path class="ow-line" data-ow-line/><path class="ow-line ow-line--b" data-ow-line2/></svg>
        </div>
        <div class="ow-tile ow-cams">{cams}</div>
        <div class="ow-tile ow-gpu"><h3>AI cluster utilisation</h3><ul>{bars}</ul></div>
        <div class="ow-tile ow-log"><h3>Event log</h3><ol data-ow-log></ol></div>
      </div>
    </div>
    <p class="opswall-sec__note">Illustrative interface. All figures are simulated.</p>
  </div>
</section>'''


def page_hero(title, sub, image, caption="", kicker="", accent=None, mosaic=False):
    style = f' style="--accent:{accent}"' if accent else ""
    media = clip_mosaic("phero__media phero__media--mosaic") if mosaic else f'<div class="phero__media">{img(image, "", lazy=False)}</div>'
    return f'''<section class="phero{" phero--mosaic" if mosaic else ""}"{style}>
  {media}
  <div class="wrap phero__content">
    {eyebrow(kicker, True) if kicker else ""}
    <h1 class="display-1">{title}</h1>
    {f'<p class="phero__sub">{sub}</p>' if sub else ""}
  </div>
  {f'<p class="phero__cap wrap">{e(caption)}</p>' if caption else ""}
</section>'''


# Selected projects of MAEC Architects & Engineers (MIDRAR's engineering practice), from its firm profile.
MAEC_PROJECTS = [
    ("headquarters-business-park", "The Headquarters Business Park", "Jeddah", "187,000 m²", "Design & project management"),
    ("hajj-street-hotels", "Hajj Street Hotels", "Makkah", "300,000 m²", "Design management"),
    ("kudai-hotels", "Kudai Hotels", "Makkah", "200,000 m²", "Design management"),
    ("abha-the-point", "Abha The Point", "Abha", "75,000 m²", "Design & project management"),
    ("corniche-towers", "Corniche Towers", "Jeddah", "30,000 m²", "Project management & supervision"),
    ("al-bukhariya-lane", "Al Bukhariya Lane, Al Balad", "Jeddah", "41,000 m²", "Design management"),
    ("hilton-duba", "Hilton Duba", "Duba", "3,000 m²", "Full design & operator selection"),
    ("mbs-calligraphy-center", "MBS Global Center for Arabic Calligraphy", "Diriyah", "", "Heritage & cultural advisory"),
]
MAEC_MORE = ["Crown Plaza & Holiday Inn Makkah", "Souq 7 Mixed-Use", "Jeddah Vibes", "Al Balad Cultural Square",
             "Red Sea Mall Expansion", "Bin Sulaiman Center", "Umm Al-Qura University", "KEC Dar Al Jiwar",
             "Retaj Masterplan", "Al Shara’i Masterplan", "Badi’ah Palace Redesign", "Jeddah Central Project"]


TECH_SOLUTIONS = ['LED Display Solutions', 'Digital Signage Solutions', 'Intelligent Command & Control Solutions', 'NOC (Network Operations Centre) Solutions', 'AV (Audio-Visual) Solutions', 'System Integration (AV, IT & ELV)', 'Immersive Experience Solutions', 'Interactive Technology Solutions', 'Museum Technology Solutions', 'Exhibition & Event Technology', 'Smart Fit-Out & Turnkey Solutions', 'Luxury Retail Solutions', 'Automotive Showroom Solutions', 'Hospitality & Hotel Technology Solutions', 'Education & EdTech Solutions', 'AI & Automation Solutions', 'Facade & Architectural Lighting Solutions', 'Meeting Room & Collaboration Solutions', 'Content Development & CMS Solutions', 'AMC & Managed Services', 'IPTV (Interactive TV) Solutions']


CLIENTS = [('alkhabeer-capital', 'Alkhabeer Capital'), ('bcg', 'BCG'), ('ministry-of-culture', 'Ministry of Culture'), ('ministry-of-commerce', 'Ministry of Commerce'), ('knowledge-economic-city', 'Knowledge Economic City'), ('aldar-alkhasa', 'Aldar Alkhasa'), ('aramco-digital', 'Aramco Digital'), ('dallah-albaraka', 'Dallah Albaraka'), ('dar', 'Dar'), ('ministry-of-health', 'Ministry of Health'), ('abdul-latif-jameel', 'Abdul Latif Jameel'), ('jeddah-central', 'Jeddah Central Development Company'), ('diriyah-gate', 'Diriyah Gate Development Authority'), ('thakher-makkah', 'Thakher Makkah'), ('kinan', 'Kinan'), ('development-authorities-support-office', 'Development Authorities Support Office'), ('al-balad-development', 'Al Balad Development Company'), ('sedco-holding', 'SEDCO Holding'), ('sumou', 'Sumou')]


def clients_section():
    """Client logos as two endless rows drifting in opposite directions (paused on hover, still with reduced motion)."""
    def item(slug, name, hidden=False):
        return (f'<li{" aria-hidden=\"true\"" if hidden else ""}><img src="{{r}}assets/img/clients/{slug}.png" alt="{"" if hidden else e(name)}"'
                f' title="{e(name)}" loading="lazy" decoding="async"></li>')
    half = (len(CLIENTS) + 1) // 2
    rows = []
    for k, group in enumerate((CLIENTS[:half], CLIENTS[half:])):
        once = "".join(item(sl, n) for sl, n in group)
        twice = "".join(item(sl, n, True) for sl, n in group)   # duplicate set for a seamless loop
        rows.append(f'<div class="cmarq__row{" cmarq__row--rev" if k else ""}"><ul class="cmarq__track">{once}{twice}</ul></div>')
    return f'''
<section class="section clients" id="clients">
  <div class="wrap">
    <div class="split clients__head">
      <div data-reveal>{eyebrow("Our clients")}<h2 class="display-3">Trusted across <em>the Kingdom.</em></h2></div>
      <p class="lead" data-reveal>Government ministries, development authorities, investors and leading Saudi groups.</p>
    </div>
  </div>
  <div class="cmarq" data-reveal>{"".join(rows)}</div>
</section>'''


def tech_solutions_section():
    items = "".join(f'<li><span>{i + 1:02d}</span>{e(t)}</li>' for i, t in enumerate(TECH_SOLUTIONS))
    return f'''
<section class="section solutions" id="solutions">
  <div class="wrap">
    <div class="sec-head" data-reveal>{eyebrow("What we deliver")}<h2 class="display-3">Twenty-one technology solutions, <em>end to end.</em></h2>
      <p class="sec-head__lead">Design, supply, installation, system integration, commissioning and support, under one roof.</p></div>
    <ol class="solutions__list" data-reveal>{items}</ol>
  </div>
</section>'''


def maec_section():
    cards = "".join(f'''
      <article class="proj" data-reveal>
        <div class="proj__media"><img src="{{r}}assets/img/maec/{slug}.jpg" alt="{e(name)}" loading="lazy" decoding="async" width="960" height="720"></div>
        <div class="proj__body">
          <h3>{e(name)}</h3>
          <p class="proj__meta"><span>{e(city)}</span>{f"<span>{e(area)}</span>" if area else ""}</p>
          <p class="proj__svc">{e(svc)}</p>
        </div>
      </article>''' for slug, name, city, area, svc in MAEC_PROJECTS)
    more = "".join(f"<li>{e(m)}</li>" for m in MAEC_MORE)
    return f'''
<section class="section projects" id="group-projects">
  <div class="wrap">
    <div class="split projects__head">
      <div data-reveal>{eyebrow("Group track record")}<h2 class="display-3">Projects across <em>the Kingdom.</em></h2></div>
      <div class="prose" data-reveal>
        <p class="lead">Selected work from MIDRAR’s project management and engineering consulting practice, MAEC Architects &amp; Engineers.</p>
        <p>Design, project management and construction supervision for hospitality, commercial, residential and cultural landmarks in Jeddah, Makkah, Madinah, Riyadh, Abha, Duba and Diriyah.</p>
      </div>
    </div>
    <dl class="projects__facts" data-reveal>
      <div><dt>27</dt><dd>Selected projects</dd></div>
      <div><dt>100+</dt><dd>Years of cumulative team experience</dd></div>
      <div><dt>5.7M m²</dt><dd>Largest project site</dd></div>
    </dl>
    <div class="projects__grid">{cards}
    </div>
    <div class="projects__more" data-reveal><h3>Also in the portfolio</h3><ul class="tags">{more}</ul></div>
  </div>
</section>'''


def about():
    body = page_hero("A multidisciplinary group, <em>built on delivery.</em>", "Technology, engineering, infrastructure and development expertise — brought together to deliver integrated solutions across industries.",
                     "hd/jeddah-corniche-hd.jpg", "Jeddah, Kingdom of Saudi Arabia", "About Us") + f'''
<section class="section">
  <div class="wrap split">
    <div data-reveal>{eyebrow("Who we are")}<h2 class="display-3">Integrated solutions, from concept to completion.</h2></div>
    <div class="prose" data-reveal>
      <p class="lead">PROPER Developments is a Saudi company delivering innovative solutions across technology, intelligent infrastructure, construction, fit-out, digital environments and immersive experiences.</p>
      <p>Founded in {COMPANY["founded"]}, the company began with a vision to deliver innovative solutions in technology and infrastructure. Over the years, our expertise has expanded across audiovisual, ICT, construction and project development — and today spans AI enablement, command and control environments, museums and exhibition services.</p>
      <p>We help organisations turn spaces into intelligent, high-performance environments, from LED displays, digital signage and command centres to audiovisual systems, immersive experiences and architectural lighting.</p>
      <p>Our multidisciplinary approach means one accountable team across every stage: consultancy and design, supply and construction, integration and commissioning, and long-term support.</p>
    </div>
  </div>
</section>

<section class="section grp" id="group">
  <div class="grp__bg" aria-hidden="true"></div>
  <div class="wrap">
    <div class="sec-head grp__head" data-reveal>{eyebrow("Group structure", True)}<h2 class="display-3">One group. <em>Four core domains.</em></h2>
      <p class="sec-head__lead">PROPER Holding brings together PROPER Developments and MIDRAR, covering technology, real estate development, project management and engineering consulting.</p></div>

    <div class="grp__tree">
      <div class="grp__root" data-reveal>
        <span class="grp__halo" aria-hidden="true"></span>
        <img src="{{r}}assets/img/logo-holding-white.png" alt="PROPER Holding" width="1259" height="334">
        <span class="grp__role">Parent company</span>
      </div>
      <div class="grp__wire grp__wire--split" aria-hidden="true"><i></i><i></i><i></i></div>

      <div class="grp__cos">
        <article class="grp__co is-us" data-reveal>
          <div class="grp__co-bg" style="background-image:url({{r}}assets/img/hd/tech-hero-1280.jpg)"></div>
          <div class="grp__co-body">
            <em class="grp__here">You are here</em>
            <img class="grp__logo" src="{{r}}assets/img/logo-developments-white.png" alt="PROPER Developments" width="645" height="174">
            <p>Technology and real estate development.</p>
          </div>
        </article>
        <article class="grp__co" data-reveal>
          <div class="grp__co-bg" style="background-image:url({{r}}assets/img/maec/headquarters-business-park.jpg)"></div>
          <div class="grp__co-body">
            <img class="grp__logo grp__logo--midrar" src="{{r}}assets/img/logo-midrar-white.png" alt="MIDRAR" width="797" height="272">
            <p>Project management and engineering consulting.</p>
          </div>
        </article>
      </div>

      <div class="grp__wires" aria-hidden="true"><div class="grp__wire grp__wire--split"><i></i><i></i><i></i></div><div class="grp__wire grp__wire--split"><i></i><i></i><i></i></div></div>

      <ul class="grp__specs">
        <li data-reveal><a href="{{r}}capabilities/technology.html"><span class="grp__img" style="background-image:url({{r}}assets/img/hd/tech-noc-640.jpg)"></span><span class="grp__n">01</span><b>Information Technology</b></a></li>
        <li data-reveal><a href="{{r}}capabilities/real-estate.html"><span class="grp__img" style="background-image:url({{r}}assets/img/hd/realestate-hero-640.jpg)"></span><span class="grp__n">02</span><b>Real Estate Development</b></a></li>
        <li data-reveal><a href="#group-projects"><span class="grp__img" style="background-image:url({{r}}assets/img/maec/hajj-street-hotels.jpg)"></span><span class="grp__n">03</span><b>Project Management</b></a></li>
        <li data-reveal><a href="#group-projects"><span class="grp__img" style="background-image:url({{r}}assets/img/hd/construction-architecture-640.jpg)"></span><span class="grp__n">04</span><b>Engineering Consulting</b></a></li>
      </ul>
    </div>
  </div>
</section>

<section class="section feature" id="featured-project">
  <div class="wrap feature__grid">
    <div class="feature__text" data-reveal>
      {eyebrow("Featured project")}
      <h2 class="display-3">Saudi Aramco, <em>Dammam.</em></h2>
      <p class="lead">An IT lab and experience space wrapped in curved LED walls, with digital signage, IPTV, AV systems and meeting rooms, designed, supplied, installed and integrated by PROPER Developments.</p>
      <dl class="feature__facts">
        <div><dt>Location</dt><dd>Dammam, Saudi Arabia</dd></div>
        <div><dt>Solutions</dt><dd>IPTV · Digital signage · AV systems · Meeting rooms</dd></div>
        <div><dt>Scope</dt><dd>Design, supply, installation &amp; integration</dd></div>
      </dl>
    </div>
    <div class="feature__media" data-reveal>
      <figure class="feature__big"><img src="{{r}}assets/img/projects/aramco-heritage-wall.jpg" srcset="{{r}}assets/img/projects/aramco-heritage-wall-640.jpg 640w, {{r}}assets/img/projects/aramco-heritage-wall.jpg 1200w" sizes="(max-width: 980px) 100vw, 55vw" alt="Curved LED wall showing a heritage scene, Saudi Aramco, Dammam" loading="lazy" decoding="async" width="1165" height="744"></figure>
      <figure><img src="{{r}}assets/img/projects/aramco-curve-wall.jpg" srcset="{{r}}assets/img/projects/aramco-curve-wall-640.jpg 640w, {{r}}assets/img/projects/aramco-curve-wall.jpg 1200w" sizes="(max-width: 980px) 50vw, 15vw" alt="Curved LED journey wall" loading="lazy" decoding="async" width="1165" height="703"></figure>
      <figure><img src="{{r}}assets/img/projects/aramco-lab.jpg" srcset="{{r}}assets/img/projects/aramco-lab-640.jpg 640w, {{r}}assets/img/projects/aramco-lab.jpg 1200w" sizes="(max-width: 980px) 50vw, 15vw" alt="IT Lab of Excellence LED wall" loading="lazy" decoding="async" width="1197" height="744"></figure>
      <figure><img src="{{r}}assets/img/projects/aramco-immersive.jpg" srcset="{{r}}assets/img/projects/aramco-immersive-640.jpg 640w, {{r}}assets/img/projects/aramco-immersive.jpg 1200w" sizes="(max-width: 980px) 50vw, 15vw" alt="Interactive LED wall" loading="lazy" decoding="async" width="1197" height="748"></figure>
      <figure><img src="{{r}}assets/img/projects/aramco-led-corridor.jpg" srcset="{{r}}assets/img/projects/aramco-led-corridor-640.jpg 640w, {{r}}assets/img/projects/aramco-led-corridor.jpg 1200w" sizes="(max-width: 980px) 50vw, 15vw" alt="LED corridor" loading="lazy" decoding="async" width="1165" height="748"></figure>
    </div>
  </div>
</section>

{clients_section()}

{image_band("hd/riyadh-night.jpg", "Our reach", "Delivering across <em>the Kingdom.</em>",
            "Headquartered in Jeddah and working across Saudi Arabia, with an ambition that reaches across the GCC.")}

<section class="section">
  <div class="wrap">
    <div class="sec-head" data-reveal>{eyebrow("Direction")}<h2 class="display-3">Vision, mission and ambition</h2></div>
    <div class="cols3">
      <article class="pillar" data-reveal><span class="pillar__n">01</span><h3>Vision</h3><p>To provide innovative, sustainable and high-quality solutions across technology, infrastructure, construction and development.</p></article>
      <article class="pillar" data-reveal><span class="pillar__n">02</span><h3>Mission</h3><p>To be a leading force in shaping Saudi Arabia’s future by delivering world-class technology, infrastructure and development solutions aligned with Vision 2030.</p></article>
      <article class="pillar" data-reveal><span class="pillar__n">03</span><h3>Ambition</h3><p>To expand our footprint across the GCC and international markets, forging strategic partnerships and investing in the technologies that create lasting value.</p></article>
    </div>
  </div>
</section>

<section class="section section--stone">
  <div class="wrap">
    <div class="sec-head" data-reveal>{eyebrow("Values")}<h2 class="display-3">How we work</h2></div>
    <div class="cols3">
      <article class="value" data-reveal><h3>Integrity in every action</h3><p>Transparency, honesty and accountability in every relationship — so trust and reliability carry through every project.</p></article>
      <article class="value" data-reveal><h3>Innovation with purpose</h3><p>Technology and forward-thinking solutions applied where they create meaningful impact for clients and communities.</p></article>
      <article class="value" data-reveal><h3>Excellence in execution</h3><p>Precision, quality and dedication, so that every project meets the highest standards of performance.</p></article>
    </div>
  </div>
</section>
{tech_solutions_section()}
{maec_section()}
'''
    return page("about.html", "About Us", "PROPER Developments is a multidisciplinary Saudi company operating under MIDRAR, bringing together technology, engineering, infrastructure and development expertise since 2007.",
                body, "about.html", "has-hero")


def capabilities_overview():
    blocks = "".join(f'''
  <article class="capblock" style="--accent:{c["accent"]}" data-reveal>
    <a class="capblock__media" href="{{r}}capabilities/{c["slug"]}.html" tabindex="-1" aria-hidden="true">{img(c["hero"], "", sizes="(max-width: 980px) 100vw, 55vw")}</a>
    <div class="capblock__body">
      <span class="capblock__n">{c["n"]}</span>
      <h2 class="display-3"><a href="{{r}}capabilities/{c["slug"]}.html">{e(c["name"])}</a></h2>
      <p class="capblock__tag">{e(c["tagline"])}</p>
      <ul class="tags">{"".join(f"<li>{e(s[0])}</li>" for s in c["services"])}</ul>
      <a class="link" href="{{r}}capabilities/{c["slug"]}.html">Explore {e(c["short"])} {arrow()}</a>
    </div>
  </article>''' for c in CAPABILITIES)
    body = page_hero("Our <em>Capabilities</em>", "Six integrated business verticals — engineered to work together, from the first concept to long-term operation.",
                     "hd/capabilities-hero.jpg", "", "What We Do") + f'''
<section class="section capblocks"><div class="wrap">{blocks}</div></section>'''
    return page("capabilities.html", "Our Capabilities", "Technology & intelligent infrastructure, audiovisual & integrated solutions, construction, architecture & engineering, real estate development, museums & immersive experiences, and exhibition & equipment rental.",
                body, "capabilities.html", "has-hero")


# Exhibition & Rental: installation clips (illustrative, generated with Higgsfield after the PROPER Technology Catalogue)
RENTAL_REEL = [
    ("kinetic-facade", "Kinetic Facade", "Rotating LED pillars that move as one wall or in waves."),
    ("kinetic-wall", "Kinetic Wall", "LED blocks that shift in sync with content and react to visitors."),
    ("led-sphere", "Expandable LED Sphere", "A 1.5 m LED globe that opens out to 3 m."),
    ("kinetic-ceiling", "Kinetic Ceiling", "An overhead canvas of moving panels, light and shadow."),
    ("led-rings", "Kinetic LED Rings", "Suspended rings that rise, tilt and change colour."),
    ("immersive-room", "Rotating Immersive Room", "An LED-clad room on a rotating platform."),
]


def clip_mosaic(cls):
    """All six installation clips as one 3 x 2 moving mosaic (muted; played only while visible)."""
    return f'<div class="{cls} mosaic">' + "".join(
        f'<video muted loop playsinline preload="none" poster="{{r}}assets/video/{slug}.jpg" data-autoplay aria-hidden="true">'
        f'<source src="{{r}}assets/video/{slug}.mp4" type="video/mp4"></video>' for slug, _, _ in RENTAL_REEL) + '</div>'


def rental_reel():
    tiles = "".join(f'''
      <figure class="vreel__item" data-reveal>
        <div class="vreel__media"><video muted loop playsinline preload="none" poster="{{r}}assets/video/{slug}.jpg" data-autoplay aria-label="{e(name)}">
          <source src="{{r}}assets/video/{slug}.mp4" type="video/mp4"></video></div>
        <figcaption><span class="vreel__n">{i + 1:02d}</span><h3>{e(name)}</h3><p>{e(text)}</p></figcaption>
      </figure>''' for i, (slug, name, text) in enumerate(RENTAL_REEL))
    return f'''
<section class="section vreel" id="in-motion">
  <div class="wrap">
    <div class="split vreel__head">
      <div data-reveal>{eyebrow("In motion")}<h2 class="display-3">Installations that <em>move.</em></h2></div>
      <div class="prose" data-reveal><p class="lead">Kinetic LED, holographic and interactive installations from our technology catalogue, with more than 250 activations delivered since 2023.</p>
        <p>Each piece is programmed in-house and can be themed to your brand, your content and your stand.</p></div>
    </div>
    <div class="vreel__grid">{tiles}
    </div>
  </div>
</section>'''


def svc_cols(n):
    """Columns for a services grid: 2 for 4 items, otherwise 3 (the last card stretches to close the row)."""
    return 2 if n in (2, 4) else 3


def capability_page(c, idx):
    n_svc, cols = len(c["services"]), svc_cols(len(c["services"]))
    last_span = cols - (n_svc % cols) + 1 if n_svc % cols else 1
    services = "".join(f'''<li class="svccard" data-reveal{f' style="grid-column:span {last_span}"' if i == n_svc - 1 and last_span > 1 else ""}><span class="svccard__n">{i + 1:02d}</span><h3>{e(s[0])}</h3><p>{e(s[1])}</p></li>''' for i, s in enumerate(c["services"]))
    fig = lambda src, cap: f'<figure data-reveal>{img(src, cap or c["name"], sizes="(max-width: 640px) 100vw, 50vw")}{f"<figcaption>{e(cap)}</figcaption>" if cap else ""}</figure>'
    gallery = "".join(fig(src, cap) for src, cap in c["gallery"])
    gallery2 = "".join(fig(src, cap) for src, cap in c.get("gallery2", []))
    gallery2 = f'<div class="wrap gallery gallery--{len(c["gallery2"])}">{gallery2}</div>' if gallery2 else ""
    nxt = CAPABILITIES[(idx + 1) % len(CAPABILITIES)]
    steps = [("Consult", "Requirements, users, site and success criteria."), ("Design", "Engineering, technology selection and value engineering."),
             ("Deliver", "Supply, construction, installation and integration."), ("Support", "Commissioning, training, maintenance and upgrades.")]
    body = page_hero(e(c["name"]), e(c["tagline"]), c["hero"], c["hero_caption"], f'Capability {c["n"]}', c["accent"], mosaic=c["slug"] == "rental") + f'''
<section class="section cap-over" style="--accent:{c["accent"]}">
  <div class="wrap">
    <div class="cap-over__intro" data-reveal><div class="cap-over__side">{eyebrow("Overview")}<p class="cap-over__count"><b>{n_svc:02d}</b><span>Core services</span></p></div><p class="cap-intro">{e(c["intro"])}</p></div>
    <ol class="svcgrid svcgrid--{svc_cols(len(c["services"]))}">{services}</ol>
  </div>
</section>

{ops_wall() if c["slug"] == "technology" else ""}
<section class="section section--tight gallery-sec"><div class="wrap gallery gallery--{len(c["gallery"])}">{gallery}</div>{gallery2}</section>
{rental_reel() if c["slug"] == "rental" else ""}

<section class="section section--stone">
  <div class="wrap">
    <div class="sec-head" data-reveal>{eyebrow("Approach")}<h2 class="display-3">One team, every stage</h2></div>
    <ol class="steps">{"".join(f'<li data-reveal><span>{i + 1:02d}</span><h3>{t}</h3><p>{d}</p></li>' for i, (t, d) in enumerate(steps))}</ol>
  </div>
</section>

<section class="next-cap" style="--accent:{nxt["accent"]}">
  <a class="wrap next-cap__link" href="{{r}}capabilities/{nxt["slug"]}.html">
    <span class="eyebrow">Next capability · {nxt["n"]}</span>
    <span class="display-2">{e(nxt["name"])} {arrow()}</span>
  </a>
</section>'''
    return page(f'capabilities/{c["slug"]}.html', c["name"], f'{c["name"]} by PROPER Developments: {", ".join(s[0] for s in c["services"])}.',
                body, "capabilities.html", "has-hero", image=c["hero"])


def partners():
    body = page_hero("Technology Partners <em>&amp; Distribution</em>", "We work with global technology leaders — and distribute selected brands — to deliver proven, supported solutions in the Kingdom.",
                     "hd/network-cables.jpg", "", "Partners") + f'''
<section class="section section--stone">
  <div class="wrap">
    <ul class="partners partners--big">{"".join(partner_tile(p, True) for p in PARTNERS)}</ul>
    <div class="sec-head partners__sub" data-reveal>{eyebrow("Solution partners")}<h2 class="display-3">Specialists in AI, BIM, security and data.</h2></div>
    <ul class="partners partners--big partners--four">{"".join(partner_tile(p, True) for p in SOLUTION_PARTNERS)}</ul>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div data-reveal>{eyebrow("Why it matters")}<h2 class="display-3">Proven technology, local accountability.</h2></div>
    <div class="prose" data-reveal>
      <p class="lead">Our partnerships give clients direct access to manufacturer-backed products, supply and warranty — with design, installation and support delivered by our own teams in Saudi Arabia.</p>
      <p>As a distributor we connect global brands to local markets with dependable availability, logistics and after-sales support.</p>
    </div>
  </div>
</section>'''
    return page("partners.html", "Technology Partners", "PROPER Developments technology partners and distribution brands, including LG, Samsung, Huawei, Dell, Lenovo, MAXHUB, Yealink, Shure, QSC, Biamp, CTF and VOD.",
                body, "partners.html", "has-hero")


def contact():
    opts = "".join(f"<option>{e(c['name'])}</option>" for c in CAPABILITIES) + "<option>Technology partners &amp; distribution</option><option>Other</option>"
    body = f'''<section class="contact-hero">
  <div class="wrap contact-grid">
    <div data-reveal>
      {eyebrow("Contact")}
      <h1 class="display-1">Let’s talk about <em>your project.</em></h1>
      <dl class="contact-list">
        <div><dt>Headquarters</dt><dd>{e(COMPANY["address"])}</dd></div>
        <div><dt>Phone</dt><dd><a href="tel:{COMPANY["phone_href"]}">{COMPANY["phone"]}</a></dd></div>
        <div><dt>Email</dt><dd><a href="mailto:{COMPANY["email"]}">{COMPANY["email"]}</a></dd></div>
        <div><dt>Hours</dt><dd>{COMPANY["hours"]}</dd></div>
        <div><dt>WhatsApp</dt><dd><a href="{COMPANY["whatsapp"]}" target="_blank" rel="noopener">Chat with our team</a></dd></div>
      </dl>
    </div>
    <form class="form" id="contactForm" novalidate data-reveal>
      <div class="form__row">
        <label><span>Full name</span><input name="name" required autocomplete="name" aria-describedby="err-name"><small class="form__error" id="err-name" hidden>Enter your full name.</small></label>
        <label><span>Organisation</span><input name="company" autocomplete="organization"></label>
      </div>
      <div class="form__row">
        <label><span>Email</span><input name="email" type="email" required autocomplete="email" aria-describedby="err-email"><small class="form__error" id="err-email" hidden>Enter a valid email address, like name@company.com.</small></label>
        <label><span>Phone</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" aria-describedby="err-phone"><small class="form__error" id="err-phone" hidden>Enter a phone number using digits, like +966 5X XXX XXXX.</small></label>
      </div>
      <label><span>Area of interest</span><select name="interest">{opts}</select></label>
      <label><span>Message</span><textarea name="message" rows="5" required aria-describedby="err-message"></textarea><small class="form__error" id="err-message" hidden>Tell us briefly about your project.</small></label>
      <button class="btn btn--metal" type="submit">Send message {arrow()}</button>
      <p class="form__note">Submitting opens your email application with the message addressed to {COMPANY["email"]}.</p>
      <p class="form__status" id="formStatus" role="status" tabindex="-1" hidden>Thank you. Your email app should now open with your message ready to send. If it didn’t open, email us at <a href="mailto:{COMPANY["email"]}">{COMPANY["email"]}</a> or call <a href="tel:{COMPANY["phone_href"]}">{COMPANY["phone"]}</a>.</p>
    </form>
  </div>
</section>
{image_band("hd/jeddah-corniche-hd.jpg", "Headquarters", "Visit us on <em>Jeddah’s Corniche.</em>",
            "The Headquarters Business Park, Al Corniche Road — open Monday to Saturday.")}
<section class="map-sec">
  <iframe title="Map — Headquarters Business Park, Jeddah" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=The+Headquarters+Business+Park+Jeddah&amp;output=embed"></iframe>
</section>'''
    return page("contact.html", "Contact", "Contact PROPER Developments at the Headquarters Business Park, Al Corniche Road, Jeddah.", body, "contact.html", "is-contact")


def not_found():
    body = '''<section class="contact-hero"><div class="wrap"><p class="eyebrow">404</p><h1 class="display-1">Page not found.</h1>
<p class="lead">The page you’re looking for has moved or no longer exists.</p><a class="btn btn--metal" href="{r}index.html">Back to home</a></div></section>'''
    return page("404.html", "Page not found", "Page not found.", body, "", "is-contact")


def build_pages():
    out = {"index.html": home(), "about.html": about(), "capabilities.html": capabilities_overview(),
           "partners.html": partners(), "contact.html": contact(), "404.html": not_found()}
    for i, c in enumerate(CAPABILITIES):
        out[f'capabilities/{c["slug"]}.html'] = capability_page(c, i)
    return out


def main():
    global LANG
    out = build_pages()
    LANG = "ar"
    out.update({"ar/" + p: h for p, h in build_pages().items()})
    LANG = "en"
    if MISSING:
        print(f"{len(MISSING)} untranslated Arabic strings:")
        for m in sorted(MISSING):
            print("   ", repr(m))
    for path, html in out.items():
        f = ROOT / path
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(html, encoding="utf-8")
    urls = [p for p in out if p != "404.html"]
    sm = "\n".join(f"  <url><loc>{SITE}/{p.replace('index.html', '')}</loc></url>" for p in urls)
    (ROOT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{sm}\n</urlset>\n', encoding="utf-8")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n", encoding="utf-8")
    print(f"Built {len(out)} pages")


if __name__ == "__main__":
    main()
