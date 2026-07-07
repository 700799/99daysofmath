"""6.EE Unit 8 — Equivalent expressions & checking solutions  (TeachingDeck)

Math (verified):
  • 2(x+3) = 2x+6 (distribute). Check x=2: 2(5)=10, 2(2)+6=10 ✓.
  • Is x=4 a solution to x+5=9? 4+5=9 ✓ → yes.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6EE8(TeachingDeck):
    TITLE = "Equivalent expressions & checking solutions"
    DOMAIN = "6.EE"
    HOOK = "Are 2(x + 3) and 2x + 6 secretly the SAME, for every x?"
    RECAP = [
        "Equivalent = same value for any x",
        "Test with a number to check",
        "A solution makes both sides equal",
    ]

    def concept(self):
        pal = self.pal
        left = Text("2(x + 3)", font_size=40, weight="BOLD").move_to(UP * 1.8 + LEFT * 3.0)
        right = Text("2x + 6", font_size=40, weight="BOLD", color=YELLOW).move_to(UP * 1.8 + RIGHT * 3.0)
        arrow = Arrow(left.get_right(), right.get_left(), color=ORANGE, buff=0.3)
        self.reveal(FadeIn(left), rt=1.2)
        self.breathe(1.2)
        self.reveal(GrowArrow(arrow), FadeIn(right), rt=1.5)
        cap0 = Text("distribute the 2 into both x and 3", font_size=24, color=pal["accent"],
                    weight="BOLD").move_to(UP * 0.9)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        test = Text("Test x = 2:", font_size=26, color=pal["step"], weight="BOLD").move_to(DOWN * 0.3)
        left2 = Text("2(2+3) = 2(5) = 10", font_size=26, color=pal["step"]).move_to(DOWN * 1.1 + LEFT * 2.2)
        right2 = Text("2(2)+6 = 10", font_size=26, color=YELLOW).move_to(DOWN * 1.1 + RIGHT * 2.2)
        check = Text("✓ equal!", font_size=28, color=GREEN, weight="BOLD").move_to(DOWN * 2.0)
        self.reveal(FadeIn(test), rt=1.2)
        self.breathe(1.2)
        self.reveal(FadeIn(left2), FadeIn(right2), rt=1.4)
        self.breathe(1.4)
        self.reveal(FadeIn(check, scale=1.2), rt=1.3)
        self.breathe(1.8)

        return VGroup(left, right, arrow, cap0, test, left2, right2, check)

    def example(self):
        pal = self.pal
        q = Text("Is x = 4 a solution to x + 5 = 9?", font_size=30,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.2)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.8)

        steps = self.step_lines([
            ("substitute x = 4", pal["step"]),
            ("4 + 5 = 9", pal["step"]),
            ("true! ✓", GREEN),
        ], anchor=UP * 0.5, size=30, gap=0.4)

        ans = answer_card(self, "Yes, x = 4 works", pal["answer"], self.mascot, pos=DOWN * 2.0)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
