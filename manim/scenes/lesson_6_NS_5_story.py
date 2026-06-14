"""Story: Katherine Johnson & Apollo. Aligned to 6.NS-5 (Coordinate plane).

Math: She used coordinate geometry to plot the path of Apollo 11 to the Moon.

This scene uses BESPOKE Manim motion — a real Axes, Earth and Moon plotted
at coordinates, and a curved trajectory traced live so the kid SEES the
coordinate plane in action.
"""
import math
from manim import (
    Axes, Circle, Dot, Text, VGroup, FadeIn, FadeOut, Create, Write,
    ParametricFunction, MoveAlongPath, AnimationGroup, Polygon, Line,
    UP, DOWN, LEFT, RIGHT, ORIGIN, PI, TAU,
    WHITE, BLUE, GREEN, RED, ORANGE, YELLOW, GOLD,
)
import _mascot as M
from _helpers import StoryDeck, _rt


def _rocket(scale=1.0):
    """Vector rocket (Cairo can't render the 🚀 emoji) — points UP."""
    body = Polygon([-0.12, -0.26, 0], [0.12, -0.26, 0], [0.12, 0.20, 0], [-0.12, 0.20, 0],
                   fill_color=WHITE, fill_opacity=1, stroke_color=BLUE, stroke_width=2)
    nose = Polygon([-0.12, 0.20, 0], [0.12, 0.20, 0], [0, 0.48, 0],
                   fill_color=RED, fill_opacity=1, stroke_width=0)
    fin_l = Polygon([-0.12, -0.26, 0], [-0.28, -0.40, 0], [-0.12, -0.04, 0],
                    fill_color=RED, fill_opacity=1, stroke_width=0)
    fin_r = Polygon([0.12, -0.26, 0], [0.28, -0.40, 0], [0.12, -0.04, 0],
                    fill_color=RED, fill_opacity=1, stroke_width=0)
    window = Circle(radius=0.07, fill_color=BLUE, fill_opacity=1,
                    stroke_color=WHITE, stroke_width=1.5).move_to([0, 0.0, 0])
    flame = Polygon([-0.08, -0.26, 0], [0.08, -0.26, 0], [0, -0.52, 0],
                    fill_color=ORANGE, fill_opacity=1, stroke_width=0)
    return VGroup(flame, fin_l, fin_r, body, nose, window).scale(scale)


class Lesson6NS5Story(StoryDeck):
    TITLE = "Story: Katherine Johnson & Apollo"
    DOMAIN = "6.NS"
    SUBTITLE = "The mathematician who got Apollo 11 to the Moon."

    # ── Bespoke visuals — real coordinate plane + planets + trajectory ──

    def v_nasa_room(self, scene, pal, mascot):
        # Blueprint-style room with a chalkboard "NASA · 1962" header.
        board = Polygon(
            [-3.0, -1.5, 0], [3.0, -1.5, 0], [3.0, 1.5, 0], [-3.0, 1.5, 0],
            fill_color="#0F2540", fill_opacity=0.9,
            stroke_color=GOLD, stroke_width=4,
        ).move_to(RIGHT * 3.2 + DOWN * 0.6)
        header = Text("NASA · 1962", font_size=34, color=GOLD, weight="BOLD").move_to(board.get_top() + DOWN * 0.45)
        equation = Text("v² = u² + 2as", font_size=24, color=WHITE).move_to(board.get_center())
        equation2 = Text("F = m a", font_size=24, color=WHITE).move_to(board.get_center() + DOWN * 0.55)
        chalk = VGroup(board, header, equation, equation2)
        scene.play(FadeIn(board, shift=DOWN * 0.2), Write(header), run_time=_rt(0.8))
        scene.play(Write(equation), run_time=_rt(0.6))
        scene.play(Write(equation2), run_time=_rt(0.6))
        return chalk

    def v_coord_plane(self, scene, pal, mascot):
        # A real Manim Axes, Earth + Moon plotted at coordinates, with their
        # (x, y) labels appearing alongside them.
        ax = Axes(
            x_range=[0, 12, 2], y_range=[0, 8, 2],
            x_length=5.4, y_length=3.4,
            axis_config={"color": WHITE, "stroke_width": 2,
                         "include_numbers": True, "font_size": 22},
            tips=True,
        ).move_to(RIGHT * 3.2 + DOWN * 0.4)
        x_lbl = Text("x", font_size=22, color=WHITE).next_to(ax.x_axis.get_end(), RIGHT, buff=0.1)
        y_lbl = Text("y", font_size=22, color=WHITE).next_to(ax.y_axis.get_end(), UP, buff=0.1)
        scene.play(Create(ax), Write(x_lbl), Write(y_lbl), run_time=_rt(1.1))

        # Earth at (2, 1)
        earth = Dot(ax.c2p(2, 1), color=BLUE, radius=0.18)
        earth_label = Text("Earth (2, 1)", font_size=20, color=BLUE, weight="BOLD")
        earth_label.next_to(earth, DOWN, buff=0.18)
        scene.play(FadeIn(earth, scale=1.4), Write(earth_label), run_time=_rt(0.7))

        # Moon at (10, 6)
        moon = Dot(ax.c2p(10, 6), color=YELLOW, radius=0.16)
        moon_label = Text("Moon (10, 6)", font_size=20, color=YELLOW, weight="BOLD")
        moon_label.next_to(moon, UP, buff=0.18)
        scene.play(FadeIn(moon, scale=1.4), Write(moon_label), run_time=_rt(0.7))

        return VGroup(ax, x_lbl, y_lbl, earth, earth_label, moon, moon_label)

    def v_trajectory(self, scene, pal, mascot):
        # Axes + Earth + Moon + a real curved trajectory traced from one to
        # the other. The rocket dot moves along the path.
        ax = Axes(
            x_range=[0, 12, 2], y_range=[0, 8, 2],
            x_length=5.4, y_length=3.4,
            axis_config={"color": WHITE, "stroke_width": 2,
                         "include_numbers": True, "font_size": 22},
            tips=True,
        ).move_to(RIGHT * 3.2 + DOWN * 0.4)
        earth = Dot(ax.c2p(2, 1), color=BLUE, radius=0.18)
        moon = Dot(ax.c2p(10, 6), color=YELLOW, radius=0.16)
        scene.play(Create(ax), FadeIn(earth, scale=1.4), FadeIn(moon, scale=1.4),
                   run_time=_rt(0.9))

        # Parametric curve from (2, 1) to (10, 6) with a small upward arc.
        def path(t):
            # t in [0, 1]; x linear, y has a parabolic bump.
            x = 2 + 8 * t
            y = 1 + 5 * t + 1.5 * t * (1 - t) * 4
            return ax.c2p(x, y)
        curve = ParametricFunction(path, t_range=[0, 1, 0.01],
                                   color=ORANGE, stroke_width=4)
        scene.play(Create(curve), run_time=_rt(1.6))

        # Rocket icon traces the curve.
        rocket = _rocket(0.8).move_to(path(0))
        scene.play(FadeIn(rocket), run_time=_rt(0.35))
        scene.play(MoveAlongPath(rocket, curve, run_time=_rt(2.0)))

        # Highlight the curve and rocket at the destination.
        scene.play(rocket.animate.scale(1.4), run_time=_rt(0.4))
        scene.play(rocket.animate.scale(1 / 1.4), run_time=_rt(0.3))

        return VGroup(ax, earth, moon, curve, rocket)

    def v_glenn(self, scene, pal, mascot):
        # John Glenn quote card, with a sharp single-line callout.
        quote = VGroup(
            Text('"Get the girl to', font_size=26, color=WHITE),
            Text('check the numbers."', font_size=26, color=WHITE),
            Text('— John Glenn, astronaut', font_size=22, color=GOLD, weight="BOLD"),
        ).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to(RIGHT * 3.2 + DOWN * 0.4)
        scene.play(Write(quote[0]), run_time=_rt(0.7))
        scene.play(Write(quote[1]), run_time=_rt(0.7))
        scene.play(FadeIn(quote[2], shift=DOWN * 0.1), run_time=_rt(0.6))
        return quote

    def v_landing(self, scene, pal, mascot):
        # Lunar surface with the lander and "1969" text.
        moon_ground = Polygon(
            [-3.0, -1.5, 0], [3.0, -1.5, 0], [3.0, -0.8, 0], [-3.0, -0.8, 0],
            fill_color="#5C5C5C", fill_opacity=0.85, stroke_color=WHITE, stroke_width=2,
        ).move_to(RIGHT * 3.2 + DOWN * 1.1)
        flag = VGroup(
            Line([0, -0.8, 0], [0, 0.4, 0], stroke_width=4, color=WHITE),
            Polygon([0, 0.4, 0], [0.5, 0.3, 0], [0, 0.1, 0],
                    fill_color=RED, fill_opacity=0.9, stroke_color=RED, stroke_width=1),
        ).move_to(RIGHT * 2.7 + DOWN * 0.4)
        lander = _rocket(1.3).move_to(RIGHT * 3.5 + DOWN * 0.35)
        year = Text("July 1969", font_size=30, color=YELLOW, weight="BOLD")
        year.move_to(RIGHT * 3.2 + UP * 0.8)
        scene.play(FadeIn(moon_ground), run_time=_rt(0.6))
        scene.play(FadeIn(lander, shift=DOWN * 0.4), run_time=_rt(0.8))
        scene.play(Create(flag[0]), FadeIn(flag[1], scale=1.2), run_time=_rt(0.7))
        scene.play(Write(year), run_time=_rt(0.7))
        return VGroup(moon_ground, flag, lander, year)

    BEATS = [
        {"head": "Math superstar",
         "body": "Katherine Johnson was a Black mathematician at NASA. She did some of the hardest math humans had ever attempted.",
         "visual": v_nasa_room},
        {"head": "Plotting a path",
         "body": "She used the coordinate plane. Every point in space gets a label like (x, y). Earth here, Moon way over there.",
         "visual": v_coord_plane},
        {"head": "The trajectory",
         "body": "Katherine calculated the EXACT curve a rocket would follow from Earth to Moon — every (x, y) point along the way.",
         "visual": v_trajectory},
        {"head": "Astronaut's choice",
         "body": "Astronaut John Glenn refused to fly unless Katherine personally checked the trajectory. The computers might be wrong — but she wouldn't be.",
         "visual": v_glenn},
        {"head": "We made it",
         "body": "Her work helped Apollo 11 land on the Moon in July 1969. The coordinate plane took humans to another world.",
         "visual": v_landing},
    ]
    LEARNED = "The coordinate plane pinpoints any location — even a spacecraft (x, y) million miles from home."
