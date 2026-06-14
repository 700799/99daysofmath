"""Reusable illustrations for the Story Time decks.

Each function takes (scene, palette, mascot) and draws a small visual in the
RIGHT pane while the body paragraph fades in on the LEFT. They return a
VGroup so the parent deck can fade them out at the end of the beat.
"""
from manim import (
    VGroup, Text, Circle, Ellipse, Line, Dot, Polygon, Rectangle, AnnularSector,
    NumberLine, Arc, RoundedRectangle, FadeIn, FadeOut, Write, Create,
    WHITE, BLUE, GREEN, RED, ORANGE, YELLOW, GOLD,
    UP, DOWN, LEFT, RIGHT, ORIGIN, PI, TAU,
)
import math

DARK = "#0F172A"
RIGHT_ANCHOR = RIGHT * 3.4 + DOWN * 0.4


# ── Vector icons (Cairo can't render colour emoji, so we draw them) ──────

def vec_rabbit(scale=1.0):
    """A simple bunny from shapes — head, two ears, eyes, nose."""
    head = Circle(radius=0.30, fill_color="#F3F4F6", fill_opacity=1,
                  stroke_color=WHITE, stroke_width=2)
    ear_l = Ellipse(width=0.15, height=0.42, fill_color="#F3F4F6",
                    fill_opacity=1, stroke_color=WHITE, stroke_width=2)
    ear_l.move_to(head.get_top() + UP * 0.16 + LEFT * 0.10)
    ear_r = ear_l.copy().move_to(head.get_top() + UP * 0.16 + RIGHT * 0.10)
    in_l = Ellipse(width=0.06, height=0.26, fill_color="#F9A8D4",
                   fill_opacity=1, stroke_width=0).move_to(ear_l)
    in_r = in_l.copy().move_to(ear_r)
    eye_l = Dot(head.get_center() + LEFT * 0.10 + UP * 0.03, radius=0.038, color="#111827")
    eye_r = Dot(head.get_center() + RIGHT * 0.10 + UP * 0.03, radius=0.038, color="#111827")
    nose = Dot(head.get_center() + DOWN * 0.07, radius=0.033, color="#FB7185")
    return VGroup(ear_l, ear_r, in_l, in_r, head, eye_l, eye_r, nose).scale(scale)


def vec_fly(scale=1.0):
    """A tiny fly — dark body with two translucent wings."""
    body = Ellipse(width=0.20, height=0.11, fill_color="#1F2937",
                   fill_opacity=1, stroke_width=0)
    wing_l = Ellipse(width=0.17, height=0.10, fill_color=WHITE, fill_opacity=0.55,
                     stroke_color=WHITE, stroke_width=1)
    wing_l.move_to(body.get_center() + UP * 0.06 + LEFT * 0.05)
    wing_r = wing_l.copy().move_to(body.get_center() + UP * 0.06 + RIGHT * 0.05)
    return VGroup(wing_l, wing_r, body).scale(scale)


def vec_flag(scale=1.0, color=RED):
    """A pennant flag on a pole."""
    pole = Line([0, -0.38, 0], [0, 0.42, 0], stroke_color=WHITE, stroke_width=3)
    cloth = Polygon([0, 0.42, 0], [0.48, 0.29, 0], [0, 0.16, 0],
                    fill_color=color, fill_opacity=1, stroke_width=0)
    return VGroup(pole, cloth).scale(scale)


# ── number / counting visuals ──────────────────────────────────────────

def stack_of_value(value, color=GOLD, max_show=20):
    """A stack of `value` coins/dots (capped at max_show so it fits)."""
    show = min(value, max_show)
    g = VGroup()
    for i in range(show):
        r = i // 5
        c = i % 5
        coin = Circle(radius=0.18, fill_color=color, fill_opacity=1,
                      stroke_color=DARK, stroke_width=2)
        coin.move_to([c * 0.42 - 0.84, 1.0 - r * 0.42, 0])
        g.add(coin)
    if value > max_show:
        more = Text(f"+{value - max_show} more", font_size=18, color=WHITE)
        more.next_to(g, DOWN, buff=0.2)
        g.add(more)
    return g


def big_number(s, color=YELLOW):
    return Text(str(s), font_size=72, color=color, weight="BOLD")


def labeled_value(label, value, color=GREEN):
    head = Text(label, font_size=20, color=WHITE, weight="BOLD")
    val = Text(str(value), font_size=48, color=color, weight="BOLD")
    return VGroup(head, val).arrange(DOWN, buff=0.18)


# ── Gauss: pairs of 1+100, 2+99, ... ───────────────────────────────────

def pair_sums():
    rows = []
    for i, (a, b) in enumerate([(1, 100), (2, 99), (3, 98)]):
        line = Text(f"{a} + {b} = 101", font_size=30, color=WHITE, weight="BOLD")
        rows.append(line)
    rows.append(Text("...", font_size=30, color=WHITE))
    rows.append(Text("50 pairs of 101", font_size=28, color=YELLOW, weight="BOLD"))
    g = VGroup(*rows).arrange(DOWN, buff=0.32, aligned_edge=LEFT)
    return g


def big_total():
    return Text("50 × 101 = 5050", font_size=42, color=GREEN, weight="BOLD")


# ── Penny doubles ──────────────────────────────────────────────────────

def doubling_table():
    rows = [
        ("Day 1", "1¢"),
        ("Day 5", "16¢"),
        ("Day 10", "$5.12"),
        ("Day 20", "$5,242.88"),
        ("Day 30", "$5.3 million"),
    ]
    lines = []
    for d, v in rows:
        line = VGroup(
            Text(d, font_size=24, color=BLUE, weight="BOLD"),
            Text(v, font_size=26, color=YELLOW, weight="BOLD"),
        ).arrange(RIGHT, buff=0.9)
        lines.append(line)
    return VGroup(*lines).arrange(DOWN, buff=0.28, aligned_edge=LEFT)


# ── Fibonacci ──────────────────────────────────────────────────────────

def fib_sequence():
    nums = [1, 1, 2, 3, 5, 8, 13, 21]
    chars = []
    for n in nums:
        chars.append(Text(str(n), font_size=34, color=YELLOW, weight="BOLD"))
    g = VGroup()
    row1 = VGroup(*chars[:5]).arrange(RIGHT, buff=0.5)
    row2 = VGroup(*chars[5:]).arrange(RIGHT, buff=0.5)
    g = VGroup(row1, row2).arrange(DOWN, buff=0.5, aligned_edge=LEFT)
    return g


def rabbit_row(count):
    return VGroup(*[vec_rabbit() for _ in range(min(count, 10))]).arrange(RIGHT, buff=0.16)


# ── Pizza ──────────────────────────────────────────────────────────────

def pizza_pair(big_d=2.0, small_d=1.4):
    big = Circle(radius=big_d, fill_color=ORANGE, fill_opacity=0.6, stroke_color=YELLOW, stroke_width=3)
    big_l = Text(f"{int(big_d*2*2.5)}\"", font_size=24, color=WHITE, weight="BOLD").next_to(big, DOWN, buff=0.18)
    small = Circle(radius=small_d, fill_color=ORANGE, fill_opacity=0.6, stroke_color=YELLOW, stroke_width=3)
    small_l = Text(f"{int(small_d*2*2.5)}\"", font_size=24, color=WHITE, weight="BOLD").next_to(small, DOWN, buff=0.18)
    g = VGroup(VGroup(big, big_l), VGroup(small, small_l)).arrange(RIGHT, buff=0.6)
    return g


def area_compare(big_area, small_area):
    return VGroup(
        Text(f"{big_area:.0f}", font_size=48, color=GREEN, weight="BOLD"),
        Text("vs", font_size=24, color=WHITE),
        Text(f"{small_area:.0f}", font_size=48, color=YELLOW, weight="BOLD"),
    ).arrange(RIGHT, buff=0.5)


# ── Birthday paradox ───────────────────────────────────────────────────

def birthday_curve():
    pts = [(5, 0.03), (10, 0.12), (15, 0.25), (20, 0.41), (23, 0.50), (30, 0.71), (40, 0.89)]
    lo, hi = 0, 50
    nl = NumberLine(x_range=[lo, hi, 10], length=4.8, include_numbers=True,
                    font_size=24, color=WHITE, stroke_width=3)
    nl.shift(DOWN * 0.6)
    dots = VGroup()
    for n, p in pts:
        x_loc = nl.n2p(n)[0]
        y_loc = -0.6 + p * 2.4
        dots.add(Dot([x_loc, y_loc, 0], radius=0.09, color=YELLOW))
    label = Text("23 people → 50% chance!", font_size=22, color=GREEN, weight="BOLD")
    label.next_to(nl, UP, buff=0.8)
    g = VGroup(nl, dots, label)
    return g


# ── Soccer / batting / basketball percentages ──────────────────────────

def percent_bar(percent, label):
    box = Rectangle(width=4.4, height=0.6, stroke_color=WHITE, stroke_width=3, fill_opacity=0)
    fill = Rectangle(width=4.4 * percent / 100, height=0.6,
                     fill_color=GREEN, fill_opacity=0.85, stroke_width=0)
    fill.align_to(box, LEFT)
    pct = Text(f"{percent}%", font_size=28, color=YELLOW, weight="BOLD").next_to(box, DOWN, buff=0.18)
    lbl = Text(label, font_size=22, color=WHITE, weight="BOLD").next_to(box, UP, buff=0.18)
    return VGroup(lbl, box, fill, pct)


def fraction_eq_percent(num, den, percent):
    return VGroup(
        Text(f"{num}/{den}", font_size=46, color=BLUE, weight="BOLD"),
        Text("=", font_size=46, color=WHITE),
        Text(f"{percent}%", font_size=46, color=GREEN, weight="BOLD"),
    ).arrange(RIGHT, buff=0.4)


# ── Handshake ──────────────────────────────────────────────────────────

def handshake_graph(n=6):
    pts = []
    for i in range(n):
        a = TAU * i / n - PI / 2
        pts.append([1.5 * math.cos(a), 1.5 * math.sin(a), 0])
    people = VGroup(*[Dot(p, radius=0.18, color=YELLOW) for p in pts])
    lines = VGroup()
    for i in range(n):
        for j in range(i + 1, n):
            lines.add(Line(pts[i], pts[j], stroke_width=2, color=BLUE).set_opacity(0.7))
    return VGroup(lines, people)


def handshake_formula(n):
    return VGroup(
        Text(f"{n} people", font_size=24, color=WHITE),
        Text(f"{n}·{n-1}/2 = {n*(n-1)//2}", font_size=36, color=YELLOW, weight="BOLD"),
        Text("handshakes", font_size=24, color=WHITE),
    ).arrange(DOWN, buff=0.25)


# ── Egyptian 3-4-5 triangle ────────────────────────────────────────────

def triangle_345():
    A = [-1.6, -1.0, 0]
    B = [1.6, -1.0, 0]
    C = [-1.6, 1.4, 0]
    tri = Polygon(A, B, C, fill_color=ORANGE, fill_opacity=0.35, stroke_color=ORANGE, stroke_width=3)
    a = Text("3", font_size=34, color=YELLOW, weight="BOLD").move_to([-2.0, 0.2, 0])
    b = Text("4", font_size=34, color=YELLOW, weight="BOLD").move_to([0, -1.4, 0])
    c = Text("5", font_size=34, color=GREEN, weight="BOLD").move_to([0.4, 0.5, 0])
    rt = Polygon([-1.4, -1.0, 0], [-1.4, -0.6, 0], [-1.0, -1.0, 0],
                 fill_color=WHITE, fill_opacity=0, stroke_color=WHITE, stroke_width=3)
    return VGroup(tri, rt, a, b, c)


# ── Coordinate / shortcut ──────────────────────────────────────────────

def shortcut_path():
    # Plot a square from (0,0) to (3,3) with right-then-up path vs diagonal.
    grid = NumberLine(x_range=[0, 4, 1], length=3.6, include_numbers=False,
                      color=WHITE, stroke_width=2)
    grid_y = NumberLine(x_range=[0, 4, 1], length=3.6, include_numbers=False,
                        color=WHITE, stroke_width=2).rotate(PI / 2)
    grid_y.next_to(grid, UP, buff=0).align_to(grid, LEFT).shift(DOWN * 1.8)
    L_path = VGroup(
        Line(grid.n2p(0), grid.n2p(3), stroke_width=5, color=YELLOW),
        Line(grid.n2p(3), grid.n2p(3) + UP * 2.7, stroke_width=5, color=YELLOW),
    )
    diag = Line(grid.n2p(0), grid.n2p(3) + UP * 2.7, stroke_width=5, color=GREEN)
    longw = Text("7", font_size=28, color=YELLOW, weight="BOLD").next_to(L_path, RIGHT, buff=0.3)
    shortw = Text("≈ 4.2", font_size=28, color=GREEN, weight="BOLD").next_to(diag, LEFT, buff=0.3)
    return VGroup(grid, grid_y, L_path, diag, longw, shortw)


# ── Tic-tac-toe ────────────────────────────────────────────────────────

def tictac_board():
    cells = VGroup()
    for r in range(3):
        for c in range(3):
            cell = Rectangle(width=0.7, height=0.7, stroke_color=WHITE, stroke_width=3, fill_opacity=0)
            cell.move_to([(c - 1) * 0.72, (1 - r) * 0.72, 0])
            cells.add(cell)
    # Marks: X in 8 lines pass through center → put X in center.
    X = Text("X", font_size=36, color=YELLOW, weight="BOLD").move_to([0, 0, 0])
    return VGroup(cells, X)


def tictac_lines():
    return Text("8 lines through center", font_size=26, color=GREEN, weight="BOLD")


# ── Archimedes water ───────────────────────────────────────────────────

def water_displacement():
    tub = Rectangle(width=3.4, height=2.2, stroke_color=WHITE, stroke_width=3)
    water = Rectangle(width=3.4, height=1.0, fill_color=BLUE, fill_opacity=0.5, stroke_width=0)
    water.align_to(tub, DOWN).shift(UP * 0.1)
    crown = Polygon([0, 0.5, 0], [-0.4, 0.2, 0], [-0.5, -0.1, 0],
                    [0.5, -0.1, 0], [0.4, 0.2, 0],
                    fill_color=GOLD, fill_opacity=0.95, stroke_color=YELLOW, stroke_width=2)
    crown.shift(UP * 0.3)
    raised = Line(tub.get_left() + RIGHT * 0.1 + UP * 0.55,
                  tub.get_right() + LEFT * 0.1 + UP * 0.55,
                  color=YELLOW, stroke_width=4)
    return VGroup(tub, water, crown, raised)


# ── Apollo trajectory ──────────────────────────────────────────────────

def apollo_curve():
    earth = Circle(radius=0.45, fill_color=BLUE, fill_opacity=0.85, stroke_color=WHITE, stroke_width=2).shift(LEFT * 1.8)
    moon = Circle(radius=0.32, fill_color=WHITE, fill_opacity=0.9, stroke_color=WHITE, stroke_width=2).shift(RIGHT * 1.8 + UP * 0.6)
    # curved trajectory from earth to moon
    from manim import ArcBetweenPoints
    arc = ArcBetweenPoints(earth.get_center() + RIGHT * 0.5, moon.get_center() + LEFT * 0.4,
                           angle=-PI / 2.2)
    arc.set_stroke(YELLOW, 4)
    coords = Text("(x, y)", font_size=22, color=YELLOW, weight="BOLD").move_to([0.2, 1.4, 0])
    return VGroup(earth, moon, arc, coords)


# ── Taxi number 1729 ───────────────────────────────────────────────────

def taxi_1729():
    big = Text("1729", font_size=72, color=YELLOW, weight="BOLD")
    line1 = Text("= 1³ + 12³", font_size=32, color=BLUE, weight="BOLD")
    line2 = Text("= 9³ + 10³", font_size=32, color=GREEN, weight="BOLD")
    return VGroup(big, line1, line2).arrange(DOWN, buff=0.35)


# ── Turing / cipher ────────────────────────────────────────────────────

def letter_freq():
    letters = [("E", 13), ("T", 9), ("A", 8), ("O", 7), ("I", 7)]
    bars = VGroup()
    for ch, freq in letters:
        bar = Rectangle(width=freq * 0.18, height=0.45,
                        fill_color=BLUE, fill_opacity=0.8, stroke_color=WHITE, stroke_width=2)
        lab = Text(ch, font_size=22, color=YELLOW, weight="BOLD")
        pct = Text(f"{freq}%", font_size=18, color=WHITE)
        row = VGroup(lab, bar, pct).arrange(RIGHT, buff=0.2)
        bars.add(row)
    return VGroup(*bars).arrange(DOWN, buff=0.16, aligned_edge=LEFT)


# ── Hexagons ──────────────────────────────────────────────────────────

def hex_tiling():
    g = VGroup()
    for r in range(2):
        for c in range(4):
            cx = c * 1.05 + (0.52 if r % 2 else 0) - 1.6
            cy = r * 0.9 - 0.4
            verts = [[cx + math.cos(a) * 0.55, cy + math.sin(a) * 0.55, 0]
                     for a in [PI / 6 + k * PI / 3 for k in range(6)]]
            hex_ = Polygon(*verts, fill_color=GOLD, fill_opacity=0.75,
                           stroke_color=YELLOW, stroke_width=2)
            g.add(hex_)
    return g


# ── Chessboard rice ────────────────────────────────────────────────────

def chess_doubling():
    rows = [
        ("Square 1", "1 grain"),
        ("Square 2", "2"),
        ("Square 4", "8"),
        ("Square 10", "512"),
        ("Square 32", "2.1 billion"),
        ("Square 64", "18 quintillion"),
    ]
    lines = []
    for d, v in rows:
        line = VGroup(
            Text(d, font_size=22, color=BLUE, weight="BOLD"),
            Text(v, font_size=24, color=YELLOW, weight="BOLD"),
        ).arrange(RIGHT, buff=0.6)
        lines.append(line)
    return VGroup(*lines).arrange(DOWN, buff=0.22, aligned_edge=LEFT)


# ── Zero & number line ───────────────────────────────────────────────

def number_line_zero():
    nl = NumberLine(x_range=[-3, 3, 1], length=5.0, include_numbers=True,
                    font_size=32, color=WHITE, stroke_width=4)
    zero_dot = Dot(nl.n2p(0), color=YELLOW, radius=0.18)
    label = Text("Zero!", font_size=28, color=YELLOW, weight="BOLD").next_to(zero_dot, UP, buff=0.4)
    return VGroup(nl, zero_dot, label)


def big_label(text, color=YELLOW):
    return Text(text, font_size=42, color=color, weight="BOLD")


# ── Hypatia — Alexandria, polygons & conic sections ────────────────────

def alexandria_scroll():
    scroll = Rectangle(width=2.4, height=1.6, fill_color=GOLD, fill_opacity=0.25,
                       stroke_color=GOLD, stroke_width=3)
    return VGroup(scroll, Text("ΑΛΕΞΑΝΔΡΕΙΑ", font_size=22, color=YELLOW, weight="BOLD").move_to(scroll))


def regular_polygons():
    g = VGroup()
    sides = [3, 4, 5, 6]
    colors = [BLUE, ORANGE, GREEN, YELLOW]
    for i, n in enumerate(sides):
        verts = [[math.cos(PI / 2 + k * TAU / n) * 0.5,
                  math.sin(PI / 2 + k * TAU / n) * 0.5, 0]
                 for k in range(n)]
        poly = Polygon(*verts, stroke_color=colors[i], stroke_width=3,
                       fill_color=colors[i], fill_opacity=0.25)
        poly.shift(RIGHT * (i % 2) * 1.5 + UP * (1 - i // 2) * 1.3)
        g.add(poly)
    return g


def cone_section():
    cone = Polygon([0, 1.2, 0], [-0.9, -0.5, 0], [0.9, -0.5, 0],
                   fill_color=BLUE, fill_opacity=0.25,
                   stroke_color=BLUE, stroke_width=3)
    slice_line = Line([-1.0, 0.3, 0], [1.0, -0.1, 0], color=YELLOW, stroke_width=4)
    label = Text("Slice = curve", font_size=24, color=YELLOW, weight="BOLD")
    label.next_to(cone, DOWN, buff=0.4)
    return VGroup(cone, slice_line, label)


# ── Florence Nightingale — rose diagram for cause of death ──────────────

def crimea_map():
    map_box = Rectangle(width=2.8, height=2.0, fill_color=BLUE, fill_opacity=0.15,
                        stroke_color=BLUE, stroke_width=2)
    title = Text("Crimea, 1854", font_size=22, color=BLUE, weight="BOLD").next_to(map_box, UP, buff=0.2)
    flag = vec_flag().move_to(map_box.get_center())
    return VGroup(map_box, title, flag)


def hospital_cost():
    bars = VGroup()
    causes = [("Disease", 0.85, RED), ("Wounds", 0.15, ORANGE)]
    for i, (label, frac, color) in enumerate(causes):
        bar = Rectangle(width=3.0 * frac, height=0.6, fill_color=color,
                        fill_opacity=0.85, stroke_color=WHITE, stroke_width=2)
        lab = Text(label, font_size=22, color=color, weight="BOLD")
        pct = Text(f"{int(frac*100)}%", font_size=22, color=WHITE)
        row = VGroup(lab, bar, pct).arrange(RIGHT, buff=0.25)
        bars.add(row)
    return VGroup(*bars).arrange(DOWN, buff=0.3, aligned_edge=LEFT)


def rose_diagram():
    # Coxcomb / rose chart with 4 wedges, varying radii.
    g = VGroup()
    months = [(0.6, RED), (0.95, RED), (0.45, ORANGE), (0.3, BLUE)]
    for i, (r, color) in enumerate(months):
        ang0 = i * TAU / 4
        ang1 = (i + 1) * TAU / 4
        wedge = AnnularSector(inner_radius=0.0, outer_radius=r * 1.6,
                              angle=ang1 - ang0, start_angle=ang0,
                              fill_color=color, fill_opacity=0.7,
                              stroke_color=WHITE, stroke_width=2)
        g.add(wedge)
    label = Text("Disease deaths", font_size=22, color=RED, weight="BOLD")
    label.next_to(g, DOWN, buff=0.3)
    return VGroup(g, label)


# ── Descartes — fly on the ceiling → coordinate plane ──────────────────

def ceiling_fly():
    ceiling = Rectangle(width=3.6, height=2.4, fill_color="#FAFAFA", fill_opacity=0.15,
                        stroke_color=WHITE, stroke_width=2)
    fly = vec_fly(1.4).shift(RIGHT * 0.8 + UP * 0.6)
    return VGroup(ceiling, fly)


def coord_with_fly():
    from manim import Axes
    grid = NumberLine(x_range=[0, 5, 1], length=3.4, include_numbers=True,
                      font_size=26, color=WHITE, stroke_width=3)
    grid_y = NumberLine(x_range=[0, 4, 1], length=2.8, include_numbers=True,
                        font_size=26, color=WHITE, stroke_width=3).rotate(PI / 2)
    grid_y.next_to(grid, UP, buff=0).align_to(grid, LEFT)
    point = Dot(grid.n2p(3) + UP * 1.6, color=YELLOW, radius=0.12)
    fly = vec_fly(0.9).next_to(point, UP + RIGHT, buff=0.04)
    coord = Text("(3, 2)", font_size=30, color=YELLOW, weight="BOLD")
    coord.next_to(point, DOWN + RIGHT, buff=0.2)
    return VGroup(grid, grid_y, point, fly, coord)


def x_y_anywhere():
    return VGroup(
        Text("Any point =", font_size=26, color=WHITE),
        Text("(x, y)", font_size=46, color=YELLOW, weight="BOLD"),
    ).arrange(DOWN, buff=0.25)


# ── Banneker — clock + almanac + DC compass ────────────────────────────

def wooden_clock():
    face = Circle(radius=0.9, fill_color="#A87C5A", fill_opacity=0.9, stroke_color=GOLD, stroke_width=3)
    hour = Line([0, 0, 0], [0, 0.55, 0], stroke_width=6, color=DARK)
    minute = Line([0, 0, 0], [0.7, 0, 0], stroke_width=5, color=DARK)
    pivot = Dot(ORIGIN, radius=0.06, color=GOLD)
    return VGroup(face, hour, minute, pivot)


def almanac_grid():
    rows = []
    days = ["Mar 1", "Mar 15", "Apr 1", "Apr 15"]
    times = ["6:32", "6:18", "5:54", "5:30"]
    rows.append(VGroup(
        Text("Date", font_size=22, color=BLUE, weight="BOLD"),
        Text("Sunrise", font_size=22, color=ORANGE, weight="BOLD"),
    ).arrange(RIGHT, buff=1.4))
    for d, t in zip(days, times):
        rows.append(VGroup(
            Text(d, font_size=22, color=WHITE),
            Text(t, font_size=22, color=YELLOW, weight="BOLD"),
        ).arrange(RIGHT, buff=1.8))
    return VGroup(*rows).arrange(DOWN, buff=0.22, aligned_edge=LEFT)


def dc_compass():
    diamond = Polygon([0, 1.2, 0], [1.2, 0, 0], [0, -1.2, 0], [-1.2, 0, 0],
                      fill_color=WHITE, fill_opacity=0.1,
                      stroke_color=YELLOW, stroke_width=3)
    n = Text("N", font_size=24, color=YELLOW, weight="BOLD").next_to(diamond, UP, buff=0.05)
    label = Text("D.C.", font_size=30, color=YELLOW, weight="BOLD").move_to(diamond)
    return VGroup(diamond, n, label)


# ── Mirzakhani — surfaces, doodles, Fields Medal ───────────────────────

def doodle_curves():
    from manim import ParametricFunction
    f = ParametricFunction(
        lambda t: [1.4 * math.cos(t), 0.8 * math.sin(t) + 0.4 * math.sin(2 * t), 0],
        t_range=[0, TAU],
        color=BLUE, stroke_width=4,
    )
    f2 = ParametricFunction(
        lambda t: [1.4 * math.cos(t) * 0.6, 0.8 * math.sin(t), 0],
        t_range=[0, TAU],
        color=ORANGE, stroke_width=4,
    )
    return VGroup(f, f2)


def fields_medal():
    coin = Circle(radius=1.0, fill_color=GOLD, fill_opacity=0.95,
                  stroke_color=YELLOW, stroke_width=4)
    text = Text("Fields\nMedal", font_size=24, color=DARK, weight="BOLD").move_to(coin)
    return VGroup(coin, text)


def hex_net():
    # Hexagonal "net" (a flat thing that folds into a shape).
    hex_top = []
    verts = [[math.cos(PI / 6 + k * PI / 3) * 0.7,
              math.sin(PI / 6 + k * PI / 3) * 0.7, 0]
             for k in range(6)]
    hex_top = Polygon(*verts, stroke_color=YELLOW, stroke_width=3,
                      fill_color=YELLOW, fill_opacity=0.3)
    return hex_top


def saddle_surface():
    # Wireframe saddle (suggesting curved surface).
    from manim import ParametricFunction
    g = VGroup()
    for u in [-1, -0.5, 0, 0.5, 1]:
        f = ParametricFunction(
            lambda t, u=u: [t, u, 0],
            t_range=[-1.2, 1.2],
            color=BLUE, stroke_width=2,
        )
        g.add(f)
    for v in [-1, -0.5, 0, 0.5, 1]:
        f = ParametricFunction(
            lambda t, v=v: [v, t * 0.7, 0],
            t_range=[-1.2, 1.2],
            color=ORANGE, stroke_width=2,
        )
        g.add(f)
    return g
