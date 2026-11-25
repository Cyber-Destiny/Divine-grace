"""Prepare a panorama image for the virtual tour.

Usage:
  python3 tools/process_panorama.py <input> <slug>                 full 360 (2:1) image
  python3 tools/process_panorama.py <input> <slug> --partial       2:1 image whose left and
                                                                    right edges do not meet
  python3 tools/process_panorama.py <input> <slug> --segments 0.47-1,0-0.15
        keep only these horizontal slices (fractions of the width), joined in order;
        use this to cut out a section that repeats. The result is a partial view.

Writes assets/tour/<slug>.jpg (max 4096 px wide, the largest phones can show in 3D),
assets/tour/<slug>-thumb.jpg, and prints the "haov" value to put in js/config.js.
"""
import argparse
import os

import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "assets", "tour")
SEAM = 64  # columns blended on each side of the wrap-around seam of a full 360


def blend_seam(img):
    a = np.asarray(img.convert("RGB"), dtype=np.float32)
    left, right = a[:, 0, :].copy(), a[:, -1, :].copy()
    mid = (left + right) / 2
    for i in range(SEAM):
        w = (1 - i / SEAM) ** 2
        a[:, i, :] += (mid - left) * w
        a[:, -1 - i, :] += (mid - right) * w
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("slug")
    ap.add_argument("--partial", action="store_true")
    ap.add_argument("--segments")
    args = ap.parse_args()

    img = Image.open(args.src).convert("RGB")
    w, h = img.size
    full_haov = 360.0 * (w / h) / 2  # a 2:1 image covers 360 degrees

    if args.segments:
        parts = []
        for seg in args.segments.split(","):
            a, b = (float(x) for x in seg.split("-"))
            parts.append(img.crop((round(a * w), 0, round(b * w), h)))
        width = sum(p.width for p in parts)
        joined = Image.new("RGB", (width, h))
        x = 0
        for p in parts:
            joined.paste(p, (x, 0))
            x += p.width
        img, haov = joined, full_haov * width / w
    elif args.partial:
        haov = min(full_haov, 358.0)
    else:
        img, haov = blend_seam(img), 360.0

    scale = min(1.0, 4096 / img.width, 2048 / img.height * (360 / max(haov, 1)) if haov < 360 else 2048 / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    img.save(os.path.join(OUT, f"{args.slug}.jpg"), quality=84, optimize=True, progressive=True)

    cx, cy = img.width // 2, img.height // 2
    tw = min(img.width, img.height)
    thumb = img.crop((cx - tw // 2, cy - tw // 4, cx + tw // 2, cy + tw // 4)).resize((480, 240), Image.LANCZOS)
    thumb.save(os.path.join(OUT, f"{args.slug}-thumb.jpg"), quality=78, optimize=True)
    size = os.path.getsize(os.path.join(OUT, f"{args.slug}.jpg")) // 1024
    print(f"assets/tour/{args.slug}.jpg  {img.width}x{img.height}  {size} KB  haov={haov:.1f}")


if __name__ == "__main__":
    main()
