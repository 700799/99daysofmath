"""6.SP Unit 2 — Choosing a center  (TeachingDeck)

Math (verified):
  • Data 2, 3, 4, 100: Mean = (2+3+4+100)/4 = 109/4 = 27.25.
    Median (sorted 2,3,4,100) = average of middle two = (3+4)/2 = 3.5.
    100 is an outlier that pulls the mean way up; median is more typical.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6SP2(TeachingDeck):
    TITLE = "Choosing a center"
    DOMAIN = "6.SP"
    HOOK = "Salaries: $30k, $32k, $35k, $200k. Which number tells you what's 'typical' here?"
    RECAP = [
        "Mean uses every value — outliers pull it",
        "Median resists outliers",
        "Lopsided data → median is more typical",
    ]

    def concept(self):
        pal = self.pal
        data = Text("Data: 2, 3, 4, 100", font_size=32, color=YELLOW, weight="BOLD").move_to(UP * 2.1)
        self.reveal(FadeIn(data), rt=1.3)
        self.breathe(1.6)

        nl = NumberLine(x_range=[0, 100, 25], length=9.5, color=GREY_B,
                        include_numbers=True, font_size=20)
        nl.move_to(UP * 0.6)
        self.reveal(Create(nl), rt=1.5)
        dots = VGroup(*[Dot(nl.n2p(v), color=BLUE if v != 100 else RED, radius=0.12) for v in [2, 3, 4, 100]])
        self.reveal(LaggedStart(*[FadeIn(d, scale=1.4) for d in dots], lag_ratio=0.2), rt=1.5)
        out_lbl = Text("outlier!", font_size=22, color=RED, weight="BOLD").next_to(dots[3], DOWN, buff=0.2)
        self.reveal(FadeIn(out_lbl), rt=1.2)
        self.breathe(1.6)

        mean_t = Text("Mean = 27.25 (pulled up by 100)", font_size=26, color=ORANGE,
                      weight="BOLD").move_to(DOWN * 1.1)
        med_t = Text("Median = 3.5 (ignores the outlier)", font_size=26, color=GREEN,
                     weight="BOLD").move_to(DOWN * 1.9)
        self.reveal(FadeIn(mean_t, shift=UP * 0.15), rt=1.4)
        self.breathe(1.4)
        self.reveal(FadeIn(med_t, shift=UP * 0.15), rt=1.4)
        self.breathe(1.8)

        return VGroup(data, nl, dots, out_lbl, mean_t, med_t)

    def example(self):
        pal = self.pal
        q = Text("Data 2, 3, 4, 100 — which center is more typical?", font_size=27,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.3)
        self.breathe(1.8)

        steps = self.step_lines([
            ("Mean = 27.25 (pulled up by 100)", ORANGE),
            ("Median = 3.5", GREEN),
        ], anchor=UP * 0.6, size=28, gap=0.4)

        ans = answer_card(self, "median", pal["answer"], self.mascot, pos=DOWN * 1.9)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
