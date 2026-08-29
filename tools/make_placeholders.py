"""
Generates the dark abstract placeholder imagery used by the site.
Replace the files in public/images/ with real photography when ready;
re-run with `python3 tools/make_placeholders.py` to regenerate.
"""
import math
import os
import random
import sys

from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT, exist_ok=True)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def base_gradient(w, h, top, bottom):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        d.line([(0, y), (w, y)], fill=lerp(top, bottom, y / max(1, h - 1)))
    return img


def screen(a, b, strength=1.0):
    """Screen-blend b over a."""
    pa, pb = a.load(), b.load()
    w, h = a.size
    out = Image.new("RGB", (w, h))
    po = out.load()
    for y in range(h):
        for x in range(w):
            ra, ga, ba = pa[x, y]
            rb, gb, bb = pb[x, y]
            po[x, y] = (
                min(255, int(255 - (255 - ra) * (255 - rb * strength) / 255)),
                min(255, int(255 - (255 - ga) * (255 - gb * strength) / 255)),
                min(255, int(255 - (255 - ba) * (255 - bb * strength) / 255)),
            )
    return out


def fold_layer(w, h, seed, accent, density=26, amp=0.16):
    rnd = random.Random(seed)
    layer = Image.new("RGB", (w, h), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(density):
        p = i / max(1, density - 1)
        base_y = h * (0.05 + p * 0.95)
        phase = rnd.uniform(0, math.tau)
        f1 = rnd.uniform(1.4, 3.4)
        f2 = rnd.uniform(4.0, 9.0)
        a1 = h * amp * rnd.uniform(0.4, 1.0)
        a2 = h * amp * 0.34 * rnd.uniform(0.3, 1.0)
        width = rnd.choice([1, 1, 1, 2, 2, 3])
        glow = rnd.random() < 0.16
        col = accent if glow else (
            int(120 + p * 74), int(134 + p * 80), int(170 + p * 85)
        )
        col = tuple(max(0, min(255, int(c * rnd.uniform(0.55, 1.15)))) for c in col)
        pts = []
        for x in range(-10, w + 12, 8):
            nx = x / w
            y = base_y + math.sin(nx * f1 + phase) * a1 + math.sin(nx * f2 - phase * 0.7) * a2
            pts.append((x, y))
        d.line(pts, fill=col, width=width, joint="curve")

    blurred = layer.filter(ImageFilter.GaussianBlur(14))
    layer = Image.blend(layer.filter(ImageFilter.GaussianBlur(0.8)), blurred, 0.5)
    return layer


def vignette(img, strength=0.85):
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse(
        [-w * 0.22, -h * 0.22, w * 1.22, h * 1.22],
        fill=int(255 * strength),
    )
    mask = mask.filter(ImageFilter.GaussianBlur(min(w, h) * 0.16))
    dark = Image.new("RGB", (w, h), (2, 3, 6))
    return Image.composite(img, dark, mask)


def grain(img, amount=9, seed=0):
    w, h = img.size
    rnd = random.Random(seed)
    noise = Image.new("L", (w // 2, h // 2))
    noise.putdata([rnd.randint(128 - amount, 128 + amount) for _ in range(
        (w // 2) * (h // 2))])
    noise = noise.resize((w, h), Image.BILINEAR)
    px, pn = img.load(), noise.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            n = pn[x, y] - 128
            px[x, y] = (
                max(0, min(255, r + n)),
                max(0, min(255, g + n)),
                max(0, min(255, b + n)),
            )
    return img


FORCE = "--force" in sys.argv


def make(name, w, h, seed, top, bottom, accent, density=26, amp=0.16, vig=0.85):
    """Writes a placeholder. Never overwrites an existing file unless --force
    is passed: once a real image lands in public/images/ under one of these
    names, re-running this script must not destroy it."""
    path = os.path.join(OUT, name)
    if os.path.exists(path) and not FORCE:
        print("kept  ", os.path.relpath(path), "(already exists)")
        return
    img = base_gradient(w, h, top, bottom)
    img = screen(img, fold_layer(w, h, seed, accent, density, amp), 1.0)
    img = vignette(img, vig)
    img = grain(img, 8, seed)
    img.save(path, "JPEG", quality=86, optimize=True)
    print("wrote", os.path.relpath(path))


BLUE = (77, 157, 255)
CYAN = (111, 227, 255)
WARM = (196, 150, 104)

if __name__ == "__main__":
    # NOTE: portrait.jpg is deliberately NOT generated here. It is a real
    # photograph, and this script used to overwrite it.
    specs = [
        ("work-ai-01.jpg", 1600, 940, 11, (30, 42, 66), (8, 10, 16), CYAN, 30, 0.18, 0.78),
        ("work-ai-02.jpg", 1200, 900, 12, (38, 42, 58), (9, 11, 17), BLUE, 24, 0.15, 0.78),
        ("work-ai-03.jpg", 1600, 940, 13, (24, 38, 64), (8, 10, 18), CYAN, 34, 0.20, 0.78),
        ("work-film-01.jpg", 900, 1300, 21, (28, 36, 56), (8, 10, 16), BLUE, 32, 0.14, 0.78),
        ("work-film-02.jpg", 1600, 940, 22, (48, 42, 44), (11, 10, 13), WARM, 26, 0.17, 0.78),
        ("work-film-03.jpg", 1200, 900, 23, (36, 36, 44), (10, 10, 14), WARM, 22, 0.15, 0.78),
        ("work-theater-01.jpg", 1200, 900, 31, (44, 38, 42), (11, 10, 13), WARM, 28, 0.16, 0.78),
        ("work-theater-02.jpg", 1200, 900, 32, (30, 34, 50), (8, 9, 15), BLUE, 26, 0.16, 0.78),
        ("work-theater-03.jpg", 900, 1300, 33, (26, 32, 52), (8, 9, 15), CYAN, 34, 0.15, 0.78),
        ("work-ai-04.jpg", 1200, 900, 14, (32, 40, 60), (9, 11, 17), CYAN, 26, 0.16, 0.78),
        ("work-theater-04.jpg", 900, 1300, 34, (40, 34, 40), (11, 9, 12), WARM, 30, 0.15, 0.78),
        ("work-theater-05.jpg", 1200, 900, 35, (34, 36, 48), (9, 10, 15), BLUE, 24, 0.17, 0.78),
        ("work-ai-05.jpg", 2100, 900, 41, (28, 38, 60), (8, 10, 16), CYAN, 30, 0.20, 0.82),
        # shared gallery placeholders, reused across every project detail page
        ("gal-01.jpg", 1400, 1000, 51, (34, 40, 58), (9, 11, 17), BLUE, 26, 0.17, 0.8),
        ("gal-02.jpg", 1000, 1400, 52, (30, 34, 50), (8, 10, 16), CYAN, 30, 0.15, 0.8),
        ("gal-03.jpg", 1400, 1000, 53, (44, 38, 40), (11, 10, 12), WARM, 24, 0.18, 0.8),
        ("gal-04.jpg", 1000, 1400, 54, (28, 36, 56), (8, 10, 16), BLUE, 32, 0.14, 0.8),
        ("gal-05.jpg", 1400, 1000, 55, (36, 36, 46), (10, 10, 14), WARM, 22, 0.16, 0.8),
        ("gal-06.jpg", 1000, 1400, 56, (26, 34, 54), (8, 9, 15), CYAN, 28, 0.16, 0.8),
    ]
    for spec in specs:
        make(*spec)
