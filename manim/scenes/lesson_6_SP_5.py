"""6.SP Unit 5 — Describing a distribution  (TeachingDeck)

Math (verified):
  • Scores 78, 80, 82, 85, 30: the 30 sits far from the cluster near 80 → outlier.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6SP5(TeachingDeck):
    TITLE = "Describing a distribution"
    DOMAIN = "6.SP"
    HOOK = "Most test scores cluster near 80. One kid scored 30. How do you describe THAT?"
    RECAP = [
        "Mention center, spread, and shape",
        "Note any outliers or clusters",
        "Tie it back to the question",
    ]

    def concept(self):
        pal = self.pal
        data = Text("Scores: 78, 80, 82, 85, 30", font_size=28, color=YELLOW, weight="BOLD").move_to(UP * 2.1)
        self.reveal(FadeIn(data), rt=1.3)
        self.breathe(1.4)

        nl = NumberLine(x_range=[20, 100, 10], length=9.5, color=GREY_B,
                        include_numbers=True, font_size=18)
        nl.move_to(UP * 0.4)
        self.reveal(Create(nl), rt=1.4)
        cluster = VGroup(*[Dot(nl.n2p(v), color=BLUE, radius=0.12) for v in [78, 80, 82, 85]])
        self.reveal(LaggedStart(*[FadeIn(d, scale=1.4) for d in cluster], lag_ratio=0.2), rt=1.5)
        self.breathe(1.4)

        outlier = Dot(nl.n2p(30), color=RED, radius=0.15)
        self.reveal(FadeIn(outlier, scale=1.5), rt=1.3)
        out_lbl = Text("← outlier", font_size=24, color=RED, weight="BOLD").next_to(outlier, DOWN, buff=0.3)
        clus_lbl = Text("cluster near 80", font_size=24, color=BLUE, weight="BOLD").next_to(cluster, DOWN, buff=0.4)
        self.reveal(FadeIn(out_lbl), FadeIn(clus_lbl), rt=1.4)
        self.breathe(1.8)

        cap = Text("A value far from the rest = an outlier", font_size=26, color=pal["accent"],
                   weight="BOLD").move_to(DOWN * 2.2)
        self.reveal(FadeIn(cap, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(data, nl, cluster, outlier, out_lbl, clus_lbl, cap)

    def example(self):
        pal = self.pal
        q = Text("Scores cluster near 80 with one 30. The 30 is a what?", font_size=27,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("it sits far from the rest", pal["step"]),
        ], anchor=UP * 0.6, size=28, gap=0.4)

        ans = answer_card(self, "an outlier", pal["answer"], self.mascot, pos=DOWN * 1.3)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
