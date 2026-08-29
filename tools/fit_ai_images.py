"""
Fits the four Hyperion character sheets to the shape of the card they sit in.

The Selected Works grid crops with object-fit: cover, so an image whose shape
is far from its slot loses its edges — and these are line-ups, where an edge
is a whole character. Rather than reshape the grid, each sheet is prepared to
its slot's exact ratio here, so the browser has nothing left to crop:

  bikura  wide     16:9.4   left alone (a 4% side trim clears every figure)
  shrike  standard 4:3      cropped to the LEFT TWO figures, then padded
  semfa   wide     16:9.4   cropped to the LEFT TWO figures, then padded
  tuk     standard 4:3      all four kept, padded top and bottom

Padding extends the sheets' white and gradient grounds. The fill is the
per-row MEDIAN of a band of background-only columns, not a copy of one column:
these sheets carry short horizontal rules in the background, and repeating any
single column that crosses one smears it into a hard band across the padding.
A median over many columns drops those outliers and leaves the vertical
gradient. Idempotent: an image already at its target ratio is skipped, so
re-running never pads twice.

Run after tools/import_images.py, which writes the covers this reads.
"""
import os

import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")

WIDE = 16 / 9.4       # .card--wide
STANDARD = 4 / 3      # .card--standard

# (file, label, slot ratio, crop window or None, background column bands to
# median for the side fill — coordinates are in the CROPPED image)
JOBS = [
    # bikura is left alone: its 1.777 in a 1.702 frame trims 2% a side, which
    # clears every figure, and padding it smeared the grass along the bottom.
    ("work-ai-02.jpg", "shrike", STANDARD, (0, 0, 930, None), [(0, 110), (830, 925)]),
    ("work-ai-03.jpg", "semfa", WIDE, (0, 0, 710, None), [(0, 60), (630, 705)]),
    ("work-ai-04.jpg", "tuk", STANDARD, None, None),
]


def background_column(im, bands):
    """A 1px column whose every row is the median of `bands` of background."""
    a = np.asarray(im, dtype=np.uint8)
    sample = np.concatenate([a[:, x0:x1, :] for x0, x1 in bands], axis=1)
    med = np.median(sample, axis=1).astype(np.uint8)          # (h, 3)
    return Image.fromarray(med[:, None, :], "RGB")


def pad_to_ratio(im, target, bands=None):
    """Grow the canvas to `target`, filling with clean background."""
    w, h = im.size
    if w / h < target:                      # too narrow — add width
        new_w = round(h * target)
        extra = new_w - w
        left, right = extra // 2, extra - extra // 2
        col = background_column(im, bands) if bands else im.crop((w - 1, 0, w, h))
        out = Image.new("RGB", (new_w, h))
        out.paste(col.resize((left, h)), (0, 0))
        out.paste(im, (left, 0))
        out.paste(col.resize((right, h)), (left + w, 0))
        return out
    new_h = round(w / target)               # too wide — add height
    extra = new_h - h
    top, bottom = extra // 2, extra - extra // 2
    out = Image.new("RGB", (w, new_h))
    out.paste(im.crop((0, 0, w, 1)).resize((w, top)), (0, 0))
    out.paste(im, (0, top))
    out.paste(im.crop((0, h - 1, w, h)).resize((w, bottom)), (0, top + h))
    return out


for name, label, target, window, bands in JOBS:
    path = os.path.join(OUT, name)
    im = Image.open(path).convert("RGB")
    before = im.size

    if abs(im.size[0] / im.size[1] - target) < 0.01:
        print(f"{label:<8} already {target:.3f} — skipped")
        continue

    if window:
        x0, y0, x1, y1 = window
        im = im.crop((x0, y0, x1, y1 if y1 is not None else im.size[1]))

    im = pad_to_ratio(im, target, bands)
    im.save(path, "JPEG", quality=88, optimize=True, progressive=True)
    print(
        f"{label:<8} {before[0]}x{before[1]} -> {im.size[0]}x{im.size[1]}"
        f"  ratio {im.size[0] / im.size[1]:.3f} (target {target:.3f})"
    )
