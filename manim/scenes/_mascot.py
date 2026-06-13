"""Cute mascots for lesson videos, drawn in pure Manim shapes.

A small rotating cast (fox, owl, cat, dog, alien, pencil) lives in a corner of
the frame, blinks on its own, and does a quick beat (think / cheer / spin) at
natural moments so it adds personality without stealing focus.

Build one with `mascot_for(seed)`; animate with the beat helpers, each of which
calls `scene.play(...)` directly and lasts well under a second.
"""
from __future__ import annotations

import numpy as np
from manim import (
    VGroup, Circle, Ellipse, Polygon, Line, Dot, ArcBetweenPoints, RoundedRectangle,
    Rotate, Wiggle, GrowFromCenter,
    WHITE, ORANGE, GREY_BROWN, GREEN, YELLOW, PINK, GOLD,
    UP, DOWN, TAU,
)

DARK = "#0F172A"


def _eye(cx, cy, r=0.16, pupil=0.07, look=(0.0, 0.0)):
    white = Circle(radius=r, fill_color=WHITE, fill_opacity=1, stroke_color=DARK, stroke_width=2)
    white.move_to([cx, cy, 0])
    pup = Dot(point=[cx + look[0], cy + look[1], 0], radius=pupil, color=DARK)
    shine = Dot(point=[cx + look[0] + 0.03, cy + look[1] + 0.04, 0], radius=0.02, color=WHITE)
    return VGroup(white, pup, shine)


def _smile_arc(cx, cy, w, depth, color):
    # A happy U-curve: endpoints level, middle dips down.
    left = np.array([cx - w / 2, cy + depth, 0])
    right = np.array([cx + w / 2, cy + depth, 0])
    a = ArcBetweenPoints(left, right, angle=depth * 6)
    a.set_stroke(color, 3)
    return a


def _finish(group: VGroup, eyes: VGroup) -> VGroup:
    group.eyes = eyes
    return group


def fox() -> VGroup:
    head = Circle(radius=0.7, fill_color=ORANGE, fill_opacity=1, stroke_color=DARK, stroke_width=3)
    # pointy ears
    lear = Polygon([-0.55, 0.45, 0], [-0.75, 1.15, 0], [-0.18, 0.62, 0],
                   fill_color=ORANGE, fill_opacity=1, stroke_color=DARK, stroke_width=3)
    rear = Polygon([0.55, 0.45, 0], [0.75, 1.15, 0], [0.18, 0.62, 0],
                   fill_color=ORANGE, fill_opacity=1, stroke_color=DARK, stroke_width=3)
    lin = Polygon([-0.55, 0.5, 0], [-0.66, 0.95, 0], [-0.33, 0.62, 0], fill_color=DARK, fill_opacity=0.5, stroke_width=0)
    rin = Polygon([0.55, 0.5, 0], [0.66, 0.95, 0], [0.33, 0.62, 0], fill_color=DARK, fill_opacity=0.5, stroke_width=0)
    # white muzzle
    muzzle = Ellipse(width=0.95, height=0.7, fill_color=WHITE, fill_opacity=1, stroke_width=0).shift(DOWN * 0.28)
    eyes = VGroup(_eye(-0.26, 0.12), _eye(0.26, 0.12))
    nose = Polygon([0, -0.18, 0], [-0.1, -0.04, 0], [0.1, -0.04, 0], fill_color=DARK, fill_opacity=1, stroke_width=0)
    mouth = _smile_arc(0, -0.42, 0.34, 0.12, DARK)
    cheeks = VGroup(
        Dot([-0.42, -0.18, 0], radius=0.08, color=PINK).set_opacity(0.5),
        Dot([0.42, -0.18, 0], radius=0.08, color=PINK).set_opacity(0.5),
    )
    g = VGroup(lear, rear, lin, rin, head, muzzle, cheeks, eyes, nose, mouth)
    return _finish(g, eyes)


def owl() -> VGroup:
    body = Ellipse(width=1.4, height=1.5, fill_color=GREEN, fill_opacity=1, stroke_color=DARK, stroke_width=3)
    belly = Ellipse(width=1.0, height=1.05, fill_color="#FFFBEA", fill_opacity=1, stroke_width=0).shift(DOWN * 0.12)
    ltuft = Polygon([-0.6, 0.45, 0], [-0.72, 1.0, 0], [-0.3, 0.62, 0], fill_color="#46A302", fill_opacity=1, stroke_width=0)
    rtuft = Polygon([0.6, 0.45, 0], [0.72, 1.0, 0], [0.3, 0.62, 0], fill_color="#46A302", fill_opacity=1, stroke_width=0)
    eyes = VGroup(_eye(-0.32, 0.2, r=0.24, pupil=0.1), _eye(0.32, 0.2, r=0.24, pupil=0.1))
    beak = Polygon([0, 0.0, 0], [-0.12, -0.18, 0], [0.12, -0.18, 0], fill_color=ORANGE, fill_opacity=1, stroke_color=DARK, stroke_width=1.5)
    feet = VGroup(
        Polygon([-0.25, -0.78, 0], [-0.33, -0.92, 0], [-0.17, -0.92, 0], fill_color=ORANGE, fill_opacity=1, stroke_width=0),
        Polygon([0.25, -0.78, 0], [0.17, -0.92, 0], [0.33, -0.92, 0], fill_color=ORANGE, fill_opacity=1, stroke_width=0),
    )
    g = VGroup(ltuft, rtuft, body, belly, feet, eyes, beak)
    return _finish(g, eyes)


def cat() -> VGroup:
    head = Circle(radius=0.7, fill_color=GREY_BROWN, fill_opacity=1, stroke_color=DARK, stroke_width=3)
    lear = Polygon([-0.5, 0.45, 0], [-0.72, 1.0, 0], [-0.2, 0.6, 0], fill_color=GREY_BROWN, fill_opacity=1, stroke_color=DARK, stroke_width=3)
    rear = Polygon([0.5, 0.45, 0], [0.72, 1.0, 0], [0.2, 0.6, 0], fill_color=GREY_BROWN, fill_opacity=1, stroke_color=DARK, stroke_width=3)
    eyes = VGroup(_eye(-0.26, 0.12, pupil=0.06), _eye(0.26, 0.12, pupil=0.06))
    nose = Polygon([0, -0.1, 0], [-0.08, 0.02, 0], [0.08, 0.02, 0], fill_color=PINK, fill_opacity=1, stroke_width=0)
    mouth = _smile_arc(0, -0.34, 0.3, 0.1, DARK)
    whisk = VGroup(
        Line([-0.3, -0.16, 0], [-0.95, -0.1, 0], stroke_width=2, color=DARK),
        Line([-0.3, -0.26, 0], [-0.95, -0.3, 0], stroke_width=2, color=DARK),
        Line([0.3, -0.16, 0], [0.95, -0.1, 0], stroke_width=2, color=DARK),
        Line([0.3, -0.26, 0], [0.95, -0.3, 0], stroke_width=2, color=DARK),
    )
    g = VGroup(lear, rear, head, whisk, eyes, nose, mouth)
    return _finish(g, eyes)


def dog() -> VGroup:
    head = Circle(radius=0.7, fill_color="#C8A165", fill_opacity=1, stroke_color=DARK, stroke_width=3)
    lear = Ellipse(width=0.34, height=0.7, fill_color="#9C7A4A", fill_opacity=1, stroke_color=DARK, stroke_width=3).move_to([-0.66, 0.25, 0]).rotate(0.3)
    rear = Ellipse(width=0.34, height=0.7, fill_color="#9C7A4A", fill_opacity=1, stroke_color=DARK, stroke_width=3).move_to([0.66, 0.25, 0]).rotate(-0.3)
    muzzle = Ellipse(width=0.8, height=0.55, fill_color="#E8D3AE", fill_opacity=1, stroke_width=0).shift(DOWN * 0.28)
    eyes = VGroup(_eye(-0.26, 0.16, pupil=0.07), _eye(0.26, 0.16, pupil=0.07))
    nose = Ellipse(width=0.22, height=0.16, fill_color=DARK, fill_opacity=1, stroke_width=0).shift(DOWN * 0.18)
    mouth = _smile_arc(0, -0.42, 0.34, 0.12, DARK)
    tongue = Ellipse(width=0.18, height=0.22, fill_color=PINK, fill_opacity=1, stroke_width=0).shift(DOWN * 0.52)
    g = VGroup(lear, rear, head, muzzle, tongue, eyes, nose, mouth)
    return _finish(g, eyes)


def alien() -> VGroup:
    head = Ellipse(width=1.3, height=1.5, fill_color=GREEN, fill_opacity=1, stroke_color=DARK, stroke_width=3)
    ant = Line([0, 0.75, 0], [0, 1.15, 0], stroke_width=3, color=DARK)
    antball = Dot([0, 1.2, 0], radius=0.1, color=YELLOW)
    eyes = VGroup(
        Ellipse(width=0.34, height=0.5, fill_color=DARK, fill_opacity=1, stroke_width=0).move_to([-0.28, 0.05, 0]),
        Ellipse(width=0.34, height=0.5, fill_color=DARK, fill_opacity=1, stroke_width=0).move_to([0.28, 0.05, 0]),
    )
    shine = VGroup(
        Dot([-0.22, 0.18, 0], radius=0.05, color=WHITE),
        Dot([0.34, 0.18, 0], radius=0.05, color=WHITE),
    )
    mouth = _smile_arc(0, -0.5, 0.3, 0.08, DARK)
    g = VGroup(ant, antball, head, eyes, shine, mouth)
    return _finish(g, eyes)


def pencil() -> VGroup:
    body = RoundedRectangle(width=0.7, height=1.7, corner_radius=0.08, fill_color=YELLOW, fill_opacity=1, stroke_color=DARK, stroke_width=3)
    tip = Polygon([-0.35, -0.85, 0], [0.35, -0.85, 0], [0, -1.25, 0], fill_color="#E8B27A", fill_opacity=1, stroke_color=DARK, stroke_width=3)
    lead = Polygon([-0.1, -1.13, 0], [0.1, -1.13, 0], [0, -1.25, 0], fill_color=DARK, fill_opacity=1, stroke_width=0)
    eraser = RoundedRectangle(width=0.7, height=0.28, corner_radius=0.08, fill_color=PINK, fill_opacity=1, stroke_color=DARK, stroke_width=3).shift(UP * 0.92)
    band = RoundedRectangle(width=0.72, height=0.12, corner_radius=0.04, fill_color="#9CA3AF", fill_opacity=1, stroke_width=0).shift(UP * 0.74)
    eyes = VGroup(_eye(-0.16, 0.12, r=0.13, pupil=0.055), _eye(0.16, 0.12, r=0.13, pupil=0.055))
    mouth = _smile_arc(0, -0.18, 0.24, 0.08, DARK)
    g = VGroup(body, band, eraser, tip, lead, eyes, mouth)
    return _finish(g, eyes)


def puppy() -> VGroup:
    """The star: a black-and-white Japanese Chin with a yellow sun hat,
    big dark eyes, a white forehead blaze, and a little pink tongue."""
    BLACKFUR = "#1B1B1F"
    # Floppy feathered ears hanging at the sides (drawn first, behind head).
    lear = Ellipse(width=0.62, height=1.15, fill_color=BLACKFUR, fill_opacity=1,
                   stroke_color=DARK, stroke_width=2).move_to([-0.66, -0.18, 0]).rotate(0.18)
    rear = Ellipse(width=0.62, height=1.15, fill_color=BLACKFUR, fill_opacity=1,
                   stroke_color=DARK, stroke_width=2).move_to([0.66, -0.18, 0]).rotate(-0.18)
    # White face.
    head = Circle(radius=0.74, fill_color=WHITE, fill_opacity=1, stroke_color=DARK, stroke_width=3)
    # Black cap over the top of the head, split by a white blaze.
    cap = Ellipse(width=1.5, height=0.92, fill_color=BLACKFUR, fill_opacity=1,
                  stroke_width=0).move_to([0, 0.42, 0])
    blaze = Ellipse(width=0.3, height=1.05, fill_color=WHITE, fill_opacity=1,
                    stroke_width=0).move_to([0, 0.32, 0])
    # Big dark Chin eyes with catchlights.
    le = Circle(radius=0.2, fill_color=BLACKFUR, fill_opacity=1, stroke_color=DARK, stroke_width=2).move_to([-0.3, 0.06, 0])
    re = Circle(radius=0.2, fill_color=BLACKFUR, fill_opacity=1, stroke_color=DARK, stroke_width=2).move_to([0.3, 0.06, 0])
    lshine = Dot([-0.24, 0.13, 0], radius=0.05, color=WHITE)
    rshine = Dot([0.36, 0.13, 0], radius=0.05, color=WHITE)
    eyes = VGroup(le, re, lshine, rshine)
    # Nose + tongue.
    nose = Ellipse(width=0.2, height=0.14, fill_color=BLACKFUR, fill_opacity=1, stroke_width=0).move_to([0, -0.26, 0])
    TONGUE = "#FF8FB0"
    tongue = VGroup(
        RoundedRectangle(width=0.22, height=0.3, corner_radius=0.1, fill_color=TONGUE,
                         fill_opacity=1, stroke_color="#E0608A", stroke_width=1.5).move_to([0, -0.5, 0]),
        Line([0, -0.4, 0], [0, -0.58, 0], stroke_width=1.5, color="#E0608A"),
    )
    # Yellow bucket sun hat.
    brim = Ellipse(width=1.9, height=0.42, fill_color=YELLOW, fill_opacity=1,
                   stroke_color=GOLD, stroke_width=2).move_to([0, 0.78, 0])
    crown = Polygon([-0.58, 0.78, 0], [0.58, 0.78, 0], [0.42, 1.32, 0], [-0.42, 1.32, 0],
                    fill_color=YELLOW, fill_opacity=1, stroke_color=GOLD, stroke_width=2)
    band = Polygon([-0.5, 0.92, 0], [0.5, 0.92, 0], [0.46, 1.04, 0], [-0.46, 1.04, 0],
                   fill_color=GOLD, fill_opacity=0.7, stroke_width=0)
    hat = VGroup(crown, band, brim)
    g = VGroup(lear, rear, head, cap, blaze, eyes, nose, tongue, hat)
    return _finish(g, eyes)


# Featured cast — the kid's dog stars; the others add occasional variety.
_CAST = [puppy, fox, owl, cat, dog, alien, pencil]
_NAMES = ["puppy", "fox", "owl", "cat", "dog", "alien", "pencil"]


def mascot_for(seed: int, featured: bool = True):
    """Pick a mascot. The star puppy headlines ~2 of every 3 videos; the rest
    of the cast (fox/owl/cat/dog/alien/pencil) fills the others for variety."""
    if featured and (abs(int(seed)) % 3 != 0):
        return puppy(), "puppy"
    others = [fox, owl, cat, dog, alien, pencil]
    onames = ["fox", "owl", "cat", "dog", "alien", "pencil"]
    i = abs(int(seed)) % len(others)
    return others[i](), onames[i]


# ---- beats: each calls scene.play directly and stays short ----

def blink(scene, m, run_time=0.16):
    eyes = m.eyes
    cy = eyes.get_center()
    scene.play(eyes.animate.stretch(0.12, 1).move_to(cy), run_time=run_time / 2)
    scene.play(eyes.animate.stretch(1 / 0.12, 1).move_to(cy), run_time=run_time / 2)


def think(scene, m, run_time=0.7):
    # A puzzled little wiggle + tilt — reads as "hmm".
    scene.play(Wiggle(m, scale_value=1.05, rotation_angle=0.06 * TAU), run_time=run_time)


def cheer(scene, m, run_time=0.7):
    c = m.get_center()
    scene.play(m.animate.shift(UP * 0.45).rotate(0.12), run_time=run_time / 2)
    scene.play(m.animate.move_to(c).rotate(-0.12), run_time=run_time / 2)


def spin(scene, m, run_time=0.8):
    # Cartwheel-ish full rotation in place.
    scene.play(Rotate(m, angle=-TAU, run_time=run_time))


def wave_in(scene, m, run_time=0.6):
    scene.play(GrowFromCenter(m), run_time=run_time)


def bounce(scene, m, run_time=0.8):
    # Two playful hops in place.
    c = m.get_center()
    scene.play(m.animate.shift(UP * 0.35), run_time=run_time / 4)
    scene.play(m.animate.move_to(c), run_time=run_time / 4)
    scene.play(m.animate.shift(UP * 0.22), run_time=run_time / 4)
    scene.play(m.animate.move_to(c), run_time=run_time / 4)


def wave_arm(scene, m, run_time=0.7):
    # Tilt side to side like a friendly wave.
    scene.play(m.animate.rotate(0.18), run_time=run_time / 3)
    scene.play(m.animate.rotate(-0.36), run_time=run_time / 3)
    scene.play(m.animate.rotate(0.18), run_time=run_time / 3)


def eureka(scene, m, run_time=0.8):
    # Pop + a yellow spark above the head.
    from manim import Dot, FadeIn, FadeOut, YELLOW as _Y, UP as _UP
    spark = Dot(m.get_top() + _UP * 0.25, radius=0.12, color=_Y)
    c = m.get_center()
    scene.play(m.animate.scale(1.12).shift(_UP * 0.18), FadeIn(spark, scale=1.5), run_time=run_time / 2)
    scene.play(m.animate.scale(1 / 1.12).move_to(c), FadeOut(spark), run_time=run_time / 2)
