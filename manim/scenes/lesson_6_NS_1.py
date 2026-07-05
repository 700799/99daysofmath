"""6.NS Unit 1 — Adding & subtracting decimals  (TeachingDeck)

Math (verified):
  • 3.4 + 1.25: align the decimal points, write 3.4 as 3.40.
    hundredths 0+5=5, tenths 4+2=6, ones 3+1=4 → 3.40 + 1.25 = 4.65.
  • 5 − 2.3: write 5 as 5.0. Tenths: borrow → 10−3=7; ones: 4−2=2 → 2.7.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


def mono(s, size=52, color=WHITE, **kw):
    return Text(s, font="Monospace", font_size=size, color=color,
                weight="BOLD", **kw)


class Lesson6NS1(TeachingDeck):
    TITLE = "Adding & subtracting decimals"
    DOMAIN = "6.NS"
    HOOK = "You have $3.40 and earn $1.25 more. How much money now?"
    RECAP = [
        "Line up the decimal POINTS",
        "Fill empty places with zeros",
        "Bring the point straight down",
    ]

    def concept(self):
        pal = self.pal

        # 1 · The tempting-but-wrong line-up: ends aligned, points crooked.
        a = mono("3.4")
        b = mono("1.25")
        stack = VGroup(a, b).arrange(DOWN, buff=0.4, aligned_edge=RIGHT)
        stack.move_to(LEFT * 3.4 + UP * 1.2)
        self.reveal(FadeIn(a, shift=DOWN * 0.15), FadeIn(b, shift=UP * 0.15), rt=1.4)
        warn = Text("Ends lined up… but the POINTS don't match!",
                    font_size=26, color=RED, weight="BOLD")
        warn.move_to(RIGHT * 1.6 + UP * 1.2)
        self.reveal(FadeIn(warn, shift=UP * 0.15), rt=1.2)
        self.breathe(1.8)

        # 2 · Slide the top number until the decimal points stack up.
        dx = b[1].get_center()[0] - a[1].get_center()[0]
        self.reveal(a.animate.shift(RIGHT * dx), FadeOut(warn), rt=1.4)
        px = b[1].get_center()[0]
        guide = DashedLine([px, a.get_top()[1] + 0.3, 0],
                           [px, b.get_bottom()[1] - 1.6, 0],
                           color=YELLOW, stroke_width=4)
        note = Text("Point under point — always!", font_size=28,
                    color=YELLOW, weight="BOLD").move_to(RIGHT * 1.6 + UP * 1.2)
        self.reveal(Create(guide), FadeIn(note, shift=UP * 0.15), rt=1.4)
        self.breathe(1.8)

        # 3 · Fill the empty place with a zero: 3.4 → 3.40.
        a2 = mono("3.40", t2c={"0": GREEN})
        a2.shift(a[0].get_center() - a2[0].get_center())
        zero_note = Text("Empty spot? Add a zero: 3.4 = 3.40", font_size=26,
                         color=GREEN, weight="BOLD").next_to(note, DOWN, buff=0.35)
        self.reveal(Transform(a, a2), FadeIn(zero_note, shift=UP * 0.15), rt=1.4)
        self.breathe(1.8)

        # 4 · Now add column by column, right to left.
        plus = mono("+", color=pal["accent"]).next_to(b, LEFT, buff=0.35)
        bar = Line(LEFT * 0.3, RIGHT * 0.3, color=WHITE, stroke_width=4)
        bar.set_width(2.9)
        bar.next_to(b, DOWN, buff=0.28)
        bar.align_to(b, RIGHT).shift(RIGHT * 0.15)
        self.reveal(FadeIn(plus), Create(bar), rt=1.2)

        total = mono("4.65", color=pal["answer"])
        total.next_to(bar, DOWN, buff=0.28)
        total.shift(RIGHT * (px - total[1].get_center()[0]))
        col_notes = VGroup(
            Text("hundredths: 0 + 5 = 5", font_size=26, color=pal["step"], weight="BOLD"),
            Text("tenths:  4 + 2 = 6", font_size=26, color=pal["step"], weight="BOLD"),
            Text("ones:  3 + 1 = 4", font_size=26, color=pal["step"], weight="BOLD"),
        ).arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to(RIGHT * 1.9 + DOWN * 0.6)

        # digits: '4'(0) '.'(1) '6'(2) '5'(3) — reveal right to left.
        self.reveal(FadeIn(total[3], scale=1.4), FadeIn(col_notes[0], shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)
        self.reveal(FadeIn(total[2], scale=1.4), FadeIn(col_notes[1], shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)
        self.reveal(FadeIn(total[1], scale=1.4), FadeIn(total[0], scale=1.4),
                    FadeIn(col_notes[2], shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        drop = Text("The point drops straight down: 4.65", font_size=28,
                    color=pal["answer"], weight="BOLD")
        drop.move_to(RIGHT * 1.6 + DOWN * 2.3)
        self.reveal(FadeIn(drop, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(a, b, stack, guide, note, zero_note, plus, bar,
                      total, col_notes, drop)

    def example(self):
        pal = self.pal
        q = Text("5 − 2.3 = ?", font_size=36, color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.0 + LEFT * 0.7)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # Stack with the hidden .0 made visible.
        a = mono("5.0", size=48, t2c={".0": GREEN})
        b = mono("2.3", size=48)
        stack = VGroup(a, b).arrange(DOWN, buff=0.35, aligned_edge=RIGHT)
        stack.move_to(LEFT * 3.8 + UP * 0.3)
        minus = mono("−", size=48, color=pal["accent"]).next_to(b, LEFT, buff=0.35)
        bar = Line(ORIGIN, RIGHT, color=WHITE, stroke_width=4)
        bar.set_width(2.6)
        bar.next_to(b, DOWN, buff=0.26).align_to(b, RIGHT).shift(RIGHT * 0.15)
        self.reveal(FadeIn(stack, shift=DOWN * 0.15), FadeIn(minus), Create(bar), rt=1.5)
        self.breathe(1.8)

        steps = self.step_lines([
            ("Write 5 as 5.0 — same value!", GREEN),
            ("Tenths: borrow → 10 − 3 = 7", pal["step"]),
            ("Ones: 4 − 2 = 2", pal["step"]),
        ], anchor=RIGHT * 1.7 + UP * 0.8, size=28)

        res = mono("2.7", size=48, color=pal["answer"])
        res.next_to(bar, DOWN, buff=0.26)
        res.shift(RIGHT * (b[1].get_center()[0] - res[1].get_center()[0]))
        self.reveal(FadeIn(res, scale=1.2), rt=1.3)
        self.breathe(1.8)

        ans = answer_card(self, "5 − 2.3 = 2.7", pal["answer"], self.mascot,
                          pos=DOWN * 2.4 + LEFT * 0.7)
        self.breathe(2.0)
        return VGroup(q, stack, minus, bar, steps, res, ans)
