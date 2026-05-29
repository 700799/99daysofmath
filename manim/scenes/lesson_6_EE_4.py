"""6.EE Unit 4 — One-step equations.
Math (verified):  x + 7 = 12  →  x = 12 - 7  →  x = 5.
"""
from manim import *


class Lesson6EE4(Scene):
    def construct(self):
        title = Text("Solve a one-step equation", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        eq = Text("x + 7 = 12", font_size=54).shift(UP * 1.2)
        self.play(Write(eq))
        self.wait(0.3)

        rule = Text("Do the opposite of '+ 7' on BOTH sides:", font_size=26, color=YELLOW).shift(UP * 0.1)
        self.play(Write(rule))

        step = Text("x + 7 - 7 = 12 - 7", font_size=40).shift(DOWN * 0.9)
        self.play(Write(step))

        simplify = Text("x = 12 - 7", font_size=40).shift(DOWN * 2.0)
        self.play(Write(simplify))

        ans = Text("x = 5", font_size=58, color=GREEN, weight=BOLD).shift(DOWN * 3.1)
        self.play(Write(ans))
        self.wait(2)
