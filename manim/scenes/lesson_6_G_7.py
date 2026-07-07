"""6.G Unit 7 — Composite figures (area)  (TeachingDeck)

Math (verified):
  • House shape = rectangle 8×5 + triangle base 8, height 4.
    Rectangle: 8×5=40. Triangle: ½×8×4 = ½×32 = 16. Total: 40+16=56.
"""
import numpy as np
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card
import _geo as G


class Lesson6G7(TeachingDeck):
    TITLE = "Composite figures (area)"
    DOMAIN = "6.G"
    HOOK = "A house-shaped sign: a rectangle wall with a triangle roof — what's its total area?"
    RECAP = [
        "Split into shapes you know",
        "Add the pieces (subtract cutouts)",
        "Label every length before you compute",
    ]

    def concept(self):
        pal = self.pal
        u = 0.42
        ov = np.array([-5.6, -1.9, 0.0])
        wall = Rectangle(width=8 * u, height=5 * u, color=BLUE, fill_color=BLUE,
                         fill_opacity=0.35, stroke_width=4)
        wall.move_to(G.P(4 * u, 2.5 * u) + ov)
        roof = Polygon(G.P(0, 5 * u), G.P(8 * u, 5 * u), G.P(4 * u, 9 * u),
                       stroke_color=WHITE, stroke_width=4, fill_color=ORANGE, fill_opacity=0.35).shift(ov)
        self.reveal(Create(wall), rt=1.5)
        self.breathe(1.4)
        self.reveal(Create(roof), rt=1.5)
        self.breathe(1.6)

        w_lbl = Text("8 × 5 rectangle", font_size=24, color=BLUE, weight="BOLD").move_to(RIGHT * 1.8 + UP * 1.4)
        r_lbl = Text("base 8, height 4 triangle", font_size=24, color=ORANGE, weight="BOLD").next_to(w_lbl, DOWN, buff=0.4)
        self.reveal(FadeIn(w_lbl), rt=1.3)
        self.breathe(1.3)
        self.reveal(FadeIn(r_lbl), rt=1.3)
        self.breathe(1.6)

        cap = Text("Two shapes, one house!", font_size=26, color=pal["accent"],
                   weight="BOLD").next_to(r_lbl, DOWN, buff=0.6)
        self.reveal(FadeIn(cap, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        return VGroup(wall, roof, w_lbl, r_lbl, cap)

    def example(self):
        pal = self.pal
        q = Text("House: 8×5 wall + triangle roof (base 8, h 4). Total area?",
                 font_size=26, color=pal["accent"], weight="BOLD").move_to(UP * 2.35)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        u = 0.36
        ov = np.array([-6.1, -1.9, 0.0])
        wall = Rectangle(width=8 * u, height=5 * u, color=BLUE, fill_color=BLUE,
                         fill_opacity=0.35, stroke_width=4).move_to(G.P(4 * u, 2.5 * u) + ov)
        roof = Polygon(G.P(0, 5 * u), G.P(8 * u, 5 * u), G.P(4 * u, 9 * u),
                       stroke_color=WHITE, stroke_width=4, fill_color=ORANGE, fill_opacity=0.35).shift(ov)
        self.reveal(Create(wall), Create(roof), rt=1.6)
        self.breathe(1.6)

        steps = self.step_lines([
            ("Rectangle: 8 × 5 = 40", BLUE),
            ("Triangle: ½ × 8 × 4 = 16", ORANGE),
            ("Add: 40 + 16", pal["step"]),
        ], anchor=RIGHT * 2.3 + UP * 1.4, size=24, gap=0.32)

        ans = answer_card(self, "Total area = 56", pal["answer"], self.mascot, pos=RIGHT * 2.3 + DOWN * 1.4)
        self.breathe(2.0)
        return VGroup(q, wall, roof, steps, ans)
