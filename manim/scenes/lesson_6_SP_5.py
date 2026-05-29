"""6.SP Unit 5 — Describing a distribution.
Math (verified):  Most test scores cluster near 80; a 30 sits far from the
  rest of the data. That far-away value is called an OUTLIER.
"""
from manim import *


class Lesson6SP5(Scene):
    def construct(self):
        title = Text("Spot the outlier", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        prompt = Text("Test scores: 78, 80, 82, 85, 30",
                      font_size=30, color=YELLOW).shift(UP * 1.4)
        self.play(Write(prompt))

        nl = NumberLine(
            x_range=[20, 100, 10],
            length=10,
            include_numbers=True,
            label_direction=DOWN,
            font_size=22,
            color=GREY,
        )
        self.play(Create(nl))

        # Dot plot
        cluster_values = [78, 80, 82, 85]
        cluster_dots = VGroup()
        for v in cluster_values:
            d = Dot(nl.n2p(v), color=BLUE, radius=0.13).shift(UP * 0.25)
            cluster_dots.add(d)
        self.play(LaggedStartMap(FadeIn, cluster_dots, lag_ratio=0.15))

        outlier = Dot(nl.n2p(30), color=RED, radius=0.16).shift(UP * 0.25)
        self.play(FadeIn(outlier))

        # Highlight cluster
        cluster_bracket = Brace(
            Line(nl.n2p(78) + UP * 0.55, nl.n2p(85) + UP * 0.55),
            direction=UP,
            color=BLUE,
        )
        cluster_lbl = Text("cluster", font_size=22, color=BLUE).next_to(cluster_bracket, UP, buff=0.05)
        self.play(GrowFromCenter(cluster_bracket), Write(cluster_lbl))

        outlier_lbl = Text("← outlier", font_size=26, color=RED).next_to(outlier, RIGHT, buff=0.2)
        self.play(Write(outlier_lbl))

        rule = Text("A value far from the rest = an outlier.",
                    font_size=28, color=GREEN, weight=BOLD).to_edge(DOWN, buff=0.6)
        self.play(Write(rule))
        self.wait(2)
