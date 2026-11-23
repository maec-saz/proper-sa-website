"""Regenerate the website image set with the Higgsfield CLI (Cinema Studio Image 2.5, 4K, 16:9) and download each result.

Usage:  python3 tools/higgsfield_generate.py <out_dir> [name ...]     (needs `higgsfield auth login` and a paid workspace)
These are the exact prompts used for the published images. The one exception is home-shot-3-facade, which was made with
Nano Banana Pro (`higgsfield generate create nano_banana_pro --resolution 4k --aspect_ratio 16:9 ...`, prompt in README).
After generating, convert to assets/img/hd/<name>.jpg (2560px) and <name>-1280.jpg; re-run tools/render_hero_film.py
if a home shot changed. About 4 credits per image."""
import json, subprocess, sys, concurrent.futures as cf, urllib.request, os
OUT = sys.argv[1]
STYLE = ("Photorealistic architectural photography, premium corporate aesthetic, charcoal and graphite tones with warm "
         "brushed-metal accents, soft volumetric light, shallow haze, high dynamic range, sharp detail, no text, no logos, "
         "no brand names, no readable signage, no identifiable faces.")
JOBS = {
 "home-shot-1-altitude": "High-altitude dawn aerial over a modern Red Sea coastal city in Saudi Arabia, low cloud layer drifting between contemporary towers, the sea glowing on the horizon, camera looking down at a 30 degree angle, vast sense of scale, no recognisable landmark towers.",
 "home-shot-2-dive": "Top-down drone view diving onto a modern business district in Saudi Arabia: geometric rooftops, landscaped plazas with palm trees, long shadows at golden hour, clean urban grid, slight rotation.",
 "home-shot-3-facade": "Low-angle architectural photo of a modern office building facade with glass and vertical bronze fins, warm golden sunset light on the bronze, clear blue and amber sky, building on the right side of the frame, empty sky on the left side, one building only, no other towers, no landmarks.",
 "tech-gpu": "Rows of high-density GPU server racks in a modern AI data hall, cold-aisle containment, cool white and blue LED status lights, polished floor reflections, deep one-point perspective.",
 "tech-robotics": "A sleek white service robot gliding through a premium corporate lobby with stone floors and warm lighting, slight motion blur on the robot, minimal and futuristic.",
 "tech-noc": "Interior of a modern network operations centre: a clean workstation with three monitors showing abstract line charts and network diagrams, a large video wall of data panels in the background, dim blue ambient lighting, cinematic depth of field, empty room.",
 "av-hero": "Interior of a modern corporate auditorium with a huge curved LED video wall glowing with soft gold and deep blue abstract waves, rows of empty upholstered seats, architectural ceiling with linear lights, wide-angle view.",
 "av-boardroom": "Executive boardroom with a seamless LED display wall showing an abstract gradient, long walnut table, integrated microphones and touch panels, warm ambient light, contemporary Saudi corporate interior.",
 "av-control-room": "Ergonomic technical operator consoles in a control room, curved desks with integrated monitors, keyboards, soft blue light from a video wall, empty and pristine.",
 "av-led-detail": "A modular LED video wall being assembled in a clean technical workshop: rows of square display cabinets, some lit with a warm gold to blue gradient, neatly routed cables and aluminium frames, soft workshop lighting, empty room.",
 "construction-hero": "A contemporary commercial tower under construction at golden hour in Saudi Arabia, tower crane silhouettes, glass curtain wall half-installed, warm dust in the air, low angle, sense of ambition and precision.",
 "construction-fitout": "A newly completed premium office interior: travertine floors, timber slat ceiling, glass meeting rooms, warm indirect lighting, no people.",
 "construction-site": "Construction site at sunrise: rebar, formwork and concrete columns in neat rhythm, white hard hats on a table with rolled architectural drawings in the foreground, shallow depth of field.",
 "construction-infrastructure": "Aerial view of new infrastructure in a desert development: road interchange, utility corridors and landscaped boulevards, clean geometric patterns, golden light.",
 "museum-hero": "An immersive projection gallery: a single distant visitor silhouette standing in a dark room whose walls and floor are covered in flowing projected desert dunes and abstract eight-pointed geometric star patterns, deep blue and gold, awe-inspiring scale, purely geometric ornament, no calligraphy, no letters, no writing of any kind.",
 "museum-gallery": "A modern museum gallery: heritage artefacts in museum-grade glass showcases, precise spotlighting, warm stone walls, minimal elegant design, no people.",
 "museum-interactive": "Hands interacting with a large glowing multi-touch table showing an abstract interactive map in a dark museum, soft glow, hands only.",
 "museum-dome": "A 360 degree immersive dome theatre with a starfield and desert dunes projected overhead, reclined seats, cinematic wide angle, nobody visible.",
 "rental-hero": "A premium exhibition hall during setup at dusk: a striking two-storey custom exhibition stand with a large LED screen showing an abstract gradient, truss rigging and moving-head lights casting beams through light haze, no branding, wide angle.",
 "rental-stage": "A conference stage with a wide LED backdrop showing an abstract gradient, a lectern and a concert-grade lighting rig, empty auditorium, dramatic light beams.",
 "rental-equipment": "Neatly arranged professional AV flight cases, LED panels and stage lighting fixtures in a clean modern warehouse, industrial light, no readable labels.",
 "rental-kiosk": "Interactive digital kiosks and portrait LED totems displaying abstract gradients at a modern exhibition, glossy floor, visitors softly blurred in the background.",
}
only = set(sys.argv[2:])
def run(name):
    path = os.path.join(OUT, name + ".png")
    if os.path.exists(path) and os.path.getsize(path) > 100000: return name, "exists", path
    r = subprocess.run(["higgsfield", "generate", "create", "cinematic_studio_2_5", "--resolution", "4k", "--aspect_ratio", "16:9",
                        "--prompt", JOBS[name] + " " + STYLE, "--wait", "--wait-timeout", "20m", "--json"], capture_output=True, text=True)
    if r.returncode != 0: return name, "FAILED " + (r.stderr or r.stdout)[-300:], None
    job = json.loads(r.stdout)[0]
    json.dump(job, open(os.path.join(OUT, name + ".json"), "w"), indent=1)
    if job.get("status") != "completed": return name, "status " + job.get("status", "?"), None
    urllib.request.urlretrieve(job["result_url"], path)
    return name, "ok %dx%d" % (job["params"]["width"], job["params"]["height"]), path
names = [n for n in JOBS if not only or n in only]
with cf.ThreadPoolExecutor(8) as ex:
    for name, status, path in ex.map(run, names):
        print(f"{name:30} {status}", flush=True)
