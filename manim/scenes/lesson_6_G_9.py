"""6.G Unit 9 — Polygons on the coordinate plane  (TeachingDeck)

Math (verified):
  • (−3,4) to (2,4): same y → horizontal, |2−(−3)| = 5.
  • Rectangle (0,0)(4,0)(4,3)(0,3): width 4, height 3, area 4×3=12.
"""
import numpy as np
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card
import _geo as G


class Lesson6G9(TeachingDeck):
    TITLE = "Polygons on the coordinate plane"
    DOMAIN = "6.G"
    HOOK = "Two points at (−3,4) and (2,4) — same height on the grid. How far apart, without counting one square at a time?"
    RECAP = [
        "Same y → horizontal: subtract the x's",
        "Same x → vertical: subtract the y's",
        "Rectangle area = width × height",
    ]

    def concept(self):
        pal = self.pal
        u = 0.5
        shift_amt = np.array([-3.7, -0.3, 0.0])
        plane = G.grid_plane(-6, 4, -2, 6, u=u).shift(shift_amt)
        self.reveal(Create(plane), rt=1.6)
        self.breathe(1.4)

        p1 = G.gp_dot(shift_amt, -3, 4, u=u, color=GREEN)
        p2 = G.gp_dot(shift_amt, 2, 4, u=u, color=ORANGE)
        l1 = Text("(−3,4)", font_size=22, color=GREEN, weight="BOLD").next_to(p1, UP, buff=0.12)
        l2 = Text("(2,4)", font_size=22, color=ORANGE, weight="BOLD").next_to(p2, UP, buff=0.12)
        seg = Line(G.P(-3 * u, 4 * u) + shift_amt, G.P(2 * u, 4 * u) + shift_amt, color=YELLOW, stroke_width=5)
        self.reveal(FadeIn(p1, scale=1.5), FadeIn(p2, scale=1.5), FadeIn(l1), FadeIn(l2), Create(seg), rt=1.6)
        cap0 = Text("same y → |2−(−3)| = 5", font_size=24, color=YELLOW, weight="BOLD").move_to(RIGHT * 3.0 + UP * 1.6)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        cap1 = Text("same x → subtract the y's instead", font_size=22, color=BLUE,
                    weight="BOLD").move_to(RIGHT * 3.0 + UP * 0.4)
        self.reveal(FadeIn(cap1, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        return VGroup(plane, p1, p2, l1, l2, seg, cap0, cap1)

    def example(self):
        pal = self.pal
        q = Text("Rectangle (0,0)(4,0)(4,3)(0,3) — area?", font_size=28,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.35)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        u = 0.55
        shift_amt = np.array([-4.6, -1.9, 0.0])
        plane = G.grid_plane(0, 6, 0, 5, u=u).shift(shift_amt)
        self.reveal(Create(plane), rt=1.4)

        rect = Polygon(
            G.P(0, 0) + shift_amt, G.P(4 * u, 0) + shift_amt,
            G.P(4 * u, 3 * u) + shift_amt, G.P(0, 3 * u) + shift_amt,
            stroke_color=BLUE, stroke_width=4, fill_color=BLUE, fill_opacity=0.25,
        )
        self.reveal(Create(rect), rt=1.5)
        self.breathe(1.4)

        wb = Brace(Line(G.P(0, 0) + shift_amt, G.P(4 * u, 0) + shift_amt), direction=DOWN, color=ORANGE)
        wb_lbl = Text("width 4", font_size=22, color=ORANGE, weight="BOLD").next_to(wb, DOWN, buff=0.1)
        hb = Brace(Line(G.P(0, 0) + shift_amt, G.P(0, 3 * u) + shift_amt), direction=LEFT, color=GREEN)
        hb_lbl = Text("height 3", font_size=22, color=GREEN, weight="BOLD").next_to(hb, LEFT, buff=0.1)
        self.reveal(GrowFromCenter(wb), FadeIn(wb_lbl), rt=1.4)
        self.breathe(1.3)
        self.reveal(GrowFromCenter(hb), FadeIn(hb_lbl), rt=1.4)
        self.breathe(1.6)

        steps = self.step_lines([
            ("width × height", pal["step"]),
            ("4 × 3", pal["step"]),
        ], anchor=RIGHT * 2.6 + UP * 1.4, size=28, gap=0.36)

        ans = answer_card(self, "Area = 12", pal["answer"], self.mascot, pos=RIGHT * 2.6 + DOWN * 1.0)
        self.breathe(2.0)
        return VGroup(q, plane, rect, wb, wb_lbl, hb, hb_lbl, steps, ans)
