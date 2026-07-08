"""6.EE Unit 9 — Writing & solving equations from words  (TeachingDeck)

Math (verified):
  • "a number plus 6 equals 14" → x + 6 = 14 → x = 14 − 6 = 8. Check: 8+6=14 ✓.
  • "n less than 12" = 12 − n (order reversed, NOT n − 12).
  • Marcos saves $25/week for w weeks: 25w. At w=3: 25×3=75.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6EE9(TeachingDeck):
    TITLE = "Writing & solving equations from words"
    DOMAIN = "6.EE"
    HOOK = "'A number plus 6 equals 14' — can you turn WORDS into math?"
    RECAP = [
        "Name the unknown: let x = ...",
        "Translate phrase by phrase",
        "Undo to solve, then check",
    ]

    def concept(self):
        pal = self.pal
        words = Text("a number  plus  6  equals  14", font_size=28, weight="BOLD").move_to(UP * 1.9)
        self.reveal(FadeIn(words), rt=1.4)
        self.breathe(1.6)

        symbols = Text("x + 6 = 14", font_size=40, color=YELLOW, weight="BOLD").move_to(UP * 0.8)
        self.reveal(FadeIn(symbols, shift=UP * 0.15), rt=1.4)
        self.breathe(1.6)

        steps = self.step_lines([
            ("subtract 6 from both sides", pal["step"]),
            ("x = 14 − 6 = 8", pal["step"]),
        ], anchor=DOWN * 0.4, size=27, gap=0.36)

        trap = Text("'n less than 12' = 12 − n\n(NOT n − 12!)", font_size=24, color=YELLOW,
                    weight="BOLD").move_to(DOWN * 2.3)
        self.reveal(FadeIn(trap, shift=UP * 0.15), rt=1.4)
        self.breathe(2.0)

        return VGroup(words, symbols, steps, trap)

    def example(self):
        pal = self.pal
        q = Text("Marcos saves $25 a week for w weeks. Write it, then find w = 3.",
                 font_size=25, color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        expr = Text("25w", font_size=40, color=YELLOW, weight="BOLD").move_to(UP * 0.9)
        self.reveal(FadeIn(expr, shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)

        steps = self.step_lines([
            ("25 × 3", pal["step"]),
            ("= 75", pal["step"]),
        ], anchor=DOWN * 0.3, size=30, gap=0.4)

        ans = answer_card(self, "75 dollars", pal["answer"], self.mascot, pos=DOWN * 2.1)
        self.breathe(2.0)
        return VGroup(q, expr, steps, ans)
