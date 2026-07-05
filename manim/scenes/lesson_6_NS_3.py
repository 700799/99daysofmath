"""6.NS Unit 3 — GCF, LCM & distributing  (TeachingDeck)

Math (verified):
  • Factors of 12: 1, 2, 3, 4, 6, 12.  Factors of 18: 1, 2, 3, 6, 9, 18.
    Common: 1, 2, 3, 6 → GCF(12, 18) = 6. ✓
  • Multiples of 4: 4, 8, 12, 16…  Multiples of 6: 6, 12, 18…
    First shared multiple = 12 → LCM(4, 6) = 12. ✓
  • GCF(18, 24) = 6;  18 = 6·3, 24 = 6·4 → 18 + 24 = 6(3 + 4) = 6·7 = 42
    and 18 + 24 = 42. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


def chip(n, color, size=28, w=0.72):
    box = RoundedRectangle(width=w, height=0.56, corner_radius=0.14,
                           stroke_color=color, stroke_width=3,
                           fill_color=color, fill_opacity=0.12)
    t = Text(str(n), font_size=size, color=WHITE, weight="BOLD").move_to(box)
    return VGroup(box, t)


class Lesson6NS3(TeachingDeck):
    TITLE = "GCF, LCM & distributing"
    DOMAIN = "6.NS"
    HOOK = "12 hotdogs, 18 buns. Biggest equal packs with nothing left over?"
    RECAP = [
        "GCF: biggest number dividing BOTH",
        "LCM: smallest number both fit into",
        "Distribute: 18 + 24 = 6(3 + 4)",
    ]

    def concept(self):
        pal = self.pal
        # Factor chips for 12 and 18, common ones lighting up.
        lbl12 = Text("factors of 12:", font_size=26, color=BLUE, weight="BOLD")
        row12 = VGroup(*[chip(n, BLUE) for n in (1, 2, 3, 4, 6, 12)])
        row12.arrange(RIGHT, buff=0.22)
        lbl18 = Text("factors of 18:", font_size=26, color=ORANGE, weight="BOLD")
        row18 = VGroup(*[chip(n, ORANGE) for n in (1, 2, 3, 6, 9, 18)])
        row18.arrange(RIGHT, buff=0.22)
        r1 = VGroup(lbl12, row12).arrange(RIGHT, buff=0.4)
        r2 = VGroup(lbl18, row18).arrange(RIGHT, buff=0.4)
        rows = VGroup(r1, r2).arrange(DOWN, buff=0.5, aligned_edge=LEFT)
        rows.move_to(UP * 1.5 + LEFT * 0.8)

        self.reveal(FadeIn(lbl12), LaggedStart(*[GrowFromCenter(c) for c in row12],
                                               lag_ratio=0.15), rt=1.8)
        self.breathe(1.6)
        self.reveal(FadeIn(lbl18), LaggedStart(*[GrowFromCenter(c) for c in row18],
                                               lag_ratio=0.15), rt=1.8)
        self.breathe(1.6)

        # Highlight the shared factors 1, 2, 3, 6.
        shared12 = [row12[i] for i in (0, 1, 2, 4)]   # 1, 2, 3, 6
        shared18 = [row18[i] for i in (0, 1, 2, 3)]   # 1, 2, 3, 6
        rings = VGroup(*[SurroundingRectangle(c, color=YELLOW, buff=0.06,
                                              corner_radius=0.12)
                         for c in shared12 + shared18])
        note = Text("Shared factors: 1, 2, 3, 6", font_size=28,
                    color=YELLOW, weight="BOLD").move_to(UP * 0.15 + LEFT * 0.8)
        self.reveal(LaggedStart(*[Create(r) for r in rings], lag_ratio=0.12),
                    FadeIn(note, shift=UP * 0.15), rt=2.0)
        self.breathe(1.8)

        # The biggest shared one is the GCF.
        gcf = Text("Biggest shared = GCF = 6", font_size=32,
                   color=GREEN, weight="BOLD").next_to(note, DOWN, buff=0.35)
        glow6 = VGroup(SurroundingRectangle(shared12[3], color=GREEN, buff=0.1,
                                            corner_radius=0.14, stroke_width=6),
                       SurroundingRectangle(shared18[3], color=GREEN, buff=0.1,
                                            corner_radius=0.14, stroke_width=6))
        self.reveal(FadeIn(gcf, scale=1.15), Create(glow6[0]), Create(glow6[1]), rt=1.5)
        self.breathe(1.8)

        # Flip side: LCM — count UP by each number until the lists meet.
        m4 = Text("multiples of 4:  4, 8, 12, 16…", font_size=26,
                  color=BLUE, weight="BOLD")
        m6 = Text("multiples of 6:  6, 12, 18…", font_size=26,
                  color=ORANGE, weight="BOLD")
        ml = VGroup(m4, m6).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        ml.move_to(DOWN * 1.55 + LEFT * 2.2)
        self.reveal(FadeIn(m4, shift=UP * 0.15), FadeIn(m6, shift=UP * 0.15), rt=1.5)
        # ring the first shared multiple, 12.  m4 chars: "multiplesof4:4,8,12,16…"
        ring12a = SurroundingRectangle(VGroup(m4[17], m4[18]), color=GREEN,
                                       buff=0.08, corner_radius=0.1)
        ring12b = SurroundingRectangle(VGroup(m6[15], m6[16]), color=GREEN,
                                       buff=0.08, corner_radius=0.1)
        lcm = Text("first meet = LCM = 12", font_size=28, color=GREEN,
                   weight="BOLD").next_to(ml, RIGHT, buff=0.55)
        self.reveal(Create(ring12a), Create(ring12b),
                    FadeIn(lcm, shift=UP * 0.15), rt=1.5)
        self.breathe(2.0)

        return VGroup(rows, rings, note, gcf, glow6, ml, ring12a, ring12b, lcm)

    def example(self):
        pal = self.pal
        q = Text("Rewrite 18 + 24 using the GCF", font_size=32,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.0 + LEFT * 0.7)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # 18 and 24 drawn as blocks of 6 — the GCF made visible.
        def six_blocks(k, color):
            return VGroup(*[
                VGroup(Rectangle(width=0.95, height=0.6, stroke_color=color,
                                 stroke_width=3, fill_color=color, fill_opacity=0.2),
                       Text("6", font_size=26, color=WHITE, weight="BOLD"))
                for _ in range(k)
            ]).arrange(RIGHT, buff=0.14)

        b18 = six_blocks(3, BLUE)
        for cellb in b18:
            cellb[1].move_to(cellb[0])
        b24 = six_blocks(4, ORANGE)
        for cellb in b24:
            cellb[1].move_to(cellb[0])
        l18 = Text("18 =", font_size=28, color=BLUE, weight="BOLD")
        l24 = Text("24 =", font_size=28, color=ORANGE, weight="BOLD")
        g18 = VGroup(l18, b18).arrange(RIGHT, buff=0.35)
        e18 = Text("3 sixes", font_size=26, color=BLUE, weight="BOLD").next_to(b18, RIGHT, buff=0.35)
        g24 = VGroup(l24, b24).arrange(RIGHT, buff=0.35)
        e24 = Text("4 sixes", font_size=26, color=ORANGE, weight="BOLD").next_to(b24, RIGHT, buff=0.35)
        both = VGroup(VGroup(g18, e18), VGroup(g24, e24)).arrange(DOWN, buff=0.45, aligned_edge=LEFT)
        both.move_to(UP * 0.7 + LEFT * 1.6)

        self.reveal(FadeIn(l18), LaggedStart(*[GrowFromCenter(c) for c in b18],
                                             lag_ratio=0.2), FadeIn(e18), rt=1.8)
        self.breathe(1.6)
        self.reveal(FadeIn(l24), LaggedStart(*[GrowFromCenter(c) for c in b24],
                                             lag_ratio=0.2), FadeIn(e24), rt=1.8)
        self.breathe(1.8)

        steps = self.step_lines([
            ("GCF(18, 24) = 6", pal["step"]),
            ("18 = 6 × 3   and   24 = 6 × 4", pal["step"]),
            ("18 + 24 = 6 × (3 + 4) = 6 × 7 = 42 ✓", pal["step"]),
        ], anchor=DOWN * 0.9 + LEFT * 0.7, size=28)

        ans = answer_card(self, "18 + 24 = 6(3 + 4)", pal["answer"], self.mascot,
                          pos=DOWN * 2.55 + LEFT * 0.7)
        self.breathe(2.0)
        return VGroup(q, both, steps, ans)
