"""6.SP Unit 3 — Range.
Math (verified):  Data 5, 9, 12, 20.  Range = max − min = 20 − 5 = 15.
"""
from manim import *


class Lesson6SP3(Scene):
    def construct(self):
        title = Text("Range = maximum − minimum", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        data = Text("Data: 5, 9, 12, 20", font_size=34, color=YELLOW).shift(UP * 1.6)
        self.play(Write(data), run_time=1.4)

        nl = NumberLine(
            x_range=[0, 25, 5],
            length=10,
            include_numbers=True,
            label_direction=DOWN,
            font_size=22,
            color=GREY,
        ).shift(UP * 0.2)
        self.play(Create(nl), run_time=1.4)

        # Dots at each data point
        dots = []
        for v in [5, 9, 12, 20]:
            d = Dot(nl.n2p(v), color=BLUE, radius=0.13)
            self.play(FadeIn(d), run_time=0.2)
            dots.append(d)

        # Highlight min and max
        min_dot = Dot(nl.n2p(5), color=GREEN, radius=0.18)
        max_dot = Dot(nl.n2p(20), color=GREEN, radius=0.18)
        min_lbl = Text("min = 5", font_size=24, color=GREEN).next_to(min_dot, UP, buff=0.3)
        max_lbl = Text("max = 20", font_size=24, color=GREEN).next_to(max_dot, UP, buff=0.3)
        self.play(FadeIn(min_dot), FadeIn(max_dot), run_time=1.4)
        self.play(Write(min_lbl), Write(max_lbl), run_time=1.4)

        bracket = DoubleArrow(nl.n2p(5), nl.n2p(20), color=YELLOW, buff=0.05, stroke_width=4)
        bracket.shift(DOWN * 0.6)
        self.play(GrowArrow(bracket), run_time=1.4)

        calc = Text("Range = 20 − 5", font_size=30).shift(DOWN * 1.8)
        self.play(Write(calc), run_time=1.4)
        ans = Text("= 15", font_size=48, color=GREEN, weight=BOLD).shift(DOWN * 2.9)
        self.play(Write(ans), run_time=1.4)
        self.wait(2.8)
# slowed
