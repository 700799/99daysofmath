"""6.NS Unit 6 — Dividing fractions (keep-change-flip).
Math (verified):
  1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2.
"""
from manim import *


class Lesson6NS6(Scene):
    def construct(self):
        title = Text("Dividing fractions: keep · change · flip", font_size=36, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        prob = Text("1/2 ÷ 1/4", font_size=46).shift(UP * 1.2)
        self.play(Write(prob), run_time=1.4)
        self.wait(0.56)

        step1 = Text("KEEP the first fraction", font_size=26, color=YELLOW)
        step2 = Text("CHANGE ÷ to ×", font_size=26, color=YELLOW)
        step3 = Text("FLIP the second fraction (reciprocal)", font_size=26, color=YELLOW)
        steps = VGroup(step1, step2, step3).arrange(DOWN, aligned_edge=LEFT, buff=0.18).shift(LEFT * 1.0)
        for s in steps:
            self.play(Write(s), run_time=0.45)
        self.wait(0.42)

        kcf = Text("1/2 × 4/1", font_size=42).shift(DOWN * 1.5)
        self.play(Write(kcf), run_time=1.4)

        mult = Text("= 4 / 2", font_size=38).shift(DOWN * 2.3)
        self.play(Write(mult), run_time=1.4)

        ans = Text("= 2", font_size=54, color=GREEN, weight=BOLD).shift(DOWN * 3.2)
        self.play(Write(ans), run_time=1.4)
        self.wait(2.8)
# slowed
