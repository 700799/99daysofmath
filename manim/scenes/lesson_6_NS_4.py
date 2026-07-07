"""6.NS Unit 4 — Integers & absolute value  (TeachingDeck)

Math (verified):
  • Negatives sit LEFT of 0 on the number line; bigger is always to the right.
  • |x| = distance from 0, never negative: |−7| = 7 and |7| = 7.
  • Diver at −30 ft, kite at +12 ft: |−30| = 30, |12| = 12, 30 > 12 → the
    diver is farther from sea level (0).
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


class Lesson6NS4(TeachingDeck):
    TITLE = "Integers & absolute value"
    DOMAIN = "6.NS"
    HOOK = "A diver is at −30 ft, a kite at +12 ft. Who is farther from sea level?"
    RECAP = [
        "Negatives live LEFT of 0",
        "|x| = distance from 0",
        "Distance is NEVER negative",
    ]

    def concept(self):
        pal = self.pal

        # 1 · The number line — home of the integers.
        nl = NumberLine(x_range=[-8, 8, 1], length=10.6, include_numbers=True,
                        label_direction=DOWN, font_size=24, color=GREY_B)
        nl.move_to(UP * 1.2 + LEFT * 0.7)
        self.reveal(Create(nl), rt=1.8)
        self.breathe(1.6)

        # 2 · Direction: right = bigger, left = smaller.
        r_arrow = Arrow(nl.n2p(0.5) + UP * 0.5, nl.n2p(6.5) + UP * 0.5,
                        color=GREEN, buff=0, stroke_width=5)
        r_lbl = Text("bigger", font_size=24, color=GREEN, weight="BOLD")
        r_lbl.next_to(r_arrow, UP, buff=0.12)
        l_arrow = Arrow(nl.n2p(-0.5) + UP * 0.5, nl.n2p(-6.5) + UP * 0.5,
                        color=BLUE, buff=0, stroke_width=5)
        l_lbl = Text("smaller", font_size=24, color=BLUE, weight="BOLD")
        l_lbl.next_to(l_arrow, UP, buff=0.12)
        self.reveal(GrowArrow(r_arrow), FadeIn(r_lbl),
                    GrowArrow(l_arrow), FadeIn(l_lbl), rt=1.5)
        self.breathe(1.8)

        # 3 · What a negative MEANS: owing money, below sea level.
        d3 = Dot(nl.n2p(-3), color=BLUE, radius=0.12)
        cap = Text("−3 means BELOW zero — like owing $3",
                   font_size=28, color=BLUE, weight="BOLD").move_to(DOWN * 0.25 + LEFT * 0.7)
        self.reveal(FadeIn(d3, scale=1.4), FadeIn(cap, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        # Clear the direction furniture to make room for the distance story.
        self.reveal(FadeOut(r_arrow), FadeOut(r_lbl), FadeOut(l_arrow),
                    FadeOut(l_lbl), FadeOut(d3), FadeOut(cap), rt=1.2)

        # 4 · Absolute value = distance from 0. Walk from −7 to 0.
        d_neg = Dot(nl.n2p(-7), color=ORANGE, radius=0.12)
        a_neg = Arrow(nl.n2p(-7) + UP * 0.4, nl.n2p(0) + UP * 0.4,
                      color=YELLOW, buff=0, stroke_width=5)
        n_lbl = Text("7 steps", font_size=24, color=YELLOW, weight="BOLD")
        n_lbl.next_to(a_neg, UP, buff=0.12)
        self.reveal(FadeIn(d_neg, scale=1.4), GrowArrow(a_neg), FadeIn(n_lbl), rt=1.6)
        self.breathe(1.6)

        # 5 · Mirror side: +7 is ALSO 7 steps from 0.
        d_pos = Dot(nl.n2p(7), color=GREEN, radius=0.12)
        a_pos = Arrow(nl.n2p(7) + UP * 0.4, nl.n2p(0) + UP * 0.4,
                      color=GREEN, buff=0, stroke_width=5)
        p_lbl = Text("7 steps too!", font_size=24, color=GREEN, weight="BOLD")
        p_lbl.next_to(a_pos, UP, buff=0.12)
        self.reveal(FadeIn(d_pos, scale=1.4), GrowArrow(a_pos), FadeIn(p_lbl), rt=1.5)
        self.breathe(1.6)

        # 6 · The notation, big and side by side.
        eq_n = Text("|−7| = 7", font_size=40, color=ORANGE, weight="BOLD")
        eq_p = Text("|7| = 7", font_size=40, color=GREEN, weight="BOLD")
        eqs = VGroup(eq_n, eq_p).arrange(RIGHT, buff=1.2).move_to(DOWN * 1.1 + LEFT * 0.7)
        self.reveal(FadeIn(eq_n, scale=1.15), FadeIn(eq_p, scale=1.15), rt=1.4)
        self.breathe(1.8)

        rule = Text(_wrap("Absolute value is distance from 0 — never negative!", 44),
                    font_size=28, color=GOLD, weight="BOLD").move_to(DOWN * 2.2 + LEFT * 0.7)
        self.reveal(FadeIn(rule, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(nl, d_neg, a_neg, n_lbl, d_pos, a_pos, p_lbl, eqs, rule)

    def example(self):
        pal = self.pal
        q = Text(_wrap("Diver at −30 ft, kite at +12 ft — who is farther from 0?", 40),
                 font_size=28, color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.15 + LEFT * 0.8)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # Sea-level picture: a vertical scale, kite up, diver down.
        x0 = -4.8

        def y_at(v):
            return 0.7 + v * 0.075

        pole = Line([x0, y_at(-32), 0], [x0, y_at(14), 0],
                    color=GREY_B, stroke_width=4)
        sea = DashedLine([x0 - 1.5, y_at(0), 0], [x0 + 1.5, y_at(0), 0],
                         color=BLUE, stroke_width=4)
        sea_lbl = Text("sea level 0", font_size=24, color=BLUE, weight="BOLD")
        sea_lbl.next_to(sea, UP, buff=0.1).align_to(sea, LEFT)
        self.reveal(Create(pole), Create(sea), FadeIn(sea_lbl), rt=1.5)
        self.breathe(1.6)

        kite = Dot([x0, y_at(12), 0], color=GREEN, radius=0.12)
        kite_lbl = Text("kite +12", font_size=24, color=GREEN, weight="BOLD")
        kite_lbl.next_to(kite, RIGHT, buff=0.25)
        diver = Dot([x0, y_at(-30), 0], color=ORANGE, radius=0.12)
        diver_lbl = Text("diver −30", font_size=24, color=ORANGE, weight="BOLD")
        diver_lbl.next_to(diver, RIGHT, buff=0.25)
        self.reveal(FadeIn(kite, scale=1.4), FadeIn(kite_lbl),
                    FadeIn(diver, scale=1.4), FadeIn(diver_lbl), rt=1.5)
        self.breathe(1.6)

        up_arrow = Arrow([x0 - 0.7, y_at(0), 0], [x0 - 0.7, y_at(12), 0],
                         color=GREEN, buff=0, stroke_width=5)
        up_num = Text("12", font_size=24, color=GREEN, weight="BOLD")
        up_num.next_to(up_arrow, LEFT, buff=0.12)
        dn_arrow = Arrow([x0 - 0.7, y_at(0), 0], [x0 - 0.7, y_at(-30), 0],
                         color=ORANGE, buff=0, stroke_width=5)
        dn_num = Text("30", font_size=24, color=ORANGE, weight="BOLD")
        dn_num.next_to(dn_arrow, LEFT, buff=0.12)
        self.reveal(GrowArrow(up_arrow), FadeIn(up_num),
                    GrowArrow(dn_arrow), FadeIn(dn_num), rt=1.5)
        self.breathe(1.8)

        steps = self.step_lines([
            ("Distance from 0 is what counts", pal["step"]),
            ("|−30| = 30      |12| = 12", YELLOW),
            ("30 > 12", pal["step"]),
        ], anchor=RIGHT * 1.2 + UP * 0.9, size=28)

        ans = answer_card(self, "Farther: the diver!", pal["answer"], self.mascot,
                          pos=DOWN * 2.15 + RIGHT * 0.9)
        self.breathe(2.0)
        return VGroup(q, pole, sea, sea_lbl, kite, kite_lbl, diver, diver_lbl,
                      up_arrow, up_num, dn_arrow, dn_num, steps, ans)
