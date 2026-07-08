"""6.SP Unit 7 — Statistical questions  (TeachingDeck)

Math (verified):
  • "How tall am I?" → one answer, about one person → NOT statistical.
  • "How tall are the students in my class?" → many students, many
    different heights → IS statistical (answers vary).
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6SP7(TeachingDeck):
    TITLE = "Statistical questions"
    DOMAIN = "6.SP"
    HOOK = "'How tall am I?' vs 'How tall are the students in my class?' — one of these is a statistical question. Which?"
    RECAP = [
        "Statistical question → answers VARY",
        "One-answer question → NOT statistical",
        "Look for group words: each, every, students",
    ]

    def concept(self):
        pal = self.pal
        q1 = Text("How tall am I?", font_size=32, color=ORANGE, weight="BOLD").move_to(UP * 1.6 + LEFT * 3.2)
        one = Text("ONE person, ONE answer", font_size=22, color=pal["step"]).next_to(q1, DOWN, buff=0.3)
        cross = Text("✗ not statistical", font_size=24, color=RED, weight="BOLD").next_to(one, DOWN, buff=0.3)
        self.reveal(FadeIn(q1), rt=1.3)
        self.breathe(1.2)
        self.reveal(FadeIn(one), FadeIn(cross), rt=1.4)
        self.breathe(1.6)

        q2 = Text("How tall are the students\nin my class?", font_size=30, color=GREEN,
                  weight="BOLD").move_to(UP * 1.5 + RIGHT * 2.6)
        many = Text("MANY students, MANY heights", font_size=22, color=pal["step"]).next_to(q2, DOWN, buff=0.35)
        check = Text("✓ statistical!", font_size=24, color=GREEN, weight="BOLD").next_to(many, DOWN, buff=0.3)
        self.reveal(FadeIn(q2), rt=1.3)
        self.breathe(1.2)
        self.reveal(FadeIn(many), FadeIn(check), rt=1.4)
        self.breathe(2.0)

        return VGroup(q1, one, cross, q2, many, check)

    def example(self):
        pal = self.pal
        q = Text("Is 'How many days are in February 2025?' statistical?", font_size=26,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("one fact, one answer", pal["step"]),
        ], anchor=UP * 0.6, size=30, gap=0.4)

        ans = answer_card(self, "no", pal["answer"], self.mascot, pos=DOWN * 1.3)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
