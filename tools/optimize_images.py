"""Turn the raw phone photos into web-ready WebP files.

Usage:  python3 tools/optimize_images.py <folder-with-originals> [slug ...]

Each entry in MAP is  output-slug : original-filename-prefix.
Two sizes are written per photo:  <slug>.webp (full) and <slug>-sm.webp (thumb).
"""
import sys, os
from PIL import Image, ImageOps, ImageFilter

sys.path.insert(0, os.path.dirname(__file__))
from photo_fix import neutral_light, daylight, lift_faces  # noqa: E402

MAP = {
    # Standard suite
    "standard-blue": "9d322e02",
    "standard-bed-violet": "3a0de17e", "standard-blinds": "d6474aaa",
    "standard-desk": "d09b1a51", "wardrobe": "1a2e20f2",
    # Presidential suite bedroom
    "executive-1": "3cab52f6", "executive-bed": "bd374e3d",
    # Executive suite (bedroom + sitting area)
    "studio-sapphire": "6314e6cb", "studio-wide-ruby": "b636e8f3", "studio-blue": "ba7e2d54",
    # Presidential suite living room
    "suite-living": "14972158", "suite-living-2": "fb674a29",
    "suite-living-door": "9c7cec55", "suite-entrance": "a54350a1",
    # Bathrooms
    "bath-shower": "65a61208",
    # Grand hall
    "hall-wide": "a675c347", "hall-wide-2": "eec96637",
    "hall-side": "f19572de", "hall-stage": "9b5d321a",
    "hall-gallery-view": "26dd130b",
    # Restaurant (two different views; the others repeated these or had staff in shot)
    "dining-1": "1456850c", "dining-2": "a443a205",
    # Velvet Club
    "lounge-violet": "0e7e5575", "lounge-blue": "b84bc279",
    # Pearl Lounge
    "pearl-blue": "de9d9c87", "pearl-violet": "83286698",
    # Security & access
    "sec-card": "4eec6fff",
    "sec-intercom": "6f05e556", "sec-cctv": "109ae151", "door-301": "813b8638",
    # Team
    "team-1": "03a76500", "team-2": "a3c4393a",
    "team-ladies": "1dcdf073", "team-managers": "22a78a0d",
    # Outside, in daylight
    "outside-compound": "477b5c63", "outside-front": "de0d4962",
    "outside-rotunda": "4be79480", "outside-fountain": "1c9c2080",
    "outside-side": "afeac5c1", "outside-courtyard": "f157b14d",
    "outside-sign": "96e49b73",
}

# Rooms photographed under blue/purple LED strips: shown as they look with the white lights on
NEUTRAL = {
    "standard-blue", "standard-bed-violet", "executive-1", "executive-bed",
    "studio-sapphire", "studio-wide-ruby", "studio-blue",
    "suite-living", "suite-living-2", "suite-living-door", "suite-entrance",
    "lounge-violet", "lounge-blue", "pearl-blue", "pearl-violet",
}
DAYLIGHT = {k for k in MAP if k.startswith("outside-")}
FACES = {"team-1", "team-2", "team-ladies", "team-managers"}

# Crops (left, top, right, bottom) in pixels of the upright original
CROP = {
    "outside-compound": (300, 1300, 3000, 3000),    # cuts out a finger and the sun
    "outside-courtyard": (0, 1250, 3000, 3500),
}
WIDTH = {"outside-compound": 1920, "outside-courtyard": 1440}

FULL_W, THUMB_W = 1080, 480


def save(im, path, width, quality):
    if im.width > width:
        h = round(im.height * width / im.width)
        im = im.resize((width, h), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=45, threshold=2))
    im.save(path, "WEBP", quality=quality, method=6)
    return im.size


def main(src, only=None):
    out = os.path.join(os.path.dirname(__file__), "..", "assets", "img")
    files = os.listdir(src)
    for slug, prefix in MAP.items():
        if only and slug not in only:
            continue
        name = next(f for f in files if f.startswith(prefix))
        im = ImageOps.exif_transpose(Image.open(os.path.join(src, name))).convert("RGB")
        if slug in CROP:
            im = im.crop(CROP[slug])
        width = WIDTH.get(slug, FULL_W)
        if im.width > width * 1.5:  # fix colour at a working size, not full resolution
            im = im.resize((round(width * 1.5), round(im.height * width * 1.5 / im.width)), Image.LANCZOS)
        if slug in NEUTRAL:
            im = neutral_light(im)
        if slug in DAYLIGHT:
            im = daylight(im)
        if slug in FACES:
            im = lift_faces(im)
        size = save(im, os.path.join(out, slug + ".webp"), width, 80)
        save(im, os.path.join(out, slug + "-sm.webp"), THUMB_W, 72)
        print(slug, size)


if __name__ == "__main__":
    main(sys.argv[1], set(sys.argv[2:]) or None)
