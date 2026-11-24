"""Build the 1200x630 social-share image (assets/og-image.jpg) from site photos.

Usage:  python3 tools/make_og_image.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(__file__), "..")
IMG = os.path.join(ROOT, "assets", "img")


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def main():
    W, H = 1200, 630
    og = Image.new("RGB", (W, H), (12, 14, 26))
    x = 560
    for slug in ["executive-1", "hall-wide", "lounge-violet"]:
        panel = Image.open(os.path.join(IMG, slug + ".webp")).convert("RGB")
        panel = panel.resize((200, int(panel.height * 200 / panel.width)), Image.LANCZOS).crop((0, 0, 200, 530))
        og.paste(panel, (x, 50))
        x += 212
    d = ImageDraw.Draw(og)
    serif = font("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 64)
    sans = font("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    d.text((60, 210), "Divine Grace", font=serif, fill=(243, 237, 226))
    d.text((60, 290), "Hotel", font=serif, fill=(212, 175, 106))
    d.line((60, 385, 200, 385), fill=(212, 175, 106), width=2)
    d.text((60, 400), "Suites  ·  Event Hall  ·  Restaurant", font=sans, fill=(190, 186, 200))
    og.save(os.path.join(ROOT, "assets", "og-image.jpg"), quality=85)


if __name__ == "__main__":
    main()
