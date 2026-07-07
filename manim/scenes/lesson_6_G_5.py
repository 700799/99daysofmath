"""6.G Unit 5 — Composite figures (area)  (TeachingDeck)

Math (verified):
  • L-shape = 4×2 rectangle + 3×2 rectangle. 4×2=8, 3×2=6, 8+6=14.
  • 5×5 square minus 2×2 cutout = 25−4=21.
"""
import numpy as np
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card
import _geo as G


class Lesson6G5(TeachingDeck):
    TITLE = "Composite figures (area)"
    DOMAIN = "6.G"
    HOOK = "An L-shaped room — how do you find its floor area without one formula?"
    RECAP = [
        "Cut the shape into pieces you know",
        "Find each piece's area",
        "Add the pieces — or subtract a hole",
    ]

    def concept(self):
        pal = self.pal
        u = 0.55
        ov = np.array([-6.0, -1.5, 0.0])
        big = Polygon(
            G.P(0, 0), G.P(4 * u, 0), G.P(4 * u, 2 * u), G.P(2 * u, 2 * u),
            G.P(2 * u, 4 * u), G.P(0, 4 * u),
            stroke_color=WHITE, stroke_width=4, fill_color=BLUE, fill_opacity=0.35,
        ).shift(ov)
        self.reveal(Create(big), rt=1.6)
        self.breathe(1.6)

        cut = DashedLine(G.P(0, 2 * u) + ov, G.P(4 * u, 2 * u) + ov, color=YELLOW, stroke_width=4)
        self.reveal(Create(cut), rt=1.3)
        cap0 = Text("Cut it into two rectangles", font_size=26, color=pal["accent"],
                    weight="BOLD").move_to(RIGHT * 1.8 + UP * 2.2)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.2)
        self.breathe(1.6)

        r1 = Text("4 × 2 = 8", font_size=28, color=GREEN, weight="BOLD").move_to(RIGHT * 1.8 + UP * 1.1)
        r2 = Text("3 × 2 = 6", font_size=28, color=ORANGE, weight="BOLD").move_to(RIGHT * 1.8 + UP * 0.2)
        self.reveal(FadeIn(r1), rt=1.3)
        self.breathe(1.4)
        self.reveal(FadeIn(r2), rt=1.3)
        self.breathe(1.6)

        total = Text("8 + 6 = 14", font_size=32, color=pal["answer"], weight="BOLD").move_to(RIGHT * 1.8 + DOWN * 1.0)
        self.reveal(FadeIn(total, scale=1.2), rt=1.4)
        self.breathe(2.0)

        return VGroup(big, cut, cap0, r1, r2, total)

    def example(self):
        pal = self.pal
        q = Text("A 5×5 square has a 2×2 corner cut out. Area?", font_size=28,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.35)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        u = 0.5
        ov = np.array([-6.0, -1.7, 0.0])
        big = Polygon(
            G.P(0, 0), G.P(5 * u, 0), G.P(5 * u, 5 * u), G.P(0, 5 * u),
            stroke_color=WHITE, stroke_width=4, fill_color=BLUE, fill_opacity=0.30,
        ).shift(ov)
        hole = Polygon(
            G.P(3 * u, 3 * u), G.P(5 * u, 3 * u), G.P(5 * u, 5 * u), G.P(3 * u, 5 * u),
            stroke_color=RED, stroke_width=4, fill_color=BLACK, fill_opacity=1,
        ).shift(ov)
        self.reveal(Create(big), rt=1.4)
        self.breathe(1.2)
        self.reveal(FadeIn(hole), rt=1.3)
        cap = Text("cut out!", font_size=22, color=RED, weight="BOLD").move_to(G.P(4 * u, 4 * u) + ov)
        self.reveal(FadeIn(cap), rt=1.1)
        self.breathe(1.6)

        steps = self.step_lines([
            ("Whole square: 5 × 5 = 25", pal["step"]),
            ("Hole: 2 × 2 = 4", RED),
            ("Subtract: 25 − 4", pal["step"]),
        ], anchor=RIGHT * 2.2 + UP * 1.4, size=26, gap=0.34)

        ans = answer_card(self, "Area = 21", pal["answer"], self.mascot, pos=RIGHT * 2.2 + DOWN * 1.3)
        self.breathe(2.0)
        return VGroup(q, big, hole, cap, steps, ans)
