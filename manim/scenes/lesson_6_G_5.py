"""6.G Unit 5 — Composite figures.
Math (verified):  L-shape split into a 4×2 rectangle and a 3×2 rectangle.
  Total area = 4·2 + 3·2 = 8 + 6 = 14 square units.
"""
from manim import *


class Lesson6G5(Scene):
    def construct(self):
        title = Text("Composite figures: split & add", font_size=38, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        # Build an L-shape from two rectangles.
        unit = 0.55  # one grid unit
        # 4-by-2 rectangle at left
        r1 = Rectangle(width=4 * unit, height=2 * unit, color=BLUE,
                       fill_color=BLUE, fill_opacity=0.25)
        # 3-by-2 rectangle stacked on top-right of r1
        r2 = Rectangle(width=3 * unit, height=2 * unit, color=ORANGE,
                       fill_color=ORANGE, fill_opacity=0.25)
        # Arrange r2 sitting on top of r1's right portion
        r1.shift(LEFT * 1.5 + DOWN * 0.6)
        r2.next_to(r1, UP, buff=0).align_to(r1, RIGHT)

        self.play(Create(r1))
        self.play(Create(r2))

        # Labels
        r1_lbl = Text("4 × 2 = 8", font_size=24, color=BLUE).move_to(r1.get_center())
        r2_lbl = Text("3 × 2 = 6", font_size=24, color=ORANGE).move_to(r2.get_center())
        self.play(Write(r1_lbl), Write(r2_lbl))

        eq = Text("Total area = 8 + 6", font_size=30).shift(RIGHT * 2.5 + UP * 0.4)
        self.play(Write(eq))

        ans = Text("= 14 sq units", font_size=36, color=GREEN, weight=BOLD).shift(RIGHT * 2.5 + DOWN * 0.7)
        self.play(Write(ans))
        self.wait(2)
