#!/usr/bin/env python3
"""
PROPER Developments — static site generator.

All page content lives in this file (CAPABILITIES, PROJECTS, PARTNERS, COMPANY).
Edit it, then run:   python3 tools/build.py
It writes every .html page, sitemap.xml and robots.txt into the site root.
No dependencies beyond the Python 3 standard library.
"""
from html import escape as e
from pathlib import Path
import json

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
    # Drop a drone film at this path (MP4/H.264, ~1920×1080, 8–15 s, < 6 MB) and the hero plays it
    # automatically, with the photo sequence as poster and fallback. Leave empty to use the photo sequence.
    "hero_video": "",
}

# --------------------------------------------------------------------------------------------
# Capabilities (five verticals). Images: prefer real project photos / design visualisations.
# --------------------------------------------------------------------------------------------
CAPABILITIES = [
    {
        "slug": "technology", "n": "01", "accent": "#8fa9c4",
        "name": "Technology & Intelligent Infrastructure", "short": "Technology",
        "tagline": "Intelligent systems for mission-critical operations.",
        "intro": "We design, supply and integrate the compute, AI and operations infrastructure that keeps organisations informed and in control — from GPU platforms and robotics to command centres that run around the clock.",
        "hero": "real/control-room-render.jpg", "hero_caption": "Command centre — design visualisation",
        "services": [
            ("AI Enablement", "Readiness assessments, use-case delivery and the data foundations needed to put AI into production."),
            ("GPU Solutions", "High-performance GPU compute, storage and networking for AI training and inference — on-premise or hybrid."),
            ("Robotics", "Service and delivery robotics, integrated with your facilities, systems and day-to-day operations."),
            ("Command & Control Centres", "Real-time monitoring, analysis and decision-making environments for government and enterprise."),
            ("Network Operations Centres (NOC)", "Purpose-built NOCs combining visualisation, monitoring platforms and resilient infrastructure."),
            ("Security Operations Centres (SOC)", "SOC environments that bring analysts, processes and security tooling together in one space."),
        ],
        "gallery": [("real/aramco-sail-robot.jpg", "Aramco Sail — robotics and LED environment"),
                    ("real/aramco-sail-kiosk.jpg", "Aramco Sail — interactive cybersecurity kiosk")],
    },
    {
        "slug": "audiovisual", "n": "02", "accent": "#c9a978",
        "name": "Audiovisual & Integrated Solutions", "short": "Audiovisual",
        "tagline": "Display, sound and control — engineered as one system.",
        "intro": "From curved LED walls to operator consoles, we engineer audiovisual environments where every screen, signal and control surface works together — reliably, every day.",
        "hero": "real/aramco-sail-led-wall.jpg", "hero_caption": "Aramco Sail — curved LED environment",
        "services": [
            ("Professional AV Solutions", "Boardrooms, auditoria, briefing centres and collaboration spaces, designed and integrated end to end."),
            ("LED Display Solutions", "Fine-pitch and large-format LED, curved and bespoke walls, calibrated for colour and longevity."),
            ("Control Room Solutions", "Video walls, visualisation, KVM and signal management for 24/7 operations rooms."),
            ("Operator Consoles", "Ergonomic technical consoles and supervisor positions designed around the operator."),
            ("Integrated Technology Systems", "Unified control, scheduling and monitoring that bring AV, IT and building systems together."),
        ],
        "gallery": [("real/aramco-sail-panorama.jpg", "Aramco Sail — panoramic LED wall"),
                    ("projects/lexus-showroom.jpg", "Lexus Flagship Showroom"),
                    ("real/aramco-sail-gallery.jpg", "Aramco Sail")],
    },
    {
        "slug": "construction", "n": "03", "accent": "#b7a68b",
        "name": "Construction & Development", "short": "Construction",
        "tagline": "From concept to completion — built to perform.",
        "intro": "We deliver commercial, residential and specialised buildings, interiors and infrastructure — combining planning, engineering and site expertise to build environments that last.",
        "hero": "hero/hq-business-park-1920.jpg", "hero_caption": "The Headquarters Business Park, Jeddah",
        "services": [
            ("Construction", "Commercial buildings and specialised facilities, delivered with precision, quality and safety."),
            ("Interior Fit-Out", "Workplace, hospitality and retail interiors, from design development to final handover."),
            ("Infrastructure Development", "Planning, engineering and delivery of the infrastructure that developments depend on."),
        ],
        "gallery": [("real/executive-lounge-render.jpg", "Executive interior — design visualisation"),
                    ("projects/madinah-office.jpg", "Madinah Office Building"),
                    ("projects/al-salheah.jpg", "Al-Salheah Building")],
    },
    {
        "slug": "museums", "n": "04", "accent": "#8fb3a5",
        "name": "Museums & Immersive Experiences", "short": "Museums & Immersive",
        "tagline": "Spaces where stories become places.",
        "intro": "We create museums, interactive exhibitions and immersive environments that hold attention — combining storytelling, architecture and technology into experiences visitors remember.",
        "hero": "real/immersive-dome-render.jpg", "hero_caption": "Immersive exhibition — design visualisation",
        "services": [
            ("Museum Development", "Galleries and visitor centres, from interpretive planning to fit-out and commissioning."),
            ("Interactive Exhibitions", "Touch, motion and sensor-driven exhibits that invite visitors to take part."),
            ("Immersive Experiences", "Projection, LED and spatial sound environments that surround the audience."),
            ("Exhibition Solutions", "Showcases, lighting, media and content integrated into a single coherent experience."),
        ],
        "gallery": [("real/immersive-panorama-render.jpg", "360° immersive room — design visualisation"),
                    ("real/aramco-sail-panorama.jpg", "Aramco Sail"),
                    ("projects/kec-dar-al-jewar.jpg", "KEC – Dar Al Jewar")],
    },
    {
        "slug": "rental", "n": "05", "accent": "#a9a6c4",
        "name": "Exhibition & Equipment Rental", "short": "Rental",
        "tagline": "Event-ready infrastructure, on demand.",
        "intro": "Exhibition structures, audiovisual equipment and display technology — supplied, installed, operated and removed by our own teams, so your event runs exactly to plan.",
        "hero": "projects/lexus-showroom.jpg", "hero_caption": "Lexus Flagship Showroom",
        "services": [
            ("Exhibition Infrastructure", "Stands, structures and staging for exhibitions, conferences and launches."),
            ("AV Equipment Rental", "Sound, lighting, cameras and control systems with on-site technical crews."),
            ("Display and Technology Rental", "LED walls, screens, kiosks and interactive displays for short- and long-term hire."),
        ],
        "gallery": [("real/aramco-sail-gallery.jpg", "Aramco Sail"),
                    ("services/warehouse.jpg", "")],
    },
]
CAP = {c["slug"]: c for c in CAPABILITIES}

# --------------------------------------------------------------------------------------------
# Projects — ONLY verified projects with real imagery. Each entry is from the current proper-sa.com
# portfolio. Confirm wording/categories with the project teams before launch (see README).
# --------------------------------------------------------------------------------------------
PROJECTS = [
    {"id": "aramco-sail", "title": "Aramco Sail", "cats": ["LED & Audiovisual", "Immersive Experiences"],
     "caps": ["audiovisual", "museums", "technology"], "featured": True,
     "summary": "Curved large-format LED walls, interactive displays and integrated audiovisual systems for an immersive technology environment.",
     "images": ["real/aramco-sail-led-wall.jpg", "real/aramco-sail-panorama.jpg", "real/aramco-sail-robot.jpg", "real/aramco-sail-gallery.jpg", "real/aramco-sail-kiosk.jpg"]},
    {"id": "lexus", "title": "Lexus Flagship Showroom", "cats": ["LED & Audiovisual"], "caps": ["audiovisual", "rental"], "featured": True,
     "summary": "Brand display wall and showroom media for the Lexus flagship showroom.",
     "images": ["projects/lexus-showroom.jpg"]},
    {"id": "hq", "title": "The Headquarters Business Park", "cats": ["Construction & Fit-Out"], "caps": ["construction"],
     "location": "Al Corniche Road, Jeddah",
     "summary": "MIDRAR’s landmark business park on Jeddah’s Corniche — and home of PROPER Developments.",
     "images": ["hero/hq-business-park-1920.jpg"]},
    {"id": "hospital", "title": "Private Hospital Extension & Medical College", "cats": ["Construction & Fit-Out"], "caps": ["construction"],
     "summary": "Hospital extension and medical college.", "images": ["projects/hospital-medical-college.jpg"]},
    {"id": "bin-sulaiman", "title": "Bin Sulaiman Business Center", "cats": ["Construction & Fit-Out"], "caps": ["construction"],
     "summary": "Commercial business centre.", "images": ["projects/bin-sulaiman.jpg"]},
    {"id": "high-mark", "title": "High Mark", "cats": ["Construction & Fit-Out"], "caps": ["construction"],
     "summary": "Retail interior development.", "images": ["projects/high-mark.jpg"]},
    {"id": "madinah", "title": "Madinah Office Building", "cats": ["Construction & Fit-Out"], "caps": ["construction"],
     "summary": "Office building.", "images": ["projects/madinah-office.jpg"]},
    {"id": "al-salheah", "title": "Al-Salheah Building", "cats": ["Construction & Fit-Out"], "caps": ["construction"],
     "summary": "Commercial building.", "images": ["projects/al-salheah.jpg"]},
    {"id": "tewergi", "title": "Tewergi Mixed-Use Building", "cats": ["Construction & Fit-Out"], "caps": ["construction"],
     "summary": "Mixed-use building.", "images": ["projects/tewergi.jpg"]},
    {"id": "al-juwan", "title": "Al Juwan Residential Community", "cats": ["Construction & Fit-Out"], "caps": ["construction"],
     "summary": "Residential community.", "images": ["projects/al-juwan.jpg"]},
    {"id": "suhail", "title": "Suhail Al Riyadh Community", "cats": ["Construction & Fit-Out"], "caps": ["construction"],
     "summary": "Residential community.", "images": ["projects/suhail-al-riyadh.jpg"]},
    {"id": "kec", "title": "KEC – Dar Al Jewar", "cats": ["Construction & Fit-Out"], "caps": ["construction", "museums"], "featured": True,
     "summary": "Heritage-inspired arcaded interior.", "images": ["projects/kec-dar-al-jewar.jpg"]},
]

# --------------------------------------------------------------------------------------------
# Technology partners & distribution (order as specified in the brief)
# logo=None → typographic placeholder until the official logo file is supplied.
# --------------------------------------------------------------------------------------------
PARTNERS = [
    {"name": "VOD", "logo": "partners/vod.png", "role": "Distribution partner"},
    {"name": "CTF", "logo": "partners/ctf.jpg", "role": "Technical consoles & control room furniture"},
    {"name": "PUDU", "logo": None, "role": "Service & delivery robotics"},
    {"name": "LG", "logo": "partners/lg.jpg", "role": "Commercial displays & LED"},
    {"name": "SAMSUNG", "logo": "partners/samsung.png", "role": "Commercial displays & LED"},
    {"name": "SOLUM", "logo": "partners/solum.png", "role": "Distribution partner"},
]

NAV = [("index.html", "Home"), ("about.html", "About Us"), ("capabilities.html", "Our Capabilities"),
       ("partners.html", "Technology Partners"), ("projects.html", "Projects"), ("contact.html", "Contact")]


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
    <a class="btn btn--line btn--sm header-cta" href="{r}contact.html">Contact Us</a>
    <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="siteNav"><span class="sr">Menu</span><i></i><i></i></button>
  </div>
</header>'''


def footer(r):
    caps = "".join(f'<li><a href="{r}capabilities/{c["slug"]}.html">{e(c["name"])}</a></li>' for c in CAPABILITIES)
    nav = "".join(f'<li><a href="{r}{h}">{l}</a></li>' for h, l in NAV)
    return f'''<footer class="site-footer">
  <div class="wrap">
    <div class="footer__top">
      <p class="footer__statement">{COMPANY["statement"]} <em>{COMPANY["statement_em"]}</em></p>
      <a class="btn btn--metal" href="{r}contact.html">Start a conversation {arrow()}</a>
    </div>
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


# First visit per session with motion allowed → play the cinematic intro (decided before first paint).
INTRO_JS = ("try{if(!sessionStorage.getItem('proper-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)"
            "document.documentElement.classList.add('is-intro')}catch(e){}")


def page(path, title, desc, body, active, body_class="", image="hero/hq-business-park-1920.jpg", preload=None, jsonld=None):
    depth = path.count("/")
    r = "../" * depth
    canonical = SITE + "/" + ("" if path == "index.html" else path)
    ld = f'<script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False)}</script>' if jsonld else ""
    pre = f'<link rel="preload" as="image" href="{r}assets/img/{preload}" fetchpriority="high">' if preload else ""
    full_title = title if path == "index.html" else f"{title} | PROPER Developments"
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(full_title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{canonical}">
<meta name="theme-color" content="#0d0e10">
<meta property="og:type" content="website">
<meta property="og:site_name" content="PROPER Developments">
<meta property="og:title" content="{e(full_title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE}/assets/img/{image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{r}assets/img/favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.add('js');{INTRO_JS if path == "index.html" else ""}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap">
{pre}
<link rel="stylesheet" href="{r}assets/css/site.css">
<script src="{r}assets/js/site.js" defer></script>
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
'''


def img(src, alt="", cls="", lazy=True, sizes=None):
    return f'<img src="{{r}}assets/img/{src}" alt="{e(alt)}"{f" class={chr(34)}{cls}{chr(34)}" if cls else ""}{" loading=" + chr(34) + "lazy" + chr(34) if lazy else ""} decoding="async">'


def eyebrow(text, light=False):
    return f'<p class="eyebrow{" eyebrow--light" if light else ""}">{e(text)}</p>'


def cta_band(title="Let’s build what’s next.", text="Tell us about your project — our team will respond within one working day."):
    return f'''<section class="cta-band" data-reveal>
  <div class="wrap cta-band__inner">
    <div><h2 class="display-2">{title}</h2><p>{text}</p></div>
    <div class="cta-band__actions">
      <a class="btn btn--metal" href="{{r}}contact.html">Contact Us {arrow()}</a>
      <a class="btn btn--line" href="{{r}}capabilities.html">Explore Our Capabilities</a>
    </div>
  </div>
</section>'''


def project_card(p, size=""):
    meta = " · ".join(p["cats"])
    return f'''<button type="button" class="pcard {size}" data-project="{p["id"]}" data-cats="{e("|".join(p["cats"]))}" data-reveal>
  <span class="pcard__img">{img(p["images"][0], p["title"])}</span>
  <span class="pcard__body">
    <span class="pcard__meta">{e(meta)}</span>
    <span class="pcard__title">{e(p["title"])}</span>
    {f'<span class="pcard__loc">{e(p["location"])}</span>' if p.get("location") else ""}
  </span>
  <span class="pcard__go" aria-hidden="true">{arrow()}</span>
</button>'''


def project_viewer():
    data = {p["id"]: {"t": p["title"], "c": " · ".join(p["cats"]), "d": p["summary"], "l": p.get("location", ""),
                      "i": p["images"]} for p in PROJECTS}
    return f'''<dialog class="viewer" id="viewer" aria-labelledby="viewerTitle">
  <div class="viewer__media"><img id="viewerImg" alt=""><div class="viewer__thumbs" id="viewerThumbs"></div></div>
  <div class="viewer__info">
    <p class="eyebrow" id="viewerCat"></p>
    <h2 id="viewerTitle"></h2>
    <p class="viewer__loc" id="viewerLoc"></p>
    <p id="viewerDesc"></p>
    <div class="viewer__nav">
      <button type="button" class="round" id="viewerPrev" aria-label="Previous project"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>
      <span id="viewerCount"></span>
      <button type="button" class="round" id="viewerNext" aria-label="Next project"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    </div>
  </div>
  <button type="button" class="viewer__close" id="viewerClose" aria-label="Close">×</button>
</dialog>
<script type="application/json" id="projectData">{json.dumps({"base": "{r}assets/img/", "order": [p["id"] for p in PROJECTS], "items": data}, ensure_ascii=False)}</script>'''


def partner_tile(p, big=False):
    inner = (f'<img src="{{r}}assets/img/{p["logo"]}" alt="{e(p["name"])}" loading="lazy">' if p["logo"]
             else f'<span class="logo-type" title="Placeholder — official logo to be supplied">{e(p["name"])}</span>')
    role = f'<span class="partner__role">{e(p["role"])}</span>' if big else ""
    return f'<li class="partner{" partner--big" if big else ""}" data-reveal><span class="partner__logo">{inner}</span>{role}</li>'


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
def home():
    v = COMPANY["hero_video"]
    caps = "".join(f'''
        <li class="capx__item{" is-active" if i == 0 else ""}" style="--accent:{c["accent"]}" data-cap="{i}">
          <a href="{{r}}capabilities/{c["slug"]}.html" class="capx__link">
            <span class="capx__n">{c["n"]}</span>
            <span class="capx__name">{e(c["name"])}</span>
            <span class="capx__go">{arrow()}</span>
          </a>
          <div class="capx__detail"><div>
            <p>{e(c["tagline"])}</p>
            <ul>{"".join(f"<li>{e(s[0])}</li>" for s in c["services"])}</ul>
          </div></div>
        </li>''' for i, c in enumerate(CAPABILITIES))
    cap_imgs = "".join(f'<figure class="capx__fig{" is-active" if i == 0 else ""}" data-cap-fig="{i}">{img(c["hero"], "")}<figcaption>{e(c["hero_caption"])}</figcaption></figure>' for i, c in enumerate(CAPABILITIES))
    feat = [p for p in PROJECTS if p.get("featured")]
    body = f'''
<section class="hero" id="hero" data-hero data-video="{e(v)}">
  <div class="hero__stage" aria-hidden="true">
    <div class="hero__shot">
      <img class="hero__img" src="{{r}}assets/img/hero/hq-business-park-1920.jpg" srcset="{{r}}assets/img/hero/hq-business-park-960.jpg 960w, {{r}}assets/img/hero/hq-business-park-1920.jpg 1920w" sizes="100vw" alt="" fetchpriority="high" decoding="async">
    </div>
    <video class="hero__video" muted playsinline loop preload="none" poster="{{r}}assets/img/hero/hq-business-park-1920.jpg"></video>
    <div class="hero__grade"></div>
    <div class="hero__sweep"></div>
    <div class="hero__grain"></div>
  </div>
  <div class="hero__bars" aria-hidden="true"><i></i><i></i></div>

  <div class="hero__slate" aria-hidden="true">
    <span class="hero__slate-k">{COMPANY["parent"]}</span>
    <span class="hero__slate-t">The Headquarters Business Park</span>
    <span class="hero__slate-l">Al Corniche Road · Jeddah</span>
  </div>

  <div class="wrap hero__content">
    <img class="hero__logo" src="{{r}}assets/img/logo-white.png" alt="" width="220" height="63">
    <h1 class="hero__title"><span class="line"><span>{COMPANY["statement"]}</span></span><span class="line"><em>{COMPANY["statement_em"]}</em></span></h1>
    <p class="hero__lead">Technology, intelligent infrastructure, construction and immersive experiences — delivered by one multidisciplinary team. A {COMPANY["parent"]} company.</p>
    <div class="hero__actions">
      <a class="btn btn--metal" href="{{r}}capabilities.html">Explore Our Capabilities {arrow()}</a>
      <a class="btn btn--line" href="{{r}}contact.html">Contact Us</a>
    </div>
  </div>

  <div class="hero__foot wrap">
    <span class="hero__loc"><i></i>Headquarters Business Park, Jeddah</span>
    <button type="button" class="hero__skip" id="heroSkip">Skip intro</button>
    <a class="hero__scroll" href="#intro" aria-label="Scroll to content"><span></span></a>
  </div>
</section>

<section class="intro" id="intro">
  <div class="wrap intro__grid">
    <div data-reveal>
      {eyebrow("PROPER Developments")}
      <h2 class="display-2">One partner for the environments where organisations <em>work, operate and engage.</em></h2>
    </div>
    <div class="intro__text" data-reveal>
      <p>PROPER Developments brings technology, engineering, infrastructure and development expertise together under one roof. Founded in {COMPANY["founded"]} and operating under {COMPANY["parent"]}, we deliver integrated solutions — from AI-ready infrastructure and command centres to construction, fit-out and immersive visitor experiences.</p>
      <a class="link" href="{{r}}about.html">About PROPER Developments {arrow()}</a>
    </div>
  </div>
  <div class="wrap facts" data-reveal>
    <div class="fact"><span class="fact__v">{COMPANY["founded"]}</span><span class="fact__l">Established</span></div>
    <div class="fact"><span class="fact__v">05</span><span class="fact__l">Integrated business verticals</span></div>
    <div class="fact"><span class="fact__v">{COMPANY["parent"]}</span><span class="fact__l">Parent organisation</span></div>
    <div class="fact"><span class="fact__v">Jeddah</span><span class="fact__l">Headquarters Business Park</span></div>
  </div>
</section>

<section class="capx dark" id="capabilities" aria-labelledby="capx-title">
  <div class="wrap">
    <div class="sec-head" data-reveal>
      {eyebrow("Our Capabilities", True)}
      <h2 class="display-2" id="capx-title">Five disciplines. <em>One accountable team.</em></h2>
    </div>
    <div class="capx__grid">
      <ol class="capx__list">{caps}
      </ol>
      <div class="capx__media" aria-hidden="true">{cap_imgs}</div>
    </div>
  </div>
</section>

<section class="hq" aria-labelledby="hq-title">
  <div class="hq__media" data-reveal="clip">{img("hero/hq-business-park-1920.jpg", "The Headquarters Business Park on Al Corniche Road, Jeddah")}</div>
  <div class="wrap hq__grid">
    <div class="hq__card" data-reveal>
      {eyebrow("Our home")}
      <h2 class="display-3" id="hq-title">The Headquarters Business Park</h2>
      <p>Owned by {COMPANY["parent"]}, the Headquarters Business Park on Jeddah’s Corniche is home to PROPER Developments — and a daily reminder of the scale and quality we build to.</p>
      <a class="link" href="{{r}}contact.html">Visit us {arrow()}</a>
    </div>
  </div>
</section>

<section class="featured" aria-labelledby="feat-title">
  <div class="wrap">
    <div class="sec-head sec-head--split" data-reveal>
      <div>{eyebrow("Projects")}<h2 class="display-2" id="feat-title">Selected work</h2></div>
      <a class="link" href="{{r}}projects.html">All projects {arrow()}</a>
    </div>
    <div class="featured__grid">
      {project_card(feat[0], "pcard--xl")}
      {"".join(project_card(p) for p in feat[1:])}
    </div>
  </div>
</section>

<section class="partners-strip" aria-labelledby="ps-title">
  <div class="wrap">
    <div class="sec-head sec-head--split" data-reveal>
      <div>{eyebrow("Technology Partners & Distribution")}<h2 class="display-3" id="ps-title">Global brands, delivered locally.</h2></div>
      <a class="link" href="{{r}}partners.html">Our partners {arrow()}</a>
    </div>
    <ul class="partners">{"".join(partner_tile(p) for p in PARTNERS)}</ul>
  </div>
</section>

{cta_band()}
{project_viewer()}
'''
    return page("index.html", "PROPER Developments | Building Intelligent Environments. Enabling Tomorrow.",
                "PROPER Developments, a MIDRAR company, delivers technology & intelligent infrastructure, audiovisual, construction & fit-out, museums & immersive experiences and exhibition rental across Saudi Arabia.",
                body, "index.html", "has-hero is-home", preload="hero/hq-business-park-1920.jpg", jsonld=ORG_LD)


def page_hero(title, sub, image, caption="", kicker="", accent=None):
    style = f' style="--accent:{accent}"' if accent else ""
    return f'''<section class="phero"{style}>
  <div class="phero__media">{img(image, "", lazy=False)}</div>
  <div class="wrap phero__content">
    {eyebrow(kicker, True) if kicker else ""}
    <h1 class="display-1">{title}</h1>
    {f'<p class="phero__sub">{sub}</p>' if sub else ""}
  </div>
  {f'<p class="phero__cap wrap">{e(caption)}</p>' if caption else ""}
</section>'''


def about():
    body = page_hero("A multidisciplinary group, <em>built on delivery.</em>", "Technology, engineering, infrastructure and development expertise — brought together to deliver integrated solutions across industries.",
                     "hero/hq-business-park-1920.jpg", "The Headquarters Business Park, Jeddah", "About Us") + f'''
<section class="section">
  <div class="wrap split">
    <div data-reveal>{eyebrow("Who we are")}<h2 class="display-3">Integrated solutions, from concept to completion.</h2></div>
    <div class="prose" data-reveal>
      <p class="lead">PROPER Developments is a Saudi company delivering innovative solutions across technology, intelligent infrastructure, construction, fit-out, digital environments and immersive experiences.</p>
      <p>Founded in {COMPANY["founded"]}, the company began with a vision to deliver innovative solutions in technology and infrastructure. Over the years, our expertise has expanded across audiovisual, ICT, construction and project development — and today spans AI enablement, command and control environments, museums and exhibition services.</p>
      <p>Our multidisciplinary approach means one accountable team across every stage: consultancy and design, supply and construction, integration and commissioning, and long-term support.</p>
    </div>
  </div>
</section>

<section class="section dark midrar">
  <div class="wrap split">
    <div data-reveal>{eyebrow("Part of " + COMPANY["parent"], True)}<h2 class="display-3">Backed by {COMPANY["parent"]}.</h2></div>
    <div class="prose" data-reveal>
      <p class="lead">PROPER Developments operates under {COMPANY["parent"]}, owner of the Headquarters Business Park on Jeddah’s Corniche.</p>
      <p>The association gives our clients the confidence of an established group, and gives us a home that reflects the standards we deliver to — in architecture, technology and the day-to-day experience of the people who use the spaces we build.</p>
    </div>
  </div>
</section>

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

<section class="section">
  <div class="wrap">
    <div class="sec-head" data-reveal>{eyebrow("Clients")}<h2 class="display-3">Trusted by leading organisations</h2></div>
    <div class="clients" data-reveal>{img("clients.jpg", "Logos of PROPER Developments clients, including the Ministry of Culture and leading Saudi organisations")}</div>
  </div>
</section>
{cta_band()}'''
    return page("about.html", "About Us", "PROPER Developments is a multidisciplinary Saudi company operating under MIDRAR, bringing together technology, engineering, infrastructure and development expertise since 2007.",
                body, "about.html", "has-hero")


def capabilities_overview():
    blocks = "".join(f'''
  <article class="capblock" style="--accent:{c["accent"]}" data-reveal>
    <a class="capblock__media" href="{{r}}capabilities/{c["slug"]}.html" tabindex="-1" aria-hidden="true">{img(c["hero"], "")}</a>
    <div class="capblock__body">
      <span class="capblock__n">{c["n"]}</span>
      <h2 class="display-3"><a href="{{r}}capabilities/{c["slug"]}.html">{e(c["name"])}</a></h2>
      <p class="capblock__tag">{e(c["tagline"])}</p>
      <ul class="tags">{"".join(f"<li>{e(s[0])}</li>" for s in c["services"])}</ul>
      <a class="link" href="{{r}}capabilities/{c["slug"]}.html">Explore {e(c["short"])} {arrow()}</a>
    </div>
  </article>''' for c in CAPABILITIES)
    body = page_hero("Our <em>Capabilities</em>", "Five integrated business verticals — engineered to work together, from the first concept to long-term operation.",
                     "real/control-room-render.jpg", "Command centre — design visualisation", "What We Do") + f'''
<section class="section capblocks"><div class="wrap">{blocks}</div></section>
{cta_band()}'''
    return page("capabilities.html", "Our Capabilities", "Technology & intelligent infrastructure, audiovisual & integrated solutions, construction & development, museums & immersive experiences, and exhibition & equipment rental.",
                body, "capabilities.html", "has-hero")


def capability_page(c, idx):
    services = "".join(f'''<li class="svc" data-reveal><span class="svc__n">{i + 1:02d}</span><h3>{e(s[0])}</h3><p>{e(s[1])}</p></li>''' for i, s in enumerate(c["services"]))
    gallery = "".join(f'<figure data-reveal>{img(src, cap or c["name"])}{f"<figcaption>{e(cap)}</figcaption>" if cap else ""}</figure>' for src, cap in c["gallery"])
    related = [p for p in PROJECTS if c["slug"] in p["caps"]][:3]
    rel = f'''<section class="section section--graphite">
  <div class="wrap">
    <div class="sec-head sec-head--split" data-reveal><div>{eyebrow("Related projects", True)}<h2 class="display-3">Selected work</h2></div><a class="link link--light" href="{{r}}projects.html">All projects {arrow()}</a></div>
    <div class="featured__grid{" featured__grid--3" if len(related) == 3 else ""}">{"".join(project_card(p, "pcard--xl" if len(related) == 1 else "") for p in related)}</div>
  </div>
</section>''' if related else ""
    nxt = CAPABILITIES[(idx + 1) % len(CAPABILITIES)]
    steps = [("Consult", "Requirements, users, site and success criteria."), ("Design", "Engineering, technology selection and value engineering."),
             ("Deliver", "Supply, construction, installation and integration."), ("Support", "Commissioning, training, maintenance and upgrades.")]
    body = page_hero(e(c["name"]), e(c["tagline"]), c["hero"], c["hero_caption"], f'Capability {c["n"]}', c["accent"]) + f'''
<section class="section" style="--accent:{c["accent"]}">
  <div class="wrap split">
    <div data-reveal>{eyebrow("Overview")}<p class="display-3 cap-intro">{e(c["intro"])}</p></div>
    <ol class="svcs">{services}</ol>
  </div>
</section>

<section class="section section--tight gallery-sec"><div class="wrap gallery gallery--{len(c["gallery"])}">{gallery}</div></section>

<section class="section section--stone">
  <div class="wrap">
    <div class="sec-head" data-reveal>{eyebrow("Approach")}<h2 class="display-3">One team, every stage</h2></div>
    <ol class="steps">{"".join(f'<li data-reveal><span>{i + 1:02d}</span><h3>{t}</h3><p>{d}</p></li>' for i, (t, d) in enumerate(steps))}</ol>
  </div>
</section>
{rel}
<section class="next-cap" style="--accent:{nxt["accent"]}">
  <a class="wrap next-cap__link" href="{{r}}capabilities/{nxt["slug"]}.html">
    <span class="eyebrow">Next capability · {nxt["n"]}</span>
    <span class="display-2">{e(nxt["name"])} {arrow()}</span>
  </a>
</section>
{cta_band(f"Let’s discuss your {e(c['short'].lower())} project.")}
{project_viewer() if related else ""}'''
    return page(f'capabilities/{c["slug"]}.html', c["name"], f'{c["name"]} by PROPER Developments: {", ".join(s[0] for s in c["services"])}.',
                body, "capabilities.html", "has-hero", image=c["hero"])


def partners():
    body = page_hero("Technology Partners <em>&amp; Distribution</em>", "We work with global technology leaders — and distribute selected brands — to deliver proven, supported solutions in the Kingdom.",
                     "real/aramco-sail-panorama.jpg", "Aramco Sail", "Partners") + f'''
<section class="section section--stone">
  <div class="wrap">
    <ul class="partners partners--big">{"".join(partner_tile(p, True) for p in PARTNERS)}</ul>
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
</section>
{cta_band("Looking for a technology partner?")}'''
    return page("partners.html", "Technology Partners", "PROPER Developments technology partners and distribution brands: VOD, CTF, PUDU, LG, Samsung and SOLUM.",
                body, "partners.html", "has-hero")


def projects():
    cats = []
    for p in PROJECTS:
        for c in p["cats"]:
            if c not in cats:
                cats.append(c)
    filters = '<button type="button" class="chip is-active" data-filter="*">All</button>' + "".join(f'<button type="button" class="chip" data-filter="{e(c)}">{e(c)}</button>' for c in cats)
    body = page_hero("Projects <em>&amp; Experience</em>", "A selection of completed work across audiovisual, immersive environments, construction and fit-out.",
                     "real/aramco-sail-led-wall.jpg", "Aramco Sail", "Portfolio") + f'''
<section class="section">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filter projects" data-reveal>{filters}</div>
    <div class="pgrid" id="pgrid">{"".join(project_card(p, "pcard--xl" if i == 0 else "") for i, p in enumerate(PROJECTS))}</div>
  </div>
</section>
{cta_band("Have a project in mind?")}
{project_viewer()}'''
    return page("projects.html", "Projects", "Selected PROPER Developments projects including Aramco Sail, the Lexus Flagship Showroom and the Headquarters Business Park.",
                body, "projects.html", "has-hero", image="real/aramco-sail-led-wall.jpg")


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
        <label><span>Full name</span><input name="name" required autocomplete="name"></label>
        <label><span>Organisation</span><input name="company" autocomplete="organization"></label>
      </div>
      <div class="form__row">
        <label><span>Email</span><input name="email" type="email" required autocomplete="email"></label>
        <label><span>Phone</span><input name="phone" type="tel" autocomplete="tel"></label>
      </div>
      <label><span>Area of interest</span><select name="interest">{opts}</select></label>
      <label><span>Message</span><textarea name="message" rows="5" required></textarea></label>
      <button class="btn btn--metal" type="submit">Send message {arrow()}</button>
      <p class="form__note">Submitting opens your email application with the message addressed to {COMPANY["email"]}.</p>
    </form>
  </div>
</section>
<section class="map-sec">
  <iframe title="Map — Headquarters Business Park, Jeddah" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=The+Headquarters+Business+Park+Jeddah&amp;output=embed"></iframe>
</section>'''
    return page("contact.html", "Contact", "Contact PROPER Developments at the Headquarters Business Park, Al Corniche Road, Jeddah.", body, "contact.html", "is-contact")


def not_found():
    body = '''<section class="contact-hero"><div class="wrap"><p class="eyebrow">404</p><h1 class="display-1">Page not found.</h1>
<p class="lead">The page you’re looking for has moved or no longer exists.</p><a class="btn btn--metal" href="{r}index.html">Back to home</a></div></section>'''
    return page("404.html", "Page not found", "Page not found.", body, "", "is-contact")


def main():
    out = {"index.html": home(), "about.html": about(), "capabilities.html": capabilities_overview(),
           "partners.html": partners(), "projects.html": projects(), "contact.html": contact(), "404.html": not_found()}
    for i, c in enumerate(CAPABILITIES):
        out[f'capabilities/{c["slug"]}.html'] = capability_page(c, i)
    for path, html in out.items():
        f = ROOT / path
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(html, encoding="utf-8")
    urls = [p for p in out if p != "404.html"]
    sm = "\n".join(f"  <url><loc>{SITE}/{'' if p == 'index.html' else p}</loc></url>" for p in urls)
    (ROOT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{sm}\n</urlset>\n', encoding="utf-8")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n", encoding="utf-8")
    print(f"Built {len(out)} pages")


if __name__ == "__main__":
    main()
