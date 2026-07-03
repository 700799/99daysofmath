"""6.RP Unit 2 — Unit rates  (TeachingDeck)

Math (verified):
  • 150 miles in 3 hours → 150 ÷ 3 = 50 miles each hour → 50 mph.
    Check: 50 + 50 + 50 = 150. ✓
  • 6 muffins cost $9 → $9 ÷ 6 = $1.50 per muffin.
    Check: 6 × $1.50 = $9.00. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


def muffin_row(n, r=0.3, buff=0.28):
    return VGroup(*[
        Circle(radius=r, color=GOLD, fill_color=GOLD, fill_opacity=0.8,
               stroke_width=3)
        for _ in range(n)
    ]).arrange(RIGHT, buff=buff)


class Lesson6RP2(TeachingDeck):
    TITLE = "Unit rates"
    DOMAIN = "6.RP"
    HOOK = "6 muffins cost $9. What does just ONE muffin cost?"
    RECAP = [
        "A unit rate is the amount for just 1",
        "Divide:  total ÷ how many",
        "$9 ÷ 6 muffins  =  $1.50 each",
    ]

    def concept(self):
        pal = self.pal
        intro = Text("A rate compares two DIFFERENT units",
                     font_size=28, color=pal["step"], weight="BOLD")
        intro.move_to(UP * 1.9)
        self.reveal(FadeIn(intro, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.6)

        # A road trip bar: 150 miles in 3 hours, cut into 3 equal hours.
        segs = VGroup(*[
            Rectangle(width=2.3, height=0.7, stroke_color=WHITE, stroke_width=3,
                      fill_color=BLUE, fill_opacity=0.35)
            for _ in range(3)
        ]).arrange(RIGHT, buff=0).move_to(UP * 0.55 + LEFT * 0.8)
        total = Text("150 miles in 3 hours", font_size=26, color=BLUE, weight="BOLD")
        total.next_to(segs, UP, buff=0.28)
        self.reveal(FadeIn(total), LaggedStart(*[Create(s) for s in segs], lag_ratio=0.25), rt=1.8)
        hlbls = VGroup(*[
            Text(f"hour {i + 1}", font_size=24, color=pal["accent"]).next_to(segs[i], DOWN, buff=0.18)
            for i in range(3)
        ])
        self.reveal(LaggedStart(*[FadeIn(h) for h in hlbls], lag_ratio=0.25), rt=1.4)
        self.breathe(1.6)

        # Share the 150 miles equally across the 3 hours.
        m50 = VGroup(*[
            Text("50 mi", font_size=26, color=YELLOW, weight="BOLD").move_to(segs[i])
            for i in range(3)
        ])
        self.reveal(LaggedStart(*[FadeIn(t, scale=1.25) for t in m50], lag_ratio=0.3), rt=1.6)
        divide = Text("150 ÷ 3 = 50 miles every hour", font_size=28,
                      color=pal["step"], weight="BOLD")
        divide.move_to(DOWN * 1.15 + LEFT * 0.8)
        self.reveal(FadeIn(divide, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        # Name the idea.
        unit = Text("Unit rate = the amount for exactly 1", font_size=30,
                    color=YELLOW, weight="BOLD")
        unit.move_to(DOWN * 2.05 + LEFT * 0.8)
        ubox = SurroundingRectangle(unit, color=YELLOW, buff=0.18, corner_radius=0.12)
        self.reveal(FadeIn(unit, shift=UP * 0.15), Create(ubox), rt=1.5)
        self.breathe(2.0)

        say = Text("say it: “50 mph” — 50 miles per 1 hour", font_size=26,
                   color=pal["accent"], weight="BOLD")
        say.next_to(ubox, DOWN, buff=0.25)
        self.reveal(FadeIn(say, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(intro, segs, total, hlbls, m50, divide, unit, ubox, say)

    def example(self):
        pal = self.pal
        q = Text("6 muffins cost $9. Cost per muffin?", font_size=30,
                 color=pal["step"], weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        muffins = muffin_row(6).move_to(UP * 0.9 + LEFT * 1.4)
        tag = Text("$9 total", font_size=28, color=GREEN, weight="BOLD")
        tag.next_to(muffins, RIGHT, buff=0.5)
        self.reveal(LaggedStart(*[GrowFromCenter(m) for m in muffins], lag_ratio=0.15),
                    FadeIn(tag), rt=1.8)
        self.breathe(1.6)

        # Spotlight ONE muffin — that's the "unit".
        ring = SurroundingRectangle(muffins[0], color=YELLOW, buff=0.1, corner_radius=0.12)
        one = Text("just 1 = ?", font_size=26, color=YELLOW, weight="BOLD")
        one.next_to(muffins, UP, buff=0.3).align_to(muffins[0], LEFT)
        self.reveal(Create(ring), FadeIn(one, shift=DOWN * 0.15), rt=1.4)
        self.breathe(1.8)

        steps = self.step_lines([
            ("per muffin → money ÷ muffins", pal["accent"]),
            ("$9 ÷ 6 = $1.50", WHITE),
        ], anchor=DOWN * 0.6, size=30)
        check = Text("check: 6 × $1.50 = $9 ✓", font_size=26, color=GREEN, weight="BOLD")
        check.next_to(steps, DOWN, buff=0.3)
        self.reveal(FadeIn(check, shift=UP * 0.15), rt=1.2)
        self.breathe(1.6)

        ans = answer_card(self, "$1.50 per muffin", pal["answer"], self.mascot,
                          pos=DOWN * 2.85)
        self.breathe(2.0)
        return VGroup(q, muffins, tag, ring, one, steps, check, ans)
