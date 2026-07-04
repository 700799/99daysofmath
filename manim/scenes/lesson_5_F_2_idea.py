"""5.F Unit 2 idea — Adding & subtracting fractions  (TeachingDeck)

Math (verified):
  • 1/2 = 3/6 and 1/3 = 2/6  →  1/2 + 1/3 = 3/6 + 2/6 = 5/6 (NOT 2/5).
  • 1/2 = 2/4  →  3/4 − 1/2 = 3/4 − 2/4 = 1/4.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card

BAR_W = 5.2
BAR_H = 0.72


def frac_bar(n, shaded, color, width=BAR_W, height=BAR_H):
    """A fraction bar: n equal cells, the first `shaded` filled."""
    cells = VGroup()
    for i in range(n):
        r = Rectangle(width=width / n, height=height,
                      stroke_color=WHITE, stroke_width=3)
        r.set_fill(color, opacity=0.8 if i < shaded else 0.06)
        cells.add(r)
    cells.arrange(RIGHT, buff=0)
    return cells


class Lesson5F2Idea(TeachingDeck):
    TITLE = "Adding & subtracting fractions"
    DOMAIN = "5.F"
    HOOK = "Half a pizza plus a third of a pizza... is that 2/5? Guess!"
    RECAP = [
        "Only SAME-size pieces can add",
        "Rewrite with a common denominator",
        "Then add the tops — never the bottoms!",
    ]

    def concept(self):
        pal = self.pal
        cx = LEFT * 0.9
        # ── Two bars with different-size pieces ──
        bar_half = frac_bar(2, 1, BLUE).move_to(cx + UP * 1.45)
        lab_half = Text("1/2", font_size=30, color=BLUE, weight="BOLD")
        lab_half.next_to(bar_half, LEFT, buff=0.35)
        self.reveal(Create(bar_half), FadeIn(lab_half), rt=1.5)
        self.breathe(1.6)

        bar_third = frac_bar(3, 1, ORANGE).move_to(cx + UP * 0.35)
        lab_third = Text("1/3", font_size=30, color=ORANGE, weight="BOLD")
        lab_third.next_to(bar_third, LEFT, buff=0.35)
        self.reveal(Create(bar_third), FadeIn(lab_third), rt=1.5)
        self.breathe(1.6)

        clash = Text("Different-size pieces — we can't add these yet!",
                     font_size=26, color=YELLOW, weight="BOLD")
        clash.move_to(cx + DOWN * 0.72)
        self.reveal(FadeIn(clash, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        # ── Split BOTH bars into sixths — now every piece matches ──
        bar_half6 = frac_bar(6, 3, BLUE).move_to(bar_half)
        bar_third6 = frac_bar(6, 2, ORANGE).move_to(bar_third)
        lab_half6 = Text("1/2 = 3/6", font_size=30, color=BLUE, weight="BOLD")
        lab_half6.next_to(bar_half6, LEFT, buff=0.35)
        lab_third6 = Text("1/3 = 2/6", font_size=30, color=ORANGE, weight="BOLD")
        lab_third6.next_to(bar_third6, LEFT, buff=0.35)
        self.reveal(ReplacementTransform(bar_half, bar_half6),
                    ReplacementTransform(lab_half, lab_half6), rt=1.6)
        self.reveal(ReplacementTransform(bar_third, bar_third6),
                    ReplacementTransform(lab_third, lab_third6), rt=1.6)
        self.breathe(1.8)

        match = Text("Now every piece is a sixth — same size!",
                     font_size=26, color=GREEN, weight="BOLD")
        match.move_to(cx + DOWN * 0.72)
        self.reveal(FadeOut(clash), FadeIn(match, shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)

        # ── The payoff: count the sixths ──
        total = Text("3/6 + 2/6 = 5/6   (not 2/5!)", font_size=32,
                     color=pal["step"], weight="BOLD").move_to(cx + DOWN * 1.8)
        self.reveal(FadeIn(total, shift=UP * 0.2), rt=1.4)
        self.breathe(2.2)

        return VGroup(bar_half6, bar_third6, lab_half6, lab_third6, match, total)

    def example(self):
        pal = self.pal
        q = Text("Subtract 3/4 − 1/2", font_size=32, color=pal["step"], weight="BOLD")
        q.move_to(UP * 2.05)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        cx = LEFT * 2.9
        # 3/4 bar and a 1/2 bar that becomes 2/4.
        bar34 = frac_bar(4, 3, GREEN, width=4.4, height=0.62).move_to(cx + UP * 1.0)
        lab34 = Text("3/4", font_size=28, color=GREEN, weight="BOLD")
        lab34.next_to(bar34, LEFT, buff=0.3)
        self.reveal(Create(bar34), FadeIn(lab34), rt=1.5)
        self.breathe(1.6)

        bar12 = frac_bar(2, 1, BLUE, width=4.4, height=0.62).move_to(cx + DOWN * 0.05)
        lab12 = Text("1/2", font_size=28, color=BLUE, weight="BOLD")
        lab12.next_to(bar12, LEFT, buff=0.3)
        self.reveal(Create(bar12), FadeIn(lab12), rt=1.5)
        self.breathe(1.6)

        # Match the pieces: 1/2 becomes 2/4.
        bar24 = frac_bar(4, 2, BLUE, width=4.4, height=0.62).move_to(bar12)
        lab24 = Text("1/2 = 2/4", font_size=28, color=BLUE, weight="BOLD")
        lab24.next_to(bar24, LEFT, buff=0.3)
        self.reveal(ReplacementTransform(bar12, bar24),
                    ReplacementTransform(lab12, lab24), rt=1.6)
        self.breathe(1.8)

        # Cross off the 2 quarters we take away from the 3/4 bar.
        crosses = VGroup(*[
            Cross(bar34[i], stroke_color=YELLOW, stroke_width=5, scale_factor=0.7)
            for i in range(2)
        ])
        take = Text("take away 2 quarters", font_size=24, color=YELLOW, weight="BOLD")
        take.next_to(bar34, UP, buff=0.22)
        self.reveal(LaggedStart(*[Create(c) for c in crosses], lag_ratio=0.35),
                    FadeIn(take), rt=1.6)
        self.breathe(1.6)

        steps = self.step_lines([
            ("match the pieces: 1/2 = 2/4", BLUE),
            ("3/4 − 2/4 = 1/4", WHITE),
        ], anchor=RIGHT * 2.0 + UP * 0.6, size=28)
        self.breathe(1.6)

        ans = answer_card(self, "3/4 − 1/2 = 1/4", pal["answer"], self.mascot,
                          pos=DOWN * 2.0 + LEFT * 0.7)
        self.breathe(2.0)
        return VGroup(q, bar34, lab34, bar24, lab24, crosses, take, steps, ans)
