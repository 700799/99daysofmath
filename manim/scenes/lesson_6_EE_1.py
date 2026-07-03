"""6.EE Unit 1 — Exponents  (TeachingDeck)

Math (verified):
  • 3² = 3 × 3 = 9 — a 3×3 grid really contains 9 small squares.
  • 3 × 2 = 6 ≠ 9 — multiplying base × exponent is the classic trap.
  • 3³ = 3 × 3 × 3 = 9 × 3 = 27.
  • 2³ = 2 × 2 × 2 = 8, not 2 × 3 = 6.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6EE1(TeachingDeck):
    TITLE = "Exponents"
    DOMAIN = "6.EE"
    HOOK = "Quick guess: is 2³ equal to 6 ... or 8?"
    RECAP = [
        "The exponent counts COPIES to multiply",
        "2³ = 2 × 2 × 2 = 8",
        "Never base × exponent — 2³ is not 6!",
    ]

    def concept(self):
        pal = self.pal
        # The notation: big base, small raised exponent, both labeled.
        base = Text("3", font_size=76, weight="BOLD", color=pal["step"])
        expo = Text("2", font_size=42, weight="BOLD", color=YELLOW)
        base.move_to(LEFT * 4.3 + UP * 1.6)
        expo.next_to(base, RIGHT, buff=0.08).shift(UP * 0.5)
        self.reveal(FadeIn(base, scale=1.2), FadeIn(expo, scale=1.2), rt=1.4)

        b_lbl = Text("base", font_size=26, color=BLUE, weight="BOLD")
        b_lbl.next_to(base, DOWN, buff=0.3)
        e_lbl = Text("exponent", font_size=26, color=YELLOW, weight="BOLD")
        e_lbl.next_to(expo, UP, buff=0.25)
        self.reveal(FadeIn(b_lbl, shift=UP * 0.15), FadeIn(e_lbl, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        meaning = Text("2 copies of 3:\n3 × 3", font_size=30, color=pal["step"],
                       weight="BOLD", line_spacing=1.1)
        meaning.next_to(b_lbl, DOWN, buff=0.5)
        self.reveal(FadeIn(meaning, shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)

        # "Squared" literally draws a square: a 3×3 grid of 9 tiles.
        tiles = VGroup(*[
            Square(side_length=0.46, stroke_color=BLUE, stroke_width=3,
                   fill_color=BLUE, fill_opacity=0.35)
            for _ in range(9)
        ]).arrange_in_grid(rows=3, cols=3, buff=0.1)
        tiles.move_to(RIGHT * 1.3 + UP * 1.1)
        g_lbl = Text("3 rows of 3", font_size=24, color=BLUE, weight="BOLD")
        g_lbl.next_to(tiles, UP, buff=0.25)
        self.reveal(LaggedStart(*[GrowFromCenter(t) for t in tiles], lag_ratio=0.12),
                    FadeIn(g_lbl), rt=2.0)
        count = Text("= 9 squares!", font_size=28, color=GREEN, weight="BOLD")
        count.next_to(tiles, RIGHT, buff=0.45)
        self.reveal(FadeIn(count, scale=1.2), rt=1.2)
        self.breathe(1.8)

        eq = Text("3² = 3 × 3 = 9", font_size=36, color=GREEN, weight="BOLD")
        eq.move_to(DOWN * 1.0 + LEFT * 0.7)
        self.reveal(FadeIn(eq, shift=UP * 0.2), rt=1.3)
        self.breathe(1.6)

        # The trap, struck through on the spot.
        wrong = Text("3 × 2 = 6", font_size=30, color=RED, weight="BOLD")
        wrong.move_to(DOWN * 2.1 + LEFT * 3.2)
        strike = Line(wrong.get_left() + LEFT * 0.1, wrong.get_right() + RIGHT * 0.1,
                      stroke_width=5, color=RED)
        warn = Text("Don't multiply base × exponent!", font_size=24,
                    color=YELLOW, weight="BOLD")
        warn.move_to(DOWN * 2.1 + RIGHT * 1.7)
        self.reveal(FadeIn(wrong), rt=1.2)
        self.reveal(Create(strike), FadeIn(warn, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(base, expo, b_lbl, e_lbl, meaning, tiles, g_lbl, count,
                      eq, wrong, strike, warn)

    def example(self):
        pal = self.pal
        q = Text("Evaluate 3³", font_size=34, color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # Unpack the power into its three copies, counted by a brace.
        copies = Text("3 × 3 × 3", font_size=44, color=pal["step"], weight="BOLD")
        copies.move_to(UP * 0.9 + LEFT * 0.7)
        brace = Brace(copies, DOWN, color=YELLOW)
        b_lbl = Text("3 copies of the base", font_size=24, color=YELLOW, weight="BOLD")
        b_lbl.next_to(brace, DOWN, buff=0.15)
        self.reveal(FadeIn(copies, shift=UP * 0.15), rt=1.3)
        self.reveal(GrowFromCenter(brace), FadeIn(b_lbl), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            "3 × 3 = 9",
            "9 × 3 = 27",
        ], anchor=DOWN * 0.9 + LEFT * 0.7, size=30)
        self.breathe(1.6)

        ans = answer_card(self, "3³ = 27", pal["answer"], self.mascot,
                          pos=DOWN * 2.6 + LEFT * 0.7)
        self.breathe(1.8)
        return VGroup(q, copies, brace, b_lbl, steps, ans)
