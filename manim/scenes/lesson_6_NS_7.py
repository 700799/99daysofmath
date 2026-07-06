"""6.NS Unit 7 — Whole-number addition & subtraction  (TeachingDeck)

Math (verified):
  • 47 + 38: ones 7+8=15 → write 5, carry 1; tens 4+3=7, +1 carried = 8.
    Result 85. Check: 47+38 = 47+40−2 = 87−2 = 85. ✓
  • 952 − 387: ones 2−7 → borrow from tens (tens 5→4, ones 12−7=5);
    tens 4−8 → borrow from hundreds (hundreds 9→8, tens 14−8=6);
    hundreds 8−3=5. Result 565. Check: 565+387 = 565+400−13 = 965−13 = 952. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


def col_stack(top, bot, y=0.0, x=-3.0, size=40, color=WHITE):
    t = Text(top, font_size=size, weight="BOLD", color=color)
    b = Text(bot, font_size=size, weight="BOLD", color=color)
    g = VGroup(t, b).arrange(DOWN, buff=0.22, aligned_edge=RIGHT)
    g.move_to(RIGHT * x + UP * y)
    line = Line(g.get_left() + DOWN * 0.32, g.get_right() + DOWN * 0.32,
                stroke_width=4, color=GREY_B)
    line.next_to(g, DOWN, buff=0.05)
    return VGroup(g, line)


class Lesson6NS7(TeachingDeck):
    TITLE = "Whole-number addition & subtraction"
    DOMAIN = "6.NS"
    HOOK = "425 + 376... how do BIG numbers add up without a calculator?"
    RECAP = [
        "Line up ones, tens, hundreds",
        "Carry when a column totals 10 or more",
        "Borrow when a digit's too small",
    ]

    def concept(self):
        pal = self.pal
        stack = col_stack("47", "38", x=2.5, y=0.8)
        self.reveal(FadeIn(stack), rt=1.3)
        self.breathe(1.6)

        cap0 = Text("Ones column: 7 + 8 = 15", font_size=28, color=pal["step"], weight="BOLD")
        cap0.move_to(LEFT * 2.6 + UP * 1.6)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)

        fifteen = Text("15", font_size=34, color=ORANGE, weight="BOLD")
        fifteen.next_to(stack, DOWN, buff=0.35)
        self.reveal(FadeIn(fifteen, scale=1.2), rt=1.2)
        self.breathe(1.6)

        write5 = Text("write 5", font_size=26, color=pal["step"])
        write5.move_to(LEFT * 2.6 + UP * 0.5)
        carry1 = Text("carry 1 →", font_size=26, color=ORANGE, weight="BOLD")
        carry1.move_to(LEFT * 2.6 + DOWN * 0.3)
        arrow = CurvedArrow(carry1.get_right() + RIGHT * 0.1, stack.get_top() + LEFT * 0.3,
                             color=ORANGE, angle=-1.0)
        self.reveal(FadeIn(write5), FadeIn(carry1), Create(arrow), rt=1.5)
        self.breathe(1.8)

        cap1 = Text("Tens column: 4 + 3 + 1(carried) = 8", font_size=26,
                    color=pal["accent"], weight="BOLD")
        cap1.move_to(LEFT * 2.6 + DOWN * 1.3)
        self.reveal(FadeIn(cap1, shift=UP * 0.15), rt=1.4)
        self.breathe(1.8)

        final = Text("85", font_size=44, color=GREEN, weight="BOLD")
        final.next_to(stack, DOWN, buff=1.1)
        cap2 = Text("Carry when a column totals 10 or more.", font_size=24,
                    color=pal["step"])
        cap2.next_to(final, DOWN, buff=0.3)
        self.reveal(FadeIn(final, scale=1.3), FadeIn(cap2), rt=1.4)
        self.breathe(2.0)

        return VGroup(stack, cap0, fifteen, write5, carry1, arrow, cap1, final, cap2)

    def example(self):
        pal = self.pal
        q = Text("952 − 387 = ?", font_size=32, color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.2)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        top = Text("9 5 2", font_size=40, weight="BOLD")
        bot = Text("3 8 7", font_size=40, weight="BOLD")
        g = VGroup(top, bot).arrange(DOWN, buff=0.25)
        g.move_to(LEFT * 3.2 + UP * 0.3)
        bar = Line(g.get_left() + DOWN * 0.35, g.get_right() + DOWN * 0.35,
                  stroke_width=4, color=GREY_B)
        bar.next_to(g, DOWN, buff=0.05)
        self.reveal(FadeIn(g), Create(bar), rt=1.4)
        self.breathe(1.6)

        steps = self.step_lines([
            ("Ones: 2−7? Borrow from tens → 12−7 = 5", ORANGE),
            ("Tens: 4−8? Borrow from hundreds → 14−8 = 6", BLUE),
            ("Hundreds: 8−3 = 5", pal["step"]),
        ], anchor=RIGHT * 1.6 + UP * 1.2, size=26)

        ans = answer_card(self, "952 − 387 = 565", pal["answer"], self.mascot,
                          pos=DOWN * 2.2)
        self.breathe(2.0)
        return VGroup(q, g, bar, steps, ans)
