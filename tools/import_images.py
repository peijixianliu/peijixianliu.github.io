"""
Imports the real project images from the connected folder into public/images/.

Each slot maps to one folder under the staged upload; the first file found in
that folder becomes the card cover. Re-run after adding images — it overwrites
its own slots on purpose (unlike make_placeholders.py, which never overwrites).
"""
import glob, os, sys
from PIL import Image, ImageOps

U = "/mnt/user-data/uploads/网页文件"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
# The lead image on a detail page is laid out at the full 1604px shell width,
# and a `wide` card is 1061px. Anything under ~2400 is being upscaled on a
# high-DPI screen, and under ~1700 it is upscaled even at 1x. Sources smaller
# than this are left at their own size — never enlarged.
LONG_EDGE = 2400
QUALITY = 84

SLOTS = {
    "work-ai-01":      "ai-hyperion/bikura",
    "work-ai-02":      "ai-hyperion/shrike",
    "work-ai-03":      "ai-hyperion/semfa",
    "work-ai-04":      "ai-hyperion/tuk",
    "work-ai-05":      "ai-hyperion/environment",
    "work-film-01":    "inversion",
    "work-film-02":    "she-is-just-her",
    "work-film-03":    "go-fish",
    "work-theater-01": "arcadia",
    "work-theater-02": "anarchist",
    "work-theater-03": "dance-light",
    "work-theater-04": "hanging-garden",
    "work-theater-05": "love-and-money",
}

for slot, folder in SLOTS.items():
    files = sorted(f for f in glob.glob(os.path.join(U, folder, "*")) if os.path.isfile(f))
    if not files:
        print(f"  ! {slot}: nothing in {folder}", file=sys.stderr)
        continue
    im = ImageOps.exif_transpose(Image.open(files[0])).convert("RGB")
    before = im.size
    im.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)
    dst = os.path.join(OUT, slot + ".jpg")
    im.save(dst, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    kb = os.path.getsize(dst) // 1024
    print(f"{slot:<17} {os.path.basename(files[0])[:34]:<36} {before[0]}x{before[1]} -> {im.size[0]}x{im.size[1]}  {kb}KB")
