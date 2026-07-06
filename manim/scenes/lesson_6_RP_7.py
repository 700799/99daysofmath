"""6.RP Unit 7 — Percent applications  (TeachingDeck)

Math (verified):
  • 25% = 25/100 = 1/4 = 0.25 — a 10×10 grid with 25 of 100 squares shaded.
  • Percent → decimal: move the dot LEFT two places (25% → 0.25).
  • 25% of 80 = 0.25 × 80 = 20.
  • Example: $40 shirt, 30% off. 30% = 0.30; 0.30 × 40 = 12 → $12 off.
    Sale price = 40 − 12 = $28. (Check: 70% of 40 = 0.7 × 40 = 28. ✓)
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


def percent_grid(side=0.26, buff=0.045):
    """A 10×10 grid of 100 faint squares — the 'whole'."""
    cells = VGroup(*[
        Square(side_length=side, stroke_color=BLUE, stroke_width=1.6,
               fill_color=BLUE, fill_opacity=0.08)
        for _ in range(100)
    ]).arrange_in_grid(rows=10, cols=10, buff=buff)
    return cells


class Lesson6RP7(TeachingDeck):
    TITLE = "Percent applications"
    DOMAIN = "6.RP"
    HOOK = "A $40 shirt is 30% off. Guess the sale price!"
    RECAP = [
        "Percent means 'out of 100'",
        "X% of Y: move the dot LEFT two, multiply",
        "'% off' subtracts — tip and tax ADD",
    ]

    def concept(self):
        pal = self.pal
        # LEFT: a 10×10 percent grid — the whole is 100 little squares.
        grid = percent_grid()
        grid.move_to(LEFT * 3.9 + UP * 0.35)
        whole = Text("100 squares = the whole", font_size=24,
                     color=pal["accent"], weight="BOLD")
        whole.next_to(grid, DOWN, buff=0.3)
        self.reveal(FadeIn(grid, lag_ratio=0.01), FadeIn(whole), rt=1.8)
        self.breathe(1.6)

        # Shade 25 of them — that IS 25%.
        shade = VGroup()
        for i in range(25):
            s = Square(side_length=0.26, stroke_width=0,
                       fill_color=YELLOW, fill_opacity=0.9)
            s.move_to(grid[(i // 10) * 10 + (i % 10)])
            shade.add(s)
        self.reveal(LaggedStart(*[GrowFromCenter(s) for s in shade],
                                lag_ratio=0.06), rt=2.2)
        tag = Text("25 shaded", font_size=26, color=YELLOW, weight="BOLD")
        tag.next_to(grid, UP, buff=0.25)
        self.reveal(FadeIn(tag, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # RIGHT: what that means in numbers.
        eq = Text("25% = 25/100 = 1/4", font_size=32, color=pal["step"],
                  weight="BOLD")
        eq.move_to(RIGHT * 2.0 + UP * 1.5)
        self.reveal(FadeIn(eq, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        # The dot move: 25% → 0.25.
        dot_rule = Text("percent → decimal:\nmove the dot LEFT two places",
                        font_size=25, color=pal["accent"], weight="BOLD")
        dot_rule.move_to(RIGHT * 2.0 + UP * 0.4)
        move = Text("25% → 0.25", font_size=34, color=GREEN, weight="BOLD")
        move.next_to(dot_rule, DOWN, buff=0.3)
        self.reveal(FadeIn(dot_rule, shift=UP * 0.15), rt=1.3)
        self.reveal(FadeIn(move, scale=1.15), rt=1.3)
        self.breathe(1.8)

        # Then multiply: 25% of 80.
        use = Text("25% of 80 = 0.25 × 80 = 20", font_size=30,
                   color=pal["step"], weight="BOLD")
        use.move_to(RIGHT * 2.0 + DOWN * 1.3)
        box = SurroundingRectangle(use, color=GREEN, buff=0.18,
                                   corner_radius=0.12)
        self.reveal(FadeIn(use, shift=UP * 0.15), Create(box), rt=1.5)
        self.breathe(1.8)

        # Discount vs tip/tax — which way does the money go?
        offadd = Text("'% off' → subtract      tip / tax → add",
                      font_size=26, color=YELLOW, weight="BOLD")
        offadd.move_to(DOWN * 2.5 + LEFT * 0.7)
        self.reveal(FadeIn(offadd, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(grid, whole, shade, tag, eq, dot_rule, move, use, box,
                      offadd)

    def example(self):
        pal = self.pal
        q = Text("A $40 shirt is 30% off. Sale price?", font_size=30,
                 color=pal["step"], weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # The $40 bar: 30% peels away in red, 70% stays in green.
        bar_w = 7.0
        keep = Rectangle(width=bar_w * 0.7, height=0.75, stroke_color=WHITE,
                         stroke_width=3, fill_color=GREEN, fill_opacity=0.6)
        off = Rectangle(width=bar_w * 0.3, height=0.75, stroke_color=WHITE,
                        stroke_width=3, fill_color=RED, fill_opacity=0.6)
        bar = VGroup(keep, off).arrange(RIGHT, buff=0)
        bar.move_to(UP * 0.75 + LEFT * 1.2)
        forty = Text("$40", font_size=28, color=pal["step"], weight="BOLD")
        forty.next_to(bar, UP, buff=0.22)
        off_lbl = Text("30% off", font_size=24, color=RED, weight="BOLD")
        off_lbl.next_to(off, DOWN, buff=0.22)
        keep_lbl = Text("you pay 70%", font_size=24, color=GREEN, weight="BOLD")
        keep_lbl.next_to(keep, DOWN, buff=0.22)
        self.reveal(FadeIn(bar), FadeIn(forty), rt=1.4)
        self.reveal(FadeIn(off_lbl, shift=UP * 0.15),
                    FadeIn(keep_lbl, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        steps = self.step_lines([
            ("30% = 0.30", pal["step"]),
            ("0.30 × $40 = $12 off", RED),
            ("$40 − $12 = $28", GREEN),
        ], anchor=DOWN * 1.0 + LEFT * 3.2, size=28)
        self.breathe(1.6)

        ans = answer_card(self, "Sale price: $28", pal["answer"], self.mascot,
                          pos=DOWN * 1.9 + RIGHT * 2.3)
        self.breathe(2.0)
        return VGroup(q, bar, forty, off_lbl, keep_lbl, steps, ans)
