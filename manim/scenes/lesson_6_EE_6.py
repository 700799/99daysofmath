"""6.EE Unit 6 — Variables that change together  (TeachingDeck)

Math (verified):
  • y = 3x: x=1→3, x=2→6, x=3→9 (all verified by ×3).
  • d = 60t: t=2 → d = 60×2 = 120.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6EE6(TeachingDeck):
    TITLE = "Variables that change together"
    DOMAIN = "6.EE"
    HOOK = "A number x picks a partner y. If y is always 3 times x... can you predict y?"
    RECAP = [
        "y depends on x: plug x in",
        "Independent = you choose it",
        "Dependent = it reacts",
    ]

    def concept(self):
        pal = self.pal
        eq = Text("y = 3x", font_size=44, color=YELLOW, weight="BOLD").move_to(UP * 2.0)
        self.reveal(FadeIn(eq, shift=UP * 0.15), rt=1.3)
        self.breathe(1.6)

        cap0 = Text("x is independent (you pick it)\ny is dependent (it reacts)",
                    font_size=24, color=pal["accent"], weight="BOLD").move_to(LEFT * 3.4 + UP * 0.3)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.4)
        self.breathe(1.8)

        header = VGroup(Text("x", font_size=28, color=BLUE, weight="BOLD"),
                        Text("y", font_size=28, color=ORANGE, weight="BOLD")).arrange(RIGHT, buff=1.6)
        header.move_to(RIGHT * 2.2 + UP * 1.4)
        self.reveal(FadeIn(header), rt=1.2)

        rows = [(1, 3), (2, 6), (3, 9)]
        row_mobs = VGroup()
        prev = header
        for a, b in rows:
            r = VGroup(Text(str(a), font_size=26, color=BLUE),
                      Text(str(b), font_size=26, color=ORANGE)).arrange(RIGHT, buff=1.9)
            r.next_to(prev, DOWN, buff=0.35).align_to(header, LEFT)
            self.reveal(FadeIn(r), rt=1.1)
            self.breathe(1.1)
            row_mobs.add(r)
            prev = r

        self.breathe(1.4)
        return VGroup(eq, cap0, header, row_mobs)

    def example(self):
        pal = self.pal
        q = Text("A car drives d = 60t miles. Find d when t = 2.", font_size=27,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("t = 2", pal["step"]),
            ("d = 60 × 2", pal["step"]),
        ], anchor=UP * 0.6, size=30, gap=0.4)

        ans = answer_card(self, "d = 120 miles", pal["answer"], self.mascot, pos=DOWN * 1.8)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
