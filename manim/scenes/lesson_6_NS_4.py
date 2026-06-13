"""6.NS Unit 4 — Integers & absolute value.
Math (verified):  |-7| = 7  (distance from 0 on the number line).
"""
from manim import *


class Lesson6NS4(Scene):
    def construct(self):
        title = Text("Absolute value = distance from 0", font_size=38, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        # Number line from -10 to 10
        nl = NumberLine(
            x_range=[-10, 10, 1],
            length=11,
            include_numbers=True,
            label_direction=DOWN,
            font_size=22,
            color=GREY,
        ).shift(DOWN * 0.4)
        self.play(Create(nl), run_time=1.4)
        self.wait(0.42)

        # Mark -7 with a red dot
        p = Dot(nl.n2p(-7), color=RED, radius=0.13)
        p_lbl = Text("-7", font_size=26, color=RED).next_to(p, UP, buff=0.15)
        zero = Dot(nl.n2p(0), color=YELLOW, radius=0.1)
        self.play(FadeIn(p), Write(p_lbl), FadeIn(zero), run_time=1.4)

        # Arrow from -7 to 0 showing distance 7
        arrow = Arrow(nl.n2p(-7), nl.n2p(0), color=YELLOW, buff=0.05, stroke_width=4)
        dist = Text("distance = 7", font_size=26, color=YELLOW).next_to(arrow, UP, buff=0.25)
        self.play(GrowArrow(arrow), Write(dist), run_time=1.4)
        self.wait(0.84)

        # Conclusion
        eq = Text("| -7 |  =  7", font_size=44, color=GREEN, weight=BOLD).shift(UP * 1.6)
        self.play(Write(eq), run_time=1.4)
        self.wait(2.8)
# slowed
