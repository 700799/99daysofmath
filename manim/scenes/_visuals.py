"""Parametric topical illustrations for lesson videos.

Each builder returns a compact VGroup sized to sit beside the steps as a
"hero" diagram that reinforces the domain. `hero_for(domain)` returns a
zero-arg builder for a sensible default illustration per domain.
"""
from __future__ import annotations

from manim import (
    VGroup, Line, Rectangle, Circle, Dot, Polygon, Text, NumberLine,
    WHITE, ORANGE, GREEN, BLUE, YELLOW, PINK, GREY_BROWN,
    UP, DOWN, LEFT, RIGHT,
)

DARK = "#0F172A"


def number_line(lo=-3, hi=3, dots=(1,), color=BLUE) -> VGroup:
    nl = NumberLine(x_range=[lo, hi, 1], length=4.2, include_numbers=True,
                    font_size=20, color=WHITE, stroke_width=3)
    marks = VGroup(*[Dot(nl.n2p(v), radius=0.09, color=color) for v in dots])
    return VGroup(nl, marks)


def fraction_bar(num=2, den=3, color=GREEN) -> VGroup:
    w, h = 3.0, 0.6
    cells = VGroup()
    for i in range(den):
        c = Rectangle(width=w / den, height=h, stroke_color=DARK, stroke_width=2,
                      fill_color=color if i < num else WHITE,
                      fill_opacity=1 if i < num else 0.15)
        cells.add(c)
    cells.arrange(RIGHT, buff=0)
    label = Text(f"{num}/{den}", font_size=26, color=color).next_to(cells, DOWN, buff=0.2)
    return VGroup(cells, label)


def area_rect(w=4, h=3, color=ORANGE) -> VGroup:
    box = Rectangle(width=2.2, height=1.6, fill_color=color, fill_opacity=0.35,
                    stroke_color=color, stroke_width=3)
    wl = Text(str(w), font_size=22, color=WHITE).next_to(box, DOWN, buff=0.12)
    hl = Text(str(h), font_size=22, color=WHITE).next_to(box, LEFT, buff=0.12)
    return VGroup(box, wl, hl)


def dot_plot(data=(1, 2, 2, 3, 3, 3, 4), color=BLUE) -> VGroup:
    lo, hi = min(data), max(data)
    nl = NumberLine(x_range=[lo - 1, hi + 1, 1], length=3.6, include_numbers=True,
                    font_size=18, color=WHITE, stroke_width=2)
    counts = {}
    dots = VGroup()
    for v in data:
        counts[v] = counts.get(v, 0) + 1
        p = nl.n2p(v) + UP * (0.18 * counts[v])
        dots.add(Dot(p, radius=0.07, color=color))
    return VGroup(nl, dots)


def ratio_table(pairs=((1, 3), (2, 6), (3, 9)), c1=BLUE, c2=ORANGE) -> VGroup:
    rows = VGroup()
    head = VGroup(Text("in", font_size=22, color=c1), Text("out", font_size=22, color=c2)) \
        .arrange(RIGHT, buff=1.0)
    rows.add(head)
    for a, b in pairs:
        rows.add(VGroup(Text(str(a), font_size=24, color=WHITE),
                        Text(str(b), font_size=24, color=WHITE)).arrange(RIGHT, buff=1.4))
    rows.arrange(DOWN, buff=0.22)
    box = Rectangle(width=rows.width + 0.5, height=rows.height + 0.4,
                    stroke_color=DARK, stroke_width=2).move_to(rows)
    return VGroup(box, rows)


def balance_scale(left="2x+5", right="13", color=BLUE) -> VGroup:
    base = Line([-1.4, -1.0, 0], [1.4, -1.0, 0], stroke_width=4, color=GREY_BROWN)
    post = Line([0, -1.0, 0], [0, 0.5, 0], stroke_width=4, color=GREY_BROWN)
    beam = Line([-1.5, 0.5, 0], [1.5, 0.5, 0], stroke_width=4, color=DARK)
    lpan = VGroup(
        Line([-1.5, 0.5, 0], [-1.5, 0.1, 0], stroke_width=2, color=DARK),
        Polygon([-1.9, 0.1, 0], [-1.1, 0.1, 0], [-1.3, -0.15, 0], [-1.7, -0.15, 0],
                fill_color=color, fill_opacity=0.4, stroke_color=color, stroke_width=2),
    )
    rpan = VGroup(
        Line([1.5, 0.5, 0], [1.5, 0.1, 0], stroke_width=2, color=DARK),
        Polygon([1.1, 0.1, 0], [1.9, 0.1, 0], [1.7, -0.15, 0], [1.3, -0.15, 0],
                fill_color=ORANGE, fill_opacity=0.4, stroke_color=ORANGE, stroke_width=2),
    )
    lt = Text(left, font_size=22, color=color).move_to([-1.5, 0.32, 0])
    rt = Text(right, font_size=22, color=ORANGE).move_to([1.5, 0.32, 0])
    return VGroup(base, post, beam, lpan, rpan, lt, rt)


_DOMAIN_HERO = {
    "6.NS": lambda: number_line(),
    "5.F": lambda: fraction_bar(),
    "6.RP": lambda: ratio_table(),
    "6.G": lambda: area_rect(),
    "6.SP": lambda: dot_plot(),
    "6.EE": lambda: balance_scale(),
}


def hero_for(domain: str):
    """Return a zero-arg builder for the domain's default illustration."""
    return _DOMAIN_HERO.get(domain, lambda: number_line())
