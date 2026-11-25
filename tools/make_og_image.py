"""Build the 1200x630 social-share image (assets/og-image.jpg) from the outside photo.

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
    photo = Image.open(os.path.join(IMG, "outside-night.webp")).convert("RGB")
    scale = max(W / photo.width, H / photo.height)
    photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
    left = (photo.width - W) // 2
    og = photo.crop((left, 0, left + W, H))

    # dark fade on the left so the text reads clearly
    shade = Image.new("L", (W, H))
    for x in range(W):
        a = int(238 - x * 0.06) if x < 560 else max(0, int(204 - (x - 560) * 0.55))
        shade.paste(a, (x, 0, x + 1, H))
    og = Image.composite(Image.new("RGB", (W, H), (7, 8, 15)), og, shade)

    d = ImageDraw.Draw(og)
    serif = font("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 66)
    sans = font("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    d.text((64, 200), "Divine Grace", font=serif, fill=(243, 237, 226))
    d.text((64, 280), "Hotel", font=serif, fill=(212, 175, 106))
    d.line((64, 385, 204, 385), fill=(212, 175, 106), width=2)
    d.text((64, 402), "Suites  ·  Event Hall  ·  Restaurant", font=sans, fill=(214, 210, 222))
    og.save(os.path.join(ROOT, "assets", "og-image.jpg"), quality=86)


if __name__ == "__main__":
    main()
