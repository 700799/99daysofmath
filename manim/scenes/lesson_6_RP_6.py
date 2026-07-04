"""6.RP Unit 6 — Converting with rates  (TeachingDeck)

Math (verified):
  • 1 foot = 12 inches (the conversion rate: 12 inches per 1 foot).
  • 3 feet → inches: 3 × 12 = 36 inches. Check: 12 + 12 + 12 = 36. ✓
  • Sense check: inches are SMALLER than feet, so you get MORE of them
    (36 > 3). ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


def foot_bar(width=4.4, height=0.55):
    """A 1-foot ruler bar with 12 inch ticks."""
    bar = Rectangle(width=width, height=height, stroke_color=WHITE, stroke_width=3,
                    fill_color=GREEN, fill_opacity=0.25)
    ticks = VGroup(*[
        Line(UP * height / 2, UP * height / 2 + DOWN * 0.18, stroke_width=2, color=WHITE)
        .move_to(bar.get_left() + RIGHT * (i * width / 12), aligned_edge=UP)
        .align_to(bar, UP)
        for i in range(1, 12)
    ])
    return VGroup(bar, ticks)


class Lesson6RP6(TeachingDeck):
    TITLE = "Converting with rates"
    DOMAIN = "6.RP"
    HOOK = "Your desk is 3 feet wide, but the tape only shows inches. Now what?"
    RECAP = [
        "A conversion is a rate: 12 in per 1 ft",
        "Multiply so the old unit cancels out",
        "Smaller units → expect a BIGGER count",
    ]

    def concept(self):
        pal = self.pal
        intro = Text("A conversion is just a rate", font_size=29,
                     color=pal["step"], weight="BOLD")
        intro.move_to(UP * 1.95)
        self.reveal(FadeIn(intro, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.6)

        # One foot, sliced into 12 inches.
        ruler = foot_bar().move_to(UP * 0.75 + LEFT * 1.6)
        f_lbl = Text("1 foot", font_size=26, color=GREEN, weight="BOLD")
        f_lbl.next_to(ruler, UP, buff=0.22)
        self.reveal(Create(ruler[0]), FadeIn(f_lbl), rt=1.4)
        self.reveal(LaggedStart(*[Create(t) for t in ruler[1]], lag_ratio=0.08), rt=1.8)
        i_lbl = Text("= 12 inches", font_size=26, color=YELLOW, weight="BOLD")
        i_lbl.next_to(ruler, RIGHT, buff=0.4)
        self.reveal(FadeIn(i_lbl, shift=LEFT * 0.2), rt=1.2)
        self.breathe(1.8)

        rate = Text("the rate:  12 inches per 1 foot", font_size=29,
                    color=pal["accent"], weight="BOLD")
        rate.move_to(DOWN * 0.35 + LEFT * 1.0)
        self.reveal(FadeIn(rate, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        # Multiply so the unwanted unit cancels.
        expr = Text("3 ft  ×  12 in per ft  =  36 in", font_size=30,
                    color=pal["step"], weight="BOLD")
        expr.move_to(DOWN * 1.3 + LEFT * 1.0)
        self.reveal(FadeIn(expr, shift=UP * 0.15), rt=1.3)
        cancel = Text("“ft” cancels — only inches are left!", font_size=26,
                      color=YELLOW, weight="BOLD")
        cancel.next_to(expr, DOWN, buff=0.3)
        self.reveal(FadeIn(cancel, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        sense = Text("Sense check: inches are smaller → MORE of them",
                     font_size=25, color=GREEN, weight="BOLD")
        sense.move_to(DOWN * 2.5 + LEFT * 0.8)
        self.reveal(FadeIn(sense, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(intro, ruler, f_lbl, i_lbl, rate, expr, cancel, sense)

    def example(self):
        pal = self.pal
        q = Text("How many inches are in 3 feet?", font_size=31,
                 color=pal["step"], weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # Three foot-bars appear one by one, each worth 12 inches.
        bars = VGroup(*[foot_bar(width=3.4, height=0.5) for _ in range(3)])
        bars.arrange(DOWN, buff=0.32).move_to(UP * 0.55 + LEFT * 2.6)
        tags = VGroup(*[
            Text("12 in", font_size=25, color=YELLOW, weight="BOLD")
            .next_to(bars[i], RIGHT, buff=0.35)
            for i in range(3)
        ])
        running = ["12", "24", "36"]
        runs = VGroup(*[
            Text(running[i], font_size=25, color=GREEN, weight="BOLD")
            .next_to(tags[i], RIGHT, buff=0.6)
            for i in range(3)
        ])
        r_head = Text("running total", font_size=24, color=GREEN)
        r_head.next_to(runs[0], UP, buff=0.35)
        for i in range(3):
            anims = [FadeIn(bars[i], shift=RIGHT * 0.2), FadeIn(tags[i])]
            if i == 0:
                anims.append(FadeIn(r_head))
            anims.append(FadeIn(runs[i], scale=1.2))
            self.reveal(*anims, rt=1.4)
        self.breathe(1.8)

        steps = self.step_lines([
            ("1 foot = 12 inches", pal["accent"]),
            ("3 × 12 = 36", WHITE),
        ], anchor=DOWN * 1.35, size=30)
        self.breathe(1.6)

        ans = answer_card(self, "3 feet = 36 inches", pal["answer"], self.mascot,
                          pos=DOWN * 2.8)
        self.breathe(2.0)
        return VGroup(q, bars, tags, runs, r_head, steps, ans)
