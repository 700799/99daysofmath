"""6.NS Unit 6 — Dividing fractions  (TeachingDeck)

Math (verified):
  • 1/2 ÷ 1/4 asks "how many quarters fit in a half?" Two quarters make a
    half → 1/2 ÷ 1/4 = 2.  Keep-change-flip: 1/2 × 4/1 = 4/2 = 2.
  • 3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2 (divide top and bottom by 2).
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


def frac_bar(total, filled, width=5.6, height=0.72, fill=BLUE, opacity=0.75):
    cells = VGroup()
    for i in range(total):
        r = Rectangle(width=width / total, height=height,
                      stroke_color=WHITE, stroke_width=3)
        if i < filled:
            r.set_fill(fill, opacity=opacity)
        cells.add(r)
    cells.arrange(RIGHT, buff=0)
    return cells


class Lesson6NS6(TeachingDeck):
    TITLE = "Dividing fractions"
    DOMAIN = "6.NS"
    HOOK = "How many quarter-slices of pizza fit inside HALF a pizza?"
    RECAP = [
        "Dividing asks: how many fit?",
        "Keep · Change · Flip",
        "Flip only the SECOND fraction",
    ]

    def concept(self):
        pal = self.pal

        # 1 · A bar showing one half.
        half = frac_bar(2, 1, fill=BLUE).move_to(UP * 1.8 + LEFT * 1.2)
        h_lbl = Text("1/2", font_size=28, color=BLUE, weight="BOLD")
        h_lbl.next_to(half, LEFT, buff=0.4)
        self.reveal(FadeIn(half, shift=DOWN * 0.15), FadeIn(h_lbl), rt=1.5)
        self.breathe(1.6)

        # 2 · The question division really asks.
        ask = Text(_wrap("1/2 ÷ 1/4 asks: how many 1/4 pieces fit in the half?", 44),
                   font_size=28, color=YELLOW, weight="BOLD").move_to(UP * 0.7 + LEFT * 0.7)
        self.reveal(FadeIn(ask, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        # 3 · Cut the same bar into quarters, right below.
        quarters = frac_bar(4, 0).move_to(DOWN * 0.4 + LEFT * 1.2)
        q_lbl = Text("1/4 s", font_size=28, color=ORANGE, weight="BOLD")
        q_lbl.next_to(quarters, LEFT, buff=0.4)
        guide = DashedLine(half.get_center() + DOWN * 0.36,
                           quarters.get_center() + UP * 0.36,
                           color=YELLOW, stroke_width=4)
        self.reveal(FadeIn(quarters, shift=UP * 0.15), FadeIn(q_lbl),
                    Create(guide), rt=1.5)
        self.breathe(1.6)

        # 4 · Fill quarter tiles under the half — count them: 1, 2.
        tile1 = quarters[0].copy().set_fill(ORANGE, opacity=0.85)
        tile2 = quarters[1].copy().set_fill(ORANGE, opacity=0.85)
        c1 = Text("1", font_size=26, color=WHITE, weight="BOLD").move_to(tile1)
        c2 = Text("2", font_size=26, color=WHITE, weight="BOLD").move_to(tile2)
        self.reveal(FadeIn(tile1), FadeIn(c1, scale=1.3), rt=1.3)
        self.breathe(1.6)
        self.reveal(FadeIn(tile2), FadeIn(c2, scale=1.3), rt=1.3)
        count = Text("2 quarters cover the half!", font_size=28,
                     color=GREEN, weight="BOLD").move_to(DOWN * 1.4 + LEFT * 0.7)
        self.reveal(FadeIn(count, shift=UP * 0.15), rt=1.2)
        self.breathe(1.8)

        # 5 · So the division and its shortcut agree.
        eq = Text("1/2 ÷ 1/4 = 2", font_size=36, color=pal["answer"], weight="BOLD")
        eq.move_to(DOWN * 2.1 + LEFT * 0.7)
        kcf = Text("shortcut: 1/2 × 4/1 = 4/2 = 2", font_size=26,
                   color=GOLD, weight="BOLD").move_to(DOWN * 2.7 + LEFT * 0.7)
        self.reveal(FadeIn(eq, scale=1.15), rt=1.3)
        self.breathe(1.6)
        self.reveal(FadeIn(kcf, shift=UP * 0.15), rt=1.2)
        self.breathe(2.0)

        return VGroup(half, h_lbl, ask, quarters, q_lbl, guide,
                      tile1, tile2, c1, c2, count, eq, kcf)

    def example(self):
        pal = self.pal
        q = Text("3/4 ÷ 1/2 = ?", font_size=34, color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.2 + LEFT * 0.8)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # Keep · Change · Flip, labeled piece by piece.
        first = Text("3/4", font_size=44, color=GREEN, weight="BOLD")
        op = Text("×", font_size=44, color=YELLOW, weight="BOLD")
        second = Text("2/1", font_size=44, color=ORANGE, weight="BOLD")
        expr = VGroup(first, op, second).arrange(RIGHT, buff=0.5)
        expr.move_to(UP * 1.05 + LEFT * 0.8)
        k_lbl = Text("KEEP", font_size=24, color=GREEN, weight="BOLD")
        k_lbl.next_to(first, DOWN, buff=0.25)
        c_lbl = Text("CHANGE", font_size=24, color=YELLOW, weight="BOLD")
        c_lbl.next_to(op, DOWN, buff=0.25)
        f_lbl = Text("FLIP", font_size=24, color=ORANGE, weight="BOLD")
        f_lbl.next_to(second, DOWN, buff=0.25)

        self.reveal(FadeIn(first, scale=1.15), FadeIn(k_lbl, shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)
        self.reveal(FadeIn(op, scale=1.15), FadeIn(c_lbl, shift=UP * 0.15), rt=1.25)
        self.breathe(1.6)
        flip_note = Text("1/2 flips to 2/1", font_size=26, color=ORANGE,
                         weight="BOLD").next_to(f_lbl, RIGHT, buff=0.6)
        self.reveal(FadeIn(second, scale=1.15), FadeIn(f_lbl, shift=UP * 0.15),
                    FadeIn(flip_note), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("Multiply across: 3×2 = 6, 4×1 = 4", pal["step"]),
            ("3/4 × 2/1 = 6/4", pal["step"]),
            ("Simplify: 6÷2 = 3, 4÷2 = 2 → 3/2", pal["step"]),
        ], anchor=DOWN * 0.7 + LEFT * 0.8, size=28)

        ans = answer_card(self, "3/4 ÷ 1/2 = 3/2", pal["answer"], self.mascot,
                          pos=DOWN * 2.5 + LEFT * 0.8)
        self.breathe(2.0)
        return VGroup(q, expr, k_lbl, c_lbl, f_lbl, flip_note, steps, ans)
