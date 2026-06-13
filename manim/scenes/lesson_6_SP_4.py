"""6.SP Unit 4 — Displaying data: the box plot.
Math (verified):
  On a box plot the line inside the box is the MEDIAN. The box ends are the
  lower (Q1) and upper (Q3) quartiles; the whiskers extend to the min/max.
"""
from manim import *


class Lesson6SP4(Scene):
    def construct(self):
        title = Text("Reading a box plot", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        # Number line
        nl = NumberLine(
            x_range=[0, 20, 2],
            length=10,
            include_numbers=True,
            label_direction=DOWN,
            font_size=22,
            color=GREY,
        ).shift(DOWN * 0.5)
        self.play(Create(nl), run_time=1.4)

        # Box plot pieces
        # Whisker lines from 2 to 18, box from 6 to 14, median line at 10
        whisker_l = Line(nl.n2p(2), nl.n2p(6), color=BLUE, stroke_width=4).shift(UP * 1.2)
        whisker_r = Line(nl.n2p(14), nl.n2p(18), color=BLUE, stroke_width=4).shift(UP * 1.2)
        # Whisker caps
        cap_l = Line(nl.n2p(2) + UP * 0.25, nl.n2p(2) + DOWN * 0.25, color=BLUE, stroke_width=3).shift(UP * 1.2)
        cap_r = Line(nl.n2p(18) + UP * 0.25, nl.n2p(18) + DOWN * 0.25, color=BLUE, stroke_width=3).shift(UP * 1.2)
        # Box
        box_w = nl.n2p(14)[0] - nl.n2p(6)[0]
        box = Rectangle(width=box_w, height=1.0, color=BLUE,
                        fill_color=BLUE, fill_opacity=0.2)
        box.move_to((nl.n2p(6) + nl.n2p(14)) / 2 + UP * 1.2)
        # Median line inside the box
        median_line = Line(nl.n2p(10) + UP * 0.5, nl.n2p(10) + DOWN * 0.5,
                           color=GREEN, stroke_width=6).shift(UP * 1.2)
        self.play(Create(whisker_l), Create(whisker_r), Create(cap_l), Create(cap_r), run_time=1.4)
        self.play(Create(box), run_time=1.4)
        self.play(Create(median_line), run_time=1.4)

        # Labels
        median_lbl = Text("Median = 10", font_size=26, color=GREEN, weight=BOLD).next_to(median_line, UP, buff=0.3)
        q1_lbl = Text("Q1", font_size=22, color=BLUE).next_to(nl.n2p(6) + UP * 1.2, DOWN, buff=0.2)
        q3_lbl = Text("Q3", font_size=22, color=BLUE).next_to(nl.n2p(14) + UP * 1.2, DOWN, buff=0.2)
        self.play(Write(median_lbl), Write(q1_lbl), Write(q3_lbl), run_time=1.4)

        rule = Text("Line inside the box = the MEDIAN",
                    font_size=28, color=GREEN, weight=BOLD).shift(DOWN * 2.2)
        self.play(Write(rule), run_time=1.4)
        self.wait(2.8)
# slowed
