"""6.G Unit 6 — Area & volume review.
Math (verified):  Rectangular prism 2 × 3 × 5 has volume 30 cubic units.
"""
from manim import *


class Lesson6G6(Scene):
    def construct(self):
        title = Text("Area or volume? Pick the right formula", font_size=36, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        # Two side-by-side reminders: area for flat shapes, volume for solids
        flat = VGroup(
            Text("Flat shape", font_size=28, color=BLUE),
            Text("→ AREA", font_size=30, color=BLUE),
            Text("square units", font_size=22, color=GREY),
        ).arrange(DOWN, buff=0.15).shift(LEFT * 3.0 + UP * 1.5)
        solid = VGroup(
            Text("Solid shape", font_size=28, color=ORANGE),
            Text("→ VOLUME", font_size=30, color=ORANGE),
            Text("cubic units", font_size=22, color=GREY),
        ).arrange(DOWN, buff=0.15).shift(RIGHT * 3.0 + UP * 1.5)
        self.play(Write(flat), Write(solid), run_time=1.4)
        self.wait(0.56)

        # A specific volume example
        problem = Text("Find the volume of a 2 × 3 × 5 prism.",
                       font_size=30, color=YELLOW).shift(DOWN * 0.2)
        self.play(Write(problem), run_time=1.4)

        formula = Text("V = l · w · h", font_size=32).shift(DOWN * 1.2)
        self.play(Write(formula), run_time=1.4)

        calc = Text("= 2 · 3 · 5", font_size=32).shift(DOWN * 2.1)
        self.play(Write(calc), run_time=1.4)

        ans = Text("= 30 cubic units", font_size=40, color=GREEN, weight=BOLD).shift(DOWN * 3.1)
        self.play(Write(ans), run_time=1.4)
        self.wait(2.8)
# slowed
