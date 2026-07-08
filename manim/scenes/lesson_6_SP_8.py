"""6.SP Unit 8 — Center: mean & median in depth  (TeachingDeck)

Math (verified):
  • Median of {3,5,7,9,11}: sorted, 5 items, middle (3rd) = 7.
  • Median of {2,4,6,8}: 4 items, middle two 4 and 6, average = 5.
  • Mean of {5,5,5,100}: sum 115, count 4, 115÷4 = 28.75.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


class Lesson6SP8(TeachingDeck):
    TITLE = "Center: mean & median in depth"
    DOMAIN = "6.SP"
    HOOK = "4 numbers instead of 5 — does 'the middle' still make sense?"
    RECAP = [
        "Mean = sum ÷ count",
        "Median = middle of SORTED data",
        "Even count → average the middle two",
    ]

    def concept(self):
        pal = self.pal
        data = Text("{3, 5, 7, 9, 11}", font_size=36, color=YELLOW, weight="BOLD").move_to(UP * 1.9)
        self.reveal(FadeIn(data), rt=1.3)
        self.breathe(1.4)

        nums = VGroup(*[Text(str(v), font_size=36, weight="BOLD",
                             color=GREEN if v == 7 else BLUE) for v in [3, 5, 7, 9, 11]])
        nums.arrange(RIGHT, buff=0.7).move_to(UP * 0.6)
        self.reveal(LaggedStart(*[FadeIn(n, scale=1.2) for n in nums], lag_ratio=0.15), rt=1.5)
        ring = SurroundingRectangle(nums[2], color=GREEN, buff=0.15, corner_radius=0.1)
        self.reveal(Create(ring), rt=1.3)
        cap = Text("5 items → middle is the 3rd: median = 7", font_size=24, color=GREEN,
                   weight="BOLD").move_to(DOWN * 0.5)
        self.reveal(FadeIn(cap, shift=UP * 0.15), rt=1.4)
        self.breathe(1.6)

        data2 = Text("{2, 4, 6, 8}", font_size=32, color=YELLOW, weight="BOLD").move_to(DOWN * 1.5)
        nums2 = VGroup(*[Text(str(v), font_size=30, weight="BOLD",
                              color=GREEN if v in (4, 6) else BLUE) for v in [2, 4, 6, 8]])
        nums2.arrange(RIGHT, buff=0.55).next_to(data2, DOWN, buff=0.3)
        self.reveal(FadeIn(data2), FadeIn(nums2), rt=1.5)
        cap2 = Text("4 items → average the middle two: (4+6)÷2 = 5", font_size=22, color=GREEN,
                    weight="BOLD").next_to(nums2, DOWN, buff=0.3)
        self.reveal(FadeIn(cap2, shift=UP * 0.15), rt=1.4)
        self.breathe(2.0)

        return VGroup(data, nums, ring, cap, data2, nums2, cap2)

    def example(self):
        pal = self.pal
        q = Text("Mean of {5, 5, 5, 100}?", font_size=34, color=pal["accent"], weight="BOLD").move_to(UP * 2.2)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        steps = self.step_lines([
            ("Sum: 115. Count: 4.", pal["step"]),
        ], anchor=UP * 0.6, size=28, gap=0.4)

        ans = answer_card(self, "115 ÷ 4 = 28.75", pal["answer"], self.mascot, pos=DOWN * 1.3)
        self.breathe(2.0)
        return VGroup(q, steps, ans)
