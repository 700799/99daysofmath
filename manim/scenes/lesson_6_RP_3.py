"""6.RP Unit 3 — Ratio tables.
Math (verified):
  Pattern: output = input × 3. So 2→6, 3→9, 4→12, 5→15.
"""
from manim import *


class Lesson6RP3(Scene):
    def construct(self):
        title = Text("Ratio tables: equivalent ratios", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        # Two-column table: input | output
        header = VGroup(
            Text("Input", font_size=28, color=BLUE),
            Text("Output", font_size=28, color=ORANGE),
        ).arrange(RIGHT, buff=2.2).shift(UP * 1.4)
        self.play(Write(header))

        rows = [(2, 6), (3, 9), (4, 12), (5, None)]
        row_groups = []
        for i, (a, b) in enumerate(rows):
            y = UP * (0.6 - i * 0.7)
            left = Text(str(a), font_size=30).move_to(LEFT * 1.1 + y)
            right_text = "?" if b is None else str(b)
            right_color = YELLOW if b is None else WHITE
            right = Text(right_text, font_size=30, color=right_color).move_to(RIGHT * 1.1 + y)
            row_groups.append((left, right))
            self.play(Write(left), Write(right), run_time=0.4)

        # Highlight the pattern.
        pattern = Text("Pattern: output = input × 3", font_size=28, color=YELLOW)
        pattern.shift(DOWN * 2.6)
        self.play(Write(pattern))
        self.wait(0.6)

        # Fill in 5 × 3 = 15
        compute = Text("5 × 3 = 15", font_size=32).shift(DOWN * 3.4)
        self.play(Write(compute))
        final_15 = Text("15", font_size=34, color=GREEN, weight=BOLD).move_to(row_groups[-1][1].get_center())
        self.play(FadeOut(row_groups[-1][1]), FadeIn(final_15))
        self.wait(2)
