"""6.EE Unit 7 — Parts of expressions  (TeachingDeck)

Math (verified):
  • 4x + 7: terms {4x, 7}, coefficient of x-term = 4, constant = 7.
  • 5x − 2 + 3: constants −2 and 3 combine to +1 → simplified 5x + 1 → 2 terms.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6EE7(TeachingDeck):
    TITLE = "Parts of expressions"
    DOMAIN = "6.EE"
    HOOK = "In 4x + 7, how many separate 'pieces' are hiding?"
    RECAP = [
        "Term = piece split by + or −",
        "Coefficient = number on the variable",
        "Constant = no variable attached",
    ]

    def concept(self):
        pal = self.pal
        expr = Text("4x + 7", font_size=52, weight="BOLD").move_to(UP * 1.6)
        self.reveal(FadeIn(expr, shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)

        term1_box = SurroundingRectangle(expr[0:2], color=BLUE, buff=0.12)
        term1_lbl = Text("term", font_size=24, color=BLUE, weight="BOLD").next_to(term1_box, DOWN, buff=0.3)
        self.reveal(Create(term1_box), FadeIn(term1_lbl), rt=1.3)
        self.breathe(1.4)

        term2_box = SurroundingRectangle(expr[5:6], color=GREEN, buff=0.12)
        term2_lbl = Text("term", font_size=24, color=GREEN, weight="BOLD").next_to(term2_box, DOWN, buff=0.3)
        self.reveal(Create(term2_box), FadeIn(term2_lbl), rt=1.3)
        self.breathe(1.4)

        coef_ring = Circle(radius=0.28, color=ORANGE, stroke_width=4).move_to(expr[0].get_center())
        coef_lbl = Text("coefficient", font_size=22, color=ORANGE, weight="BOLD").next_to(coef_ring, UP, buff=0.5)
        self.reveal(Create(coef_ring), FadeIn(coef_lbl), rt=1.3)
        self.breathe(1.6)

        const_lbl = Text("constant (no variable)", font_size=22, color=GREEN,
                         weight="BOLD").next_to(term2_lbl, DOWN, buff=0.5)
        self.reveal(FadeIn(const_lbl, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        return VGroup(expr, term1_box, term1_lbl, term2_box, term2_lbl, coef_ring, coef_lbl, const_lbl)

    def example(self):
        pal = self.pal
        q = Text("Simplify then count parts: 5x − 2 + 3", font_size=28,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.8)

        steps = self.step_lines([
            ("combine the constants: −2 + 3 = 1", pal["step"]),
            ("simplified: 5x + 1", pal["step"]),
            ("2 terms: 5x and 1", pal["step"]),
        ], anchor=UP * 0.7, size=27, gap=0.36)

        ans = answer_card(self, "2 terms", pal["answer"], self.mascot, pos=DOWN * 2.1)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
