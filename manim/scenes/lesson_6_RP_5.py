"""6.RP Unit 5 — Percents  (TeachingDeck)

Math (verified):
  • 25% = 25/100 = 0.25 = one quarter. 5×5 block = 25 of the 100 grid squares.
  • 50% = half, 100% = the whole thing.
  • 20% of 45: 20% = 0.20; 0.20 × 45 = 9. Bar check: 45 ÷ 5 = 9, and 20% is
    one fifth, so one chunk = 9. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6RP5(TeachingDeck):
    TITLE = "Percents"
    DOMAIN = "6.RP"
    HOOK = "Your quiz says 25%. Is that most of it... or just a little?"
    RECAP = [
        "Percent = out of 100:  25% = 25/100 = 0.25",
        "X% of a number → decimal × number",
        "50% = half   •   25% = quarter",
    ]

    def concept(self):
        pal = self.pal
        # A 10×10 grid: one hundred little squares.
        cell = 0.3
        squares = VGroup(*[
            Square(side_length=cell, color=GREY_B, stroke_width=1.5)
            .move_to(np.array([c * cell, -r * cell, 0]))
            for r in range(10) for c in range(10)
        ])
        squares.move_to(LEFT * 3.5 + DOWN * 0.15)
        g_lbl = Text("100 squares", font_size=26, color=pal["accent"], weight="BOLD")
        g_lbl.next_to(squares, UP, buff=0.28)
        self.reveal(FadeIn(squares, lag_ratio=0.01), FadeIn(g_lbl), rt=2.0)
        self.breathe(1.6)

        # Shade a 5×5 block = 25 squares.
        shaded = VGroup(*[
            squares[r * 10 + c].copy().set_fill(YELLOW, opacity=0.9).set_stroke(GOLD, width=1.5)
            for r in range(5) for c in range(5)
        ])
        self.reveal(LaggedStart(*[FadeIn(s) for s in shaded], lag_ratio=0.04), rt=2.2)
        s_lbl = Text("25 shaded", font_size=26, color=YELLOW, weight="BOLD")
        s_lbl.next_to(squares, DOWN, buff=0.28)
        self.reveal(FadeIn(s_lbl), rt=1.2)
        self.breathe(1.8)

        # Name it: percent = per hundred.
        line1 = Text("25 out of 100", font_size=30, color=pal["step"], weight="BOLD")
        line2 = Text("= 25%  = 0.25  = ¼", font_size=32, color=YELLOW, weight="BOLD")
        line3 = Text("percent means “per hundred”", font_size=26, color=pal["accent"])
        col = VGroup(line1, line2, line3).arrange(DOWN, buff=0.4)
        col.move_to(RIGHT * 1.7 + UP * 0.7)
        self.reveal(FadeIn(line1, shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)
        self.reveal(FadeIn(line2, shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)
        self.reveal(FadeIn(line3, shift=UP * 0.15), rt=1.2)
        self.breathe(1.6)

        # Friendly landmarks.
        marks = Text("50% = half     100% = ALL of it", font_size=28,
                     color=GREEN, weight="BOLD")
        marks.move_to(RIGHT * 1.7 + DOWN * 1.1)
        mbox = SurroundingRectangle(marks, color=GREEN, buff=0.18, corner_radius=0.12)
        self.reveal(FadeIn(marks), Create(mbox), rt=1.5)
        self.breathe(2.0)

        return VGroup(squares, g_lbl, shaded, s_lbl, col, marks, mbox)

    def example(self):
        pal = self.pal
        q = Text("What is 20% of 45?", font_size=32, color=pal["step"], weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # A bar of 45 cut into five 20% chunks — each chunk is 45 ÷ 5 = 9.
        segs = VGroup(*[
            Rectangle(width=1.5, height=0.7, stroke_color=WHITE, stroke_width=3,
                      fill_color=BLUE, fill_opacity=0.3)
            for _ in range(5)
        ]).arrange(RIGHT, buff=0).move_to(UP * 0.7 + LEFT * 0.9)
        t_lbl = Text("45", font_size=28, color=BLUE, weight="BOLD")
        t_lbl.next_to(segs, UP, buff=0.25)
        self.reveal(LaggedStart(*[Create(s) for s in segs], lag_ratio=0.2),
                    FadeIn(t_lbl), rt=1.8)
        pct = VGroup(*[
            Text("20%", font_size=24, color=pal["accent"], weight="BOLD").move_to(s)
            for s in segs
        ])
        self.reveal(LaggedStart(*[FadeIn(p) for p in pct], lag_ratio=0.15), rt=1.5)
        self.breathe(1.8)

        # Highlight ONE chunk: that's the 20% we want.
        hi = segs[0].copy().set_fill(YELLOW, opacity=0.75).set_stroke(GOLD, width=4)
        nine = Text("= ?", font_size=26, color=YELLOW, weight="BOLD")
        nine.next_to(segs[0], DOWN, buff=0.22)
        self.reveal(FadeIn(hi), FadeIn(nine, shift=UP * 0.1), rt=1.4)
        self.breathe(1.6)

        steps = self.step_lines([
            ("20% = 20/100 = 0.20", pal["accent"]),
            ("0.20 × 45 = 9", WHITE),
        ], anchor=DOWN * 0.85, size=30)
        self.breathe(1.6)

        ans = answer_card(self, "20% of 45 = 9", pal["answer"], self.mascot,
                          pos=DOWN * 2.8)
        self.breathe(2.0)
        return VGroup(q, segs, t_lbl, pct, hi, nine, steps, ans)
