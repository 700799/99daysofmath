"""6.EE Unit 3 — Equivalent expressions (distribute).
Math (verified):  3(x + 2) = 3·x + 3·2 = 3x + 6.
"""
from manim import *


class Lesson6EE3(Scene):
    def construct(self):
        title = Text("The distributive property", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        # The expression with positions to anchor arrows
        three = Text("3", font_size=64, color=BLUE).shift(LEFT * 2.0 + UP * 0.5)
        paren_l = Text("(", font_size=64).next_to(three, RIGHT, buff=0.05)
        x_term = Text("x", font_size=64).next_to(paren_l, RIGHT, buff=0.15)
        plus = Text("+", font_size=64).next_to(x_term, RIGHT, buff=0.20)
        two = Text("2", font_size=64).next_to(plus, RIGHT, buff=0.20)
        paren_r = Text(")", font_size=64).next_to(two, RIGHT, buff=0.05)
        group = VGroup(three, paren_l, x_term, plus, two, paren_r)
        self.play(Write(group))
        self.wait(0.4)

        # Arrows from 3 to x and from 3 to 2
        arc1 = CurvedArrow(three.get_top() + UP * 0.1, x_term.get_top() + UP * 0.1,
                           angle=-PI / 2.5, color=YELLOW, tip_length=0.18)
        arc2 = CurvedArrow(three.get_bottom() + DOWN * 0.1, two.get_bottom() + DOWN * 0.1,
                           angle=PI / 2.5, color=YELLOW, tip_length=0.18)
        self.play(Create(arc1))
        self.play(Create(arc2))
        self.wait(0.3)

        step = Text("= 3 · x  +  3 · 2", font_size=38).shift(DOWN * 1.4)
        self.play(Write(step))

        ans = Text("= 3x + 6", font_size=52, color=GREEN, weight=BOLD).shift(DOWN * 2.6)
        self.play(Write(ans))
        self.wait(2)
