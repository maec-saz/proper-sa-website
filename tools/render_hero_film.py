#!/usr/bin/env python3
"""
Renders the home-page hero film (assets/video/hero-film.mp4) from the three aerial stills.

It mirrors the CSS intro timeline (shots at 0 s, 3.1 s and 5.9 s) so the text sequence lands on the
same cuts, and adds what CSS can't do cheaply: sub-pixel camera moves, a descent through drifting
cloud layers with parallax, and a long continuous drift on the final façade shot so the film can loop.

Needs Pillow, NumPy and ffmpeg (libx264):   python3 tools/render_hero_film.py
To use real drone footage instead, export it to assets/video/hero-film.mp4 (H.264, 1920×1080) and skip this script.
"""
import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets/img/hd"
OUT = ROOT / "assets/video/hero-film.mp4"
W, H, FPS, DUR = 1920, 1080, 25, 16.0
rng = np.random.default_rng(7)


def ease(x):            # smooth in-out
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def ease_out(x):
    x = min(max(x, 0.0), 1.0)
    return 1 - (1 - x) ** 3


def lerp(a, b, t):
    return a + (b - a) * t


def ramp(t, a, b):      # 0→1 between a and b
    return 0.0 if t <= a else 1.0 if t >= b else (t - a) / (b - a)


def load(name):
    return Image.open(IMG / f"{name}.jpg").convert("RGB")


def frame_of(src, scale, tx=0.0, ty=0.0, rot=0.0, fx=0.5, fy=0.5):
    """Cover-fit src to W×H, then scale/rotate about the centre and translate (fractions of the frame)."""
    sw, sh = src.size
    cover = max(W / sw, H / sh)
    s = cover * scale
    cx, cy = sw * fx, sh * fy          # focal point in the source
    a = math.radians(rot)
    ca, sa = math.cos(a), math.sin(a)
    # inverse mapping: output (x,y) -> source
    # keep the view inside the photo (no empty edges), whatever the focal point and pan
    hw, hh = W / 2 / s, H / 2 / s
    vx = min(max(cx - tx * W / s, hw), sw - hw)
    vy = min(max(cy - ty * H / s, hh), sh - hh)
    cx, cy, ox, oy = vx, vy, W / 2, H / 2
    A = ca / s; B = sa / s; D = -sa / s; E = ca / s
    C = cx - (A * ox + B * oy)
    F = cy - (D * ox + E * oy)
    return np.asarray(src.transform((W, H), Image.AFFINE, (A, B, C, D, E, F), resample=Image.BICUBIC), dtype=np.float32)


def fog_layer(seed_scale, blur):
    small = rng.random((max(2, H // seed_scale), max(2, W // seed_scale))).astype(np.float32)
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((W * 2, H * 2), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(im, dtype=np.float32) / 255.0
    a = np.clip((a - 0.38) * 1.5, 0, 1) ** 1.4
    return Image.fromarray((a * 255).astype(np.uint8))


def fog_at(layer, scale, dx, dy):
    lw, lh = layer.size
    s = scale
    A, E = 1 / s, 1 / s
    C = lw / 2 - A * (W / 2 + dx * W)
    F = lh / 2 - E * (H / 2 + dy * H)
    return np.asarray(layer.transform((W, H), Image.AFFINE, (A, 0, C, 0, E, F), resample=Image.BILINEAR), dtype=np.float32)[..., None] / 255.0


def grade(px, bright, warm=0.0, sat=1.0):
    if sat != 1.0:
        g = px.mean(axis=2, keepdims=True)
        px = g + (px - g) * sat
    px = px * bright
    if warm:
        px = px * np.array([1 + 0.06 * warm, 1 + 0.01 * warm, 1 - 0.07 * warm], dtype=np.float32)
    return px


def main():
    city, dive, facade = load("home-altitude"), load("home-dive"), load("home-facade")
    fogs = [fog_layer(160, 60), fog_layer(90, 40)]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    vignette = (1 - 0.38 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.2).clip(0.35, 1)[..., None]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-profile:v", "high",
                           "-movflags", "+faststart", "-an", str(OUT)], stdin=subprocess.PIPE)
    n = int(DUR * FPS)
    for i in range(n):
        t = i / FPS
        out = np.zeros((H, W, 3), np.float32)

        # Shot 1 — high-altitude descent through cloud (0 – 4 s)
        if t < 4.0:
            p = ease(t / 4.0)
            px = frame_of(city, lerp(1.12, 1.42, p), 0, lerp(0.05, -0.04, p), fy=0.55)
            px = grade(px, lerp(0.6, 0.86, ease_out(t / 2.5)), sat=lerp(0.8, 0.95, p))
            for k, layer in enumerate(fogs):          # cloud layers rush past faster than the city (parallax)
                fs = lerp(1.0, 2.6 + k, ease(t / 3.2))
                amt = (1 - ramp(t, 0.4 + k * 0.4, 2.6 + k * 0.3)) * (0.85 - k * 0.2)
                fg = fog_at(layer, fs, 0.03 * k, lerp(0.0, 0.08, p))
                px = px * (1 - fg * amt) + 228 * fg * amt
            a = min(ramp(t, 0, 0.72), 1 - ramp(t, 3.28, 4.0))
            out += px * a

        # Shot 2 — top-down drone dive with yaw (3.1 – 6.5 s)
        if 3.1 <= t < 6.5:
            p = ease((t - 3.1) / 3.4)
            px = frame_of(dive, lerp(1.5, 1.16, p), rot=lerp(-5, 1.5, p))
            px = grade(px, lerp(0.72, 0.92, p))
            a = min(ramp(t, 3.1, 3.85), 1 - ramp(t, 5.82, 6.5))
            out = out * (1 - a) + px * a if t < 4.0 else out + px * a

        # Shot 3 — golden-hour façade flyover, then a long drift (5.9 s – end)
        if t >= 5.9:
            p = ease_out((t - 5.9) / 3.3)
            q = ease((t - 9.2) / (DUR - 9.2)) if t > 9.2 else 0.0
            px = frame_of(facade, lerp(1.28, 1.06, p) + 0.07 * q, lerp(0.05, 0.0, p) - 0.025 * q, 0, fx=0.62)
            px = grade(px, lerp(0.72, 1.0, p), warm=0.4 * p)
            a = ramp(t, 5.9, 7.3)
            out = out * (1 - a) + px * a

        out = out * vignette
        out *= 1 - ramp(t, DUR - 0.8, DUR)            # fade through black so the loop is seamless
        out += rng.normal(0, 3.0, (H, W, 1)).astype(np.float32)   # light film grain
        ff.stdin.write(np.clip(out, 0, 255).astype(np.uint8).tobytes())
        if i % 50 == 0:
            print(f"frame {i}/{n}", flush=True)
    ff.stdin.close()
    ff.wait()
    print("wrote", OUT, f"{OUT.stat().st_size / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
