"""6.SP Unit 9 — Displays: dot plots, histograms & box plots  (TeachingDeck)

Math (verified):
  • A histogram bar over 10-19 with height 5 means 5 values fall in 10-19.
  • On a box plot the box shows the middle 50% (Q1 to Q3).
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6SP9(TeachingDeck):
    TITLE = "Displays: dot plots, histograms & box plots"
    DOMAIN = "6.SP"
    HOOK = "A dot plot, a histogram, and a box plot can all show the SAME data — but each highlights something different."
    RECAP = [
        "Dot plot: each dot = one value",
        "Histogram: bar HEIGHT = count in that interval",
        "Box plot: box = middle 50% (Q1 to Q3)",
    ]

    def concept(self):
        pal = self.pal
        title1 = Text("DOT PLOT", font_size=24, color=BLUE, weight="BOLD").move_to(UP * 2.2 + LEFT * 4.2)
        dots = VGroup(*[Dot(radius=0.11, color=BLUE) for _ in range(5)])
        dots.arrange(RIGHT, buff=0.15).move_to(UP * 1.6 + LEFT * 4.2)
        self.reveal(FadeIn(title1), LaggedStart(*[FadeIn(d) for d in dots], lag_ratio=0.2), rt=1.5)
        self.breathe(1.3)

        title2 = Text("HISTOGRAM", font_size=24, color=ORANGE, weight="BOLD").move_to(UP * 2.2)
        bars = VGroup(*[
            Rectangle(width=0.5, height=h, stroke_color=ORANGE, fill_color=ORANGE, fill_opacity=0.5)
            for h in [0.5, 1.2, 0.8]
        ]).arrange(RIGHT, buff=0.15, aligned_edge=DOWN).move_to(UP * 1.1)
        self.reveal(FadeIn(title2), LaggedStart(*[GrowFromEdge(b, DOWN) for b in bars], lag_ratio=0.2), rt=1.5)
        cap2 = Text("bar HEIGHT = count", font_size=20, color=ORANGE).next_to(bars, DOWN, buff=0.3)
        self.reveal(FadeIn(cap2), rt=1.2)
        self.breathe(1.4)

        title3 = Text("BOX PLOT", font_size=24, color=GREEN, weight="BOLD").move_to(UP * 2.2 + RIGHT * 4.0)
        box = Rectangle(width=1.6, height=0.6, color=GREEN, fill_color=GREEN, fill_opacity=0.25)
        box.move_to(UP * 1.3 + RIGHT * 4.0)
        med = Line(box.get_top(), box.get_bottom(), color=YELLOW, stroke_width=4).shift(RIGHT * 0.1)
        whisk_l = Line(box.get_left() + LEFT * 0.6, box.get_left(), color=GREEN, stroke_width=3)
        whisk_r = Line(box.get_right(), box.get_right() + RIGHT * 0.6, color=GREEN, stroke_width=3)
        self.reveal(FadeIn(title3), Create(box), Create(med), Create(whisk_l), Create(whisk_r), rt=1.6)
        cap3 = Text("box = middle 50%", font_size=20, color=GREEN).next_to(box, DOWN, buff=0.5)
        self.reveal(FadeIn(cap3), rt=1.2)
        self.breathe(2.0)

        return VGroup(title1, dots, title2, bars, cap2, title3, box, med, whisk_l, whisk_r, cap3)

    def example(self):
        pal = self.pal
        q = Text("A histogram bar over 10-19 has height 5.\nHow many values in 10-19?", font_size=28,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.1)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("bar height = count", pal["step"]),
        ], anchor=UP * 0.2, size=30, gap=0.4)

        ans = answer_card(self, "5 values", pal["answer"], self.mascot, pos=DOWN * 1.0)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
