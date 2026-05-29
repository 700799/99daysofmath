"""6.RP Unit 2 — Unit rates.
Math (verified): 6 muffins cost $9 → $9 ÷ 6 = $1.50 per muffin.
"""
from manim import *


class Lesson6RP2(Scene):
    def construct(self):
        title = Text("Unit rate: cost for just one", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        # 6 muffins as filled circles in a row
        muffins = VGroup(*[
            Circle(radius=0.32, color="#C49A6C", fill_color="#C49A6C", fill_opacity=0.85)
            for _ in range(6)
        ]).arrange(RIGHT, buff=0.3).shift(UP * 1.0)
        self.play(LaggedStartMap(FadeIn, muffins, lag_ratio=0.1))

        price = Text("6 muffins cost $9", font_size=30).next_to(muffins, DOWN, buff=0.6)
        self.play(Write(price))
        self.wait(0.4)

        step1 = Text("Cost per muffin = total ÷ how many", font_size=28).shift(DOWN * 0.8)
        self.play(Write(step1))

        calc = Text("$9 ÷ 6", font_size=34).shift(DOWN * 1.7)
        self.play(Write(calc))

        answer = Text("= $1.50 per muffin", font_size=42, color=GREEN, weight=BOLD).shift(DOWN * 2.7)
        self.play(Write(answer))
        self.wait(2)
