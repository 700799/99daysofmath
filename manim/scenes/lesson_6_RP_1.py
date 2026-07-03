"""6.RP Unit 1 — What is a ratio?  (TeachingDeck)

Math (verified):
  • 4 apples to 6 oranges → ratio 4:6. Order: apples first because asked first.
  • Simplify: GCF(4, 6) = 2 → 4÷2 : 6÷2 = 2:3.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


def fruit_row(n, color, r=0.26, buff=0.22):
    return VGroup(*[
        Circle(radius=r, color=color, fill_color=color, fill_opacity=0.85,
               stroke_width=3)
        for _ in range(n)
    ]).arrange(RIGHT, buff=buff)


class Lesson6RP1(TeachingDeck):
    TITLE = "What is a ratio?"
    DOMAIN = "6.RP"
    HOOK = "A bowl has 4 apples and 6 oranges. Can ONE bit of math compare them?"
    RECAP = [
        "A ratio compares two amounts:  4 : 6",
        "Order matters — say apples first!",
        "Scale it: multiply or divide BOTH parts",
    ]

    def concept(self):
        pal = self.pal
        # Build the bowl: a row of apples, a row of oranges, counted as they appear.
        apples = fruit_row(4, RED)
        oranges = fruit_row(6, ORANGE)
        a_lbl = Text("apples", font_size=26, color=RED, weight="BOLD")
        o_lbl = Text("oranges", font_size=26, color=ORANGE, weight="BOLD")
        row_a = VGroup(a_lbl, apples).arrange(RIGHT, buff=0.45)
        row_o = VGroup(o_lbl, oranges).arrange(RIGHT, buff=0.45)
        rows = VGroup(row_a, row_o).arrange(DOWN, buff=0.55, aligned_edge=LEFT)
        rows.move_to(UP * 0.9 + LEFT * 0.6)

        self.reveal(LaggedStart(*[GrowFromCenter(c) for c in apples], lag_ratio=0.18),
                    FadeIn(a_lbl), rt=1.8)
        a_count = Text("4", font_size=34, color=RED, weight="BOLD").next_to(apples, RIGHT, buff=0.35)
        self.reveal(FadeIn(a_count, scale=1.3), rt=1.2)
        self.breathe(1.6)

        self.reveal(LaggedStart(*[GrowFromCenter(c) for c in oranges], lag_ratio=0.15),
                    FadeIn(o_lbl), rt=1.8)
        o_count = Text("6", font_size=34, color=ORANGE, weight="BOLD").next_to(oranges, RIGHT, buff=0.35)
        self.reveal(FadeIn(o_count, scale=1.3), rt=1.2)
        self.breathe(1.6)

        # The ratio is born: counts fly down into 4 : 6.
        four = Text("4", font_size=52, color=RED, weight="BOLD")
        colon = Text(":", font_size=52, color=pal["step"], weight="BOLD")
        six = Text("6", font_size=52, color=ORANGE, weight="BOLD")
        ratio = VGroup(four, colon, six).arrange(RIGHT, buff=0.3).move_to(DOWN * 1.3)
        say = Text("say: “4 to 6”", font_size=26, color=pal["accent"]).next_to(ratio, DOWN, buff=0.3)
        self.reveal(
            TransformFromCopy(a_count, four),
            TransformFromCopy(o_count, six),
            FadeIn(colon),
            rt=1.6,
        )
        self.reveal(FadeIn(say, shift=UP * 0.15), rt=1.2)
        self.breathe(2.0)

        # Order matters: apples were asked first, so apples go first.
        order = Text("Apples first → the 4 goes first. 6 : 4 is backwards!",
                     font_size=26, color=YELLOW, weight="BOLD")
        order.next_to(say, DOWN, buff=0.35)
        arrow = SurroundingRectangle(four, color=YELLOW, buff=0.12, corner_radius=0.1)
        self.reveal(Create(arrow), FadeIn(order, shift=UP * 0.15), rt=1.4)
        self.breathe(2.2)

        return VGroup(rows, a_count, o_count, ratio, say, order, arrow)

    def example(self):
        pal = self.pal
        # Simplify 4:6 by pairing — the GCF made visible.
        q = Text("Simplify the ratio 4 : 6", font_size=32, color=pal["step"], weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        apples = fruit_row(4, RED)
        oranges = fruit_row(6, ORANGE)
        rows = VGroup(apples, oranges).arrange(DOWN, buff=0.6).move_to(UP * 0.6 + LEFT * 1.0)
        self.reveal(FadeIn(rows), rt=1.4)
        self.breathe(1.6)

        # Circle the fruit in pairs — dividing both amounts by the same 2.
        pair_boxes = VGroup()
        for row in (apples, oranges):
            for i in range(0, len(row), 2):
                pb = SurroundingRectangle(VGroup(row[i], row[i + 1]),
                                          color=YELLOW, buff=0.09, corner_radius=0.12)
                pair_boxes.add(pb)
        self.reveal(LaggedStart(*[Create(pb) for pb in pair_boxes], lag_ratio=0.25), rt=2.2)
        note = Text("Group BOTH rows in 2s", font_size=26, color=YELLOW, weight="BOLD")
        note.next_to(rows, RIGHT, buff=0.6)
        self.reveal(FadeIn(note), rt=1.2)
        self.breathe(2.0)

        # The arithmetic, line by line.
        steps = self.step_lines([
            ("4 ÷ 2 = 2 groups of apples", RED),
            ("6 ÷ 2 = 3 groups of oranges", ORANGE),
        ], anchor=DOWN * 1.5, size=28)
        self.breathe(1.6)

        ans = answer_card(self, "4 : 6  =  2 : 3", pal["answer"], self.mascot,
                          pos=DOWN * 2.9)
        self.breathe(2.0)
        return VGroup(q, rows, pair_boxes, note, steps, ans)
