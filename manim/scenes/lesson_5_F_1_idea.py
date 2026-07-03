"""5.F Unit 1 idea — Place value & big operations  (TeachingDeck)

Math (verified):
  • Place-value ladder: 1 → 10 → 100 → 1,000; every step LEFT multiplies by 10.
  • In 4,562 the 5 sits in the hundreds place → 5 × 100 = 500.
  • 24 × 13 split apart: 24 × 10 = 240, 24 × 3 = 72, 240 + 72 = 312.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson5F1Idea(TeachingDeck):
    TITLE = "Place value & big operations"
    DOMAIN = "5.F"
    HOOK = "In 4,562 — is that 5 worth just five... or something much bigger?"
    RECAP = [
        "Every place is 10× the place to its right",
        "The 5 in 4,562 means 5 × 100 = 500",
        "Break big multiplications into easy parts",
    ]

    def concept(self):
        pal = self.pal
        # ── Place-value staircase: four bars, each 10× the one to its right ──
        heights = [0.45, 1.0, 1.65, 2.3]          # ones → thousands (symbolic ×10 growth)
        powers = ["1", "10", "100", "1,000"]
        names = ["ones", "tens", "hundreds", "thousands"]
        colors = [BLUE, GREEN, ORANGE, GOLD]
        xs = [1.6, -0.4, -2.4, -4.4]              # ones on the right, growing leftward
        base_y = -0.55

        cols = VGroup()
        for h, p, name, col, x in zip(heights, powers, names, colors, xs):
            bar = Rectangle(width=1.45, height=h, stroke_color=col, stroke_width=4,
                            fill_color=col, fill_opacity=0.35)
            bar.move_to([x, base_y + h / 2, 0])
            lbl = Text(name, font_size=24, color=col, weight="BOLD")
            pw = Text(p, font_size=28, color=WHITE, weight="BOLD")
            VGroup(lbl, pw).arrange(DOWN, buff=0.12).next_to(bar, DOWN, buff=0.18)
            cols.add(VGroup(bar, lbl, pw))

        # Reveal the ones column first, then climb left with ×10 arrows.
        self.reveal(GrowFromEdge(cols[0][0], DOWN), FadeIn(cols[0][1:]), rt=1.3)
        arrows = VGroup()
        for i in range(3):
            a_start = cols[i][0].get_top() + UP * 0.15
            a_end = cols[i + 1][0].get_top() + UP * 0.15
            arr = Arrow(a_start, a_end, buff=0.08, color=YELLOW, stroke_width=5,
                        max_tip_length_to_length_ratio=0.18)
            tag = Text("×10", font_size=26, color=YELLOW, weight="BOLD")
            tag.next_to(arr, UP, buff=0.1)
            arrows.add(VGroup(arr, tag))
            self.reveal(GrowArrow(arr), FadeIn(tag),
                        GrowFromEdge(cols[i + 1][0], DOWN), FadeIn(cols[i + 1][1:]),
                        rt=1.4)
        self.breathe(1.8)

        rule = Text("Every step LEFT is ×10 bigger!", font_size=28,
                    color=YELLOW, weight="BOLD").move_to(UP * 2.05 + LEFT * 1.4)
        self.reveal(FadeIn(rule, shift=DOWN * 0.2), rt=1.3)
        self.breathe(1.8)

        # ── Drop the digits of 4,562 under their columns ──
        digit_strs = ["4", "5", "6", "2"]          # thousands → ones
        digit_cols = [xs[3], xs[2], xs[1], xs[0]]
        digits = VGroup()
        for d, x in zip(digit_strs, digit_cols):
            t = Text(d, font_size=44, color=WHITE, weight="BOLD")
            t.move_to([x, -2.0, 0])
            digits.add(t)
        num_lbl = Text("4,562", font_size=28, color=pal["accent"], weight="BOLD")
        num_lbl.move_to([3.4, -2.0, 0])
        self.reveal(LaggedStart(*[FadeIn(d, shift=DOWN * 0.3) for d in digits],
                                lag_ratio=0.25), FadeIn(num_lbl), rt=1.8)
        self.breathe(1.8)

        # The 5 lives in the hundreds place → worth 500.
        box = SurroundingRectangle(digits[1], color=GREEN, buff=0.14, corner_radius=0.1)
        val = Text("the 5 means 5 × 100 = 500", font_size=28,
                    color=GREEN, weight="BOLD").move_to(DOWN * 2.62 + LEFT * 0.6)
        self.reveal(Create(box), rt=1.3)
        self.reveal(FadeIn(val, shift=UP * 0.15), rt=1.3)
        self.breathe(2.2)

        return VGroup(cols, arrows, rule, digits, num_lbl, box, val)

    def example(self):
        pal = self.pal
        q = Text("Multiply 24 × 13", font_size=32, color=pal["step"], weight="BOLD")
        q.move_to(UP * 2.05)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # ── Area model: 13 splits into 10 + 3 ──
        left_w, right_w, h = 3.0, 0.9, 1.5
        model_c = LEFT * 3.3 + UP * 0.45
        big = Rectangle(width=left_w + right_w, height=h, stroke_color=WHITE,
                        stroke_width=4).move_to(model_c)
        side = Text("24", font_size=28, color=WHITE, weight="BOLD")
        side.next_to(big, LEFT, buff=0.25)
        top13 = Text("13", font_size=28, color=WHITE, weight="BOLD")
        top13.next_to(big, UP, buff=0.2)
        self.reveal(Create(big), FadeIn(side), FadeIn(top13), rt=1.4)
        self.breathe(1.6)

        # Split the 13 into a friendly 10 and a small 3.
        div_x = big.get_left()[0] + left_w
        divider = Line([div_x, big.get_bottom()[1], 0], [div_x, big.get_top()[1], 0],
                       stroke_color=YELLOW, stroke_width=4)
        lab10 = Text("10", font_size=26, color=BLUE, weight="BOLD")
        lab10.move_to([big.get_left()[0] + left_w / 2, big.get_top()[1] + 0.32, 0])
        lab3 = Text("3", font_size=26, color=ORANGE, weight="BOLD")
        lab3.move_to([div_x + right_w / 2, big.get_top()[1] + 0.32, 0])
        split_note = Text("13 = 10 + 3", font_size=26, color=YELLOW, weight="BOLD")
        split_note.next_to(big, DOWN, buff=0.3)
        self.reveal(Create(divider), FadeOut(top13),
                    FadeIn(lab10), FadeIn(lab3), FadeIn(split_note), rt=1.4)
        self.breathe(1.8)

        # Fill each piece with its product.
        cell240 = Text("240", font_size=30, color=BLUE, weight="BOLD")
        cell240.move_to([big.get_left()[0] + left_w / 2, model_c[1], 0])
        cell72 = Text("72", font_size=26, color=ORANGE, weight="BOLD")
        cell72.move_to([div_x + right_w / 2, model_c[1], 0])
        self.reveal(FadeIn(cell240, scale=1.2), FadeIn(cell72, scale=1.2), rt=1.3)
        self.breathe(1.6)

        # ── The arithmetic, line by line ──
        steps = self.step_lines([
            ("24 × 10 = 240", BLUE),
            ("24 × 3 = 72", ORANGE),
            ("240 + 72 = 312", WHITE),
        ], anchor=RIGHT * 1.7 + UP * 0.95, size=30)
        self.breathe(1.6)

        ans = answer_card(self, "24 × 13 = 312", pal["answer"], self.mascot,
                          pos=DOWN * 2.15)
        self.breathe(2.0)
        return VGroup(q, big, side, divider, lab10, lab3, split_note,
                      cell240, cell72, steps, ans)
