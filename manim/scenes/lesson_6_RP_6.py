"""6.RP Unit 6 — Converting with rates.
Math (verified):
  1 foot = 12 inches.  3 feet × 12 in/ft = 36 inches.
"""
from manim import *


class Lesson6RP6(Scene):
    def construct(self):
        title = Text("Convert units with a rate", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        rate = Text("1 foot = 12 inches", font_size=32, color=BLUE).shift(UP * 1.4)
        self.play(Write(rate), run_time=1.4)

        # Draw three foot-long bars stacked
        feet = VGroup(*[
            Rectangle(width=4.0, height=0.5, color=GREEN, fill_color=GREEN, fill_opacity=0.3)
            for _ in range(3)
        ]).arrange(DOWN, buff=0.2).shift(LEFT * 1.5 + DOWN * 0.3)
        labels = VGroup(*[
            Text(f"1 ft = 12 in", font_size=22).next_to(bar, RIGHT, buff=0.2)
            for bar in feet
        ])
        for bar, lbl in zip(feet, labels):
            self.play(FadeIn(bar), Write(lbl), run_time=0.4)

        question = Text("How many inches in 3 feet?", font_size=28, color=YELLOW).shift(DOWN * 2.0)
        self.play(Write(question), run_time=1.4)

        calc = Text("3 × 12", font_size=32).shift(DOWN * 2.8)
        self.play(Write(calc), run_time=1.4)

        ans = Text("= 36 inches", font_size=42, color=GREEN, weight=BOLD).shift(DOWN * 3.6)
        self.play(Write(ans), run_time=1.4)
        self.wait(2.8)
# slowed
