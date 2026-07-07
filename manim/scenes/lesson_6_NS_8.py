"""6.NS Unit 8 — Comparing & ordering signed numbers  (TeachingDeck)

Math (verified):
  • Ordering −5, −2, 0 least→greatest: on a number line −5 is leftmost,
    then −2, then 0 → −5, −2, 0. ✓
  • Which is greater, −4 or −9? Both negative; −4 sits to the right of −9
    on the number line, so −4 > −9. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


class Lesson6NS8(TeachingDeck):
    TITLE = "Comparing & ordering signed numbers"
    DOMAIN = "6.NS"
    HOOK = "Which is warmer: −4°C or −9°C? Does the bigger digit always mean bigger number?"
    RECAP = [
        "Right on the line = bigger",
        "Any negative < any positive",
        "Closer to 0 wins among negatives",
    ]

    def concept(self):
        pal = self.pal
        line = NumberLine(x_range=[-10, 10, 1], length=10.2, color=GREY_B,
                          include_numbers=True, font_size=20)
        line.move_to(UP * 1.0)
        self.reveal(Create(line), rt=1.6)
        self.breathe(1.6)

        d0 = Dot(line.n2p(0), color=YELLOW, radius=0.11)
        dm2 = Dot(line.n2p(-2), color=ORANGE, radius=0.11)
        dm5 = Dot(line.n2p(-5), color=GREEN, radius=0.11)
        l0 = Text("0", font_size=24, color=YELLOW, weight="BOLD").next_to(d0, UP, buff=0.15)
        lm2 = Text("−2", font_size=24, color=ORANGE, weight="BOLD").next_to(dm2, UP, buff=0.15)
        lm5 = Text("−5", font_size=24, color=GREEN, weight="BOLD").next_to(dm5, UP, buff=0.15)
        self.reveal(FadeIn(d0, scale=1.4), FadeIn(dm2, scale=1.4), FadeIn(dm5, scale=1.4),
                    FadeIn(l0), FadeIn(lm2), FadeIn(lm5), rt=1.6)
        cap0 = Text("Right = bigger, Left = smaller", font_size=28, color=pal["accent"], weight="BOLD")
        cap0.move_to(DOWN * 0.4)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        chain = Text("−5  <  −2  <  0", font_size=34, color=pal["step"], weight="BOLD")
        chain.move_to(DOWN * 1.3)
        self.reveal(FadeIn(chain, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        dp3 = Dot(line.n2p(3), color=BLUE, radius=0.11)
        lp3 = Text("3", font_size=24, color=BLUE, weight="BOLD").next_to(dp3, UP, buff=0.15)
        cap1 = Text("ANY negative < ANY positive", font_size=26, color=BLUE, weight="BOLD")
        cap1.move_to(DOWN * 2.2)
        self.reveal(FadeIn(dp3, scale=1.4), FadeIn(lp3), FadeIn(cap1, shift=UP * 0.15), rt=1.5)
        self.breathe(1.8)

        return VGroup(line, d0, dm2, dm5, l0, lm2, lm5, cap0, chain, dp3, lp3, cap1)

    def example(self):
        pal = self.pal
        q = Text("Which is greater: −4 or −9?", font_size=30, color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        line = NumberLine(x_range=[-10, 1, 1], length=9.6, color=GREY_B,
                          include_numbers=True, font_size=20)
        line.move_to(UP * 0.6)
        self.reveal(Create(line), rt=1.5)

        dm4 = Dot(line.n2p(-4), color=ORANGE, radius=0.11)
        dm9 = Dot(line.n2p(-9), color=GREEN, radius=0.11)
        lm4 = Text("−4", font_size=24, color=ORANGE, weight="BOLD").next_to(dm4, UP, buff=0.15)
        lm9 = Text("−9", font_size=24, color=GREEN, weight="BOLD").next_to(dm9, UP, buff=0.15)
        self.reveal(FadeIn(dm4, scale=1.4), FadeIn(dm9, scale=1.4), FadeIn(lm4), FadeIn(lm9), rt=1.5)
        self.breathe(1.6)

        b9 = Brace(Line(line.n2p(-9), line.n2p(0)), direction=DOWN, color=GREEN)
        b9_lbl = Text("9 away from 0", font_size=22, color=GREEN).next_to(b9, DOWN, buff=0.1)
        b4 = Brace(Line(line.n2p(-4), line.n2p(0)), direction=DOWN, color=ORANGE)
        b4_lbl = Text("4 away from 0", font_size=22, color=ORANGE).next_to(b4, DOWN, buff=0.1)
        b4.shift(DOWN * 0.9)
        b4_lbl.shift(DOWN * 0.9)
        self.reveal(GrowFromCenter(b9), FadeIn(b9_lbl), rt=1.4)
        self.breathe(1.4)
        self.reveal(GrowFromCenter(b4), FadeIn(b4_lbl), rt=1.4)
        self.breathe(1.6)

        steps = self.step_lines([
            ("−9 is 9 away from 0", GREEN),
            ("−4 is 4 away from 0", ORANGE),
            ("closer to 0 = greater", pal["step"]),
        ], anchor=RIGHT * 3.0 + DOWN * 1.6, size=24, gap=0.3)

        ans = answer_card(self, "−4 > −9", pal["answer"], self.mascot, pos=DOWN * 2.6 + LEFT * 3.2)
        self.breathe(2.0)
        return VGroup(q, line, dm4, dm9, lm4, lm9, b9, b9_lbl, b4, b4_lbl, steps, ans)
