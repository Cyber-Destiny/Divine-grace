"""Turn the raw phone photos into web-ready WebP files.

Usage:  python3 tools/optimize_images.py <folder-with-originals>

Each entry in MAP is  output-slug : original-filename-prefix.
Two sizes are written per photo:  <slug>.webp (full) and <slug>-sm.webp (thumb).
"""
import sys, os
from PIL import Image, ImageOps, ImageFilter

MAP = {
    # Standard room
    "standard-blue": "9d322e02", "standard-ruby": "fe94aaff",
    "standard-bed-violet": "3a0de17e", "standard-bed-blue": "4027735d",
    "standard-bed-ruby": "e60221a8", "standard-blinds": "d6474aaa",
    "standard-desk": "d09b1a51", "wardrobe": "1a2e20f2",
    # Executive room
    "executive-1": "3cab52f6", "executive-2": "2cb4006d",
    "executive-3": "8dc5d5ec", "executive-bed": "bd374e3d",
    # Deluxe studio
    "studio-emerald": "43b42b21", "studio-sapphire": "6314e6cb",
    "studio-wide-emerald": "2a870443", "studio-wide-ruby": "b636e8f3",
    "studio-emerald-2": "065aad25", "studio-ruby": "c701c55f",
    "studio-blue": "ba7e2d54",
    # Grace suite (separate living room)
    "suite-living": "14972158", "suite-living-2": "fb674a29",
    "suite-living-door": "9c7cec55", "suite-entrance": "a54350a1",
    # Bathrooms
    "bath-shower": "65a61208", "bath-full": "6f94c530",
    # Grand hall
    "hall-wide": "a675c347", "hall-wide-2": "eec96637",
    "hall-side": "f19572de", "hall-stage": "9b5d321a",
    "hall-gallery-view": "26dd130b",
    # Restaurant & cafe
    "dining-1": "1456850c", "dining-2": "a443a205", "dining-3": "37f2c283",
    "dining-4": "9aae613e", "dining-5": "c6a868e8", "dining-6": "3c47b971",
    "dining-7": "c5f72943", "dining-8": "053eab49",
    # Velvet lounge
    "lounge-violet": "0e7e5575", "lounge-ruby": "73bc2008",
    "lounge-blue": "b84bc279", "lounge-deep-blue": "41f3bd24",
    "lounge-deep-ruby": "eab5b56c",
    # Pearl lounge
    "pearl-blue": "de9d9c87", "pearl-green": "8f1440de", "pearl-violet": "83286698",
    # Security & access
    "sec-card": "4eec6fff", "sec-lock": "7b91939b", "sec-handle": "0a8a023c",
    "sec-intercom": "6f05e556", "sec-cctv": "109ae151",
    "sec-corridor": "358d8438", "door-301": "813b8638",
    # Team
    "team-1": "03a76500", "team-2": "a3c4393a", "team-3": "8322e3af",
    "team-ladies": "1dcdf073", "team-managers": "22a78a0d",
}

FULL_W, THUMB_W = 1080, 480


def save(im, path, width, quality):
    if im.width > width:
        h = round(im.height * width / im.width)
        im = im.resize((width, h), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=45, threshold=2))
    im.save(path, "WEBP", quality=quality, method=6)
    return im.size


def main(src):
    out = os.path.join(os.path.dirname(__file__), "..", "assets", "img")
    files = os.listdir(src)
    sizes = {}
    for slug, prefix in MAP.items():
        name = next(f for f in files if f.startswith(prefix))
        im = ImageOps.exif_transpose(Image.open(os.path.join(src, name))).convert("RGB")
        sizes[slug] = save(im, os.path.join(out, slug + ".webp"), FULL_W, 80)
        save(im, os.path.join(out, slug + "-sm.webp"), THUMB_W, 72)
    for k, v in sizes.items():
        print(k, v)


if __name__ == "__main__":
    main(sys.argv[1])
