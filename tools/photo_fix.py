"""Colour and exposure fixes used by optimize_images.py.

neutral_light(): rooms photographed under blue/purple LED strips. Stretches each
colour channel, takes the colour cast out of the blue-violet range and the
brightest spots, and lifts the shadows, so the room looks as it does with the
white ceiling lights on.
daylight(): outdoor shots taken against the sun. Clears some haze and adds a
little contrast and colour.
lift_faces(): group photos with the sun behind people. Brightens shadows
(faces under caps) without blowing out the white walls.
"""
import cv2
import numpy as np
from PIL import Image


def _arr(im):
    return np.asarray(im.convert("RGB"))


def neutral_light(im, keep=0.18, gamma=0.92):
    a = _arr(im).astype(np.float32)
    # black point per channel, white point from the brightest unclipped surfaces
    # (sheets, walls, ceiling), so whites come out white
    lo = np.array([np.percentile(a[..., c], 0.6) for c in range(3)])
    lum = a.mean(axis=2)
    ok = (a.min(axis=2) < 248) & (lum > np.percentile(lum, 96))   # skip bare lamps
    white = a[ok].mean(axis=0) if ok.sum() > 500 else np.array([np.percentile(a[..., c], 99.5) for c in range(3)])
    gain = 238 / np.maximum(white - lo, 1)
    gain = np.minimum(gain, gain.min() * 2.6)
    a = np.clip((a - lo) * gain, 0, 255).astype(np.uint8)

    hsv = cv2.cvtColor(a, cv2.COLOR_RGB2HSV).astype(np.float32)
    h, s, v = hsv[..., 0] * 2, hsv[..., 1], hsv[..., 2] / 255
    blue = np.clip(1 - np.abs(h - 262) / 80, 0, 1) ** 0.6       # blue..violet..magenta
    bright = np.clip((v - 0.8) / 0.2, 0, 1)                      # lamps and glare
    hsv[..., 1] = s * (1 - blue * (1 - keep)) * (1 - bright * 0.8)
    hsv[..., 2] = np.power(v, gamma) * 255
    out = cv2.cvtColor(np.clip(hsv, 0, 255).astype(np.uint8), cv2.COLOR_HSV2RGB)
    return Image.fromarray(out)


def daylight(im, clip=1.6, sat=1.12):
    a = _arr(im)
    lab = cv2.cvtColor(a, cv2.COLOR_RGB2LAB)
    l = lab[..., 0]
    cl = cv2.createCLAHE(clipLimit=clip, tileGridSize=(8, 8)).apply(l)
    lab[..., 0] = cv2.addWeighted(l, 0.35, cl, 0.65, 0)
    a = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    hsv = cv2.cvtColor(a, cv2.COLOR_RGB2HSV).astype(np.float32)
    hsv[..., 1] = np.clip(hsv[..., 1] * sat, 0, 255)
    return Image.fromarray(cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB))


def lift_faces(im, amount=1.0):
    a = _arr(im).astype(np.float32) / 255
    lum = cv2.GaussianBlur(a.mean(axis=2), (0, 0), 6)[..., None]
    lift = amount * np.clip(1 - lum / 0.55, 0, 1) ** 1.5   # only the darker areas
    out = np.power(a, 1 / (1 + 1.1 * lift))
    out = np.clip(out * 255, 0, 255).astype(np.uint8)
    lab = cv2.cvtColor(out, cv2.COLOR_RGB2LAB)
    lab[..., 0] = cv2.createCLAHE(clipLimit=1.3, tileGridSize=(6, 6)).apply(lab[..., 0])
    return Image.fromarray(cv2.cvtColor(lab, cv2.COLOR_LAB2RGB))
