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
                    font_size=40, color=WHITE, stroke_width=5)
    marks = VGroup(*[Dot(nl.n2p(v), radius=0.16, color=color) for v in dots])
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
    label = Text(f"{num}/{den}", font_size=40, color=YELLOW, weight="BOLD").next_to(cells, DOWN, buff=0.24)
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
    wl = Text("base", font_size=34, color=WHITE, weight="BOLD").next_to(box, DOWN, buff=0.22)
    hl = Text("height", font_size=34, color=WHITE, weight="BOLD").next_to(box, LEFT, buff=0.22).rotate(PI / 2)
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
    big = Circle(radius=0.7, fill_color=color, fill_opacity=0.85, stroke_color=WHITE, stroke_width=3)
    big_t = Text(str(whole), font_size=40, color=WHITE, weight="BOLD").move_to(big)
    big_g = VGroup(big, big_t).shift(UP * 1.1)
    sub_l = Circle(radius=0.58, fill_color=YELLOW, fill_opacity=0.9, stroke_color=WHITE, stroke_width=3).shift(LEFT * 1.7 + DOWN * 0.6)
    sub_lt = Text(str(parts[0]), font_size=38, color=DARK, weight="BOLD").move_to(sub_l)
    sub_r = Circle(radius=0.58, fill_color=GREEN, fill_opacity=0.9, stroke_color=WHITE, stroke_width=3).shift(RIGHT * 1.7 + DOWN * 0.6)
    sub_rt = Text(str(parts[1]), font_size=38, color=DARK, weight="BOLD").move_to(sub_r)
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
    nl = NumberLine(x_range=[lo - 1, hi + 1, 1], length=4.8, include_numbers=True,
                    font_size=36, color=WHITE, stroke_width=4)
    counts = {}
    dots = VGroup()
    for v in data:
        counts[v] = counts.get(v, 0) + 1
        p = nl.n2p(v) + UP * (0.32 * counts[v])
        dots.add(Dot(p, radius=0.15, color=color))
    return VGroup(nl, dots)


def ratio_table(pairs=((1, 3), (2, 6), (3, 9)), c1=BLUE, c2=ORANGE) -> VGroup:
    rows = VGroup()
    head = VGroup(Text("in", font_size=38, color=c1, weight="BOLD"),
                  Text("out", font_size=38, color=c2, weight="BOLD")).arrange(RIGHT, buff=1.5)
    rows.add(head)
    for a, b in pairs:
        rows.add(VGroup(Text(str(a), font_size=42, color=WHITE, weight="BOLD"),
                        Text(str(b), font_size=42, color=WHITE, weight="BOLD")).arrange(RIGHT, buff=2.0))
    rows.arrange(DOWN, buff=0.4)
    box = Rectangle(width=rows.width + 0.8, height=rows.height + 0.6,
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
    lt = Text(left, font_size=34, color=color, weight="BOLD").move_to([-1.5, 0.36, 0])
    rt = Text(right, font_size=34, color=ORANGE, weight="BOLD").move_to([1.5, 0.36, 0])
    return VGroup(base, post, beam, lpan, rpan, lt, rt)


# ── Geometry: labeled shapes for area/volume lessons ──────────────────────

def labeled_right_triangle(base=3.0, height=2.0, base_color=BLUE, height_color=ORANGE,
                           label_size=28) -> VGroup:
    """Right triangle with base and height labeled and color-coded."""
    # Triangle vertices: right angle at origin, base horizontal, height vertical
    tri = Polygon(
        [0, 0, 0],
        [base, 0, 0],
        [0, height, 0],
        fill_color=BLUE, fill_opacity=0.2, stroke_color=BLUE, stroke_width=3
    )

    # Right angle indicator
    right_angle = Polygon(
        [0.3, 0, 0],
        [0.3, 0.3, 0],
        [0, 0.3, 0],
        fill_color=WHITE, fill_opacity=0, stroke_color=WHITE, stroke_width=2
    )

    # Base label
    base_label = Text(f"{int(base)}", font_size=label_size, color=base_color, weight="BOLD")
    base_label.next_to([base/2, -0.4, 0], DOWN, buff=0.1)

    # Height label
    height_label = Text(f"{int(height)}", font_size=label_size, color=height_color, weight="BOLD")
    height_label.next_to([-0.5, height/2, 0], LEFT, buff=0.1)

    g = VGroup(tri, right_angle, base_label, height_label)
    g.triangle = tri
    g.base_label = base_label
    g.height_label = height_label
    return g


def labeled_rectangle(width=4.0, height=2.5, width_color=BLUE, height_color=ORANGE,
                     label_size=28) -> VGroup:
    """Rectangle with width and height labeled and color-coded."""
    rect = Rectangle(width=width, height=height, stroke_color=BLUE, stroke_width=3,
                    fill_color=BLUE, fill_opacity=0.15)

    # Width label
    width_label = Text(f"{int(width)}", font_size=label_size, color=width_color, weight="BOLD")
    width_label.next_to([0, -height/2-0.4, 0], DOWN, buff=0.1)

    # Height label
    height_label = Text(f"{int(height)}", font_size=label_size, color=height_color, weight="BOLD")
    height_label.next_to([-width/2-0.5, 0, 0], LEFT, buff=0.1)

    g = VGroup(rect, width_label, height_label)
    g.rect = rect
    g.width_label = width_label
    g.height_label = height_label
    return g


def area_formula_display(base, height, result=None, result_color=GREEN) -> VGroup:
    """Show area formula with numbers: base × height ÷ 2 = result."""
    if result is None:
        result = int(base * height / 2)

    formula = VGroup(
        Text(f"{int(base)}", font_size=48, color=BLUE, weight="BOLD"),
        Text("×", font_size=40, color=WHITE),
        Text(f"{int(height)}", font_size=48, color=ORANGE, weight="BOLD"),
        Text("÷", font_size=40, color=WHITE),
        Text("2", font_size=40, color=WHITE),
        Text("=", font_size=40, color=WHITE),
        Text(f"{result}", font_size=48, color=result_color, weight="BOLD"),
    ).arrange(RIGHT, buff=0.2)
    return formula


# ── Coordinate grids for distance/polygon lessons ──────────────────────

def coordinate_grid_with_points(x_max=6, y_max=5, points=None, point_labels=True,
                               point_color=YELLOW) -> VGroup:
    """Coordinate grid with optional plotted points and labels."""
    from manim import Axes

    grid = Axes(
        x_range=[0, x_max, 1],
        y_range=[0, y_max, 1],
        x_length=3.6,
        y_length=3.0,
        axis_config={"color": WHITE, "stroke_width": 2, "include_numbers": True, "font_size": 22},
        tips=False,
    )

    parts = VGroup(grid)
    points_group = VGroup()
    labels_group = VGroup()

    if points:
        for pt, label_text in points:
            x, y = pt
            dot = Dot(grid.c2p(x, y), radius=0.10, color=point_color)
            points_group.add(dot)

            if point_labels:
                pt_label = Text(f"({int(x)}, {int(y)})", font_size=20, color=point_color, weight="BOLD")
                pt_label.next_to(dot, RIGHT + UP, buff=0.15)
                labels_group.add(pt_label)
                parts.add(pt_label)

            parts.add(dot)

    # Attach attributes to the VGroup for later access
    parts.grid = grid
    parts.points = points_group
    parts.labels = labels_group
    return parts


def distance_line_on_grid(grid, p1, p2, show_label=True, label_color=YELLOW) -> VGroup:
    """Line connecting two points on a coordinate grid with optional distance label."""
    # Extract grid object if passed as VGroup
    if hasattr(grid, 'grid'):
        axes = grid.grid
    else:
        axes = grid

    pt1 = axes.c2p(p1[0], p1[1])
    pt2 = axes.c2p(p2[0], p2[1])

    line = Line(pt1, pt2, stroke_color=label_color, stroke_width=3)

    g = VGroup(line)
    g.line = line

    if show_label:
        # Calculate distance
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        distance = math.sqrt(dx**2 + dy**2)

        # Place label at midpoint
        mid = [(pt1[0] + pt2[0])/2, (pt1[1] + pt2[1])/2, 0]
        label = Text(f"d ≈ {distance:.1f}", font_size=20, color=label_color, weight="BOLD")
        label.move_to(mid).shift(UP*0.3)
        g.add(label)
        g.label = label

    return g


def polygon_on_grid(grid, corners, fill=True, color=ORANGE) -> VGroup:
    """Polygon (usually rectangle) drawn on coordinate grid using corner coordinates."""
    # Extract grid object if passed as VGroup
    if hasattr(grid, 'grid'):
        axes = grid.grid
    else:
        axes = grid

    pts_3d = [axes.c2p(c[0], c[1]) for c in corners]

    poly = Polygon(*pts_3d,
                  fill_color=color, fill_opacity=0.3 if fill else 0,
                  stroke_color=color, stroke_width=3)

    g = VGroup(poly)
    g.polygon = poly
    return g


# ── 3D shapes for volume lessons ───────────────────────────────────────

def box_wireframe(width=3, height=2, depth=2, labels=True, label_size=24) -> VGroup:
    """Isometric 3D box wireframe with dimension labels."""
    # Isometric projection for a box
    # Front face (at z=0)
    front_bl = [0, 0, 0]
    front_br = [width, 0, 0]
    front_tr = [width, height, 0]
    front_tl = [0, height, 0]

    # Back face (at z=depth, offset for isometric)
    iso_offset_x = depth * 0.3
    iso_offset_y = depth * 0.2
    back_bl = [iso_offset_x, iso_offset_y, 0]
    back_br = [width + iso_offset_x, iso_offset_y, 0]
    back_tr = [width + iso_offset_x, height + iso_offset_y, 0]
    back_tl = [iso_offset_x, height + iso_offset_y, 0]

    # Draw edges
    edges = VGroup(
        # Front face
        Line(front_bl, front_br, stroke_width=3, color=WHITE),
        Line(front_br, front_tr, stroke_width=3, color=WHITE),
        Line(front_tr, front_tl, stroke_width=3, color=WHITE),
        Line(front_tl, front_bl, stroke_width=3, color=WHITE),
        # Back face
        Line(back_bl, back_br, stroke_width=3, color=WHITE),
        Line(back_br, back_tr, stroke_width=3, color=WHITE),
        Line(back_tr, back_tl, stroke_width=3, color=WHITE),
        Line(back_tl, back_bl, stroke_width=3, color=WHITE),
        # Connecting edges
        Line(front_bl, back_bl, stroke_width=2, color=GREY_BROWN),
        Line(front_br, back_br, stroke_width=2, color=GREY_BROWN),
        Line(front_tr, back_tr, stroke_width=2, color=GREY_BROWN),
        Line(front_tl, back_tl, stroke_width=2, color=GREY_BROWN),
    )

    g = VGroup(edges)
    g.edges = edges

    if labels:
        # Width label (bottom)
        w_label = Text(f"{width}", font_size=label_size, color=BLUE, weight="BOLD")
        w_label.move_to([(front_bl[0] + front_br[0])/2, front_bl[1]-0.4, 0])

        # Height label (left)
        h_label = Text(f"{height}", font_size=label_size, color=ORANGE, weight="BOLD")
        h_label.move_to([front_bl[0]-0.5, (front_bl[1] + front_tl[1])/2, 0])

        # Depth label (diagonal)
        d_label = Text(f"{depth}", font_size=label_size, color=GREEN, weight="BOLD")
        d_label.move_to([(front_bl[0] + back_bl[0])/2, (front_bl[1] + back_bl[1])/2-0.3, 0])

        g.add(w_label, h_label, d_label)
        g.w_label = w_label
        g.h_label = h_label
        g.d_label = d_label

    return g


def unit_cubes_in_box(width=3, height=2, depth=2, sample_rate=1, cube_color=BLUE) -> VGroup:
    """Show a sampling of unit cubes filling a box."""
    cubes = VGroup()

    for i in range(0, width, sample_rate):
        for j in range(0, height, sample_rate):
            for k in range(0, min(depth, 3), sample_rate):  # Limit depth to show clearly
                # Isometric position
                iso_x = i + k * 0.3
                iso_y = j + k * 0.2

                # Draw a small cube
                cube = Rectangle(width=0.8, height=0.8, stroke_width=1,
                               stroke_color=WHITE, fill_color=cube_color, fill_opacity=0.6)
                cube.move_to([iso_x, iso_y, 0])
                cubes.add(cube)

    g = VGroup(cubes)
    g.cubes = cubes
    return g


def volume_formula_display(width, height, depth, result=None, result_color=GREEN) -> VGroup:
    """Show volume formula: width × height × depth = result."""
    if result is None:
        result = width * height * depth

    formula = VGroup(
        Text(f"{int(width)}", font_size=44, color=BLUE, weight="BOLD"),
        Text("×", font_size=36, color=WHITE),
        Text(f"{int(height)}", font_size=44, color=ORANGE, weight="BOLD"),
        Text("×", font_size=36, color=WHITE),
        Text(f"{int(depth)}", font_size=44, color=GREEN, weight="BOLD"),
        Text("=", font_size=36, color=WHITE),
        Text(f"{int(result)}", font_size=44, color=result_color, weight="BOLD"),
    ).arrange(RIGHT, buff=0.15)
    return formula


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
