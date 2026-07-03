"""6.RP Unit 3 — Ratio tables  (TeachingDeck)

Math (verified):
  • Equivalent ratios: 1:3 → ×2 → 2:6;  1:3 → ×3 → 3:9. All say "3 for every 1".
    Check: 6 ÷ 2 = 3, 9 ÷ 3 = 3. ✓
  • 4 pens cost $3. 8 pens = 4 × 2, so cost = $3 × 2 = $6.
    Check (unit price): $3 ÷ 4 = $0.75/pen and $6 ÷ 8 = $0.75/pen — same rate. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


def ratio_table(col1, col2, headers, col_w=1.9, row_h=0.72, head_color=BLUE):
    """A 2-column table drawn from lines + text. Returns (frame, cells) where
    cells[r][c] is the Text at row r, column c (row 0 is the header)."""
    n = len(col1) + 1
    w, h = col_w * 2, row_h * n
    frame = VGroup(Rectangle(width=w, height=h, stroke_color=WHITE, stroke_width=3),
                   Line(UP * h / 2, DOWN * h / 2, stroke_width=3, color=WHITE))
    for r in range(1, n):
        y = h / 2 - r * row_h
        frame.add(Line(LEFT * w / 2 + UP * y, RIGHT * w / 2 + UP * y,
                       stroke_width=2.5, color=WHITE))
    cells = []
    data = [headers] + list(zip(col1, col2))
    for r, (a, b) in enumerate(data):
        col = head_color if r == 0 else WHITE
        y = h / 2 - (r + 0.5) * row_h
        ta = Text(str(a), font_size=26, color=col, weight="BOLD").move_to(LEFT * col_w / 2 + UP * y)
        tb = Text(str(b), font_size=26, color=col, weight="BOLD").move_to(RIGHT * col_w / 2 + UP * y)
        cells.append([ta, tb])
    return frame, cells


def both_arrows(cells, r_from, r_to, label):
    """Curved ×k arrows on BOTH sides of a table, from row r_from to r_to."""
    a_l = CurvedArrow(cells[r_from][0].get_center() + LEFT * 0.85,
                      cells[r_to][0].get_center() + LEFT * 0.85,
                      angle=TAU / 5, color=YELLOW, stroke_width=4, tip_length=0.16)
    t_l = Text(label, font_size=24, color=YELLOW, weight="BOLD").next_to(a_l, LEFT, buff=0.1)
    a_r = CurvedArrow(cells[r_from][1].get_center() + RIGHT * 0.85,
                      cells[r_to][1].get_center() + RIGHT * 0.85,
                      angle=-TAU / 5, color=YELLOW, stroke_width=4, tip_length=0.16)
    t_r = Text(label, font_size=24, color=YELLOW, weight="BOLD").next_to(a_r, RIGHT, buff=0.1)
    return VGroup(a_l, t_l, a_r, t_r)


class Lesson6RP3(TeachingDeck):
    TITLE = "Ratio tables"
    DOMAIN = "6.RP"
    HOOK = "4 pens cost $3. No price tag for 8 pens... can a TABLE tell you?"
    RECAP = [
        "Equivalent ratios say the same thing",
        "Multiply BOTH columns by the same number",
        "Spot the pattern, fill the gap!",
    ]

    def concept(self):
        pal = self.pal
        intro = Text("Equivalent ratios make the SAME comparison",
                     font_size=28, color=pal["step"], weight="BOLD")
        intro.move_to(UP * 1.9)
        self.reveal(FadeIn(intro, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.6)

        # Build a cookie-recipe table row by row: 1:3, 2:6, 3:9.
        frame, cells = ratio_table([1, 2, 3], [3, 6, 9], ("cups", "cookies"))
        tgroup = VGroup(frame, *[t for row in cells for t in row])
        tgroup.move_to(DOWN * 0.55 + LEFT * 2.2)
        self.reveal(Create(frame), FadeIn(cells[0][0]), FadeIn(cells[0][1]),
                    FadeIn(cells[1][0]), FadeIn(cells[1][1]), rt=1.8)
        note1 = Text("1 cup makes 3 cookies", font_size=26,
                     color=pal["accent"], weight="BOLD")
        note1.next_to(frame, RIGHT, buff=1.1).shift(UP * 0.7)
        self.reveal(FadeIn(note1, shift=LEFT * 0.2), rt=1.2)
        self.breathe(1.8)

        # Row 2: ×2 on BOTH columns.
        arr2 = both_arrows(cells, 1, 2, "×2")
        self.reveal(Create(arr2[0]), Create(arr2[2]), FadeIn(arr2[1]), FadeIn(arr2[3]),
                    FadeIn(cells[2][0], scale=1.3), FadeIn(cells[2][1], scale=1.3), rt=1.8)
        note2 = Text("2 cups → 6 cookies", font_size=26, color=YELLOW, weight="BOLD")
        note2.next_to(note1, DOWN, buff=0.45, aligned_edge=LEFT)
        self.reveal(FadeIn(note2, shift=LEFT * 0.2), rt=1.2)
        self.breathe(1.8)

        # Row 3: ×3 straight from row 1.
        self.reveal(FadeIn(cells[3][0], scale=1.3), FadeIn(cells[3][1], scale=1.3), rt=1.3)
        self.breathe(1.6)

        rule = Text("Whatever you do to one column,\ndo to the other!", font_size=27,
                    color=YELLOW, weight="BOLD")
        rule.next_to(note2, DOWN, buff=0.5, aligned_edge=LEFT)
        rbox = SurroundingRectangle(rule, color=YELLOW, buff=0.16, corner_radius=0.12)
        self.reveal(FadeIn(rule, shift=UP * 0.15), Create(rbox), rt=1.5)
        self.breathe(2.0)

        return VGroup(intro, tgroup, note1, arr2, note2, rule, rbox)

    def example(self):
        pal = self.pal
        q = Text("4 pens cost $3. What do 8 pens cost?", font_size=30,
                 color=pal["step"], weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        frame, cells = ratio_table([4, 8], ["$3", "?"], ("pens", "cost"))
        cells[2][1].set_color(YELLOW)
        tgroup = VGroup(frame, *[t for row in cells for t in row])
        tgroup.move_to(UP * 0.3 + LEFT * 2.4)
        self.reveal(Create(frame), *[FadeIn(t) for row in cells for t in row], rt=1.8)
        self.breathe(1.8)

        arr = both_arrows(cells, 1, 2, "×2")
        self.reveal(Create(arr[0]), FadeIn(arr[1]), rt=1.3)
        self.reveal(Create(arr[2]), FadeIn(arr[3]), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("8 pens = 4 pens × 2", pal["accent"]),
            ("so the cost doubles too:  $3 × 2 = $6", WHITE),
        ], anchor=DOWN * 1.35 + RIGHT * 0.4, size=28)
        self.breathe(1.6)

        six = Text("$6", font_size=26, color=GREEN, weight="BOLD").move_to(cells[2][1])
        self.reveal(Transform(cells[2][1], six), rt=1.2)
        self.breathe(1.6)

        ans = answer_card(self, "8 pens cost $6", pal["answer"], self.mascot,
                          pos=DOWN * 2.85)
        self.breathe(2.0)
        return VGroup(q, tgroup, arr, steps, ans)
