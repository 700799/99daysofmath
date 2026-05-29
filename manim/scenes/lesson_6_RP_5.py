"""6.RP Unit 5 — Percents.
Math (verified):
  • 20% = 20/100 = 0.20.
  • 20% of 45 = 0.20 × 45 = 9.
"""
from manim import *


class Lesson6RP5(Scene):
    def construct(self):
        title = Text("Percent means 'out of 100'", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        # A 10x10 grid; shade 20 squares to show 20%.
        cell = 0.32
        grid = VGroup()
        cells = []
        for r in range(10):
            for c in range(10):
                sq = Square(side_length=cell, color=GREY, stroke_width=1)
                sq.move_to(np.array([c * cell, -r * cell, 0]))
                cells.append(sq)
                grid.add(sq)
        grid.move_to(LEFT * 3.4 + UP * 0.0)
        self.play(FadeIn(grid))

        # Shade the first 20 squares blue
        shaded = VGroup(*cells[:20]).copy()
        shaded.set_fill(BLUE, opacity=0.85)
        shaded.set_stroke(BLUE, width=1)
        self.play(LaggedStartMap(FadeIn, shaded, lag_ratio=0.02))

        eq1 = Text("20 / 100 = 0.20 = 20%", font_size=30).shift(RIGHT * 2.0 + UP * 1.6)
        self.play(Write(eq1))

        prob = Text("What is 20% of 45?", font_size=30, color=YELLOW).shift(RIGHT * 2.0 + UP * 0.6)
        self.play(Write(prob))

        calc = Text("0.20 × 45", font_size=32).shift(RIGHT * 2.0 + DOWN * 0.4)
        self.play(Write(calc))

        ans = Text("= 9", font_size=44, color=GREEN, weight=BOLD).shift(RIGHT * 2.0 + DOWN * 1.5)
        self.play(Write(ans))
        self.wait(2)
