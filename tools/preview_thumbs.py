"""
Downscales public/images/* into dist-preview/.thumbs/ for the inlined preview
only. The shipped assets in public/images/ are never touched.

The preview inlines every image as base64, which is ~1.37x the file size, and a
published artifact has a hard 16 MB ceiling. Full-resolution project photography
would blow through that; these copies keep the preview honest but small.
"""
import os, sys
from PIL import Image, ImageOps

SRC = os.path.join(os.path.dirname(__file__), "..", "public", "images")
DST = os.path.join(os.path.dirname(__file__), "..", "dist-preview", ".thumbs")

# THE ARTIFACT IS SIZE-CAPPED AND THE SITE IS NOT.
#
# public/images/ ships at full size. These copies exist only for the published
# preview, which inlines every image as base64 (~1.37x) into one page with a
# hard 16 MB ceiling — and there are 115 of them.
#
# The numbers are set from the widths the layout actually asks for, measured in
# the browser: a detail-page lead image is laid out at the full 1604px shell,
# a `wide` card at 1069px, and a gallery shot usually at 795px. Anything below
# those is being UPSCALED and looks soft on any screen, retina or not — which
# is exactly the bug these tiers were tuned to fix. Do not lower them without
# re-measuring; if the page then goes over 16 MB, take the budget out of the
# hero video (see HERO_MAX in build_preview.mjs) rather than out of these.
TIERS = {"": (1850, 76), "gal": (1040, 70)}

made = 0
for dirpath, _dirs, names in os.walk(SRC):
    rel_dir = os.path.relpath(dirpath, SRC).replace("\\", "/")
    rel_dir = "" if rel_dir == "." else rel_dir
    max_edge, quality = TIERS.get(rel_dir.split("/")[0], TIERS["gal"])
    os.makedirs(os.path.join(DST, rel_dir), exist_ok=True)

    for name in sorted(names):
        if not name.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            continue
        src = os.path.join(dirpath, name)
        out = os.path.join(DST, rel_dir, os.path.splitext(name)[0] + ".jpg")
        if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
            continue
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        im.thumbnail((max_edge, max_edge), Image.LANCZOS)
        im.save(out, "JPEG", quality=quality, optimize=True, progressive=True)
        made += 1

print(f"thumbs: {made} rebuilt", file=sys.stderr)
