"""6.RP Unit 4 — Part-to-part vs part-to-whole  (TeachingDeck)

Math (verified):
  • 3 boys + 2 girls → whole class = 3 + 2 = 5.
    Part-to-part: boys : girls = 3 : 2.  Part-to-whole: boys : class = 3 : 5.
  • 4 apples + 6 pears → all fruit = 4 + 6 = 10.
    Apples : whole = 4 : 10; GCF(4, 10) = 2 → 4÷2 : 10÷2 = 2 : 5. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


def dot_row(n, color, r=0.3, buff=0.26):
    return VGroup(*[
        Circle(radius=r, color=color, fill_color=color, fill_opacity=0.85,
               stroke_width=3)
        for _ in range(n)
    ]).arrange(RIGHT, buff=buff)


class Lesson6RP4(TeachingDeck):
    TITLE = "Part-to-part vs part-to-whole"
    DOMAIN = "6.RP"
    HOOK = "3 boys, 2 girls. Boys to girls is 3:2 — but boys to the WHOLE class?"
    RECAP = [
        "Part-to-part: group vs group  (3 : 2)",
        "Part-to-whole: group vs total  (3 : 5)",
        "Add the parts FIRST to get the whole",
    ]

    def concept(self):
        pal = self.pal
        # The class: 3 boys, 2 girls, side by side.
        boys = dot_row(3, BLUE)
        girls = dot_row(2, ORANGE)
        kids = VGroup(boys, girls).arrange(RIGHT, buff=0.75).move_to(UP * 1.55 + LEFT * 1.6)
        b_lbl = Text("3 boys", font_size=25, color=BLUE, weight="BOLD")
        b_lbl.next_to(boys, UP, buff=0.25)
        g_lbl = Text("2 girls", font_size=25, color=ORANGE, weight="BOLD")
        g_lbl.next_to(girls, UP, buff=0.25)
        self.reveal(LaggedStart(*[GrowFromCenter(c) for c in boys], lag_ratio=0.2),
                    FadeIn(b_lbl), rt=1.6)
        self.reveal(LaggedStart(*[GrowFromCenter(c) for c in girls], lag_ratio=0.2),
                    FadeIn(g_lbl), rt=1.4)
        self.breathe(1.6)

        # Ratio #1: part-to-part — one group against the other.
        pp = Text("part-to-part   boys : girls = 3 : 2", font_size=29,
                  color=pal["step"], weight="BOLD")
        pp.move_to(UP * 0.35 + LEFT * 1.0)
        pp_tag = Text("group vs group", font_size=24, color=pal["accent"])
        pp_tag.next_to(pp, DOWN, buff=0.18)
        self.reveal(FadeIn(pp, shift=UP * 0.15), FadeIn(pp_tag), rt=1.4)
        self.breathe(2.0)

        # Now hug the WHOLE class in one box.
        wbox = SurroundingRectangle(VGroup(kids, b_lbl, g_lbl), color=YELLOW,
                                    buff=0.22, corner_radius=0.15)
        w_lbl = Text("the whole = 3 + 2 = 5", font_size=26, color=YELLOW, weight="BOLD")
        w_lbl.next_to(wbox, RIGHT, buff=0.4)
        self.reveal(Create(wbox), FadeIn(w_lbl, shift=LEFT * 0.2), rt=1.6)
        self.breathe(1.8)

        # Ratio #2: part-to-whole — one group against everyone.
        pw = Text("part-to-whole   boys : class = 3 : 5", font_size=29,
                  color=GREEN, weight="BOLD")
        pw.move_to(DOWN * 1.15 + LEFT * 1.0)
        pw_tag = Text("group vs EVERYONE", font_size=24, color=pal["accent"])
        pw_tag.next_to(pw, DOWN, buff=0.18)
        self.reveal(FadeIn(pw, shift=UP * 0.15), FadeIn(pw_tag), rt=1.4)
        self.breathe(2.0)

        warn = Text("Same class, two different ratios — read carefully!",
                    font_size=26, color=YELLOW, weight="BOLD")
        warn.move_to(DOWN * 2.35 + LEFT * 0.7)
        self.reveal(FadeIn(warn, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(kids, b_lbl, g_lbl, pp, pp_tag, wbox, w_lbl, pw, pw_tag, warn)

    def example(self):
        pal = self.pal
        q = Text("4 apples, 6 pears. Apples to ALL the fruit?", font_size=30,
                 color=pal["step"], weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        apples = dot_row(4, RED, r=0.26, buff=0.22)
        pears = dot_row(6, GREEN, r=0.26, buff=0.22)
        fruit = VGroup(apples, pears).arrange(RIGHT, buff=0.7).move_to(UP * 0.85 + LEFT * 1.2)
        self.reveal(LaggedStart(*[GrowFromCenter(c) for c in fruit[0]], lag_ratio=0.15),
                    LaggedStart(*[GrowFromCenter(c) for c in fruit[1]], lag_ratio=0.15), rt=1.8)
        wbox = SurroundingRectangle(fruit, color=YELLOW, buff=0.2, corner_radius=0.15)
        w_lbl = Text("count EVERYTHING", font_size=24, color=YELLOW, weight="BOLD")
        w_lbl.next_to(wbox, UP, buff=0.18).shift(RIGHT * 2.0)
        self.reveal(Create(wbox), FadeIn(w_lbl), rt=1.5)
        self.breathe(1.8)

        steps = self.step_lines([
            ("whole = 4 + 6 = 10 fruits", pal["accent"]),
            ("apples : whole = 4 : 10  →  ÷2  →  2 : 5", WHITE),
        ], anchor=DOWN * 0.7, size=29)
        self.breathe(1.6)

        ans = answer_card(self, "apples : fruit = 2 : 5", pal["answer"], self.mascot,
                          pos=DOWN * 2.8)
        self.breathe(2.0)
        return VGroup(q, fruit, wbox, w_lbl, steps, ans)
