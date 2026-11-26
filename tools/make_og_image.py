"""Build the 1200x630 social-share image (assets/og-image.jpg) from the daytime outside photo.

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
    photo = Image.open(os.path.join(IMG, "outside-compound.webp")).convert("RGB")
    scale = max(W / photo.width, H / photo.height)
    photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
    left = photo.width - W            # keep the right side: rotunda and fountain
    top = (photo.height - H) // 2
    og = photo.crop((left, top, left + W, top + H))

    # warm ivory fade on the left so the text reads clearly
    shade = Image.new("L", (W, H))
    for x in range(W):
        a = 240 if x < 540 else max(0, int(240 - (x - 540) * 0.8))
        shade.paste(a, (x, 0, x + 1, H))
    og = Image.composite(Image.new("RGB", (W, H), (251, 248, 242)), og, shade)

    d = ImageDraw.Draw(og)
    serif = font("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 66)
    sans = font("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    d.text((64, 196), "Divine Grace", font=serif, fill=(31, 29, 36))
    d.text((64, 282), "Lodging · Dining · Events", font=sans, fill=(143, 109, 47))
    d.line((64, 342, 204, 342), fill=(180, 143, 76), width=2)
    d.text((64, 362), "Omu-Aran, Kwara State", font=sans, fill=(80, 76, 90))
    og.save(os.path.join(ROOT, "assets", "og-image.jpg"), quality=86)


if __name__ == "__main__":
    main()
