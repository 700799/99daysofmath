"""6.RP Unit 10 — Ratio & proportion problem-solving  (TeachingDeck)

Math (verified):
  • Double number line for servings : cups with rate 4 servings = 6 cups.
    Ticks: 0→0, 2→3 (both ÷2), 4→6 (the rate), 6→9 (both ×1.5 from 4:6,
    or 3 steps of 2:3 → 6:9). Check: 6/9 = 2/3 = 4/6. ✓
  • Equivalent ratios multiply BOTH parts by the same number:
    2:3 ×4 → 8:12. Check: 8/12 = 2/3. ✓
  • Example: dogs : cats = 3 : 5 with 20 cats.
    Multiplier = 20 ÷ 5 = 4 → dogs = 3 × 4 = 12. Check: 12:20 = 3:5. ✓
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


class Lesson6RP10(TeachingDeck):
    TITLE = "Ratio & proportion problem-solving"
    DOMAIN = "6.RP"
    HOOK = "4 servings of pancakes need 6 cups of flour. Guess: cups for 6 servings?"
    RECAP = [
        "Multiply BOTH parts by the same number",
        "Double number lines keep ratios lined up",
        "Find the multiplier, then scale",
    ]

    def concept(self):
        pal = self.pal
        head = Text("4 servings ↔ 6 cups of flour", font_size=28,
                    color=pal["step"], weight="BOLD")
        head.move_to(UP * 1.95 + LEFT * 0.7)
        self.reveal(FadeIn(head, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # A DOUBLE NUMBER LINE: servings on top, cups underneath, ticks aligned.
        line_top = NumberLine(x_range=[0, 8, 2], length=7.2,
                              include_numbers=False, color=BLUE,
                              stroke_width=3)
        line_bot = NumberLine(x_range=[0, 12, 3], length=7.2,
                              include_numbers=False, color=ORANGE,
                              stroke_width=3)
        line_top.move_to(UP * 0.7 + LEFT * 1.0)
        line_bot.move_to(DOWN * 0.6 + LEFT * 1.0)
        t_lbl = Text("servings", font_size=24, color=BLUE, weight="BOLD")
        t_lbl.next_to(line_top, LEFT, buff=0.35)
        b_lbl = Text("cups", font_size=24, color=ORANGE, weight="BOLD")
        b_lbl.next_to(line_bot, LEFT, buff=0.35)
        self.reveal(Create(line_top), Create(line_bot),
                    FadeIn(t_lbl), FadeIn(b_lbl), rt=1.8)
        self.breathe(1.6)

        # Aligned tick labels: servings 0,2,4,6 over cups 0,3,6,9.
        top_vals = [0, 2, 4, 6]
        bot_vals = [0, 3, 6, 9]
        top_nums = VGroup(*[
            Text(str(v), font_size=26, color=BLUE, weight="BOLD")
            .next_to(line_top.n2p(v), UP, buff=0.2)
            for v in top_vals
        ])
        bot_nums = VGroup(*[
            Text(str(v), font_size=26, color=ORANGE, weight="BOLD")
            .next_to(line_bot.n2p(v), DOWN, buff=0.2)
            for v in bot_vals
        ])
        # Dashed connectors show the pairs travelling together. Because the
        # two lines share a length, 2↔3, 4↔6, 6↔9 land at the same x.
        pairs = VGroup(*[
            DashedLine(line_top.n2p(v), line_bot.n2p(bot_vals[i]),
                       color=pal["accent"], stroke_width=2.5)
            for i, v in enumerate(top_vals)
        ])
        self.reveal(LaggedStart(*[FadeIn(n) for n in top_nums],
                                lag_ratio=0.2), rt=1.6)
        self.reveal(LaggedStart(*[Create(p) for p in pairs], lag_ratio=0.2),
                    LaggedStart(*[FadeIn(n) for n in bot_nums],
                                lag_ratio=0.2), rt=2.0)
        self.breathe(2.0)

        # Ring the rate pair and the answer pair.
        rate_ring = VGroup(
            SurroundingRectangle(top_nums[2], color=GREEN, buff=0.1,
                                 corner_radius=0.1),
            SurroundingRectangle(bot_nums[2], color=GREEN, buff=0.1,
                                 corner_radius=0.1),
        )
        rate_note = Text("the rate: 4 ↔ 6", font_size=25, color=GREEN,
                         weight="BOLD").move_to(RIGHT * 3.6 + UP * 0.05)
        self.reveal(Create(rate_ring[0]), Create(rate_ring[1]),
                    FadeIn(rate_note), rt=1.5)
        self.breathe(1.8)

        rule = Text("Every pair: multiply BOTH parts by the same number",
                    font_size=26, color=YELLOW, weight="BOLD")
        rule.move_to(DOWN * 1.7 + LEFT * 0.7)
        ex = Text("2:3 ×2 → 4:6 ×2 → 8:12", font_size=28,
                  color=pal["step"], weight="BOLD")
        ex.move_to(DOWN * 2.45 + LEFT * 0.7)
        self.reveal(FadeIn(rule, shift=UP * 0.15), rt=1.4)
        self.reveal(FadeIn(ex, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(head, line_top, line_bot, t_lbl, b_lbl, top_nums,
                      bot_nums, pairs, rate_ring, rate_note, rule, ex)

    def example(self):
        pal = self.pal
        q = Text(_wrap("A shelter has dogs : cats = 3 : 5 and 20 cats. "
                       "How many dogs?", 46),
                 font_size=28, color=pal["step"], weight="BOLD")
        q.move_to(UP * 1.95)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.8)

        # Ratio table: ratio row → real row, with a ×4 bridge.
        def cell(txt, color):
            box = Rectangle(width=1.7, height=0.8, stroke_color=WHITE,
                            stroke_width=2.5)
            t = Text(txt, font_size=28, color=color, weight="BOLD").move_to(box)
            return VGroup(box, t)

        hdr_d = Text("dogs", font_size=25, color=BLUE, weight="BOLD")
        hdr_c = Text("cats", font_size=25, color=ORANGE, weight="BOLD")
        r1d, r1c = cell("3", BLUE), cell("5", ORANGE)
        r2d, r2c = cell("?", YELLOW), cell("20", ORANGE)
        table = VGroup(
            VGroup(hdr_d, hdr_c).arrange(RIGHT, buff=1.35),
            VGroup(r1d, r1c).arrange(RIGHT, buff=0),
            VGroup(r2d, r2c).arrange(RIGHT, buff=0),
        ).arrange(DOWN, buff=0.22)
        table.move_to(LEFT * 2.6 + UP * 0.25)
        self.reveal(FadeIn(table, shift=UP * 0.15), rt=1.6)
        self.breathe(1.8)

        # The ×4 arrow: 5 cats became 20 cats.
        arr = CurvedArrow(r1c.get_right() + RIGHT * 0.15,
                          r2c.get_right() + RIGHT * 0.15,
                          angle=-TAU / 5, color=GREEN, stroke_width=4)
        x4 = Text("×4", font_size=30, color=GREEN, weight="BOLD")
        x4.next_to(arr, RIGHT, buff=0.15)
        self.reveal(Create(arr), FadeIn(x4, scale=1.2), rt=1.5)
        self.breathe(1.8)

        steps = self.step_lines([
            ("cats: 5 → 20, so ×4", GREEN),
            ("dogs must ×4 too", pal["step"]),
            ("3 × 4 = 12", BLUE),
        ], anchor=DOWN * 1.2 + LEFT * 3.0, size=28)
        self.breathe(1.6)

        ans = answer_card(self, "12 dogs", pal["answer"], self.mascot,
                          pos=DOWN * 1.5 + RIGHT * 2.6)
        self.breathe(2.0)
        return VGroup(q, table, arr, x4, steps, ans)
