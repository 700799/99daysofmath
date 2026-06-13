"""6.EE Unit 1 — Exponents.
Math (verified):  3³ = 3 × 3 × 3 = 27.
"""
from manim import *


class Lesson6EE1(Scene):
    def construct(self):
        title = Text("Exponents = repeated multiplication", font_size=38, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        # "3 cubed"
        base = Text("3", font_size=84, weight=BOLD).shift(LEFT * 0.6 + UP * 0.6)
        exp = Text("3", font_size=42, color=YELLOW).next_to(base, RIGHT, buff=0.05).shift(UP * 0.7)
        self.play(Write(base), Write(exp))
        self.wait(0.3)

        meaning = Text("means '3 multiplied by itself 3 times'", font_size=24, color=GREY).shift(DOWN * 0.5)
        self.play(Write(meaning))

        expand = Text("= 3 × 3 × 3", font_size=44).shift(DOWN * 1.6)
        self.play(Write(expand))

        step = Text("= 9 × 3", font_size=38).shift(DOWN * 2.6)
        self.play(Write(step))

        ans = Text("= 27", font_size=56, color=GREEN, weight=BOLD).shift(DOWN * 3.5)
        self.play(Write(ans))
        self.wait(2)
