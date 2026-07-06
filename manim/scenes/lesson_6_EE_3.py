"""6.EE Unit 3 — Equivalent expressions  (TeachingDeck)

Math (verified):
  • Distributive property: 3(x + 2) = 3·x + 3·2 = 3x + 6 — an area model with
    3 rows of (one x-tile + two 1-tiles) really holds 3 x-tiles and 6 ones.
  • Like terms: 4x + 5x = (4 + 5)x = 9x.
  • Example: 2x + 3 + x = (2x + x) + 3 = 3x + 3.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


def x_tile(w=1.0, h=0.5):
    r = Rectangle(width=w, height=h, stroke_color=BLUE, stroke_width=3,
                  fill_color=BLUE, fill_opacity=0.35)
    t = Text("x", font_size=24, weight="BOLD", color=WHITE).move_to(r)
    return VGroup(r, t)


def one_tile(s=0.5):
    r = Square(side_length=s, stroke_color=YELLOW, stroke_width=3,
               fill_color=YELLOW, fill_opacity=0.35)
    t = Text("1", font_size=24, weight="BOLD", color=WHITE).move_to(r)
    return VGroup(r, t)


class Lesson6EE3(TeachingDeck):
    TITLE = "Equivalent expressions"
    DOMAIN = "6.EE"
    HOOK = "Do 3(x + 2) and 3x + 6 mean the SAME thing?"
    RECAP = [
        "a(b + c) = ab + ac — hit EVERY term",
        "Like terms snap together: 4x + 5x = 9x",
        "Equivalent = same value for every x",
    ]

    def concept(self):
        pal = self.pal
        # 3(x + 2) means 3 rows of (x + 2) — build them tile by tile.
        head = Text("3(x + 2)  =  3 rows of (x + 2)", font_size=30,
                    color=pal["step"], weight="BOLD")
        head.move_to(UP * 2.1 + LEFT * 1.0)
        self.reveal(FadeIn(head, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.6)

        rows = VGroup(*[
            VGroup(x_tile(), one_tile(), one_tile()).arrange(RIGHT, buff=0.12)
            for _ in range(3)
        ]).arrange(DOWN, buff=0.18)
        rows.move_to(LEFT * 3.4 + UP * 0.4)
        self.reveal(LaggedStart(*[FadeIn(r, shift=RIGHT * 0.3) for r in rows],
                                lag_ratio=0.35), rt=2.2)
        self.breathe(1.8)

        # Count what we actually have: 3 x-tiles and 6 ones.
        brace_x = Brace(VGroup(*[r[0] for r in rows]), DOWN, color=BLUE)
        cx = Text("3 x-tiles = 3x", font_size=26, color=BLUE, weight="BOLD")
        cx.next_to(brace_x, DOWN, buff=0.15).shift(LEFT * 0.4)
        brace_1 = Brace(VGroup(rows[2][1], rows[2][2]), DOWN, color=YELLOW)
        c1 = Text("6 ones = 6", font_size=26, color=YELLOW, weight="BOLD")
        c1.next_to(brace_1, DOWN, buff=0.15).shift(RIGHT * 0.5)
        self.reveal(GrowFromCenter(brace_x), FadeIn(cx), rt=1.3)
        self.reveal(GrowFromCenter(brace_1), FadeIn(c1), rt=1.3)
        self.breathe(1.8)

        same = Text("3(x + 2) = 3x + 6", font_size=36, color=GREEN, weight="BOLD")
        same.move_to(RIGHT * 1.8 + UP * 0.5)
        tag = Text("equivalent twins!", font_size=24, color=GREEN, weight="BOLD")
        tag.next_to(same, DOWN, buff=0.22)
        self.reveal(FadeIn(same, scale=1.15), FadeIn(tag, shift=UP * 0.15), rt=1.4)
        self.breathe(2.0)

        # Second move: like terms snap together.
        snap = Text("Like terms snap together:", font_size=26,
                    color=pal["accent"], weight="BOLD")
        snap.move_to(DOWN * 1.7 + LEFT * 2.6)
        eq = Text("4x + 5x = 9x", font_size=34, color=pal["step"], weight="BOLD")
        eq.next_to(snap, RIGHT, buff=0.5)
        self.reveal(FadeIn(snap, shift=UP * 0.15), rt=1.2)
        self.reveal(FadeIn(eq, shift=UP * 0.15), rt=1.3)
        why = Text("4 x-tiles + 5 x-tiles → 9 x-tiles", font_size=24,
                   color=BLUE, weight="BOLD")
        why.next_to(VGroup(snap, eq), DOWN, buff=0.3)
        self.reveal(FadeIn(why, shift=UP * 0.15), rt=1.2)
        self.breathe(2.2)

        return VGroup(head, rows, brace_x, cx, brace_1, c1, same, tag,
                      snap, eq, why)

    def example(self):
        pal = self.pal
        q = Text("Simplify 2x + 3 + x", font_size=32, color=pal["accent"],
                 weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # Highlight the like terms before combining them.
        expr = Text("2x + 3 + x", font_size=48, weight="BOLD", color=pal["step"])
        expr.move_to(UP * 0.9 + LEFT * 1.0)
        self.reveal(FadeIn(expr, shift=UP * 0.15), rt=1.3)

        # Text "2x + 3 + x": chars 2,x,+,3,+,x → indices 0..5
        ring1 = SurroundingRectangle(expr[0:2], color=BLUE, buff=0.12,
                                     corner_radius=0.1)
        ring2 = SurroundingRectangle(expr[5], color=BLUE, buff=0.12,
                                     corner_radius=0.1)
        find = Text("find the x-terms", font_size=24, color=BLUE, weight="BOLD")
        find.next_to(expr, RIGHT, buff=0.6)
        self.reveal(Create(ring1), Create(ring2), FadeIn(find), rt=1.4)
        self.breathe(1.8)

        steps = self.step_lines([
            ("x-terms:  2x + x = 3x", BLUE),
            ("the 3 has no partner — it stays", YELLOW),
            "2x + 3 + x  =  3x + 3",
        ], anchor=DOWN * 0.55 + LEFT * 1.0, size=29)
        self.breathe(1.6)

        ans = answer_card(self, "= 3x + 3", pal["answer"], self.mascot,
                          pos=DOWN * 2.6 + LEFT * 1.0)
        self.breathe(1.8)
        return VGroup(q, expr, ring1, ring2, find, steps, ans)
