"""Topical illustrations + motion-as-reasoning action helpers.

Every builder returns a `VGroup` and tags its key sub-pieces as attributes so
the action helpers (and decks) can grab `.cells`, `.label`, `.dots`, etc.
"""
from __future__ import annotations

import math
import numpy as np
from manim import (
    VGroup, Line, Rectangle, Circle, Dot, Polygon, Text, NumberLine, Arc,
    AnnularSector, RoundedRectangle, Arrow, FadeIn, FadeOut, Transform,
    WHITE, ORANGE, GREEN, BLUE, YELLOW, GREY_BROWN, GOLD,
    LEFT, RIGHT, UP, DOWN, PI, TAU,
)

DARK = "#0F172A"

# ── number line ─────────────────────────────────────────────────────────

def number_line(lo=-3, hi=3, dots=(1,), color=BLUE) -> VGroup:
    nl = NumberLine(x_range=[lo, hi, 1], length=5.4, include_numbers=True,
                    font_size=28, color=WHITE, stroke_width=4)
    marks = VGroup(*[Dot(nl.n2p(v), radius=0.13, color=color) for v in dots])
    g = VGroup(nl, marks)
    g.nl = nl
    g.marks = marks
    return g


# ── fraction bar / pizza ────────────────────────────────────────────────

def fraction_bar(num=2, den=3, color=BLUE) -> VGroup:
    w, h = 3.4, 0.7
    cells = VGroup()
    for i in range(den):
        c = Rectangle(width=w / den, height=h, stroke_color=WHITE, stroke_width=2,
                      fill_color=color if i < num else WHITE,
                      fill_opacity=1 if i < num else 0.12)
        cells.add(c)
    cells.arrange(RIGHT, buff=0)
    label = Text(f"{num}/{den}", font_size=28, color=YELLOW, weight="BOLD").next_to(cells, DOWN, buff=0.22)
    g = VGroup(cells, label)
    g.cells = cells
    g.label = label
    return g


def pizza(slices=8, shaded=3, color=BLUE) -> VGroup:
    """Cute pizza pie — `slices` total, `shaded` slices shaded with color."""
    pieces = VGroup()
    for i in range(slices):
        ang0 = TAU * i / slices
        ang1 = TAU * (i + 1) / slices
        sector = AnnularSector(inner_radius=0.0, outer_radius=1.4,
                               angle=ang1 - ang0, start_angle=ang0,
                               fill_color=color if i < shaded else WHITE,
                               fill_opacity=0.85 if i < shaded else 0.15,
                               stroke_color=WHITE, stroke_width=2)
        pieces.add(sector)
    crust = Circle(radius=1.4, stroke_color=YELLOW, stroke_width=4, fill_opacity=0)
    g = VGroup(pieces, crust)
    g.pieces = pieces
    g.crust = crust
    return g


# ── arrays for ×/area ───────────────────────────────────────────────────

def dot_array(rows=2, cols=4, color=BLUE, dot_r=0.16, gap=0.5) -> VGroup:
    grid = VGroup()
    rows_g = []
    for r in range(rows):
        row = VGroup()
        for c in range(cols):
            d = Dot(point=[(c - (cols - 1) / 2) * gap,
                           ((rows - 1) / 2 - r) * gap, 0],
                    radius=dot_r, color=color)
            row.add(d)
        rows_g.append(row)
        grid.add(row)
    grid.rows = rows_g
    return grid


def area_rect(color=ORANGE) -> VGroup:
    # Generic shape (no specific numbers) so it never contradicts the example.
    box = Rectangle(width=3.4, height=2.3, fill_color=color, fill_opacity=0.35,
                    stroke_color=color, stroke_width=4)
    grid = VGroup()
    for gx in (-1, 0, 1):
        grid.add(Line(box.get_top() + RIGHT * gx * 0.85, box.get_bottom() + RIGHT * gx * 0.85,
                      stroke_width=1.5, color=WHITE).set_opacity(0.35))
    for gy in (-0.5, 0.5):
        grid.add(Line(box.get_left() + UP * gy * 1.3, box.get_right() + UP * gy * 1.3,
                      stroke_width=1.5, color=WHITE).set_opacity(0.35))
    wl = Text("base", font_size=28, color=WHITE, weight="BOLD").next_to(box, DOWN, buff=0.2)
    hl = Text("height", font_size=28, color=WHITE, weight="BOLD").next_to(box, LEFT, buff=0.2).rotate(PI / 2)
    g = VGroup(box, grid, wl, hl)
    g.box = box
    return g


# ── tape diagrams + number bonds + comparison strips ────────────────────

def tape_diagram(parts=(3, 5), colors=(BLUE, ORANGE), labels=None) -> VGroup:
    total = sum(parts) or 1
    w_total = 5.0
    bar = VGroup()
    x = -w_total / 2
    for i, p in enumerate(parts):
        seg_w = w_total * p / total
        seg = Rectangle(width=seg_w, height=0.7,
                        fill_color=colors[i % len(colors)], fill_opacity=0.85,
                        stroke_color=WHITE, stroke_width=2)
        seg.move_to([x + seg_w / 2, 0, 0])
        lab = Text(str(p) if labels is None else str(labels[i]),
                   font_size=24, color=WHITE, weight="BOLD").move_to(seg)
        bar.add(VGroup(seg, lab))
        x += seg_w
    g = VGroup(bar)
    g.segments = list(bar)
    return g


def number_bond(whole=10, parts=(3, 7), color=BLUE) -> VGroup:
    big = Circle(radius=0.55, fill_color=color, fill_opacity=0.85, stroke_color=WHITE, stroke_width=2)
    big_t = Text(str(whole), font_size=28, color=WHITE, weight="BOLD").move_to(big)
    big_g = VGroup(big, big_t).shift(UP * 1.0)
    sub_l = Circle(radius=0.45, fill_color=YELLOW, fill_opacity=0.85, stroke_color=WHITE, stroke_width=2).shift(LEFT * 1.4 + DOWN * 0.5)
    sub_lt = Text(str(parts[0]), font_size=24, color=DARK, weight="BOLD").move_to(sub_l)
    sub_r = Circle(radius=0.45, fill_color=GREEN, fill_opacity=0.85, stroke_color=WHITE, stroke_width=2).shift(RIGHT * 1.4 + DOWN * 0.5)
    sub_rt = Text(str(parts[1]), font_size=24, color=DARK, weight="BOLD").move_to(sub_r)
    line_l = Line(big.get_bottom(), sub_l.get_top(), stroke_width=3, color=WHITE)
    line_r = Line(big.get_bottom(), sub_r.get_top(), stroke_width=3, color=WHITE)
    return VGroup(line_l, line_r, big_g, sub_l, sub_lt, sub_r, sub_rt)


def comparison_strip(a=4, b=7, color_a=BLUE, color_b=ORANGE) -> VGroup:
    unit = 0.55
    bar_a = Rectangle(width=a * unit, height=0.6, fill_color=color_a, fill_opacity=0.85,
                      stroke_color=WHITE, stroke_width=2)
    bar_b = Rectangle(width=b * unit, height=0.6, fill_color=color_b, fill_opacity=0.85,
                      stroke_color=WHITE, stroke_width=2)
    la = Text(f"A = {a}", font_size=22, color=color_a).next_to(bar_a, LEFT, buff=0.2)
    lb = Text(f"B = {b}", font_size=22, color=color_b).next_to(bar_b, LEFT, buff=0.2)
    grp = VGroup(VGroup(la, bar_a), VGroup(lb, bar_b)).arrange(DOWN, buff=0.5, aligned_edge=LEFT)
    return grp


def scaling_arrow(factor="×3", color=YELLOW) -> VGroup:
    arr = Arrow(LEFT * 1.0, RIGHT * 1.0, color=color, buff=0, stroke_width=6, max_tip_length_to_length_ratio=0.18)
    lab = Text(factor, font_size=26, color=color, weight="BOLD").next_to(arr, UP, buff=0.12)
    return VGroup(arr, lab)


# ── dot plot / ratio table / balance ────────────────────────────────────

def dot_plot(data=(1, 2, 2, 3, 3, 3, 4), color=BLUE) -> VGroup:
    lo, hi = min(data), max(data)
    nl = NumberLine(x_range=[lo - 1, hi + 1, 1], length=4.6, include_numbers=True,
                    font_size=26, color=WHITE, stroke_width=3)
    counts = {}
    dots = VGroup()
    for v in data:
        counts[v] = counts.get(v, 0) + 1
        p = nl.n2p(v) + UP * (0.3 * counts[v])
        dots.add(Dot(p, radius=0.13, color=color))
    return VGroup(nl, dots)


def ratio_table(pairs=((1, 3), (2, 6), (3, 9)), c1=BLUE, c2=ORANGE) -> VGroup:
    rows = VGroup()
    head = VGroup(Text("in", font_size=30, color=c1, weight="BOLD"),
                  Text("out", font_size=30, color=c2, weight="BOLD")).arrange(RIGHT, buff=1.3)
    rows.add(head)
    for a, b in pairs:
        rows.add(VGroup(Text(str(a), font_size=32, color=WHITE),
                        Text(str(b), font_size=32, color=WHITE)).arrange(RIGHT, buff=1.8))
    rows.arrange(DOWN, buff=0.34)
    box = Rectangle(width=rows.width + 0.7, height=rows.height + 0.5,
                    stroke_color=WHITE, stroke_width=3).move_to(rows)
    return VGroup(box, rows)


def balance_scale(left="2x+5", right="13", color=BLUE) -> VGroup:
    base = Line([-1.4, -1.0, 0], [1.4, -1.0, 0], stroke_width=4, color=GREY_BROWN)
    post = Line([0, -1.0, 0], [0, 0.5, 0], stroke_width=4, color=GREY_BROWN)
    beam = Line([-1.5, 0.5, 0], [1.5, 0.5, 0], stroke_width=4, color=WHITE)
    lpan = VGroup(
        Line([-1.5, 0.5, 0], [-1.5, 0.1, 0], stroke_width=2, color=WHITE),
        Polygon([-1.9, 0.1, 0], [-1.1, 0.1, 0], [-1.3, -0.15, 0], [-1.7, -0.15, 0],
                fill_color=color, fill_opacity=0.4, stroke_color=color, stroke_width=2),
    )
    rpan = VGroup(
        Line([1.5, 0.5, 0], [1.5, 0.1, 0], stroke_width=2, color=WHITE),
        Polygon([1.1, 0.1, 0], [1.9, 0.1, 0], [1.7, -0.15, 0], [1.3, -0.15, 0],
                fill_color=ORANGE, fill_opacity=0.4, stroke_color=ORANGE, stroke_width=2),
    )
    lt = Text(left, font_size=28, color=color, weight="BOLD").move_to([-1.5, 0.34, 0])
    rt = Text(right, font_size=28, color=ORANGE, weight="BOLD").move_to([1.5, 0.34, 0])
    return VGroup(base, post, beam, lpan, rpan, lt, rt)


# ── action helpers (motion = reasoning) ─────────────────────────────────

def slide_on_number_line(scene, nl_group, mover, frm, to, run_time=0.8):
    nl = nl_group.nl
    a, b = nl.n2p(frm), nl.n2p(to)
    scene.play(mover.animate.move_to(a), run_time=0.0001)
    scene.play(mover.animate.move_to(b), run_time=run_time)


def group_array(scene, grid, run_time=0.9):
    """Visually emphasize rows×cols by pulsing each row in turn."""
    for r in grid.rows:
        scene.play(r.animate.scale(1.18), run_time=run_time / (2 * len(grid.rows)))
        scene.play(r.animate.scale(1 / 1.18), run_time=run_time / (2 * len(grid.rows)))


def split_pizza(scene, p, color=YELLOW, run_time=0.7):
    """Pulse the shaded slices to highlight the fraction."""
    shaded = [s for s in p.pieces if s.fill_opacity > 0.5]
    if not shaded:
        return
    pulses = VGroup(*shaded)
    scene.play(pulses.animate.scale(1.06).set_color(color), run_time=run_time / 2)
    scene.play(pulses.animate.scale(1 / 1.06).set_color(BLUE), run_time=run_time / 2)


# ── domain hero default ────────────────────────────────────────────────

_DOMAIN_HERO = {
    "6.NS": lambda: number_line(),
    "5.F":  lambda: pizza(),
    "6.RP": lambda: ratio_table(),
    "6.G":  lambda: area_rect(),
    "6.SP": lambda: dot_plot(),
    "6.EE": lambda: balance_scale(),
}


def hero_for(domain: str):
    return _DOMAIN_HERO.get(domain, lambda: number_line())
