"""
Imports the detail-page galleries from each project's Gallery folder.

WHAT IT READS
-------------
Every project folder in the connected folder may hold a `Gallery/` subfolder
(the case varies — `Gallery`, `gallery`, both are found). Everything in it,
including nested subfolders, becomes that project's gallery, in sorted order.
No folder means no gallery, which is how a project opts out.

The cover image is skipped if it also appears inside Gallery/ — several folders
keep a copy there — matched on file contents, not on name.

Nothing is cropped and nothing is invented. The images are used as they are.

HOW THEY ARE LAID OUT
---------------------
These are real production photographs and boards: portrait, landscape,
panoramic, all mixed. A fixed-height grid would have to crop them to fit, which
is exactly what you must not do to a costume photograph. So the gallery is a
JUSTIFIED layout, the same one photo sites use: images are packed into rows,
and each row's height is chosen so the row fills the width exactly. Within a
row every image keeps its own aspect ratio and every image is the same height,
so the rows read level and nothing is cut off.

The packing happens here, at build time, because the ratios are known here. The
CSS only has to give each figure `flex-grow: <ratio>` and `flex-basis: 0`,
which makes widths land in proportion to the ratios — see `.shotRow` in
detail.css.

Run order:  import_images.py -> fit_ai_images.py -> build_galleries.py
Output:     public/images/gal/*.jpg  and  src/data/galleries.js (generated)
"""
import glob
import hashlib
import json
import os
import re
import sys

from PIL import Image, ImageOps


def _source_folder():
    """Where the original photographs live.

    Order: the PORTFOLIO_SRC environment variable, then the first of the
    known locations that exists. Set the variable (or add a path here) and
    these tools run anywhere — on the machine that holds the photos, not just
    in the session that built the site.

        Windows :  set PORTFOLIO_SRC=C:\\Users\\Pei\\Desktop\\网页文件
        macOS   :  export PORTFOLIO_SRC=~/Desktop/网页文件
    """
    candidates = [
        os.environ.get("PORTFOLIO_SRC"),
        "/mnt/user-data/uploads/网页文件",
        os.path.expanduser("~/Desktop/网页文件"),
        os.path.expanduser("~/Desktop/web-source"),
    ]
    for c in candidates:
        if c and os.path.isdir(os.path.expanduser(c)):
            return os.path.expanduser(c)
    raise SystemExit(
        "Cannot find the source folder.\n"
        "Point PORTFOLIO_SRC at the folder that holds one subfolder per "
        "project, e.g.\n"
        "    set PORTFOLIO_SRC=C:\\Users\\Pei\\Desktop\\网页文件"
    )


SRC = _source_folder()
ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "images", "gal")
MANIFEST = os.path.join(ROOT, "src", "data", "galleries.js")

# A gallery row is at most 1604px wide and a single image in it commonly lands
# near 800px, so 2000 keeps it sharp at 1x and close at 2x. Sources smaller than
# this are left alone — thumbnail() only ever shrinks.
LONG_EDGE = 2000
QUALITY = 80
EXT = (".jpg", ".jpeg", ".png", ".webp")

# ---- row packing -----------------------------------------------------------
SHELL = 1604          # 1700px shell minus the 48px gutters
GAP = 26              # matches --gap in .shotRow
TARGET_H = 470        # close a row once its height would drop to about this
MAX_PER_ROW = 4

# ---- slots -----------------------------------------------------------------
# slot -> (source folder, work id in site.js)
SLOTS = {
    "work-ai-01":      ("ai-hyperion/bikura",      "ai-bikura"),
    "work-ai-02":      ("ai-hyperion/shrike",      "ai-shrike"),
    "work-ai-03":      ("ai-hyperion/semfa",       "ai-semfa"),
    "work-ai-04":      ("ai-hyperion/tuk",         "ai-tuk"),
    "work-ai-05":      ("ai-hyperion/environment", "ai-environment"),
    "work-film-01":    ("inversion",               "film-inversion"),
    "work-film-02":    ("she-is-just-her",         "film-she-is-just-her"),
    "work-film-03":    ("go-fish",                 "film-go-fish"),
    "work-theater-01": ("arcadia",                 "theater-arcadia"),
    "work-theater-02": ("anarchist",               "theater-anarchist"),
    "work-theater-03": ("dance-light",             "theater-dance-light"),
    "work-theater-04": ("hanging-garden",          "theater-hanging-garden"),
    "work-theater-05": ("love-and-money",          "theater-love-and-money"),
}

# ---- captions --------------------------------------------------------------
# Keyed by source filename (without extension, lowercased). Only the Hyperion
# process boards carry captions: a production photograph does not need one, but
# a research board, a sketch sheet or a node graph is unreadable without a
# label saying what you are looking at. Everything not listed here ships
# without a caption.
CAPTIONS = {
    # bikura
    "bikura-research": "Research — silhouette, texture and culture studies",
    "bikura-sketch": "Selected sketches",
    # shrike
    "shrike": "Research — the brief, and the reference that answered it",
    "shrike-sketch": "Selected sketches",
    # semfa
    "hyperion_chatgpt images 2.0 edit_2026-04-30_09-01-26":
        "Base layer — turnaround under the chiffon",
    "ce81a263-d68b-48da-97e9-a795e7f6340b":
        "Node graph — staging the scene and ageing the costume",
    # tuk
    "tuk-research": "Research — gorpcore, techwear, rag and tent",
    "tuk-sketch": "Selected sketches",
    "workflow": "LoRA trained in Krea — sketch, prompt, model, output",
    "0006ab06-52b1-44d8-af55-112a6fcad70b": "Node graph — the prompt chain",
    "096f1d32-58a1-4452-a9b8-dbf7c49f12ee": "The same graph, all of it",
    # environment
    "enviornment": "Selected sketches — tents, cave mouths, weather",
    "enviroment": "Scenic research — lightning field, ash from a burnt-out fire",
}


# ---- sections --------------------------------------------------------------
# A project whose Gallery/ is split into subfolders can have those subfolders
# become titled sections, in a stated order, with a rule between them. Keys are
# the subfolder names as they appear on disk, matched case-insensitively; the
# value is (heading, right-hand note). A subfolder not listed here, or a project
# not listed at all, just runs as one untitled section.
SECTIONS = {
    "work-theater-03": {              # Dance / Light — four pieces, four
        "order": ["olivia", "daniel", "justinbiber", "spark"],
        "titles": {
            "olivia": ("Olivia Ruhnke", "2026"),
            "daniel": ("Daniel Bamdad", "2026"),
            # the folder is named after the music, not the choreographer
            "justinbiber": ("Benji Santiago", "2024"),
            "spark": ("Kiara Lee", "2024"),
        },
    },
}


def section_key(path, base):
    """The immediate subfolder under Gallery/, lowercased. '' if none."""
    rel = os.path.relpath(path, base).replace("\\", "/").split("/")
    # rel[0] is the Gallery folder itself
    return rel[1].lower() if len(rel) > 2 else ""


def caption_for(path):
    return CAPTIONS.get(os.path.splitext(os.path.basename(path))[0].lower(), "")


def natural_key(p):
    """Sort 2.jpg before 10.jpg, and keep subfolders grouped."""
    return [int(t) if t.isdigit() else t.lower()
            for t in re.split(r"(\d+)", p)]


def digest(path):
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


def pack(ratios):
    """Group indices into rows whose height lands near TARGET_H.

    A row of k images with ratios summing to S is (SHELL - GAP*(k-1)) / S tall.
    Images are added until adding the next one would take the row below
    TARGET_H; the row that ends closer to the target wins.
    """
    rows, row, i = [], [], 0
    while i < len(ratios):
        row.append(i)
        s = sum(ratios[j] for j in row)
        h = (SHELL - GAP * (len(row) - 1)) / s
        if h <= TARGET_H or len(row) >= MAX_PER_ROW:
            # would dropping the last one land closer to the target?
            if len(row) > 1:
                s0 = s - ratios[row[-1]]
                h0 = (SHELL - GAP * (len(row) - 2)) / s0
                if abs(h0 - TARGET_H) < abs(h - TARGET_H):
                    row.pop()
                    i -= 1
            rows.append(row)
            row = []
        i += 1
    if row:
        rows.append(row)
    return rows


def row_height(row):
    k = len(row["shots"])
    grow = sum(s["r"] for s in row["shots"]) + row.get("pad", 0)
    return round((SHELL - GAP * (k - 1)) / grow)


def add_tail_pad(rows):
    """Stop a short final row from ballooning.

    The packer fills every row but the last, so the last one can end up with a
    single image stretched across the full width — a 900px-tall photograph in a
    page of 450px ones. A phantom flex-grow at the end of that row holds the
    images to the height of the row above and leaves the remainder empty, which
    is what a justified gallery is supposed to do with its last line.
    """
    if len(rows) < 1:
        return
    last = rows[-1]
    target = row_height(rows[-2]) if len(rows) > 1 else TARGET_H
    natural = row_height(last)
    if natural <= target * 1.12:
        return
    k = len(last["shots"])
    want = (SHELL - GAP * (k - 1)) / target
    last["pad"] = round(want - sum(s["r"] for s in last["shots"]), 4)


def main():
    os.makedirs(OUT, exist_ok=True)
    for stale in glob.glob(os.path.join(OUT, "*.jpg")):
        os.remove(stale)

    manifest, report = {}, []

    for slot, (folder, work_id) in SLOTS.items():
        base = os.path.join(SRC, folder)
        cover = sorted(f for f in glob.glob(os.path.join(base, "*"))
                       if os.path.isfile(f) and f.lower().endswith(EXT))
        cover_hash = digest(cover[0]) if cover else None

        files = [f for f in glob.glob(os.path.join(base, "[Gg]allery", "**", "*"),
                                      recursive=True)
                 if os.path.isfile(f)]
        skipped_media = [f for f in files if not f.lower().endswith(EXT)]
        files = sorted((f for f in files if f.lower().endswith(EXT)),
                       key=natural_key)
        files = [f for f in files if digest(f) != cover_hash]

        if not files:
            report.append(f"{work_id:<24} —      no Gallery folder"
                          if not os.path.isdir(os.path.join(base, "Gallery"))
                          and not os.path.isdir(os.path.join(base, "gallery"))
                          else f"{work_id:<24} —      Gallery folder is empty")
            continue

        # group by subfolder, in the configured order; anything unlisted keeps
        # its natural sort position after the named ones
        cfg = SECTIONS.get(slot, {})
        order = cfg.get("order", [])
        groups = {}
        for f in files:
            groups.setdefault(section_key(f, base), []).append(f)
        keys = [k for k in order if k in groups] + \
               [k for k in groups if k not in order]

        # The file NUMBER comes from the natural sort, not from the section
        # order, so grouping or reordering sections never renames a single
        # image on disk. What a visitor sees numbered 01, 02, … is the render
        # order, which is computed at display time.
        number = {f: i for i, f in enumerate(files, 1)}

        sections, heights = [], []
        for key in keys:
            shots = []
            for src in groups[key]:
                im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
                im.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)
                name = f"{slot}-g{number[src]:02d}.jpg"
                im.save(os.path.join(OUT, name), "JPEG",
                        quality=QUALITY, optimize=True, progressive=True)
                shots.append({
                    "src": f"/images/gal/{name}",
                    "caption": caption_for(src),
                    "r": round(im.size[0] / im.size[1], 4),
                })

            # each section is packed on its own, so a row never straddles two
            # pieces and every section ends on a flush line
            rows = [{"shots": [shots[i] for i in r]}
                    for r in pack([s["r"] for s in shots])]
            add_tail_pad(rows)
            heights += [row_height(r) for r in rows]

            title, note = cfg.get("titles", {}).get(key, (None, None))
            section = {"rows": rows}
            if title:
                section["title"] = title
                if note:
                    section["note"] = note
            sections.append(section)

        manifest[work_id] = sections

        titled = sum(1 for x in sections if x.get("title"))
        report.append(f"{work_id:<24} {len(files):>3} images, {len(heights):>2} rows"
                      f"  row heights {min(heights)}–{max(heights)}px"
                      + (f", {titled} sections" if titled else "")
                      + (f"  (skipped {len(skipped_media)} video)" if skipped_media else ""))

    body = json.dumps(manifest, indent=2, ensure_ascii=False)
    with open(MANIFEST, "w", encoding="utf-8") as f:
        f.write(
            "/* GENERATED by tools/build_galleries.py — do not edit by hand.\n"
            "\n"
            "   galleries[workId] = [ section, ... ]\n"
            "     section = { title?, note?, rows: [ { shots, pad? }, ... ] }\n"
            "\n"
            "   A gallery is a list of SECTIONS. Most projects have exactly one,\n"
            "   untitled. A project whose Gallery/ folder is split into subfolders\n"
            "   (Dance / Light — one per piece) gets one titled section each, with\n"
            "   a rule between them; rows are packed inside a section so a row\n"
            "   never straddles two pieces.\n"
            "\n"
            "   Inside a section each entry is one justified row, and `r` is the\n"
            "   image's aspect ratio, which CSS uses as flex-grow so a row's images\n"
            "   share the width in proportion and all come out the same height.\n"
            "   Nothing is cropped. A hand-written `gallery` in workDetails.js\n"
            "   overrides the entry here; anything else falls through to this file.\n"
            "*/\n\n"
            f"export const galleries = {body}\n"
        )

    total = sum(len(r["shots"]) for secs in manifest.values()
                for sec in secs for r in sec["rows"])
    print("\n".join(report))
    print(f"\n{len(manifest)} galleries, {total} images -> "
          f"{os.path.relpath(MANIFEST, ROOT)}")


if __name__ == "__main__":
    main()
