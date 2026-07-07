"""6.EE Unit 10 — Tables & relationships  (TeachingDeck)

Math (verified):
  • y = 4x: x=1→4, x=2→8, x=3→12 (verified by ×4). x=6→24 (4×6=24).
  • Rule for (1,5),(2,10),(3,15): 5/1=5, 10/2=5, 15/3=5 → y = 5x.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6EE10(TeachingDeck):
    TITLE = "Tables & relationships"
    DOMAIN = "6.EE"
    HOOK = "If y is always 4 times x, what happens when x jumps to 6?"
    RECAP = [
        "Plug x into the rule to get y",
        "Check: same ratio y ÷ x every row",
        "A table is just the rule, row by row",
    ]

    def concept(self):
        pal = self.pal
        eq = Text("y = 4x", font_size=40, color=YELLOW, weight="BOLD").move_to(UP * 2.1 + LEFT * 3.0)
        self.reveal(FadeIn(eq), rt=1.3)
        self.breathe(1.4)

        header = VGroup(Text("x", font_size=28, color=BLUE, weight="BOLD"),
                        Text("y", font_size=28, color=ORANGE, weight="BOLD")).arrange(RIGHT, buff=1.6)
        header.move_to(LEFT * 3.4 + UP * 1.0)
        self.reveal(FadeIn(header), rt=1.2)

        rows = [(1, 4), (2, 8), (3, 12)]
        prev = header
        row_mobs = VGroup()
        for a, b in rows:
            r = VGroup(Text(str(a), font_size=26, color=BLUE),
                      Text(str(b), font_size=26, color=ORANGE)).arrange(RIGHT, buff=1.9)
            r.next_to(prev, DOWN, buff=0.3).align_to(header, LEFT)
            self.reveal(FadeIn(r), rt=1.1)
            self.breathe(1.0)
            row_mobs.add(r)
            prev = r

        punch = Text("x = 6 → y = 24", font_size=28, color=GREEN, weight="BOLD").move_to(RIGHT * 1.8 + DOWN * 0.5)
        self.reveal(FadeIn(punch, shift=UP * 0.15), rt=1.4)
        self.breathe(2.0)

        return VGroup(eq, header, row_mobs, punch)

    def example(self):
        pal = self.pal
        q = Text("What's the rule for (1,5), (2,10), (3,15)?", font_size=28,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("5÷1 = 5, 10÷2 = 5, 15÷3 = 5", pal["step"]),
            ("same ratio every time: 5", pal["step"]),
        ], anchor=UP * 0.6, size=27, gap=0.4)

        ans = answer_card(self, "rule: y = 5x", pal["answer"], self.mascot, pos=DOWN * 1.8)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
