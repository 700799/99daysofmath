"""6.SP Unit 4 — Displaying data  (TeachingDeck)

Math (verified):
  • Box plot: line inside the box is the median.
  • A dot plot with 3 dots above 5 means 3 values equal 5.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6SP4(TeachingDeck):
    TITLE = "Displaying data"
    DOMAIN = "6.SP"
    HOOK = "A box, a bar, or a dot — which picture tells you the middle of the data at a glance?"
    RECAP = [
        "Dot plot: one dot per value",
        "Histogram: bars, equal intervals, no gaps",
        "Box plot: shows the median and quartiles",
    ]

    def concept(self):
        pal = self.pal
        nl = NumberLine(x_range=[0, 20, 2], length=9.5, color=GREY_B,
                        include_numbers=True, font_size=20)
        nl.move_to(DOWN * 0.6)
        self.reveal(Create(nl), rt=1.4)
        self.breathe(1.4)

        whisker_l = Line(nl.n2p(2), nl.n2p(6), color=BLUE, stroke_width=4).shift(UP * 1.3)
        whisker_r = Line(nl.n2p(14), nl.n2p(18), color=BLUE, stroke_width=4).shift(UP * 1.3)
        box_w = nl.n2p(14)[0] - nl.n2p(6)[0]
        box = Rectangle(width=box_w, height=0.9, color=BLUE, fill_color=BLUE, fill_opacity=0.2)
        box.move_to((nl.n2p(6) + nl.n2p(14)) / 2 + UP * 1.3)
        median_line = Line(nl.n2p(10) + UP * 0.45, nl.n2p(10) + DOWN * 0.45, color=GREEN, stroke_width=6).shift(UP * 1.3)
        self.reveal(Create(whisker_l), Create(whisker_r), Create(box), rt=1.6)
        self.breathe(1.4)
        self.reveal(Create(median_line), rt=1.3)
        med_lbl = Text("median = 10", font_size=24, color=GREEN, weight="BOLD").next_to(median_line, UP, buff=0.2)
        self.reveal(FadeIn(med_lbl), rt=1.2)
        cap = Text("Line inside the box = MEDIAN", font_size=26, color=pal["accent"],
                   weight="BOLD").move_to(UP * 2.1)
        self.reveal(FadeIn(cap, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(nl, whisker_l, whisker_r, box, median_line, med_lbl, cap)

    def example(self):
        pal = self.pal
        q = Text("On a box plot, what does the line inside the box show?", font_size=26,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("the box spans the middle half", pal["step"]),
            ("the inside line is the middle", pal["step"]),
        ], anchor=UP * 0.6, size=27, gap=0.4)

        ans = answer_card(self, "the median", pal["answer"], self.mascot, pos=DOWN * 1.5)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
