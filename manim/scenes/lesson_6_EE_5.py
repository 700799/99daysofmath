"""6.EE Unit 5 — Graphing inequalities  (TeachingDeck)

Math (verified):
  • x ≥ 3: 3 is included → closed dot at 3, shade/arrow toward bigger numbers.
  • x < 3: 3 is NOT included → open circle at 3, shade toward smaller numbers.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


class Lesson6EE5(TeachingDeck):
    TITLE = "Graphing inequalities"
    DOMAIN = "6.EE"
    HOOK = "Can you show EVERY number that's 3 or more... on one picture?"
    RECAP = [
        "< or > → open circle",
        "≤ or ≥ → closed circle",
        "Shade toward the direction of the inequality",
    ]

    def concept(self):
        pal = self.pal
        line1 = NumberLine(x_range=[-2, 8, 1], length=9.0, color=GREY_B,
                           include_numbers=True, font_size=20)
        line1.move_to(UP * 1.4)
        self.reveal(Create(line1), rt=1.5)
        self.breathe(1.4)

        dot1 = Dot(line1.n2p(3), color=GREEN, radius=0.14)
        shade1 = Line(line1.n2p(3), line1.n2p(8), color=GREEN, stroke_width=8)
        arrow1 = Arrow(line1.n2p(7.6), line1.n2p(8.2), color=GREEN, buff=0, stroke_width=6)
        self.reveal(FadeIn(dot1, scale=1.4), Create(shade1), GrowArrow(arrow1), rt=1.6)
        cap0 = Text("≥ includes 3 → CLOSED circle", font_size=26, color=GREEN,
                    weight="BOLD").move_to(RIGHT * 1.8 + UP * 2.2)
        self.reveal(FadeIn(cap0, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        line2 = NumberLine(x_range=[-2, 8, 1], length=9.0, color=GREY_B,
                           include_numbers=True, font_size=20)
        line2.move_to(DOWN * 1.1)
        self.reveal(Create(line2), rt=1.4)
        ring = Circle(radius=0.14, color=ORANGE, stroke_width=4).move_to(line2.n2p(3))
        shade2 = Line(line2.n2p(-2), line2.n2p(3), color=ORANGE, stroke_width=8)
        arrow2 = Arrow(line2.n2p(-1.6), line2.n2p(-2.2), color=ORANGE, buff=0, stroke_width=6)
        self.reveal(Create(ring), Create(shade2), GrowArrow(arrow2), rt=1.6)
        cap1 = Text("< does NOT include 3 → OPEN circle", font_size=26, color=ORANGE,
                    weight="BOLD").move_to(RIGHT * 1.8 + DOWN * 0.3)
        self.reveal(FadeIn(cap1, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(line1, dot1, shade1, arrow1, cap0, line2, ring, shade2, arrow2, cap1)

    def example(self):
        pal = self.pal
        q = Text("Graph x ≥ 3", font_size=32, color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        steps = self.step_lines([
            ("≥ means 3 or more", pal["step"]),
            ("3 IS included → closed dot", GREEN),
            ("shade right, toward bigger numbers", GREEN),
        ], anchor=UP * 0.9, size=26, gap=0.34)

        line = NumberLine(x_range=[-2, 8, 1], length=9.0, color=GREY_B,
                          include_numbers=True, font_size=20)
        line.move_to(DOWN * 1.6)
        dot = Dot(line.n2p(3), color=GREEN, radius=0.14)
        shade = Line(line.n2p(3), line.n2p(8), color=GREEN, stroke_width=8)
        arrow = Arrow(line.n2p(7.6), line.n2p(8.2), color=GREEN, buff=0, stroke_width=6)
        self.reveal(Create(line), FadeIn(dot, scale=1.4), Create(shade), GrowArrow(arrow), rt=1.7)
        self.breathe(1.8)

        ans = answer_card(self, "x ≥ 3: closed dot at 3, shade right", pal["answer"],
                          self.mascot, pos=DOWN * 2.9)
        self.breathe(2.0)
        return VGroup(q, steps, line, dot, shade, arrow, ans)
