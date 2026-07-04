"""5.F Unit 3 idea — Multiplying & dividing fractions  (TeachingDeck)

Math (verified):
  • 1/2 × 1/4: the square splits into 2 × 4 = 8 equal pieces; half of one
    quarter is 1 piece → 1/8.  Tops: 1 × 1 = 1.  Bottoms: 2 × 4 = 8.
  • 6 ÷ 1/2: each whole holds 2 halves → 6 × 2 = 12 (bigger than 6!).
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson5F3Idea(TeachingDeck):
    TITLE = "Multiplying & dividing fractions"
    DOMAIN = "5.F"
    HOOK = "6 ÷ 1/2 — will the answer be SMALLER than 6... or bigger? Guess!"
    RECAP = [
        "Multiply: tops together, bottoms together",
        "Dividing asks: how many pieces fit?",
        "6 ÷ 1/2 = 12 — BIGGER, not smaller!",
    ]

    def concept(self):
        pal = self.pal
        side = 2.9
        sq_c = LEFT * 3.6 + UP * 0.35
        sq = Square(side_length=side, stroke_color=WHITE, stroke_width=4).move_to(sq_c)
        whole = Text("one whole", font_size=24, color=WHITE, weight="BOLD")
        whole.next_to(sq, DOWN, buff=0.25)
        self.reveal(Create(sq), FadeIn(whole), rt=1.4)
        self.breathe(1.6)

        # ── Cut into quarters (rows), shade the top quarter ──
        top, left_x = sq.get_top()[1], sq.get_left()[0]
        h_lines = VGroup(*[
            Line([left_x, top - side * k / 4, 0], [left_x + side, top - side * k / 4, 0],
                 stroke_color=WHITE, stroke_width=3)
            for k in (1, 2, 3)
        ])
        quarter = Rectangle(width=side, height=side / 4, stroke_width=0,
                            fill_color=ORANGE, fill_opacity=0.55)
        quarter.move_to([sq_c[0], top - side / 8, 0])
        lab_q = Text("1/4", font_size=28, color=ORANGE, weight="BOLD")
        lab_q.next_to(sq, LEFT, buff=0.3).shift(UP * 1.0)
        self.reveal(LaggedStart(*[Create(l) for l in h_lines], lag_ratio=0.3), rt=1.6)
        self.reveal(FadeIn(quarter), FadeIn(lab_q), rt=1.3)
        self.breathe(1.8)

        # ── Take HALF of that quarter ──
        v_line = Line([sq_c[0], top - side, 0], [sq_c[0], top, 0],
                      stroke_color=WHITE, stroke_width=3)
        piece = Rectangle(width=side / 2, height=side / 4,
                          stroke_color=GREEN, stroke_width=5,
                          fill_color=GREEN, fill_opacity=0.85)
        piece.move_to([sq_c[0] - side / 4, top - side / 8, 0])
        lab_h = Text("half of the 1/4", font_size=24, color=GREEN, weight="BOLD")
        lab_h.next_to(sq, UP, buff=0.22)
        self.reveal(Create(v_line), rt=1.3)
        self.reveal(FadeIn(piece), FadeIn(lab_h), rt=1.4)
        self.breathe(1.8)

        # ── Count the equal pieces: 8 of them, ours is 1 ──
        note1 = Text("The whole is now cut into\n2 × 4 = 8 equal pieces", font_size=26,
                     color=WHITE, weight="BOLD", line_spacing=0.9)
        note1.move_to(RIGHT * 1.9 + UP * 1.3)
        self.reveal(FadeIn(note1, shift=UP * 0.15), rt=1.4)
        self.breathe(1.8)

        note2 = Text("The green piece is 1 of the 8", font_size=26,
                     color=GREEN, weight="BOLD").move_to(RIGHT * 1.9 + UP * 0.25)
        self.reveal(FadeIn(note2, shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)

        rule = Text("tops: 1 × 1 = 1\nbottoms: 2 × 4 = 8", font_size=26,
                    color=YELLOW, weight="BOLD", line_spacing=0.9)
        rule.move_to(RIGHT * 1.9 + DOWN * 0.85)
        big = Text("1/2 × 1/4 = 1/8", font_size=34, color=pal["step"], weight="BOLD")
        big.move_to(RIGHT * 1.9 + DOWN * 2.0)
        self.reveal(FadeIn(rule, shift=UP * 0.15), rt=1.4)
        self.reveal(FadeIn(big, scale=1.15), rt=1.3)
        self.breathe(2.2)

        return VGroup(sq, whole, h_lines, quarter, lab_q, v_line, piece, lab_h,
                      note1, note2, rule, big)

    def example(self):
        pal = self.pal
        q = Text("Divide 6 ÷ 1/2", font_size=32, color=pal["step"], weight="BOLD")
        q.move_to(UP * 2.05)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # ── Six wholes ──
        wholes = VGroup(*[
            Square(side_length=0.82, stroke_color=BLUE, stroke_width=4,
                   fill_color=BLUE, fill_opacity=0.25)
            for _ in range(6)
        ]).arrange(RIGHT, buff=0.22).move_to(UP * 0.95 + LEFT * 0.9)
        lab6 = Text("6 wholes", font_size=26, color=BLUE, weight="BOLD")
        lab6.next_to(wholes, LEFT, buff=0.35)
        self.reveal(LaggedStart(*[GrowFromCenter(w) for w in wholes], lag_ratio=0.15),
                    FadeIn(lab6), rt=1.8)
        self.breathe(1.6)

        # ── Cut every whole into halves ──
        cuts = VGroup(*[
            Line(w.get_top(), w.get_bottom(), stroke_color=YELLOW, stroke_width=4)
            for w in wholes
        ])
        cut_lab = Text("cut each whole into halves", font_size=26,
                       color=YELLOW, weight="BOLD").next_to(wholes, UP, buff=0.28)
        self.reveal(LaggedStart(*[Create(c) for c in cuts], lag_ratio=0.15),
                    FadeIn(cut_lab), rt=1.8)
        self.breathe(1.8)

        # Count the halves: 2 per whole.
        counts = VGroup(*[
            Text(str(2 * (i + 1)), font_size=24, color=GREEN, weight="BOLD")
            .next_to(wholes[i], DOWN, buff=0.2)
            for i in range(6)
        ])
        self.reveal(LaggedStart(*[FadeIn(c, shift=UP * 0.1) for c in counts],
                                lag_ratio=0.2), rt=1.8)
        self.breathe(1.8)

        steps = self.step_lines([
            ("each whole holds 2 halves", YELLOW),
            ("6 × 2 = 12 halves fit", WHITE),
        ], anchor=DOWN * 0.75 + LEFT * 0.9, size=28)
        self.breathe(1.6)

        ans = answer_card(self, "6 ÷ 1/2 = 12", pal["answer"], self.mascot,
                          pos=DOWN * 2.3 + LEFT * 0.9)
        self.breathe(2.0)
        return VGroup(q, wholes, lab6, cuts, cut_lab, counts, steps, ans)
