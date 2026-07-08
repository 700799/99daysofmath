"""5.F Unit 6 — Coordinate plane, patterns & line plots  (TeachingDeck)

Math (verified):
  • Plot: right 3, up 2 from origin → (3, 2).
  • Pattern 0, 4, 8, ...: jump +4. 5th term = 0 + 4×4 = 16.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson5F6Idea(TeachingDeck):
    TITLE = "Coordinate plane, patterns & line plots"
    DOMAIN = "5.F"
    HOOK = "Right 3, up 2 from home. Can you name that exact spot with just two numbers?"
    RECAP = [
        "(x, y): across first, then up",
        "Pattern: start + jump × (n − 1)",
        "On a line plot, each X = one data value",
    ]

    def concept(self):
        pal = self.pal
        axes = Axes(x_range=[-1, 6, 1], y_range=[-1, 5, 1], x_length=4.6, y_length=4.0,
                   tips=False, axis_config={"color": GREY_B, "include_numbers": False})
        axes.move_to(LEFT * 3.9 + DOWN * 0.2)
        self.reveal(Create(axes), rt=1.5)
        self.breathe(1.4)

        a1 = Arrow(axes.c2p(0, 0), axes.c2p(3, 0), color=ORANGE, buff=0, stroke_width=5)
        a1_lbl = Text("across: 3", font_size=22, color=ORANGE, weight="BOLD").next_to(a1, DOWN, buff=0.1)
        self.reveal(GrowArrow(a1), FadeIn(a1_lbl), rt=1.4)
        self.breathe(1.4)

        a2 = Arrow(axes.c2p(3, 0), axes.c2p(3, 2), color=GREEN, buff=0, stroke_width=5)
        a2_lbl = Text("up: 2", font_size=22, color=GREEN, weight="BOLD").next_to(a2, RIGHT, buff=0.1)
        pt = Dot(axes.c2p(3, 2), color=YELLOW, radius=0.11)
        pt_lbl = Text("(3, 2)", font_size=24, color=YELLOW, weight="BOLD").next_to(pt, UP, buff=0.15)
        self.reveal(GrowArrow(a2), FadeIn(a2_lbl), FadeIn(pt, scale=1.5), FadeIn(pt_lbl), rt=1.6)
        cap = Text("Across first, THEN up —\n\"run before you jump!\"", font_size=26, color=pal["accent"],
                   weight="BOLD").move_to(RIGHT * 2.0 + UP * 1.2)
        self.reveal(FadeIn(cap, shift=UP * 0.15), rt=1.4)
        self.breathe(2.0)

        return VGroup(axes, a1, a1_lbl, a2, a2_lbl, pt, pt_lbl, cap)

    def example(self):
        pal = self.pal
        q = Text("Pattern 0, 4, 8, ... What's the 5th term?", font_size=30,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.8)

        terms = VGroup(*[Text(str(n), font_size=32, weight="BOLD") for n in [0, 4, 8]])
        terms.arrange(RIGHT, buff=1.0).move_to(UP * 0.8)
        self.reveal(FadeIn(terms), rt=1.3)
        arrows = VGroup(*[Text("+4", font_size=22, color=ORANGE, weight="BOLD") for _ in range(2)])
        for i, a in enumerate(arrows):
            a.move_to((terms[i].get_center() + terms[i + 1].get_center()) / 2 + UP * 0.4)
        self.reveal(FadeIn(arrows), rt=1.2)
        self.breathe(1.6)

        steps = self.step_lines([
            ("four jumps of +4 from 0", pal["step"]),
            ("0 + 4 × 4", pal["step"]),
        ], anchor=DOWN * 0.6, size=28, gap=0.4)

        ans = answer_card(self, "16", pal["answer"], self.mascot, pos=DOWN * 2.2)
        self.breathe(2.0)
        return VGroup(q, terms, arrows, steps, ans)
