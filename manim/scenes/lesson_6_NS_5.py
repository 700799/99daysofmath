"""6.NS Unit 5 — The coordinate plane  (TeachingDeck)

Math (verified):
  • A point is (x, y): x across first, then y up/down.
  • (−3, 5): x negative, y positive → Quadrant II (top-left).
    Quadrant signs: I (+,+), II (−,+), III (−,−), IV (+,−).
  • Distance from (2, 1) to (2, 6): same x → vertical, 6 − 1 = 5 units.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


class Lesson6NS5(TeachingDeck):
    TITLE = "The coordinate plane"
    DOMAIN = "6.NS"
    HOOK = "How do you tell a friend EXACTLY where treasure sits on a map grid?"
    RECAP = [
        "(x, y): across first, then up",
        "Signs of x and y pick the quadrant",
        "Same x? Just subtract the y's",
    ]

    def concept(self):
        pal = self.pal

        # 1 · The grid: two number lines crossed at 0.
        axes = Axes(x_range=[-6, 6, 1], y_range=[-6, 6, 1],
                    x_length=4.8, y_length=4.8, tips=False,
                    axis_config={"color": GREY_B, "include_numbers": False})
        axes.move_to(LEFT * 3.9 + DOWN * 0.1)
        x_lbl = Text("x", font_size=24, color=pal["step"], weight="BOLD")
        x_lbl.next_to(axes.x_axis.get_right(), UP, buff=0.12)
        y_lbl = Text("y", font_size=24, color=pal["step"], weight="BOLD")
        y_lbl.next_to(axes.y_axis.get_top(), RIGHT, buff=0.12)
        cap0 = Text(_wrap("Two number lines make a map!", 26),
                    font_size=28, color=pal["step"], weight="BOLD")
        cap0.move_to(RIGHT * 2.0 + UP * 2.2)
        self.reveal(Create(axes), FadeIn(x_lbl), FadeIn(y_lbl),
                    FadeIn(cap0, shift=UP * 0.15), rt=1.8)
        self.breathe(1.6)

        # 2 · Plot (−3, 5): slide ACROSS first, then climb UP.
        a1 = Arrow(axes.c2p(0, 0), axes.c2p(-3, 0), color=ORANGE, buff=0,
                   stroke_width=5)
        a1_lbl = Text("across: −3", font_size=24, color=ORANGE, weight="BOLD")
        a1_lbl.next_to(a1, DOWN, buff=0.12)
        self.reveal(GrowArrow(a1), FadeIn(a1_lbl), rt=1.4)
        self.breathe(1.6)

        a2 = Arrow(axes.c2p(-3, 0), axes.c2p(-3, 5), color=GREEN, buff=0,
                   stroke_width=5)
        a2_lbl = Text("up: 5", font_size=24, color=GREEN, weight="BOLD")
        a2_lbl.next_to(a2, LEFT, buff=0.12)
        pt = Dot(axes.c2p(-3, 5), color=YELLOW, radius=0.11)
        pt_lbl = Text("(−3, 5)", font_size=24, color=YELLOW, weight="BOLD")
        pt_lbl.next_to(pt, UP, buff=0.12)
        self.reveal(GrowArrow(a2), FadeIn(a2_lbl), FadeIn(pt, scale=1.5),
                    FadeIn(pt_lbl), rt=1.5)
        cap1 = Text(_wrap("x first: slide across. Then y: climb up!", 26),
                    font_size=26, color=pal["accent"], weight="BOLD")
        cap1.move_to(RIGHT * 2.0 + UP * 1.1)
        self.reveal(FadeIn(cap1, shift=UP * 0.15), rt=1.2)
        self.breathe(2.0)

        # 3 · The four quadrants and their sign patterns.
        q_data = [("I", 3, 3, "(+, +)"), ("II", -3.4, 2.2, "(−, +)"),
                  ("III", -3.4, -3, "(−, −)"), ("IV", 3, -3, "(+, −)")]
        quads = VGroup()
        for name, qx, qy, sgn in q_data:
            t = Text(name, font_size=26, color=BLUE, weight="BOLD")
            s = Text(sgn, font_size=24, color=GREY_B)
            g = VGroup(t, s).arrange(DOWN, buff=0.08).move_to(axes.c2p(qx, qy))
            quads.add(g)
        cap2 = Text(_wrap("The signs of (x, y) pick the quadrant", 26),
                    font_size=26, color=BLUE, weight="BOLD")
        cap2.move_to(RIGHT * 2.0 + DOWN * 0.2)
        self.reveal(LaggedStart(*[FadeIn(g, scale=1.1) for g in quads],
                                lag_ratio=0.2), FadeIn(cap2, shift=UP * 0.15), rt=1.8)
        self.breathe(1.8)

        # 4 · Our point: x negative, y positive → Quadrant II.
        ring = SurroundingRectangle(quads[1], color=GREEN, buff=0.15,
                                    corner_radius=0.12)
        cap3 = Text(_wrap("(−3, 5): x neg, y pos → Quadrant II", 28),
                    font_size=26, color=GREEN, weight="BOLD")
        cap3.move_to(RIGHT * 2.0 + DOWN * 1.5)
        self.reveal(Create(ring), FadeIn(cap3, shift=UP * 0.15), rt=1.4)
        self.breathe(2.0)

        return VGroup(axes, x_lbl, y_lbl, cap0, a1, a1_lbl, a2, a2_lbl,
                      pt, pt_lbl, cap1, quads, cap2, ring, cap3)

    def example(self):
        pal = self.pal
        q = Text("Distance from (2, 1) to (2, 6)?", font_size=30,
                 color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.2 + LEFT * 0.8)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        axes = Axes(x_range=[0, 7, 1], y_range=[0, 7, 1],
                    x_length=4.2, y_length=4.2, tips=False,
                    axis_config={"color": GREY_B, "include_numbers": False})
        axes.move_to(LEFT * 4.1 + DOWN * 0.5)
        self.reveal(Create(axes), rt=1.5)

        p1 = Dot(axes.c2p(2, 1), color=GREEN, radius=0.11)
        p1_lbl = Text("(2, 1)", font_size=24, color=GREEN, weight="BOLD")
        p1_lbl.next_to(p1, RIGHT, buff=0.15)
        p2 = Dot(axes.c2p(2, 6), color=ORANGE, radius=0.11)
        p2_lbl = Text("(2, 6)", font_size=24, color=ORANGE, weight="BOLD")
        p2_lbl.next_to(p2, RIGHT, buff=0.15)
        self.reveal(FadeIn(p1, scale=1.5), FadeIn(p1_lbl),
                    FadeIn(p2, scale=1.5), FadeIn(p2_lbl), rt=1.5)
        self.breathe(1.6)

        seg = DashedLine(axes.c2p(2, 1), axes.c2p(2, 6), color=YELLOW,
                         stroke_width=5)
        self.reveal(Create(seg), rt=1.4)
        self.breathe(1.6)

        steps = self.step_lines([
            ("Same x (both 2) → a vertical hop", pal["step"]),
            ("Subtract the y's: 6 − 1", pal["step"]),
            ("= 5", YELLOW),
        ], anchor=RIGHT * 1.4 + UP * 1.0, size=28)

        ans = answer_card(self, "Distance = 5 units", pal["answer"], self.mascot,
                          pos=DOWN * 2.2 + RIGHT * 1.0)
        self.breathe(2.0)
        return VGroup(q, axes, p1, p1_lbl, p2, p2_lbl, seg, steps, ans)
