"""6.EE Unit 2 — Writing & evaluating expressions.
Math (verified):  Evaluate 2x + 5 when x = 4 → 2·4 + 5 = 8 + 5 = 13.
"""
from manim import *


class Lesson6EE2(Scene):
    def construct(self):
        title = Text("Evaluate an expression", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        expr = Text("2x + 5", font_size=54).shift(UP * 1.0)
        self.play(Write(expr), run_time=1.4)

        sub = Text("when x = 4", font_size=32, color=YELLOW).next_to(expr, DOWN, buff=0.4)
        self.play(Write(sub), run_time=1.4)
        self.wait(0.7)

        step1 = Text("Substitute:   2(4) + 5", font_size=34).shift(DOWN * 0.6)
        self.play(Write(step1), run_time=1.4)

        step2 = Text("Multiply first:   8 + 5", font_size=34).shift(DOWN * 1.6)
        self.play(Write(step2), run_time=1.4)

        ans = Text("= 13", font_size=52, color=GREEN, weight=BOLD).shift(DOWN * 2.7)
        self.play(Write(ans), run_time=1.4)
        self.wait(2.8)
# slowed
