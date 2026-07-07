"""6.G Unit 10 — Surface area & nets  (TeachingDeck)

Math (verified):
  • 2×3×4 prism: face pairs 2×3=6, 2×4=8, 3×4=12.
    SA = 2×(6+8+12) = 2×26 = 52.
"""
import numpy as np
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card
import _geo as G


class Lesson6G10(TeachingDeck):
    TITLE = "Surface area & nets"
    DOMAIN = "6.G"
    HOOK = "A cereal box, 2 by 3 by 4 — how much cardboard makes it?"
    RECAP = [
        "A net = the solid unfolded flat",
        "Add up EVERY face's area",
        "3 pairs of matching faces on a box",
    ]

    def concept(self):
        pal = self.pal
        u = 0.5
        ov = np.array([-6.0, -1.3, 0.0])
        box = G.cuboid(2, 3, 4, u=u, color=BLUE, grid=False).shift(ov)
        self.reveal(Create(box), rt=1.6)
        self.breathe(1.6)

        cap0 = Text("3 pairs of matching faces:", font_size=26, color=pal["accent"],
                    weight="BOLD").move_to(RIGHT * 1.6 + UP * 2.1)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.3)
        self.breathe(1.4)

        p1 = Text("front & back: 2 × 3 = 6", font_size=24, color=GREEN, weight="BOLD").move_to(RIGHT * 1.6 + UP * 1.2)
        p2 = Text("top & bottom: 2 × 4 = 8", font_size=24, color=ORANGE, weight="BOLD").next_to(p1, DOWN, buff=0.35)
        p3 = Text("left & right: 3 × 4 = 12", font_size=24, color=YELLOW, weight="BOLD").next_to(p2, DOWN, buff=0.35)
        self.reveal(FadeIn(p1), rt=1.2)
        self.breathe(1.3)
        self.reveal(FadeIn(p2), rt=1.2)
        self.breathe(1.3)
        self.reveal(FadeIn(p3), rt=1.2)
        self.breathe(1.8)

        return VGroup(box, cap0, p1, p2, p3)

    def example(self):
        pal = self.pal
        q = Text("2 × 3 × 4 prism. Surface area?", font_size=30,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        u = 0.42
        ov = np.array([-6.0, -1.6, 0.0])
        box = G.cuboid(2, 3, 4, u=u, color=ORANGE, grid=False).shift(ov)
        self.reveal(Create(box), rt=1.5)
        self.breathe(1.4)

        steps = self.step_lines([
            ("2×3 = 6, 2×4 = 8, 3×4 = 12", pal["step"]),
            ("6 + 8 + 12 = 26", pal["step"]),
            ("2 × 26 (both faces of each pair)", pal["step"]),
        ], anchor=RIGHT * 1.9 + UP * 1.5, size=24, gap=0.32)

        ans = answer_card(self, "SA = 52", pal["answer"], self.mascot, pos=RIGHT * 1.9 + DOWN * 1.4)
        self.breathe(2.0)
        return VGroup(q, box, steps, ans)
