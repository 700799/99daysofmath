"""5.F Unit 4 — Decimals: place value & operations  (TeachingDeck)

Math (verified):
  • 0.3 + 0.45: write 0.3 as 0.30. 0.30 + 0.45 = 0.75.
  • 0.5 × 0.8: 5 × 8 = 40; two decimal places total → 0.40 = 0.4.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson5F4Idea(TeachingDeck):
    TITLE = "Decimals: place value & operations"
    DOMAIN = "5.F"
    HOOK = "Which is bigger: 0.5 or 0.45? The one with more digits isn't always bigger!"
    RECAP = [
        "Line up the decimal points to add/subtract",
        "Same # of places to compare",
        "Count decimal places when you multiply",
    ]

    def concept(self):
        pal = self.pal
        top = Text("0.50", font_size=42, weight="BOLD", color=GREEN).move_to(UP * 1.6 + LEFT * 2.5)
        bot = Text("0.45", font_size=42, weight="BOLD", color=ORANGE).move_to(UP * 0.5 + LEFT * 2.5)
        self.reveal(FadeIn(top), rt=1.3)
        self.breathe(1.3)
        self.reveal(FadeIn(bot), rt=1.3)
        self.breathe(1.4)

        cap0 = Text("Same # of decimal places →\neasy to compare!", font_size=26, color=pal["accent"],
                    weight="BOLD").move_to(RIGHT * 2.2 + UP * 1.1)
        gt = Text("0.50 > 0.45", font_size=34, color=GREEN, weight="BOLD").move_to(DOWN * 1.0)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.4)
        self.breathe(1.6)
        self.reveal(FadeIn(gt, scale=1.2), rt=1.3)
        self.breathe(1.8)

        cap1 = Text("Longer isn't bigger: 45 has more digits\nbut 0.5 = 0.50 still wins!", font_size=24,
                    color=YELLOW, weight="BOLD").move_to(DOWN * 2.2)
        self.reveal(FadeIn(cap1, shift=UP * 0.15), rt=1.4)
        self.breathe(2.0)

        return VGroup(top, bot, cap0, gt, cap1)

    def example(self):
        pal = self.pal
        q = Text("0.3 + 0.45 = ?", font_size=34, color=pal["accent"], weight="BOLD").move_to(UP * 2.2)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        steps = self.step_lines([
            ("write 0.3 as 0.30", pal["step"]),
            ("0.30 + 0.45", pal["step"]),
        ], anchor=UP * 0.7, size=30, gap=0.4)

        ans = answer_card(self, "0.75", pal["answer"], self.mascot, pos=DOWN * 1.7)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
