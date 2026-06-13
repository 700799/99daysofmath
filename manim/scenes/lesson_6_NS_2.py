"""6.NS Unit 2 — Multiplying decimals.
Math (verified):
  0.6 × 0.4 → multiply as 6 × 4 = 24 → 2 decimal places total → 0.24.
"""
from manim import *


class Lesson6NS2(Scene):
    def construct(self):
        title = Text("Multiplying decimals", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        prob = Text("0.6 × 0.4 = ?", font_size=40).shift(UP * 1.6)
        self.play(Write(prob), run_time=1.4)

        step1 = Text("Step 1.  Ignore the decimals:", font_size=28, color=YELLOW).shift(UP * 0.6).align_to(LEFT * 4, LEFT)
        ints = Text("6 × 4 = 24", font_size=34).next_to(step1, DOWN, buff=0.25).align_to(step1, LEFT)
        self.play(Write(step1), run_time=1.4)
        self.play(Write(ints), run_time=1.4)
        self.wait(0.56)

        step2 = Text("Step 2.  Count decimal places: 1 + 1 = 2", font_size=28, color=YELLOW).shift(DOWN * 0.6).align_to(step1, LEFT)
        self.play(Write(step2), run_time=1.4)
        self.wait(0.56)

        step3 = Text("Step 3.  Place the point 2 from the right:", font_size=28, color=YELLOW).shift(DOWN * 1.4).align_to(step1, LEFT)
        self.play(Write(step3), run_time=1.4)

        answer = Text("0.6 × 0.4 = 0.24", font_size=40, color=GREEN, weight=BOLD).shift(DOWN * 2.4)
        self.play(Write(answer), run_time=1.4)
        self.wait(2.8)
# slowed
