"""6.NS Unit 10 — Coordinate plane: distance & polygons  (TeachingDeck)

Math (verified):
  • Distance (3,2)→(3,7): same x → vertical hop, |7−2| = 5. ✓
  • Distance (−2,4)→(5,4): same y → horizontal hop, |5−(−2)| = 7. ✓
  • Rectangle corners (1,1),(5,1),(5,4),(1,4): width = |5−1| = 4,
    height = |4−1| = 3. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


class Lesson6NS10(TeachingDeck):
    TITLE = "Coordinate plane: distance & polygons"
    DOMAIN = "6.NS"
    HOOK = "Two points sit on the same vertical line on a map. How far apart are they — without a ruler?"
    RECAP = [
        "Same x → subtract the y's",
        "Same y → subtract the x's",
        "Always take the positive distance",
    ]

    def concept(self):
        pal = self.pal
        axes = Axes(x_range=[-3, 8, 1], y_range=[-1, 8, 1],
                   x_length=4.6, y_length=4.6, tips=False,
                   axis_config={"color": GREY_B, "include_numbers": False})
        axes.move_to(LEFT * 3.9 + DOWN * 0.1)
        self.reveal(Create(axes), rt=1.5)
        self.breathe(1.5)

        p1 = Dot(axes.c2p(3, 2), color=GREEN, radius=0.11)
        p2 = Dot(axes.c2p(3, 7), color=ORANGE, radius=0.11)
        l1 = Text("(3,2)", font_size=22, color=GREEN, weight="BOLD").next_to(p1, RIGHT, buff=0.1)
        l2 = Text("(3,7)", font_size=22, color=ORANGE, weight="BOLD").next_to(p2, RIGHT, buff=0.1)
        seg = DashedLine(axes.c2p(3, 2), axes.c2p(3, 7), color=YELLOW, stroke_width=5)
        self.reveal(FadeIn(p1, scale=1.5), FadeIn(p2, scale=1.5), FadeIn(l1), FadeIn(l2),
                    Create(seg), rt=1.6)
        cap0 = Text("same x → |7−2| = 5", font_size=26, color=YELLOW, weight="BOLD")
        cap0.move_to(RIGHT * 2.0 + UP * 1.8)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        p3 = Dot(axes.c2p(-2, 4), color=BLUE, radius=0.11)
        p4 = Dot(axes.c2p(5, 4), color=PURPLE, radius=0.11)
        l3 = Text("(−2,4)", font_size=22, color=BLUE, weight="BOLD").next_to(p3, DOWN, buff=0.1)
        l4 = Text("(5,4)", font_size=22, color=PURPLE, weight="BOLD").next_to(p4, DOWN, buff=0.1)
        seg2 = DashedLine(axes.c2p(-2, 4), axes.c2p(5, 4), color=GREEN, stroke_width=5)
        self.reveal(FadeIn(p3, scale=1.5), FadeIn(p4, scale=1.5), FadeIn(l3), FadeIn(l4),
                    Create(seg2), rt=1.6)
        cap1 = Text("same y → |5−(−2)| = 7", font_size=26, color=GREEN, weight="BOLD")
        cap1.move_to(RIGHT * 2.0 + UP * 0.4)
        self.reveal(FadeIn(cap1, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        return VGroup(axes, p1, p2, l1, l2, seg, cap0, p3, p4, l3, l4, seg2, cap1)

    def example(self):
        pal = self.pal
        q = Text(_wrap("Rectangle corners (1,1) (5,1) (5,4) (1,4) — width and height?", 40),
                 font_size=26, color=pal["accent"], weight="BOLD")
        q.move_to(UP * 1.85)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        axes = Axes(x_range=[0, 6, 1], y_range=[0, 5, 1],
                   x_length=4.2, y_length=3.6, tips=False,
                   axis_config={"color": GREY_B, "include_numbers": False})
        axes.move_to(LEFT * 4.0 + DOWN * 0.6)
        self.reveal(Create(axes), rt=1.4)

        pts = [(1, 1), (5, 1), (5, 4), (1, 4)]
        rect = Polygon(*[axes.c2p(x, y) for x, y in pts], color=BLUE,
                       fill_opacity=0.15, stroke_width=4)
        self.reveal(Create(rect), rt=1.5)
        self.breathe(1.4)

        wb = Brace(Line(axes.c2p(1, 1), axes.c2p(5, 1)), direction=DOWN, color=ORANGE)
        wb_lbl = Text("width = |5−1| = 4", font_size=22, color=ORANGE, weight="BOLD").next_to(wb, DOWN, buff=0.1)
        hb = Brace(Line(axes.c2p(1, 1), axes.c2p(1, 4)), direction=LEFT, color=GREEN)
        hb_lbl = Text("height =\n|4−1| = 3", font_size=20, color=GREEN, weight="BOLD").next_to(hb, LEFT, buff=0.1)
        self.reveal(GrowFromCenter(wb), FadeIn(wb_lbl), rt=1.4)
        self.breathe(1.4)
        self.reveal(GrowFromCenter(hb), FadeIn(hb_lbl), rt=1.4)
        self.breathe(1.6)

        steps = self.step_lines([
            ("width: |5 − 1| = 4", ORANGE),
            ("height: |4 − 1| = 3", GREEN),
        ], anchor=RIGHT * 2.6 + UP * 0.6, size=26)

        ans = answer_card(self, "width 4, height 3", pal["answer"], self.mascot,
                          pos=DOWN * 2.6 + RIGHT * 1.8)
        self.breathe(2.0)
        return VGroup(q, axes, rect, wb, wb_lbl, hb, hb_lbl, steps, ans)
