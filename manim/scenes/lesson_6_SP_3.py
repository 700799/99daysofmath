"""6.SP Unit 3 — Spread: range, IQR & MAD  (TeachingDeck)

Math (verified):
  • Range of 5, 9, 12, 20: max 20, min 5, 20−5=15.
  • Mean of 2,4,6 is 4; distance of 6 from mean = |6−4| = 2.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6SP3(TeachingDeck):
    TITLE = "Spread: range, IQR & MAD"
    DOMAIN = "6.SP"
    HOOK = "Two classes both average 80 on a test. Are they really the same? What if one has scores from 20 to 100?"
    RECAP = [
        "Range = max − min",
        "IQR = spread of the middle half",
        "MAD = average distance from the mean",
    ]

    def concept(self):
        pal = self.pal
        data = Text("Data: 5, 9, 12, 20", font_size=32, color=YELLOW, weight="BOLD").move_to(UP * 2.1)
        self.reveal(FadeIn(data), rt=1.3)
        self.breathe(1.4)

        nl = NumberLine(x_range=[0, 25, 5], length=9.5, color=GREY_B,
                        include_numbers=True, font_size=20)
        nl.move_to(UP * 0.6)
        self.reveal(Create(nl), rt=1.4)
        dots = VGroup(*[Dot(nl.n2p(v), color=BLUE, radius=0.12) for v in [5, 9, 12, 20]])
        self.reveal(LaggedStart(*[FadeIn(d, scale=1.4) for d in dots], lag_ratio=0.2), rt=1.5)
        self.breathe(1.4)

        minl = Text("min = 5", font_size=22, color=GREEN, weight="BOLD").next_to(dots[0], UP, buff=0.2)
        maxl = Text("max = 20", font_size=22, color=GREEN, weight="BOLD").next_to(dots[3], UP, buff=0.2)
        bracket = DoubleArrow(nl.n2p(5), nl.n2p(20), color=ORANGE, buff=0.05, stroke_width=4)
        bracket.shift(DOWN * 0.9)
        self.reveal(FadeIn(minl), FadeIn(maxl), rt=1.3)
        self.reveal(GrowArrow(bracket), rt=1.4)
        cap = Text("Range = 20 − 5 = 15", font_size=28, color=ORANGE, weight="BOLD").move_to(DOWN * 2.0)
        self.reveal(FadeIn(cap, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(data, nl, dots, minl, maxl, bracket, cap)

    def example(self):
        pal = self.pal
        q = Text("Mean of 2, 4, 6 is 4. Distance of 6 from the mean?", font_size=27,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("|6 − 4|", pal["step"]),
        ], anchor=UP * 0.6, size=30, gap=0.4)

        ans = answer_card(self, "2", pal["answer"], self.mascot, pos=DOWN * 1.3)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
