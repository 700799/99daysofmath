"""6.RP Unit 4 — Part-to-part vs part-to-whole.
Math (verified): 3 boys + 2 girls = 5 total.
  Part-to-part: boys to girls = 3 : 2.
  Part-to-whole: boys to whole = 3 : 5.
"""
from manim import *


class Lesson6RP4(Scene):
    def construct(self):
        title = Text("Part-to-part vs part-to-whole", font_size=38, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        # 3 blue + 2 pink dots
        boys = VGroup(*[
            Circle(radius=0.3, color=BLUE, fill_color=BLUE, fill_opacity=0.85) for _ in range(3)
        ]).arrange(RIGHT, buff=0.25)
        girls = VGroup(*[
            Circle(radius=0.3, color=PINK, fill_color=PINK, fill_opacity=0.85) for _ in range(2)
        ]).arrange(RIGHT, buff=0.25)
        group = VGroup(boys, girls).arrange(RIGHT, buff=0.6).shift(UP * 1.4)
        self.play(LaggedStartMap(FadeIn, boys, lag_ratio=0.15), run_time=1.4)
        self.play(LaggedStartMap(FadeIn, girls, lag_ratio=0.15), run_time=1.4)

        legend = VGroup(
            Text("3 boys", font_size=24, color=BLUE),
            Text("2 girls", font_size=24, color=PINK),
        ).arrange(RIGHT, buff=0.8).next_to(group, DOWN, buff=0.3)
        self.play(FadeIn(legend), run_time=1.4)

        pp = Text("Part-to-part:  boys : girls = 3 : 2", font_size=28, color=YELLOW)
        pp.shift(DOWN * 0.6)
        self.play(Write(pp), run_time=1.4)

        whole = Text("Whole class = 3 + 2 = 5", font_size=26).shift(DOWN * 1.4)
        self.play(Write(whole), run_time=1.4)

        pw = Text("Part-to-whole:  boys : whole = 3 : 5",
                  font_size=30, color=GREEN, weight=BOLD).shift(DOWN * 2.4)
        self.play(Write(pw), run_time=1.4)
        self.wait(2.8)
# slowed
