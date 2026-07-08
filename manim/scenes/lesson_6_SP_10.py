"""6.SP Unit 10 — Summarizing data sets  (TeachingDeck)

Math (verified):
  • Mean of {10,20,30,40,50}: sum 150, count 5, 150÷5=30.
  • Median of {3,7,1,9,5}: sorted 1,3,5,7,9, middle=5.
  • Range of {12,5,18,7,20}: max 20, min 5, 20−5=15.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6SP10(TeachingDeck):
    TITLE = "Summarizing data sets"
    DOMAIN = "6.SP"
    HOOK = "Given a messy list of numbers, what THREE things tell the whole story?"
    RECAP = [
        "Center: mean or median",
        "Spread: range = max − min",
        "Outliers pull the MEAN, not the median",
    ]

    def concept(self):
        pal = self.pal
        data = Text("{3, 7, 1, 9, 5}", font_size=34, color=YELLOW, weight="BOLD").move_to(UP * 2.1)
        self.reveal(FadeIn(data), rt=1.3)
        self.breathe(1.4)

        unsorted = VGroup(*[Text(str(v), font_size=34, weight="BOLD", color=BLUE) for v in [3, 7, 1, 9, 5]])
        unsorted.arrange(RIGHT, buff=0.6).move_to(UP * 1.0)
        self.reveal(LaggedStart(*[FadeIn(n, scale=1.2) for n in unsorted], lag_ratio=0.2), rt=1.5)
        self.breathe(1.4)

        sorted_vals = [1, 3, 5, 7, 9]
        sorted_grp = VGroup(*[Text(str(v), font_size=34, weight="BOLD",
                                   color=GREEN if v == 5 else BLUE) for v in sorted_vals])
        sorted_grp.arrange(RIGHT, buff=0.6).move_to(DOWN * 0.2)
        self.reveal(Transform(unsorted.copy(), sorted_grp), rt=1.6)
        ring = SurroundingRectangle(sorted_grp[2], color=GREEN, buff=0.15, corner_radius=0.1)
        self.reveal(Create(ring), rt=1.3)
        cap = Text("Sort first → middle = median = 5", font_size=26, color=GREEN,
                   weight="BOLD").move_to(DOWN * 1.6)
        self.reveal(FadeIn(cap, shift=UP * 0.15), rt=1.4)
        self.breathe(2.0)

        return VGroup(data, unsorted, sorted_grp, ring, cap)

    def example(self):
        pal = self.pal
        q = Text("Range of {12, 5, 18, 7, 20}?", font_size=32, color=pal["accent"], weight="BOLD").move_to(UP * 2.2)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        steps = self.step_lines([
            ("Max 20, min 5.", pal["step"]),
        ], anchor=UP * 0.6, size=28, gap=0.4)

        ans = answer_card(self, "20 − 5 = 15", pal["answer"], self.mascot, pos=DOWN * 1.3)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
