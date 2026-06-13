"""6.SP Unit 1 — Mean, median, mode.
Math (verified):  Mean of 4, 6, 8 = (4+6+8) / 3 = 18 / 3 = 6.
"""
from manim import *


class Lesson6SP1(Scene):
    def construct(self):
        title = Text("Mean = sum ÷ how many", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        nums_text = Text("Data: 4, 6, 8", font_size=34, color=YELLOW).shift(UP * 1.4)
        self.play(Write(nums_text), run_time=1.4)

        # Visual: three bars of heights 4, 6, 8
        bar_heights = [4, 6, 8]
        bar_unit = 0.35
        bars = VGroup()
        for i, h in enumerate(bar_heights):
            bar = Rectangle(width=0.8, height=h * bar_unit, color=BLUE,
                            fill_color=BLUE, fill_opacity=0.45)
            bar.shift(LEFT * 2.5 + RIGHT * i * 1.1 + DOWN * (1.5 - h * bar_unit / 2))
            label = Text(str(h), font_size=26).next_to(bar, UP, buff=0.1)
            bars.add(VGroup(bar, label))
        self.play(LaggedStartMap(FadeIn, bars, lag_ratio=0.2), run_time=1.4)

        step1 = Text("Sum:  4 + 6 + 8 = 18", font_size=30).shift(RIGHT * 2.0 + UP * 0.3)
        self.play(Write(step1), run_time=1.4)
        step2 = Text("Divide by 3:  18 ÷ 3", font_size=30).shift(RIGHT * 2.0 + DOWN * 0.7)
        self.play(Write(step2), run_time=1.4)
        ans = Text("Mean = 6", font_size=42, color=GREEN, weight=BOLD).shift(RIGHT * 2.0 + DOWN * 1.9)
        self.play(Write(ans), run_time=1.4)
        self.wait(2.8)
# slowed
