"""6.NS Unit 3 — GCF & the distributive property.
Math (verified):
  12 = 2·2·3,  18 = 2·3·3.  Common factors: 2·3.  GCF(12,18) = 6.
"""
from manim import *


class Lesson6NS3(Scene):
    def construct(self):
        title = Text("Greatest common factor", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        prob = Text("Find the GCF of 12 and 18", font_size=30, color=YELLOW).shift(UP * 1.5)
        self.play(Write(prob), run_time=1.4)

        # Two columns: prime factorizations
        col12 = VGroup(
            Text("12", font_size=34, color=BLUE),
            Text("= 2 × 2 × 3", font_size=30),
        ).arrange(DOWN, buff=0.2).shift(LEFT * 2.6 + UP * 0.1)
        col18 = VGroup(
            Text("18", font_size=34, color=ORANGE),
            Text("= 2 × 3 × 3", font_size=30),
        ).arrange(DOWN, buff=0.2).shift(RIGHT * 2.6 + UP * 0.1)
        self.play(Write(col12), Write(col18), run_time=1.4)
        self.wait(0.7)

        common = Text("Common factors: 2 × 3", font_size=30, color=YELLOW).shift(DOWN * 1.2)
        self.play(Write(common), run_time=1.4)

        gcf = Text("GCF = 6", font_size=42, color=GREEN, weight=BOLD).shift(DOWN * 2.2)
        self.play(Write(gcf), run_time=1.4)
        self.wait(0.84)

        # Bonus: distributive use
        bonus = Text("Use it: 18 + 24 = 6(3 + 4)", font_size=26, color=BLUE).shift(DOWN * 3.2)
        self.play(Write(bonus), run_time=1.4)
        self.wait(2.24)
# slowed
