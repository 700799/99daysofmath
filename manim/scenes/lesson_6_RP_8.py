"""6.RP Unit 8 — Rates & unit pricing  (TeachingDeck)

Math (verified):
  • 180 miles in 3 hours → 180 ÷ 3 = 60 miles per 1 hour (60 mph).
    Bar check: 3 equal chunks of 60 → 60 + 60 + 60 = 180. ✓
  • Unit rate = total ÷ number of units.
  • Example: 4 lbs for $10 → 10 ÷ 4 = $2.50 per lb.
    6 lbs for $12 → 12 ÷ 6 = $2.00 per lb.
    $2.00 < $2.50 → the 6-lb bag is the better deal.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


class Lesson6RP8(TeachingDeck):
    TITLE = "Rates & unit pricing"
    DOMAIN = "6.RP"
    HOOK = "A car goes 180 miles in 3 hours. Guess: how far in just ONE hour?"
    RECAP = [
        "Unit rate = how much for ONE",
        "Divide the total by the units",
        "Better deal = smaller unit price",
    ]

    def concept(self):
        pal = self.pal
        # A 180-mile road trip bar, sliced into 3 equal hours.
        head = Text("180 miles in 3 hours", font_size=30, color=pal["step"],
                    weight="BOLD")
        head.move_to(UP * 1.9 + LEFT * 0.7)
        self.reveal(FadeIn(head, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        chunks = VGroup(*[
            Rectangle(width=2.6, height=0.8, stroke_color=WHITE,
                      stroke_width=3, fill_color=BLUE, fill_opacity=0.45)
            for _ in range(3)
        ]).arrange(RIGHT, buff=0)
        chunks.move_to(UP * 0.7 + LEFT * 0.7)
        hour_lbls = VGroup(*[
            Text(f"hour {i + 1}", font_size=24, color=pal["accent"],
                 weight="BOLD").next_to(chunks[i], DOWN, buff=0.2)
            for i in range(3)
        ])
        total = Text("180 miles total", font_size=24, color=pal["step"],
                     weight="BOLD").next_to(chunks, UP, buff=0.22)
        self.reveal(LaggedStart(*[FadeIn(c) for c in chunks], lag_ratio=0.25),
                    FadeIn(total), rt=1.8)
        self.reveal(FadeIn(hour_lbls, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        # Share the miles equally: 60 lands in every hour.
        div = Text("180 ÷ 3 = 60", font_size=34, color=YELLOW, weight="BOLD")
        div.move_to(DOWN * 0.75 + LEFT * 0.7)
        self.reveal(FadeIn(div, scale=1.15), rt=1.3)
        sixties = VGroup(*[
            Text("60", font_size=30, color=YELLOW, weight="BOLD")
            .move_to(chunks[i])
            for i in range(3)
        ])
        self.reveal(LaggedStart(*[FadeIn(s, scale=1.3) for s in sixties],
                                lag_ratio=0.3), rt=1.6)
        self.breathe(1.8)

        # Name the idea: that's a UNIT rate.
        unit = Text("60 miles per 1 hour  =  60 mph", font_size=30,
                    color=GREEN, weight="BOLD")
        unit.move_to(DOWN * 1.6 + LEFT * 0.7)
        ubox = SurroundingRectangle(unit, color=GREEN, buff=0.16,
                                    corner_radius=0.12)
        self.reveal(FadeIn(unit, shift=UP * 0.15), Create(ubox), rt=1.5)
        self.breathe(1.8)

        rule = Text("Unit rate: divide the total by the units",
                    font_size=26, color=pal["accent"], weight="BOLD")
        rule.move_to(DOWN * 2.55 + LEFT * 0.7)
        self.reveal(FadeIn(rule, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        # Cross-check beat: the three 60s really do rebuild the 180.
        self.reveal(LaggedStart(*[Indicate(s, color=GREEN, scale_factor=1.3)
                                  for s in sixties], lag_ratio=0.3), rt=2.0)
        self.breathe(1.8)

        return VGroup(head, chunks, hour_lbls, total, div, sixties, unit,
                      ubox, rule)

    def example(self):
        pal = self.pal
        q = Text(_wrap("Apples: 4 lbs for $10 or 6 lbs for $12. "
                       "Which is cheaper per lb?", 46),
                 font_size=28, color=pal["step"], weight="BOLD")
        q.move_to(UP * 1.95)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.8)

        # Two bags side by side.
        def bag(lbs, price, color):
            body = RoundedRectangle(width=2.3, height=1.5, corner_radius=0.18,
                                    stroke_color=color, stroke_width=4,
                                    fill_color=color, fill_opacity=0.15)
            lbl = Text(f"{lbs} lbs", font_size=28, color=color, weight="BOLD")
            pr = Text(price, font_size=26, color=pal["step"], weight="BOLD")
            inner = VGroup(lbl, pr).arrange(DOWN, buff=0.15).move_to(body)
            return VGroup(body, inner)

        bag_a = bag(4, "$10", ORANGE).move_to(LEFT * 3.6 + UP * 0.35)
        bag_b = bag(6, "$12", BLUE).move_to(LEFT * 0.6 + UP * 0.35)
        vs = Text("vs", font_size=28, color=pal["accent"], weight="BOLD")
        vs.move_to((bag_a.get_center() + bag_b.get_center()) / 2)
        self.reveal(FadeIn(bag_a, shift=RIGHT * 0.2), FadeIn(vs),
                    FadeIn(bag_b, shift=LEFT * 0.2), rt=1.6)
        self.breathe(1.8)

        steps = self.step_lines([
            ("$10 ÷ 4 = $2.50 per lb", ORANGE),
            ("$12 ÷ 6 = $2.00 per lb", BLUE),
            ("$2.00 is smaller — it wins!", GREEN),
        ], anchor=DOWN * 1.0 + LEFT * 2.9, size=28)
        self.breathe(1.6)

        # Crown the winner before the card lands.
        win = SurroundingRectangle(bag_b, color=GREEN, buff=0.12,
                                   corner_radius=0.15, stroke_width=5)
        self.reveal(Create(win), rt=1.3)
        self.breathe(1.6)

        ans = answer_card(self, "6 lbs for $12", pal["answer"], self.mascot,
                          pos=DOWN * 1.6 + RIGHT * 2.6)
        self.breathe(2.0)
        return VGroup(q, bag_a, bag_b, vs, win, steps, ans)
