"""Geometry drawing helpers for the 6.G TeachingDeck scenes.

All builders use CORNER-BASED local coordinates: the shape's bottom-left
front corner sits at (0, 0, 0). Build, then .shift() the returned VGroup
into place. Colors stay in the bright-on-black set (BLUE / GREEN / YELLOW /
ORANGE / GOLD / WHITE); gridlines are subtle grey strokes, not text.
"""
import numpy as np
from manim import (
    VGroup, Polygon, Square, Line, DashedLine, Text, Dot,
    WHITE, BLUE, GREEN, YELLOW, ORANGE, GOLD, GREY_B,
    UP, DOWN, LEFT, RIGHT,
)


def P(x, y):
    return np.array([x, y, 0.0])


def unit_grid(cols, rows, u=0.5, color=BLUE, fill_opacity=0.35):
    """cols × rows sheet of unit squares, row-major, bottom row first.
    Row r is squares [r*cols : (r+1)*cols]."""
    g = VGroup()
    for r in range(rows):
        for c in range(cols):
            sq = Square(side_length=u, stroke_color=WHITE, stroke_width=1.6,
                        fill_color=color, fill_opacity=fill_opacity)
            sq.move_to(P((c + 0.5) * u, (r + 0.5) * u))
            g.add(sq)
    return g


def rect_outline(w, h, u=0.5, color=WHITE, stroke_width=4):
    return Polygon(P(0, 0), P(w * u, 0), P(w * u, h * u), P(0, h * u),
                   stroke_color=color, stroke_width=stroke_width)


def cuboid(w, d, h, u=0.5, color=BLUE, grid=True):
    """Oblique-projection rectangular prism, w wide × d deep × h tall.
    Returns VGroup(front, side, top, gridlines). Bottom-left FRONT corner
    at (0,0). Total width = w*u + d*0.62*u, total height = h*u + d*0.38*u."""
    ddx, ddy = 0.62 * u, 0.38 * u
    W, H = w * u, h * u
    Dx, Dy = d * ddx, d * ddy
    front = Polygon(P(0, 0), P(W, 0), P(W, H), P(0, H),
                    stroke_color=WHITE, stroke_width=2.5,
                    fill_color=color, fill_opacity=0.50)
    side = Polygon(P(W, 0), P(W + Dx, Dy), P(W + Dx, H + Dy), P(W, H),
                   stroke_color=WHITE, stroke_width=2.5,
                   fill_color=color, fill_opacity=0.68)
    top = Polygon(P(0, H), P(W, H), P(W + Dx, H + Dy), P(Dx, H + Dy),
                  stroke_color=WHITE, stroke_width=2.5,
                  fill_color=color, fill_opacity=0.30)
    lines = VGroup()
    if grid:
        for i in range(1, w):
            lines.add(Line(P(i * u, 0), P(i * u, H),
                           stroke_color=WHITE, stroke_width=1.3, stroke_opacity=0.7))
            lines.add(Line(P(i * u, H), P(i * u + Dx, H + Dy),
                           stroke_color=WHITE, stroke_width=1.3, stroke_opacity=0.7))
        for j in range(1, h):
            lines.add(Line(P(0, j * u), P(W, j * u),
                           stroke_color=WHITE, stroke_width=1.3, stroke_opacity=0.7))
            lines.add(Line(P(W, j * u), P(W + Dx, j * u + Dy),
                           stroke_color=WHITE, stroke_width=1.3, stroke_opacity=0.7))
        for k in range(1, d):
            lines.add(Line(P(k * ddx, H + k * ddy), P(W + k * ddx, H + k * ddy),
                           stroke_color=WHITE, stroke_width=1.3, stroke_opacity=0.7))
            lines.add(Line(P(W + k * ddx, k * ddy), P(W + k * ddx, H + k * ddy),
                           stroke_color=WHITE, stroke_width=1.3, stroke_opacity=0.7))
    return VGroup(front, side, top, lines)


def slab(w, d, u=0.5, color=BLUE, grid=True):
    """One unit-tall layer of a prism (for the 'stack the layers' story)."""
    return cuboid(w, d, 1, u=u, color=color, grid=grid)


def grid_plane(xmin, xmax, ymin, ymax, u=0.5, label_font=24):
    """First-quadrant-style grid with axes and integer labels.
    Local coords: grid point (i, j) sits at (i*u, j*u)."""
    grid = VGroup()
    for i in range(xmin, xmax + 1):
        grid.add(Line(P(i * u, ymin * u), P(i * u, ymax * u),
                      stroke_color=GREY_B, stroke_width=1.1, stroke_opacity=0.55))
    for j in range(ymin, ymax + 1):
        grid.add(Line(P(xmin * u, j * u), P(xmax * u, j * u),
                      stroke_color=GREY_B, stroke_width=1.1, stroke_opacity=0.55))
    axes = VGroup(
        Line(P(xmin * u, 0), P(xmax * u, 0), stroke_color=WHITE, stroke_width=3),
        Line(P(0, ymin * u), P(0, ymax * u), stroke_color=WHITE, stroke_width=3),
    )
    labels = VGroup()
    for i in range(xmin, xmax + 1):
        if i == 0 or i % 2 != 0:
            continue
        t = Text(str(i), font_size=label_font, color=GREY_B)
        t.move_to(P(i * u, -0.32))
        labels.add(t)
    for j in range(ymin, ymax + 1):
        if j == 0 or j % 2 != 0:
            continue
        t = Text(str(j), font_size=label_font, color=GREY_B)
        t.move_to(P(-0.34, j * u))
        labels.add(t)
    return VGroup(grid, axes, labels)


def gp_dot(plane_shift, x, y, u=0.5, color=YELLOW, radius=0.09):
    """A dot at grid point (x, y) of a grid_plane that was shifted by
    plane_shift (a numpy vector)."""
    return Dot(P(x * u, y * u) + plane_shift, radius=radius,
               color=color, fill_opacity=1)
