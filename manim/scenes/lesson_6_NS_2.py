"""6.NS Unit 2 — Multiplying & dividing decimals  (TeachingDeck)

Math (verified):
  • 0.6 × 0.4 on a hundredths grid: 6 columns × 4 rows overlap = 24 little
    squares = 24 hundredths = 0.24.  Rule check: 6 × 4 = 24, two decimal
    places total → 0.24. ✓
  • 4.8 ÷ 0.6: move BOTH points one place right → 48 ÷ 6 = 8.
    Check: 8 × 0.6 = 4.8. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6NS2(TeachingDeck):
    TITLE = "Multiplying & dividing decimals"
    DOMAIN = "6.NS"
    HOOK = "0.6 × 0.4 — is the answer bigger or smaller than 0.6?"
    RECAP = [
        "Multiply, then count decimal places",
        "0.6 × 0.4 → 24 → 0.24",
        "To divide, slide BOTH points right",
    ]

    def concept(self):
        pal = self.pal
        side = 3.6
        cell = side / 10
        # Hundredths grid: the square is 1 whole, each little square 0.01.
        grid = VGroup()
        for i in range(11):
            x = -side / 2 + i * cell
            grid.add(Line([x, -side / 2, 0], [x, side / 2, 0],
                          stroke_width=1.5, color=GREY_B))
            grid.add(Line([-side / 2, x, 0], [side / 2, x, 0],
                          stroke_width=1.5, color=GREY_B))
        frame = Square(side_length=side, color=WHITE, stroke_width=4)
        square = VGroup(grid, frame).move_to(LEFT * 3.6 + DOWN * 0.15)
        lbl = Text("1 whole = 100 little squares", font_size=24,
                   color=pal["step"], weight="BOLD").next_to(square, DOWN, buff=0.3)
        self.reveal(Create(frame), FadeIn(grid), FadeIn(lbl), rt=1.6)
        self.breathe(1.8)

        corner = square.get_corner(DOWN + LEFT)
        # Shade 0.6 of the columns.
        band6 = Rectangle(width=6 * cell, height=side, fill_color=BLUE,
                          fill_opacity=0.45, stroke_width=0)
        band6.move_to(corner + RIGHT * 3 * cell + UP * side / 2)
        t6 = Text("0.6", font_size=28, color=BLUE, weight="BOLD")
        t6.next_to(band6, UP, buff=0.18)
        n6 = Text("6 columns wide = 0.6", font_size=26, color=BLUE, weight="BOLD")
        n6.move_to(RIGHT * 2.2 + UP * 1.7)
        self.reveal(FadeIn(band6), FadeIn(t6), FadeIn(n6, shift=UP * 0.15), rt=1.5)
        self.breathe(1.8)

        # Shade 0.4 of the rows.
        band4 = Rectangle(width=side, height=4 * cell, fill_color=YELLOW,
                          fill_opacity=0.45, stroke_width=0)
        band4.move_to(corner + UP * 2 * cell + RIGHT * side / 2)
        t4 = Text("0.4", font_size=28, color=YELLOW, weight="BOLD")
        t4.next_to(band4, LEFT, buff=0.18)
        n4 = Text("4 rows tall = 0.4", font_size=26, color=YELLOW, weight="BOLD")
        n4.next_to(n6, DOWN, buff=0.32, aligned_edge=LEFT)
        self.reveal(FadeIn(band4), FadeIn(t4), FadeIn(n4, shift=UP * 0.15), rt=1.5)
        self.breathe(1.8)

        # The overlap IS the product.
        overlap = Rectangle(width=6 * cell, height=4 * cell, fill_color=GREEN,
                            fill_opacity=0.7, stroke_color=GREEN, stroke_width=4)
        overlap.move_to(corner + RIGHT * 3 * cell + UP * 2 * cell)
        n_ov = Text("Overlap: 6 × 4 = 24 squares", font_size=26,
                    color=GREEN, weight="BOLD").next_to(n4, DOWN, buff=0.32, aligned_edge=LEFT)
        self.reveal(FadeIn(overlap), FadeIn(n_ov, shift=UP * 0.15), rt=1.5)
        self.breathe(1.8)

        n_val = Text("24 hundredths = 0.24", font_size=30, color=GREEN, weight="BOLD")
        n_val.next_to(n_ov, DOWN, buff=0.35, aligned_edge=LEFT)
        self.reveal(FadeIn(n_val, scale=1.15), rt=1.3)
        self.breathe(1.8)

        rule = Text("Shortcut: 6 × 4 = 24, then count\n2 decimal places → 0.24",
                    font_size=26, color=pal["accent"], weight="BOLD",
                    line_spacing=0.9)
        rule.next_to(n_val, DOWN, buff=0.4, aligned_edge=LEFT)
        self.reveal(FadeIn(rule, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(square, lbl, band6, t6, n6, band4, t4, n4,
                      overlap, n_ov, n_val, rule)

    def example(self):
        pal = self.pal
        q = Text("4.8 ÷ 0.6 = ?", font_size=36, color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.0 + LEFT * 0.7)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # The point-slide, drawn: 4.8 ÷ 0.6 becomes 48 ÷ 6.
        before = Text("4.8 ÷ 0.6", font="Monospace", font_size=46,
                      color=pal["step"], weight="BOLD").move_to(LEFT * 3.4 + UP * 0.5)
        self.reveal(FadeIn(before, shift=DOWN * 0.15), rt=1.3)

        # chars: 4(0) .(1) 8(2) ÷(3) 0(4) .(5) 6(6)
        arr1 = CurvedArrow(before[1].get_top() + UP * 0.08,
                           before[1].get_top() + UP * 0.08 + RIGHT * 0.55,
                           angle=-PI / 2, color=YELLOW, stroke_width=4, tip_length=0.16)
        arr2 = CurvedArrow(before[5].get_top() + UP * 0.08,
                           before[5].get_top() + UP * 0.08 + RIGHT * 0.55,
                           angle=-PI / 2, color=YELLOW, stroke_width=4, tip_length=0.16)
        slide = Text("slide BOTH points 1 place →", font_size=26,
                     color=YELLOW, weight="BOLD").next_to(before, UP, buff=0.6)
        self.reveal(Create(arr1), Create(arr2), FadeIn(slide, shift=DOWN * 0.15), rt=1.5)
        self.breathe(1.8)

        after = Text("48 ÷ 6", font="Monospace", font_size=46,
                     color=pal["accent"], weight="BOLD")
        after.next_to(before, DOWN, buff=0.75)
        eq = Text("same answer, easier problem!", font_size=24,
                  color=pal["accent"], weight="BOLD").next_to(after, DOWN, buff=0.3)
        self.reveal(TransformFromCopy(before, after), FadeIn(eq), rt=1.6)
        self.breathe(1.8)

        steps = self.step_lines([
            ("0.6 → 6   and   4.8 → 48", pal["step"]),
            ("48 ÷ 6 = 8", pal["step"]),
            ("Check: 8 × 0.6 = 4.8 ✓", GREEN),
        ], anchor=RIGHT * 2.0 + UP * 0.5, size=28)

        ans = answer_card(self, "4.8 ÷ 0.6 = 8", pal["answer"], self.mascot,
                          pos=DOWN * 2.4 + LEFT * 0.7)
        self.breathe(2.0)
        return VGroup(q, before, arr1, arr2, slide, after, eq, steps, ans)
