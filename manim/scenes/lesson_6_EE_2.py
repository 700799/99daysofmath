"""6.EE Unit 2 — Writing & evaluating expressions  (TeachingDeck)

Math (verified):
  • "six more than a number n" → n + 6 ("more than" means add).
  • Evaluate 2x + 5 when x = 4: substitute → 2·4 + 5 = 8 + 5 = 13.
  • Order of operations: multiply 2·4 BEFORE adding 5 (2·4+5 = 13, not 2·9 = 18).
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6EE2(TeachingDeck):
    TITLE = "Writing & evaluating expressions"
    DOMAIN = "6.EE"
    HOOK = "Can you write 'six more than a number n' as MATH?"
    RECAP = [
        "A variable is a letter holding a number",
        "'more than' = +   'product of' = ×",
        "Substitute, then multiply BEFORE adding",
    ]

    def concept(self):
        pal = self.pal
        # A variable is a mystery box — a letter standing in for a number.
        box = Square(side_length=1.15, stroke_color=YELLOW, stroke_width=5,
                     fill_color=YELLOW, fill_opacity=0.12)
        letter = Text("x", font_size=52, weight="BOLD", color=YELLOW)
        box_g = VGroup(box, letter.move_to(box)).move_to(LEFT * 4.4 + UP * 1.9)
        self.reveal(GrowFromCenter(box_g), rt=1.3)

        b_lbl = Text("a letter holding\na number", font_size=24,
                     color=BLUE, weight="BOLD", line_spacing=1.0)
        b_lbl.next_to(box_g, DOWN, buff=0.35)
        self.reveal(FadeIn(b_lbl, shift=UP * 0.15), rt=1.2)
        self.breathe(1.8)

        # Words turn into math: "six more than n" becomes n + 6.
        words = Text("“six more than a number n”", font_size=28,
                     color=pal["step"], weight="BOLD")
        words.move_to(RIGHT * 0.9 + UP * 2.1)
        self.reveal(FadeIn(words, shift=DOWN * 0.15), rt=1.3)

        arrow = Arrow(words.get_bottom() + DOWN * 0.05,
                      words.get_bottom() + DOWN * 0.8,
                      color=YELLOW, stroke_width=5, buff=0.05)
        math = Text("n + 6", font_size=42, weight="BOLD", color=GREEN)
        math.next_to(arrow, DOWN, buff=0.18)
        self.reveal(GrowArrow(arrow), FadeIn(math, shift=UP * 0.2), rt=1.4)
        self.breathe(1.8)

        note = Text("'more than' means ADD", font_size=24, color=GREEN,
                    weight="BOLD")
        note.next_to(math, DOWN, buff=0.25)
        self.reveal(FadeIn(note, shift=UP * 0.15), rt=1.2)
        self.breathe(1.6)

        # The little translation dictionary.
        dict_lines = VGroup(
            Text("more than  →  +", font_size=25, color=pal["step"], weight="BOLD"),
            Text("product of  →  ×", font_size=25, color=pal["step"], weight="BOLD"),
            Text("less than  →  FLIP the order!", font_size=25, color=YELLOW, weight="BOLD"),
        ).arrange(DOWN, buff=0.26, aligned_edge=LEFT)
        dict_box = RoundedRectangle(
            width=dict_lines.width + 0.8, height=dict_lines.height + 0.6,
            corner_radius=0.2, stroke_color=BLUE, stroke_width=4,
            fill_color=BLUE, fill_opacity=0.08)
        dict_g = VGroup(dict_box, dict_lines.move_to(dict_box))
        dict_g.move_to(DOWN * 1.75 + LEFT * 2.6)
        d_lbl = Text("word dictionary", font_size=24, color=BLUE, weight="BOLD")
        d_lbl.next_to(dict_g, UP, buff=0.22)
        self.reveal(Create(dict_box), FadeIn(d_lbl), rt=1.3)
        self.reveal(FadeIn(dict_lines, shift=UP * 0.15), rt=1.4)
        self.breathe(2.2)

        flip = Text("“3 less than n”\n= n − 3", font_size=26, color=pal["accent"],
                    weight="BOLD", line_spacing=1.0)
        flip.move_to(RIGHT * 2.4 + DOWN * 1.55)
        self.reveal(FadeIn(flip, shift=UP * 0.15), rt=1.2)
        self.breathe(2.0)

        return VGroup(box_g, b_lbl, words, arrow, math, note, dict_g, d_lbl, flip)

    def example(self):
        pal = self.pal
        q = Text("Evaluate 2x + 5 when x = 4", font_size=32,
                 color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # The expression with x drawn as a box a number can drop into.
        two = Text("2", font_size=46, weight="BOLD", color=pal["step"])
        xbox = Square(side_length=0.8, stroke_color=YELLOW, stroke_width=4,
                      fill_color=YELLOW, fill_opacity=0.10)
        xin = Text("x", font_size=36, weight="BOLD", color=YELLOW).move_to(xbox)
        plus5 = Text("+ 5", font_size=46, weight="BOLD", color=pal["step"])
        expr = VGroup(two, VGroup(xbox, xin), plus5).arrange(RIGHT, buff=0.3)
        expr.move_to(UP * 0.85 + LEFT * 1.4)
        self.reveal(FadeIn(expr, shift=UP * 0.15), rt=1.3)

        # The 4 flies in and takes x's seat — that's substitution.
        token = Text("4", font_size=36, weight="BOLD", color=GREEN)
        token.move_to(RIGHT * 1.9 + UP * 0.85)
        sub_lbl = Text("substitute!", font_size=24, color=GREEN, weight="BOLD")
        sub_lbl.next_to(token, RIGHT, buff=0.35)
        self.reveal(FadeIn(token, scale=1.3), FadeIn(sub_lbl), rt=1.2)
        self.reveal(token.animate.move_to(xbox), FadeOut(xin), rt=1.4)
        self.breathe(1.8)

        steps = self.step_lines([
            "2 · 4 + 5",
            "multiply first:  2 · 4 = 8",
            "then add:  8 + 5 = 13",
        ], anchor=DOWN * 0.55 + LEFT * 1.0, size=29)
        self.breathe(1.6)

        ans = answer_card(self, "2x + 5 = 13", pal["answer"], self.mascot,
                          pos=DOWN * 2.6 + LEFT * 1.0)
        self.breathe(1.8)
        return VGroup(q, expr, token, sub_lbl, steps, ans)
