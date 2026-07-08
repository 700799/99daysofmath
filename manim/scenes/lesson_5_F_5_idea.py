"""5.F Unit 5 — Measurement, conversions & volume  (TeachingDeck)

Math (verified):
  • 2 meters to centimeters: 1 m = 100 cm, 2 × 100 = 200 cm.
  • Volume 3×2×4 box: 3×2=6, 6×4=24 cubic units.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card
import _geo as G
import numpy as np


class Lesson5F5Idea(TeachingDeck):
    TITLE = "Measurement, conversions & volume"
    DOMAIN = "5.F"
    HOOK = "3 meters... how many centimeters is that? Bigger unit to smaller — more or fewer pieces?"
    RECAP = [
        "Bigger → smaller unit: MULTIPLY",
        "Smaller → bigger unit: DIVIDE",
        "Volume of a box = l × w × h",
    ]

    def concept(self):
        pal = self.pal
        cap0 = Text("Anchor facts:", font_size=26, color=pal["accent"], weight="BOLD").move_to(UP * 2.1)
        anchors = Text("100 cm = 1 m   12 in = 1 ft   60 min = 1 hr", font_size=24,
                       color=pal["step"], weight="BOLD").move_to(UP * 1.5)
        self.reveal(FadeIn(cap0), FadeIn(anchors), rt=1.5)
        self.breathe(1.8)

        big = Text("3 m", font_size=40, color=BLUE, weight="BOLD").move_to(LEFT * 3.0 + UP * 0.2)
        arrow = Arrow(LEFT * 1.6, RIGHT * 0.2, color=ORANGE, buff=0.1).move_to(UP * 0.2)
        small = Text("300 cm", font_size=40, color=ORANGE, weight="BOLD").move_to(RIGHT * 2.0 + UP * 0.2)
        self.reveal(FadeIn(big), rt=1.3)
        self.breathe(1.2)
        self.reveal(GrowArrow(arrow), FadeIn(small), rt=1.4)
        cap1 = Text("SMALLER unit: more pieces → MULTIPLY", font_size=26, color=ORANGE,
                    weight="BOLD").move_to(DOWN * 1.1)
        self.reveal(FadeIn(cap1, shift=UP * 0.15), rt=1.4)
        self.breathe(2.0)

        return VGroup(cap0, anchors, big, arrow, small, cap1)

    def example(self):
        pal = self.pal
        q = Text("Volume of a 3 × 2 × 4 box?", font_size=32, color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        u = 0.5
        ov = np.array([-5.6, -1.6, 0.0])
        box = G.cuboid(3, 2, 4, u=u, color=GREEN, grid=True).shift(ov)
        self.reveal(Create(box), rt=1.6)
        self.breathe(1.6)

        steps = self.step_lines([
            ("3 × 2 = 6", pal["step"]),
            ("6 × 4 = 24 cubic units", pal["step"]),
        ], anchor=RIGHT * 1.8 + UP * 1.0, size=28, gap=0.4)

        ans = answer_card(self, "24 cubic units", pal["answer"], self.mascot, pos=RIGHT * 1.8 + DOWN * 1.3)
        self.breathe(2.0)
        return VGroup(q, box, steps, ans)
