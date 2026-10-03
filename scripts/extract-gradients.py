"""Extract clean, text-free gradients from the Odyssey reference screenshots.

Source images were the Odyssey reference screenshots (paths below are local to the
machine they were generated on). Text is removed by detecting pixels brighter than the local background,
dilating that mask and harmonically filling it from the surrounding
gradient. The result is de-grained, upscaled and re-grained at output
resolution so it stays crisp on large screens.
"""
from PIL import Image
import numpy as np

A = "/Users/naveen/.t3/userdata/attachments/889a926e-e933-417d-bfae-fda04ac15066-"
HERO = A + "a7eb0a90-1fad-4624-86b2-c017fe96b18c.png"
POST = A + "62536142-d5a4-401e-ba17-08872ec45e66.png"
OUT = "/tmp/cs/out/"


def box_blur(a, r):
    """Separable box blur on HxW or HxWxC float arrays (edge-padded)."""
    if r <= 0:
        return a
    k = 2 * r + 1
    for axis in (0, 1):
        pad = [(0, 0)] * a.ndim
        pad[axis] = (r + 1, r)
        p = np.pad(a, pad, mode="edge")
        c = np.cumsum(p, axis=axis)
        sl_hi = [slice(None)] * a.ndim
        sl_lo = [slice(None)] * a.ndim
        sl_hi[axis] = slice(k, None)
        sl_lo[axis] = slice(0, -k)
        a = (c[tuple(sl_hi)] - c[tuple(sl_lo)]) / k
    return a


def gauss(a, r):
    for _ in range(3):
        a = box_blur(a, r)
    return a


def lum(a):
    return a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114


def dilate(m, r):
    return box_blur(m.astype(float), r) > 1e-6


def remove_text(img, bbox, thresh=10, grow=3, iters=4000, solid=None):
    """Fill bright text strokes inside bbox (x0,y0,x1,y1) from surroundings."""
    x0, y0, x1, y1 = bbox
    mask = np.zeros(img.shape[:2], bool)
    smooth = gauss(img, 1)
    for _ in range(3):
        keep = (~mask).astype(float)
        bg = gauss(smooth * keep[..., None], 8) / np.maximum(gauss(keep, 8), 1e-6)[..., None]
        diff = lum(smooth) - lum(bg)
        m = np.zeros_like(mask)
        m[y0:y1, x0:x1] = diff[y0:y1, x0:x1] > thresh
        mask = m | mask
    mask = dilate(mask, grow)
    if solid is not None:
        sx0, sy0, sx1, sy1 = solid
        mask[sy0:sy1, sx0:sx1] = True
    out = img.copy()
    # initialise holes with the masked-out background estimate
    keep = (~mask).astype(float)
    bg = gauss(img * keep[..., None], 10) / np.maximum(gauss(keep, 10), 1e-6)[..., None]
    out[mask] = bg[mask]
    # Jacobi iterations of the Laplace equation inside the hole
    ys, xs = np.where(mask)
    for _ in range(iters):
        p = np.pad(out, ((1, 1), (1, 1), (0, 0)), mode="edge")
        avg = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4
        out[ys, xs] = avg[ys, xs]
    return out, mask


def finish(img, size, blur=5, grain=4.5, seed=7):
    """De-grain, upscale and re-grain. size=(w,h)."""
    smooth = gauss(img, blur)
    im = Image.fromarray(np.clip(smooth, 0, 255).astype(np.uint8)).resize(size, Image.BICUBIC)
    a = np.array(im).astype(float)
    rng = np.random.default_rng(seed)
    n = rng.normal(0, grain, a.shape[:2])[..., None]
    a = a + n
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


if __name__ == "__main__":
    import os

    os.makedirs(OUT, exist_ok=True)

    hero = np.array(Image.open(HERO).convert("RGB")).astype(float)
    clean, mask = remove_text(hero, (380, 208, 594, 296), solid=(308, 210, 388, 294))
    Image.fromarray(np.clip(clean, 0, 255).astype(np.uint8)).save(OUT + "_hero-clean-raw.png")

    posters = np.array(Image.open(POST).convert("RGB")).astype(float)
    left = posters[114:316, 136:332].copy()
    Image.fromarray(np.clip(left, 0, 255).astype(np.uint8)).save(OUT + "_left-clean-raw.png")
    right = posters[114:342, 569:765].copy()
    right_clean, _ = remove_text(right, (0, 0, 1, 1), solid=(166, 0, 196, 28))
    Image.fromarray(np.clip(right_clean, 0, 255).astype(np.uint8)).save(OUT + "_right-clean-raw.png")

    # measure grain of reference in a flat dark patch
    patch = hero[380:480, 780:880]
    print("grain std", (patch - gauss(patch, 6)).std())

    finish(clean, (2400, 1350), blur=4, grain=5).save(OUT + "gradient-horizon.jpg", quality=90)
    finish(np.ascontiguousarray(clean[:, ::-1]), (2400, 1350), blur=4, grain=5, seed=3).save(OUT + "gradient-horizon-flip.jpg", quality=90)
    finish(left, (1400, 1443), blur=3, grain=5, seed=11).save(OUT + "gradient-tide.jpg", quality=90)
    finish(right_clean, (1400, 1629), blur=3, grain=5, seed=13).save(OUT + "gradient-depth.jpg", quality=90)
