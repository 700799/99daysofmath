"""6.EE Unit 5 — Inequalities.
Math (verified):  x ≥ 2  →  graph: closed circle at 2, shade to the right.
"""
from manim import *


class Lesson6EE5(Scene):
    def construct(self):
        title = Text("Graphing inequalities", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        ineq = Text("x ≥ 2", font_size=58, color=YELLOW, weight=BOLD).shift(UP * 1.0)
        self.play(Write(ineq), run_time=1.4)
        self.wait(0.42)

        rule = Text("'≥' includes the number → CLOSED circle", font_size=26, color=BLUE).shift(UP * 0.0)
        self.play(Write(rule), run_time=1.4)

        # Number line
        nl = NumberLine(
            x_range=[-3, 7, 1],
            length=10,
            include_numbers=True,
            label_direction=DOWN,
            font_size=22,
            color=GREY,
        ).shift(DOWN * 1.5)
        self.play(Create(nl), run_time=1.4)

        # Closed circle at 2
        dot = Dot(nl.n2p(2), color=GREEN, radius=0.18)
        # Shading to the right of 2: a thick highlight line
        shade = Line(nl.n2p(2), nl.n2p(7), color=GREEN, stroke_width=8).set_opacity(0.85)
        # Arrow at the far right showing it continues
        arrow = Arrow(nl.n2p(6.7), nl.n2p(7.3), color=GREEN, buff=0, stroke_width=6)
        self.play(FadeIn(dot), run_time=1.4)
        self.play(Create(shade), GrowArrow(arrow), run_time=1.4)

        caption = Text("All numbers 2 or greater", font_size=26, color=GREEN, weight=BOLD).shift(DOWN * 3.0)
        self.play(Write(caption), run_time=1.4)
        self.wait(2.8)
# slowed
