"""6.G Unit 1 — Area of triangles & rectangles  (TeachingDeck)

Math (verified):
  • Rectangle 7 × 3: unit-square grid → 3 rows of 7 = 21 squares. A = 7 × 3 = 21.
  • Triangle = half its bounding rectangle → A = ½ × base × height.
  • Example: triangle base 8, height 5 → ½ × 8 × 5 = ½ × 40 = 20 square units.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card
import _geo as G


class Lesson6G1(TeachingDeck):
    TITLE = "Area of triangles & rectangles"
    DOMAIN = "6.G"
    HOOK = "A 7-by-3 chocolate bar — how many little squares can you snap off?"
    RECAP = [
        "Rectangle:  A = length × width",
        "Triangle:  A = ½ × base × height",
        "Don't forget the ½ for triangles!",
    ]

    def concept(self):
        pal = self.pal
        u = 0.42

        # ── Part 1: rectangle area = rows of unit squares ──
        outline = G.rect_outline(7, 3, u=u, color=BLUE)
        grid = G.unit_grid(7, 3, u=u, color=BLUE)
        rect = VGroup(outline, grid).shift(LEFT * 6.0 + UP * 0.7)
        w_lbl = Text("7", font_size=28, color=YELLOW, weight="BOLD").next_to(outline, DOWN, buff=0.18)
        h_lbl = Text("3", font_size=28, color=YELLOW, weight="BOLD").next_to(outline, LEFT, buff=0.18)

        self.reveal(Create(outline), FadeIn(w_lbl), FadeIn(h_lbl), rt=1.4)
        self.breathe(1.6)

        # fill row by row: 3 rows of 7
        for r in range(3):
            row = grid[r * 7:(r + 1) * 7]
            self.reveal(LaggedStart(*[GrowFromCenter(s) for s in row],
                                    lag_ratio=0.12), rt=1.3)
        rows_note = Text("3 rows of 7 squares", font_size=28, color=pal["step"],
                         weight="BOLD").move_to(RIGHT * 1.6 + UP * 2.0)
        self.reveal(FadeIn(rows_note, shift=UP * 0.15), rt=1.2)
        self.breathe(1.6)

        area_r = Text("A = 7 × 3 = 21", font_size=32, color=BLUE, weight="BOLD")
        area_r.next_to(rows_note, DOWN, buff=0.3)
        self.reveal(FadeIn(area_r, scale=1.15), rt=1.2)
        self.breathe(1.8)

        # ── Part 2: a triangle is HALF a rectangle ──
        out2 = G.rect_outline(6, 3, u=u, color=WHITE, stroke_width=3)
        out2.shift(LEFT * 5.8 + DOWN * 2.4)
        v = out2.get_vertices()
        tri = Polygon(v[0], v[1], v[2],
                      stroke_color=YELLOW, stroke_width=4,
                      fill_color=YELLOW, fill_opacity=0.45)
        diag = Line(v[0], v[2], stroke_color=YELLOW, stroke_width=4)
        b_lbl = Text("base", font_size=24, color=ORANGE, weight="BOLD").next_to(out2, DOWN, buff=0.15)
        h_lbl2 = Text("height", font_size=24, color=ORANGE, weight="BOLD").next_to(out2, RIGHT, buff=0.15)

        self.reveal(Create(out2), FadeIn(b_lbl), FadeIn(h_lbl2), rt=1.3)
        self.reveal(Create(diag), rt=1.3)
        self.reveal(FadeIn(tri), rt=1.3)
        half_note = Text("A triangle is HALF\na rectangle", font_size=28,
                         color=pal["step"], weight="BOLD",
                         line_spacing=0.9).move_to(RIGHT * 1.6 + DOWN * 1.2)
        self.reveal(FadeIn(half_note, shift=UP * 0.15), rt=1.2)
        self.breathe(1.6)

        area_t = Text("A = ½ × b × h", font_size=32, color=YELLOW, weight="BOLD")
        area_t.next_to(half_note, DOWN, buff=0.3)
        self.reveal(FadeIn(area_t, scale=1.15), rt=1.2)
        self.breathe(2.0)

        return VGroup(rect, w_lbl, h_lbl, rows_note, area_r,
                      out2, diag, tri, b_lbl, h_lbl2, half_note, area_t)

    def example(self):
        pal = self.pal
        q = Text("Triangle: base 8, height 5. Area?", font_size=30,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.1)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # triangle: base 8u, height 5u; apex above x = 5u
        u = 0.42
        A = LEFT * 6.2 + DOWN * 1.6
        tri = Polygon(A, A + RIGHT * 8 * u, A + RIGHT * 5 * u + UP * 5 * u,
                      stroke_color=BLUE, stroke_width=4,
                      fill_color=BLUE, fill_opacity=0.35)
        hline = DashedLine(A + RIGHT * 5 * u, A + RIGHT * 5 * u + UP * 5 * u,
                           stroke_color=YELLOW, stroke_width=3.5)
        b_lbl = Text("8", font_size=28, color=YELLOW, weight="BOLD").next_to(tri, DOWN, buff=0.18)
        h_lbl = Text("5", font_size=28, color=YELLOW, weight="BOLD")
        h_lbl.next_to(hline, RIGHT, buff=0.12)

        self.reveal(Create(tri), FadeIn(b_lbl), rt=1.4)
        self.reveal(Create(hline), FadeIn(h_lbl), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("A = ½ × base × height", pal["step"]),
            ("A = ½ × 8 × 5", pal["step"]),
            ("A = ½ × 40", YELLOW),
        ], anchor=RIGHT * 1.7 + UP * 0.7, size=30, gap=0.4)

        ans = answer_card(self, "A = 20 square units", pal["answer"],
                          self.mascot, pos=DOWN * 2.7 + LEFT * 0.7)
        self.breathe(2.0)
        return VGroup(q, tri, hline, b_lbl, h_lbl, steps, ans)
