"""6.SP Unit 2 — Choosing a center.
Math (verified):  Data 2, 3, 4, 100.
  Mean = (2+3+4+100) / 4 = 109 / 4 = 27.25.
  Median = average of middle two (sorted): (3 + 4) / 2 = 3.5.
  The outlier 100 pulls the mean way up; median is more typical.
"""
from manim import *


class Lesson6SP2(Scene):
    def construct(self):
        title = Text("When the mean is misleading", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        data = Text("Data: 2, 3, 4, 100", font_size=34, color=YELLOW).shift(UP * 1.6)
        self.play(Write(data), run_time=1.4)

        # Number line showing the values, 100 far to the right (compressed scale)
        nl = NumberLine(
            x_range=[0, 100, 25],
            length=10,
            include_numbers=True,
            label_direction=DOWN,
            font_size=20,
            color=GREY,
        ).shift(UP * 0.4)
        self.play(Create(nl), run_time=1.4)

        for val, color in [(2, BLUE), (3, BLUE), (4, BLUE), (100, RED)]:
            d = Dot(nl.n2p(val), color=color, radius=0.12)
            self.play(FadeIn(d), run_time=0.25)

        outlier_lbl = Text("← outlier", font_size=24, color=RED).next_to(nl.n2p(100), DOWN * 2.0, buff=0.05)
        self.play(Write(outlier_lbl), run_time=1.4)
        self.wait(0.42)

        mean = Text("Mean = (2+3+4+100) ÷ 4 = 27.25", font_size=26, color=ORANGE).shift(DOWN * 1.2)
        self.play(Write(mean), run_time=1.4)
        median = Text("Median (middle) = (3+4) ÷ 2 = 3.5", font_size=26, color=GREEN).shift(DOWN * 2.0)
        self.play(Write(median), run_time=1.4)

        verdict = Text("More typical value → MEDIAN (3.5)",
                       font_size=30, color=GREEN, weight=BOLD).shift(DOWN * 3.0)
        self.play(Write(verdict), run_time=1.4)
        self.wait(2.8)
# slowed
