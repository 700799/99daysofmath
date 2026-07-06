"""6.RP Unit 9 — Measurement conversions  (TeachingDeck)

Math (verified):
  • Anchors: 12 in = 1 ft, 3 ft = 1 yd, 100 cm = 1 m, 1000 m = 1 km.
  • 2 ft → inches (smaller unit → MORE of them → multiply): 2 × 12 = 24 in.
  • 36 in → feet (bigger unit → FEWER of them → divide): 36 ÷ 12 = 3 ft.
  • Example: 250 cm → meters. Meters are bigger → divide.
    250 ÷ 100 = 2.5 m. (Check: 2.5 × 100 = 250 cm. ✓)
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


class Lesson6RP9(TeachingDeck):
    TITLE = "Measurement conversions"
    DOMAIN = "6.RP"
    HOOK = "A robot is 2 feet tall. Guess: how many INCHES is that?"
    RECAP = [
        "Anchors: 12 in = 1 ft, 100 cm = 1 m",
        "To a SMALLER unit → multiply",
        "To a BIGGER unit → divide",
    ]

    def concept(self):
        pal = self.pal
        # One foot, stretched out: a ruler with 12 inch ticks inside it.
        ruler = Rectangle(width=5.6, height=0.65, stroke_color=WHITE,
                          stroke_width=3, fill_color=ORANGE, fill_opacity=0.35)
        ruler.move_to(UP * 1.8 + LEFT * 2.6)
        ticks = VGroup(*[
            Line(UP * 0.325, DOWN * 0.325, stroke_width=2.5, color=WHITE)
            .move_to(ruler.get_left() + RIGHT * (5.6 * i / 12))
            for i in range(1, 12)
        ])
        ft_lbl = Text("1 foot", font_size=26, color=ORANGE, weight="BOLD")
        ft_lbl.next_to(ruler, UP, buff=0.18)
        self.reveal(FadeIn(ruler), FadeIn(ft_lbl), rt=1.4)
        self.reveal(LaggedStart(*[Create(t) for t in ticks], lag_ratio=0.08),
                    rt=1.8)
        in_lbl = Text("= 12 inches", font_size=28, color=YELLOW, weight="BOLD")
        in_lbl.next_to(ruler, RIGHT, buff=0.4)
        self.reveal(FadeIn(in_lbl, shift=LEFT * 0.15), rt=1.2)
        self.breathe(1.8)

        # The anchor facts — the bridges between units (2 × 2 grid).
        anchors = VGroup(
            Text("12 in = 1 ft", font_size=26, color=pal["step"], weight="BOLD"),
            Text("3 ft = 1 yd", font_size=26, color=pal["step"], weight="BOLD"),
            Text("100 cm = 1 m", font_size=26, color=pal["step"], weight="BOLD"),
            Text("1000 m = 1 km", font_size=26, color=pal["step"], weight="BOLD"),
        ).arrange_in_grid(rows=2, cols=2, buff=(0.7, 0.28))
        anchors.move_to(UP * 0.35 + RIGHT * 0.6)
        abox = SurroundingRectangle(anchors, color=pal["accent"], buff=0.2,
                                    corner_radius=0.12)
        atag = Text("anchor\nfacts", font_size=24, color=pal["accent"],
                    weight="BOLD").next_to(abox, LEFT, buff=0.4)
        self.reveal(Create(abox), FadeIn(anchors), FadeIn(atag), rt=1.7)
        self.breathe(2.0)

        # Spotlight the anchor the ruler just showed us.
        ring = SurroundingRectangle(anchors[0], color=YELLOW, buff=0.1,
                                    corner_radius=0.1)
        self.reveal(Create(ring), rt=1.2)
        self.breathe(1.6)

        # The two directions.
        small = Text("→ SMALLER unit: more pieces → MULTIPLY",
                     font_size=27, color=GREEN, weight="BOLD")
        small.move_to(DOWN * 1.05 + LEFT * 0.7)
        ex1 = Text("2 ft → 2 × 12 = 24 in", font_size=26, color=GREEN)
        ex1.next_to(small, DOWN, buff=0.2)
        self.reveal(FadeIn(small, shift=UP * 0.15), rt=1.3)
        self.reveal(FadeIn(ex1, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        big = Text("→ BIGGER unit: fewer pieces → DIVIDE",
                   font_size=27, color=BLUE, weight="BOLD")
        big.next_to(ex1, DOWN, buff=0.3)
        ex2 = Text("36 in → 36 ÷ 12 = 3 ft", font_size=26, color=BLUE)
        ex2.next_to(big, DOWN, buff=0.2)
        self.reveal(FadeIn(big, shift=UP * 0.15), rt=1.3)
        self.reveal(FadeIn(ex2, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(ruler, ticks, ft_lbl, in_lbl, anchors, abox, atag,
                      ring, small, ex1, big, ex2)

    def example(self):
        pal = self.pal
        q = Text("Convert 250 cm to meters", font_size=30, color=pal["step"],
                 weight="BOLD")
        q.move_to(UP * 1.95)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # 250 cm laid out as meter sticks: 1 m + 1 m + half.
        stick1 = Rectangle(width=2.4, height=0.6, stroke_color=WHITE,
                           stroke_width=3, fill_color=GREEN, fill_opacity=0.5)
        stick2 = stick1.copy()
        half = Rectangle(width=1.2, height=0.6, stroke_color=WHITE,
                         stroke_width=3, fill_color=YELLOW, fill_opacity=0.5)
        sticks = VGroup(stick1, stick2, half).arrange(RIGHT, buff=0.08)
        sticks.move_to(UP * 0.7 + LEFT * 1.0)
        lbls = VGroup(
            Text("100 cm", font_size=24, color=GREEN, weight="BOLD")
            .next_to(stick1, DOWN, buff=0.18),
            Text("100 cm", font_size=24, color=GREEN, weight="BOLD")
            .next_to(stick2, DOWN, buff=0.18),
            Text("50 cm", font_size=24, color=YELLOW, weight="BOLD")
            .next_to(half, DOWN, buff=0.18),
        )
        total = Text("250 cm", font_size=26, color=pal["step"], weight="BOLD")
        total.next_to(sticks, UP, buff=0.22)
        self.reveal(LaggedStart(*[FadeIn(s) for s in sticks], lag_ratio=0.25),
                    FadeIn(total), rt=1.7)
        self.reveal(FadeIn(lbls, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        steps = self.step_lines([
            ("anchor: 100 cm = 1 m", pal["accent"]),
            ("meters are BIGGER → divide", pal["step"]),
            ("250 ÷ 100 = 2.5", GREEN),
        ], anchor=DOWN * 1.0 + LEFT * 2.9, size=28)
        self.breathe(1.6)

        ans = answer_card(self, "2.5 m", pal["answer"], self.mascot,
                          pos=DOWN * 1.6 + RIGHT * 2.8)
        self.breathe(2.0)
        return VGroup(q, sticks, lbls, total, steps, ans)
