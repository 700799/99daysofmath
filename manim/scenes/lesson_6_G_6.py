"""6.G Unit 6 — Area & volume review  (TeachingDeck)

Math (verified):
  • Prism 2×3×5: V = 2×3×5 = 30 cubic units.
  • Triangle base 6, height 9: A = ½×6×9 = 27 square units.
"""
import numpy as np
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card
import _geo as G


class Lesson6G6(TeachingDeck):
    TITLE = "Area & volume review"
    DOMAIN = "6.G"
    HOOK = "Same numbers, 2 and 3 and 5 — could they answer TWO totally different questions?"
    RECAP = [
        "Flat → area (square units)",
        "Solid → volume (cubic units)",
        "Triangle ½bh · Rectangle lw · Prism lwh",
    ]

    def concept(self):
        pal = self.pal
        rect = Rectangle(width=2.6, height=1.8, color=BLUE, fill_color=BLUE, fill_opacity=0.35)
        rect.move_to(LEFT * 3.4 + UP * 0.8)
        rect_lbl = Text("Flat shape → AREA\n(square units)", font_size=22, color=BLUE,
                        weight="BOLD").next_to(rect, DOWN, buff=0.3)
        self.reveal(FadeIn(rect), FadeIn(rect_lbl), rt=1.5)
        self.breathe(1.6)

        u = 0.5
        ov = np.array([1.0, -0.6, 0.0])
        box = G.cuboid(2, 3, 3, u=u, color=ORANGE, grid=False).shift(ov)
        box_lbl = Text("Solid shape → VOLUME\n(cubic units)", font_size=22, color=ORANGE,
                       weight="BOLD").next_to(box, DOWN, buff=0.5)
        self.reveal(FadeIn(box), FadeIn(box_lbl), rt=1.6)
        self.breathe(2.0)

        cap = Text("The units label tells you which one!", font_size=26,
                   color=pal["accent"], weight="BOLD").move_to(UP * 2.2)
        self.reveal(FadeIn(cap, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        return VGroup(rect, rect_lbl, box, box_lbl, cap)

    def example(self):
        pal = self.pal
        q = Text("Triangle: base 6, height 9. Area?", font_size=30,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.8)

        u = 0.4
        ov = np.array([-4.5, -1.6, 0.0])
        tri = Polygon(G.P(0, 0), G.P(6 * u, 0), G.P(3 * u, 9 * u),
                     stroke_color=WHITE, stroke_width=4, fill_color=GREEN, fill_opacity=0.35).shift(ov)
        base_lbl = Text("base = 6", font_size=24, color=YELLOW, weight="BOLD").move_to(G.P(3 * u, -0.4) + ov)
        h_line = DashedLine(G.P(3 * u, 0) + ov, G.P(3 * u, 9 * u) + ov, color=YELLOW, stroke_width=3)
        hgt_lbl = Text("height = 9", font_size=24, color=YELLOW, weight="BOLD").next_to(h_line, RIGHT, buff=0.15)
        self.reveal(Create(tri), rt=1.4)
        self.breathe(1.2)
        self.reveal(FadeIn(base_lbl), Create(h_line), FadeIn(hgt_lbl), rt=1.5)
        self.breathe(1.8)

        steps = self.step_lines([
            ("A = ½ × base × height", pal["step"]),
            ("½ × 6 × 9 = ½ × 54", pal["step"]),
        ], anchor=RIGHT * 2.2 + UP * 1.2, size=26, gap=0.36)

        ans = answer_card(self, "Area = 27 sq units", pal["answer"], self.mascot, pos=RIGHT * 2.2 + DOWN * 1.3)
        self.breathe(2.0)
        return VGroup(q, tri, base_lbl, h_line, hgt_lbl, steps, ans)
