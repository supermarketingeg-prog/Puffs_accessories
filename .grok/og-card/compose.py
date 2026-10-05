#!/usr/bin/env python3
"""Compose the Puffs Accessories 1200x630 share card from shop photography + crisp type."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageFont, ImageChops

ROOT = Path("/workspace")
OUT = Path("/workspace/.grok/og-card/card-raw.jpg")
FONT = Path("/workspace/.grok/og-card/fonts/PlayfairDisplay-500.ttf")

CREAM = (246, 239, 230)
IVORY = (251, 247, 241)
ESPRESSO = (42, 33, 24)
GOLD = (176, 141, 87)
TAUPE = (138, 122, 106)

W, H = 1200, 630


def cover_resize(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    tw, th = size
    scale = max(tw / im.width, th / im.height)
    nw, nh = max(1, round(im.width * scale)), max(1, round(im.height * scale))
    im = im.convert("RGB").resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return im.crop((left, top, left + tw, top + th))


def grade_cream(im: Image.Image, cream_mix: float = 0.28) -> Image.Image:
    im = ImageEnhance.Color(im).enhance(0.88)
    im = ImageEnhance.Brightness(im).enhance(1.06)
    im = ImageEnhance.Contrast(im).enhance(0.96)
    cream = Image.new("RGB", im.size, CREAM)
    return Image.blend(im, cream, cream_mix)


def hfeather(im: Image.Image, side: str, feather: int) -> Image.Image:
    """RGB image → RGBA with a horizontal fade on `side` ('left' or 'right')."""
    rgba = im.convert("RGBA")
    alpha = Image.new("L", rgba.size, 255)
    px = alpha.load()
    w, h = rgba.size
    for x in range(w):
        if side == "right":
            t = 1.0 if x < w - feather else max(0.0, (w - x) / feather)
        else:
            t = 1.0 if x > feather else max(0.0, x / feather)
        # ease
        t = t * t * (3 - 2 * t)
        for y in range(h):
            px[x, y] = int(255 * t)
    rgba.putalpha(alpha)
    return rgba


def v_vignette(base: Image.Image, strength: float = 0.22) -> Image.Image:
    overlay = Image.new("RGB", base.size, ESPRESSO)
    mask = Image.new("L", base.size, 0)
    m = mask.load()
    cx, cy = base.size[0] / 2, base.size[1] / 2
    max_r = (cx ** 2 + cy ** 2) ** 0.5
    for y in range(base.size[1]):
        for x in range(base.size[0]):
            nx = (x - cx) / cx
            ny = (y - cy) / cy
            r = (nx * nx + ny * ny) ** 0.5
            # only darken the outer rim
            t = max(0.0, (r - 0.72) / 0.55)
            t = min(1.0, t)
            m[x, y] = int(255 * strength * t)
    return Image.composite(overlay, base, mask)


def tracked_width(font: ImageFont.FreeTypeFont, text: str, tracking: int) -> int:
    total = 0
    for i, ch in enumerate(text):
        bbox = font.getbbox(ch)
        total += bbox[2] - bbox[0]
        if i < len(text) - 1:
            total += tracking
    return total


def draw_tracked(
    canvas: Image.Image,
    text: str,
    center: tuple[float, float],
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    tracking: int,
    shadow: tuple[int, int, tuple[int, int, int, int]] | None = None,
) -> tuple[int, int, int, int]:
    """Draw tracked text centered on `center`. Returns bounding box."""
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    width = tracked_width(font, text, tracking)
    bbox0 = font.getbbox(text[0])
    height = bbox0[3] - bbox0[1]
    # Use first-glyph top as y origin; center using measured width
    x = center[0] - width / 2
    # vertically center using the font's ascent/descent of a typical cap
    probe = font.getbbox("H")
    cap_h = probe[3] - probe[1]
    y = center[1] - cap_h / 2 - probe[1]
    cursor = x
    for i, ch in enumerate(text):
        if shadow:
            sx, sy, sc = shadow
            d.text((cursor + sx, y + sy), ch, font=font, fill=sc)
        d.text((cursor, y), ch, font=font, fill=fill + (255,))
        cursor += font.getbbox(ch)[2] - font.getbbox(ch)[0]
        if i < len(text) - 1:
            cursor += tracking
    canvas.alpha_composite(overlay)
    return (int(x), int(y), int(x + width), int(y + cap_h))


def gold_rule(canvas: Image.Image, cy: int, half_w: int = 110, thickness: int = 1) -> None:
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    x0, x1 = W // 2 - half_w, W // 2 + half_w
    for i in range(thickness):
        d.line([(x0, cy + i), (x1, cy + i)], fill=GOLD + (210,), width=1)
    # fade the ends
    fade = Image.new("L", canvas.size, 0)
    fd = ImageDraw.Draw(fade)
    fd.rectangle([x0, cy - 2, x1, cy + thickness + 2], fill=255)
    # end fades
    for x in range(36):
        a = int(255 * (x / 36))
        fd.rectangle([x0 + x, cy - 2, x0 + x, cy + thickness + 2], fill=a)
        fd.rectangle([x1 - x, cy - 2, x1 - x, cy + thickness + 2], fill=a)
    overlay.putalpha(ImageChops.multiply(overlay.split()[-1], fade))
    canvas.alpha_composite(overlay)


def pearl(canvas: Image.Image, cx: int, cy: int, r: int) -> None:
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    # gold bezel
    d.ellipse([cx - r - 2, cy - r - 2, cx + r + 2, cy + r + 2], fill=GOLD + (235,))
    # body
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(238, 228, 214, 255))
    # shading
    d.ellipse(
        [cx - r + 2, cy - r + int(r * 0.35), cx + r - 2, cy + r - 1],
        fill=(210, 196, 178, 70),
    )
    # highlight
    hr = max(2, int(r * 0.32))
    d.ellipse(
        [cx - int(r * 0.38) - hr, cy - int(r * 0.42) - hr, cx - int(r * 0.38) + hr, cy - int(r * 0.42) + hr],
        fill=(255, 252, 247, 210),
    )
    canvas.alpha_composite(overlay)


def compose() -> Image.Image:
    neck = Image.open(ROOT / "public/images/cat-necklaces.jpg")
    ears = Image.open(ROOT / "public/images/cat-earrings.jpg")
    hoops = Image.open(ROOT / "public/images/cat-earrings.jpg")

    # Photographic silk: a blurred, cream-graded band of the earring still-life.
    silk_src = cover_resize(ears, (W + 80, H + 80)).crop((40, 40, 40 + W, 40 + H))
    silk_src = silk_src.filter(ImageFilter.GaussianBlur(18))
    silk_src = grade_cream(silk_src, 0.42)
    canvas_rgb = v_vignette(silk_src, 0.16)

    # Soft ivory wash in the lockup well so type stays crisp.
    wash = Image.new("RGB", (W, H), IVORY)
    wash_mask = Image.new("L", (W, H), 0)
    wd = ImageDraw.Draw(wash_mask)
    wd.ellipse([W * 0.18, H * 0.12, W * 0.82, H * 0.88], fill=255)
    wash_mask = wash_mask.filter(ImageFilter.GaussianBlur(48))
    canvas_rgb = Image.composite(wash, canvas_rgb, ImageEnhance.Brightness(wash_mask).enhance(0.55))

    canvas = canvas_rgb.convert("RGBA")

    # Left still-life: pearl necklaces, feathered into the silk well.
    left = cover_resize(neck, (520, H))
    left = grade_cream(left, 0.04)
    left = hfeather(left, "right", 130)
    canvas.alpha_composite(left, dest=(0, 0))

    # Right still-life: gold and pearl earrings, feathered in from the right.
    right = cover_resize(hoops, (520, H))
    right = grade_cream(right, 0.04)
    right = hfeather(right, "left", 130)
    canvas.alpha_composite(right, dest=(W - 520, 0))

    # Gold hairlines and lockup — middle of the frame, generous margins.
    font_title = ImageFont.truetype(str(FONT), 168)
    font_tag = ImageFont.truetype(str(FONT), 24)

    title_tracking = 44
    tag_tracking = 16
    title_w = tracked_width(font_title, "PUFFS", title_tracking)
    tag_w = tracked_width(font_tag, "ACCESSORIES", tag_tracking)
    # Bound: half to two-thirds of the frame.
    assert 600 <= title_w <= 800, f"title width {title_w} out of lockup bound"

    gold_rule(canvas, 222, half_w=112)
    title_box = draw_tracked(
        canvas,
        "PUFFS",
        (W / 2, 328),
        font_title,
        ESPRESSO,
        title_tracking,
        shadow=(0, 2, (251, 247, 241, 170)),
    )
    draw_tracked(
        canvas,
        "ACCESSORIES",
        (W / 2, 430),
        font_tag,
        GOLD,
        tag_tracking,
    )
    gold_rule(canvas, 468, half_w=112)

    # Tiny pearl punctuation — echoes the favicon, does not cover glyphs.
    pearl(canvas, W // 2 - 190, 222, 6)
    pearl(canvas, W // 2 + 190, 222, 6)
    pearl(canvas, W // 2, 468, 5)

    print("title_box", title_box, "title_w", title_w, "tag_w", tag_w)
    print("title vertical span", title_box[1], title_box[3], "frame middle-half", H * 0.25, H * 0.75)
    return canvas.convert("RGB")


def main() -> None:
    card = compose()
    assert card.size == (W, H)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    card.save(OUT, "JPEG", quality=94, subsampling=1, optimize=True)
    print("wrote", OUT, OUT.stat().st_size)


if __name__ == "__main__":
    main()
