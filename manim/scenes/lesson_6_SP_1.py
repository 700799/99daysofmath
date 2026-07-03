"""6.SP Unit 1 — Mean, median & mode  (TeachingDeck)

Math (verified):
  • Mean of 4, 6, 8:  4 + 6 + 8 = 18;  18 ÷ 3 = 6.
    Leveling bars 4, 6, 8 → three bars of 6 keeps the total 18 (6×3 = 18).
  • Median of 3, 7, 5:  sorted → 3, 5, 7;  middle value = 5.
  • Mode of 2, 4, 4, 9:  4 appears twice, every other value once → mode = 4.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


BAR_UNIT = 0.28


def bar_at(x, h, base_y, color):
    bar = Rectangle(width=0.7, height=h * BAR_UNIT, stroke_color=color,
                    stroke_width=3, fill_color=color, fill_opacity=0.55)
    bar.move_to([x, base_y + h * BAR_UNIT / 2, 0])
    return bar


class Lesson6SP1(TeachingDeck):
    TITLE = "Mean, median & mode"
    DOMAIN = "6.SP"
    HOOK = "You scored 4, 6 and 8 goals. What ONE number sums up your scoring?"
    RECAP = [
        "Mean = sum ÷ how many",
        "Median = middle of the SORTED list",
        "Mode = the value seen most often",
    ]

    def concept(self):
        pal = self.pal
        base_y = -1.9

        # ── MEAN: bars 4, 6, 8 level out to 6 ──
        head_m = Text("MEAN: share it out evenly", font_size=26,
                      color=YELLOW, weight="BOLD").move_to([-3.7, 1.5, 0])
        xs = [-5.0, -3.9, -2.8]
        heights = [4, 6, 8]
        bars = VGroup(*[bar_at(x, h, base_y, BLUE) for x, h in zip(xs, heights)])
        labels = VGroup(*[
            Text(str(h), font_size=26, color=WHITE, weight="BOLD").next_to(b, UP, buff=0.12)
            for b, h in zip(bars, heights)
        ])
        floor = Line([-5.7, base_y, 0], [-2.1, base_y, 0], color=WHITE, stroke_width=3)
        self.reveal(FadeIn(head_m, shift=DOWN * 0.15), Create(floor), rt=1.3)
        self.reveal(LaggedStart(*[GrowFromEdge(b, DOWN) for b in bars], lag_ratio=0.25),
                    FadeIn(labels), rt=1.8)
        self.breathe(1.8)

        level_bars = VGroup(*[bar_at(x, 6, base_y, GREEN) for x in xs])
        level_labels = VGroup(*[
            Text("6", font_size=26, color=WHITE, weight="BOLD").next_to(b, UP, buff=0.12)
            for b in level_bars
        ])
        mean_line = DashedLine([-5.8, base_y + 6 * BAR_UNIT, 0],
                               [-2.0, base_y + 6 * BAR_UNIT, 0],
                               color=GREEN, stroke_width=4)
        mean_tag = Text("mean = 6", font_size=26, color=GREEN, weight="BOLD")
        mean_tag.next_to(mean_line, UP, buff=0.12).shift(RIGHT * 0.4)
        self.reveal(Transform(bars, level_bars), Transform(labels, level_labels), rt=1.6)
        self.reveal(Create(mean_line), FadeIn(mean_tag), rt=1.3)
        arith = Text("4 + 6 + 8 = 18   →   18 ÷ 3 = 6", font_size=24,
                     color=pal["step"], weight="BOLD").move_to([-3.8, -2.5, 0])
        self.reveal(FadeIn(arith, shift=UP * 0.15), rt=1.2)
        self.breathe(2.0)

        # ── MEDIAN: 3, 7, 5 sort themselves, the middle wins ──
        head_md = Text("MEDIAN: sort, take the middle", font_size=26,
                       color=GREEN, weight="BOLD").move_to([2.0, 1.5, 0])
        md_xs = [0.7, 2.0, 3.3]
        md_vals = [3, 7, 5]
        md = VGroup(*[
            VGroup(Circle(radius=0.36, color=BLUE, fill_color=BLUE, fill_opacity=0.35,
                          stroke_width=3),
                   Text(str(v), font_size=28, color=WHITE, weight="BOLD"))
            .move_to([x, 0.7, 0])
            for x, v in zip(md_xs, md_vals)
        ])
        self.reveal(FadeIn(head_md, shift=DOWN * 0.15),
                    LaggedStart(*[GrowFromCenter(c) for c in md], lag_ratio=0.25), rt=1.6)
        self.breathe(1.6)
        # sort: 7 and 5 swap places (3, 5, 7)
        self.reveal(md[1].animate.move_to([3.3, 0.7, 0]),
                    md[2].animate.move_to([2.0, 0.7, 0]), rt=1.5)
        ring = SurroundingRectangle(md[2], color=YELLOW, buff=0.1, corner_radius=0.12)
        md_tag = Text("median = 5", font_size=26, color=GREEN, weight="BOLD")
        md_tag.move_to([2.0, -0.15, 0])
        self.reveal(Create(ring), FadeIn(md_tag, shift=UP * 0.15), rt=1.3)
        self.breathe(1.8)

        # ── MODE: 2, 4, 4, 9 — the repeat wins ──
        head_mo = Text("MODE: seen most often", font_size=26,
                       color=ORANGE, weight="BOLD").move_to([2.0, -1.1, 0])
        mo_vals = ["2", "4", "4", "9"]
        mo = VGroup(*[Text(v, font_size=32, color=WHITE, weight="BOLD") for v in mo_vals])
        mo.arrange(RIGHT, buff=0.55).move_to([2.0, -1.8, 0])
        self.reveal(FadeIn(head_mo, shift=DOWN * 0.15), FadeIn(mo), rt=1.3)
        boxes = VGroup(SurroundingRectangle(mo[1], color=ORANGE, buff=0.1, corner_radius=0.1),
                       SurroundingRectangle(mo[2], color=ORANGE, buff=0.1, corner_radius=0.1))
        mo_tag = Text("mode = 4", font_size=26, color=ORANGE, weight="BOLD")
        mo_tag.move_to([2.0, -2.55, 0])
        self.reveal(Create(boxes[0]), Create(boxes[1]), FadeIn(mo_tag, shift=UP * 0.15), rt=1.4)
        self.breathe(2.2)

        return VGroup(head_m, bars, labels, floor, mean_line, mean_tag, arith,
                      head_md, md, ring, md_tag, head_mo, mo, boxes, mo_tag)

    def example(self):
        pal = self.pal
        q = Text("Find the mean of 4, 6, 8", font_size=32,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.1)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)

        data = VGroup(*[
            VGroup(Circle(radius=0.38, color=BLUE, fill_color=BLUE, fill_opacity=0.35,
                          stroke_width=3),
                   Text(str(v), font_size=30, color=WHITE, weight="BOLD"))
            for v in [4, 6, 8]
        ]).arrange(RIGHT, buff=0.6).move_to(UP * 1.1 + LEFT * 1.0)
        self.reveal(LaggedStart(*[GrowFromCenter(c) for c in data], lag_ratio=0.25), rt=1.5)
        self.breathe(1.6)

        steps = self.step_lines([
            ("Add them all:  4 + 6 + 8 = 18", pal["step"]),
            ("Count the values:  3", pal["step"]),
            ("Divide:  18 ÷ 3", YELLOW),
        ], anchor=DOWN * 0.1 + LEFT * 1.0, size=28)
        self.breathe(1.6)

        ans = answer_card(self, "Mean = 6", pal["answer"], self.mascot,
                          pos=DOWN * 2.6 + LEFT * 1.0)
        self.breathe(2.0)
        return VGroup(q, data, steps, ans)
