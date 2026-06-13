"""6.RP Unit 1 — What is a ratio?
Math (verified):
  • 4 apples to 6 oranges → ratio 4:6.
  • Divide both by their GCF (2) → simplified 2:3.
"""
from manim import *


class Lesson6RP1(Scene):
    def construct(self):
        title = Text("Ratios compare two amounts", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        # 4 red apples + 6 orange circles, in two rows.
        apples = VGroup(*[
            Circle(radius=0.27, color=RED, fill_color=RED, fill_opacity=0.8)
            for _ in range(4)
        ]).arrange(RIGHT, buff=0.22)
        oranges = VGroup(*[
            Circle(radius=0.27, color=ORANGE, fill_color=ORANGE, fill_opacity=0.8)
            for _ in range(6)
        ]).arrange(RIGHT, buff=0.22)

        a_lbl = Text("Apples (4)", font_size=26, color=RED)
        o_lbl = Text("Oranges (6)", font_size=26, color=ORANGE)
        row_a = VGroup(a_lbl, apples).arrange(RIGHT, buff=0.5)
        row_o = VGroup(o_lbl, oranges).arrange(RIGHT, buff=0.5)
        rows = VGroup(row_a, row_o).arrange(DOWN, buff=0.5).shift(UP * 0.6)
        self.play(LaggedStart(FadeIn(row_a), FadeIn(row_o), lag_ratio=0.3))
        self.wait(0.4)

        ratio1 = Text("Apples to oranges = 4 : 6", font_size=32).shift(DOWN * 1.4)
        self.play(Write(ratio1))
        self.wait(1)

        reduce = Text("Divide both by 2", font_size=26, color=YELLOW).shift(DOWN * 2.2)
        self.play(Write(reduce))

        simplified = Text("= 2 : 3", font_size=46, color=GREEN, weight=BOLD).shift(DOWN * 3.1)
        self.play(Write(simplified))
        self.wait(2)
