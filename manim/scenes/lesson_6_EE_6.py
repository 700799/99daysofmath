"""6.EE Unit 6 — Variables that change together.
Math (verified):  y = 3x  →  x=1→y=3, x=2→y=6, x=3→y=9, x=5→y=15.
"""
from manim import *


class Lesson6EE6(Scene):
    def construct(self):
        title = Text("Two variables changing together", font_size=38, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        eq = Text("y = 3x", font_size=52, color=YELLOW).shift(UP * 1.3)
        self.play(Write(eq), run_time=1.4)

        # Table of values
        header = VGroup(
            Text("x", font_size=30, color=BLUE),
            Text("y", font_size=30, color=ORANGE),
        ).arrange(RIGHT, buff=2.0).shift(UP * 0.2)
        self.play(Write(header), run_time=1.4)

        rows = [(1, 3), (2, 6), (3, 9), (5, 15)]
        row_mobs = []
        for i, (a, b) in enumerate(rows):
            y_pos = -0.5 - i * 0.55
            lcell = Text(str(a), font_size=28).move_to(LEFT * 1.0 + UP * y_pos)
            rcell = Text(str(b), font_size=28).move_to(RIGHT * 1.0 + UP * y_pos)
            row_mobs.append(VGroup(lcell, rcell))
            self.play(Write(lcell), Write(rcell), run_time=0.4)

        # Highlight the last row
        last = row_mobs[-1]
        box = SurroundingRectangle(last, color=GREEN, buff=0.12, stroke_width=3)
        ans_text = Text("y = 3 × 5 = 15", font_size=30, color=GREEN, weight=BOLD).next_to(last, RIGHT, buff=1.0)
        self.play(Create(box), Write(ans_text), run_time=1.4)
        self.wait(2.8)
# slowed
