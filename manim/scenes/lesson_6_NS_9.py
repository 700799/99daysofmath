"""6.NS Unit 9 — Opposites & absolute value  (TeachingDeck)

Math (verified):
  • Opposite of 6 is −6 (mirror across 0, same distance 6).
    |6| = 6, |−6| = 6 (both 6 units from 0).
  • opposite(opposite(−3)): opposite(−3) = 3 (mirror −3 across 0 → 3);
    opposite(3) = −3 (mirror 3 across 0 → −3). Final answer −3. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


class Lesson6NS9(TeachingDeck):
    TITLE = "Opposites & absolute value"
    DOMAIN = "6.NS"
    HOOK = "If 5 steps forward is +5, what's 5 steps... backward?"
    RECAP = [
        "Opposite = mirror across 0",
        "|n| = distance from 0, never negative",
        "Opposite of opposite = back home",
    ]

    def concept(self):
        pal = self.pal
        line = NumberLine(x_range=[-8, 8, 1], length=10.0, color=GREY_B,
                          include_numbers=True, font_size=20)
        line.move_to(UP * 1.2)
        self.reveal(Create(line), rt=1.6)
        self.breathe(1.6)

        d6 = Dot(line.n2p(6), color=BLUE, radius=0.11)
        l6 = Text("6", font_size=24, color=BLUE, weight="BOLD").next_to(d6, UP, buff=0.15)
        self.reveal(FadeIn(d6, scale=1.4), FadeIn(l6), rt=1.2)
        self.breathe(1.4)

        arc = CurvedArrow(line.n2p(6) + UP * 0.05, line.n2p(-6) + UP * 0.05,
                          color=ORANGE, angle=-2.3)
        dm6 = Dot(line.n2p(-6), color=ORANGE, radius=0.11)
        lm6 = Text("−6", font_size=24, color=ORANGE, weight="BOLD").next_to(dm6, UP, buff=0.15)
        self.reveal(Create(arc), FadeIn(dm6, scale=1.4), FadeIn(lm6), rt=1.6)
        cap0 = Text("opposite of 6 is −6", font_size=28, color=pal["accent"], weight="BOLD")
        cap0.move_to(DOWN * 0.3)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        b6 = Brace(Line(line.n2p(0), line.n2p(6)), direction=DOWN, color=BLUE)
        b6_lbl = Text("distance 6", font_size=22, color=BLUE).next_to(b6, DOWN, buff=0.08)
        bm6 = Brace(Line(line.n2p(-6), line.n2p(0)), direction=DOWN, color=ORANGE)
        bm6_lbl = Text("distance 6", font_size=22, color=ORANGE).next_to(bm6, DOWN, buff=0.08)
        b6.shift(DOWN * 0.9); b6_lbl.shift(DOWN * 0.9)
        bm6.shift(DOWN * 0.9); bm6_lbl.shift(DOWN * 0.9)
        self.reveal(GrowFromCenter(b6), FadeIn(b6_lbl), GrowFromCenter(bm6), FadeIn(bm6_lbl), rt=1.6)
        cap1 = Text(_wrap("|6| = 6 and |−6| = 6 — absolute value is always the distance, never negative.", 44),
                    font_size=24, color=pal["step"])
        cap1.move_to(DOWN * 2.4)
        self.reveal(FadeIn(cap1, shift=UP * 0.15), rt=1.4)
        self.breathe(2.0)

        return VGroup(line, d6, l6, arc, dm6, lm6, cap0, b6, b6_lbl, bm6, bm6_lbl, cap1)

    def example(self):
        pal = self.pal
        q = Text("opposite of (opposite of −3)?", font_size=30, color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        line = NumberLine(x_range=[-5, 5, 1], length=9.0, color=GREY_B,
                          include_numbers=True, font_size=20)
        line.move_to(UP * 1.5)
        self.reveal(Create(line), rt=1.4)

        d = Dot(line.n2p(-3), color=GREEN, radius=0.12)
        lbl = Text("−3", font_size=24, color=GREEN, weight="BOLD").next_to(d, DOWN, buff=0.15)
        self.reveal(FadeIn(d, scale=1.4), FadeIn(lbl), rt=1.2)
        self.breathe(1.4)

        self.reveal(d.animate.move_to(line.n2p(3)), lbl.animate.move_to(line.n2p(3) + DOWN * 0.5),
                    rt=1.5)
        self.breathe(1.4)
        lbl2 = Text("3", font_size=24, color=ORANGE, weight="BOLD").next_to(d, UP, buff=0.15)
        self.reveal(FadeOut(lbl), FadeIn(lbl2), rt=1.0)

        steps = self.step_lines([
            ("opposite of −3 = 3", ORANGE),
            ("opposite of 3 = −3 (back home!)", GREEN),
        ], anchor=DOWN * 0.6, size=26)

        self.reveal(d.animate.move_to(line.n2p(-3)), rt=1.4)
        self.breathe(1.6)

        ans = answer_card(self, "= −3", pal["answer"], self.mascot, pos=DOWN * 2.4)
        self.breathe(2.0)
        return VGroup(q, line, d, lbl2, steps, ans)
