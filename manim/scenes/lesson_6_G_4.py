"""6.G Unit 4 — Surface area with nets.
Math (verified):  A cube with side 2 has six 2×2 = 4 sq-unit faces.
  Surface area = 6 × 4 = 24 square units.
"""
from manim import *


class Lesson6G4(Scene):
    def construct(self):
        title = Text("Surface area = sum of the faces", font_size=38, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        # Draw a cube net: a "+" shaped arrangement of 6 squares.
        s = 0.9
        center = LEFT * 1.6 + DOWN * 0.2
        squares = []
        # cross net layout: top, mid (4 in a row), bottom
        positions = [
            (1, 2),   # top
            (0, 1), (1, 1), (2, 1), (3, 1),  # middle row
            (1, 0),   # bottom
        ]
        for col, row in positions:
            sq = Square(side_length=s, color=BLUE, fill_color=BLUE, fill_opacity=0.25, stroke_width=2)
            sq.move_to(center + RIGHT * (col - 1) * s + UP * (row - 1) * s)
            squares.append(sq)
        net = VGroup(*squares)
        self.play(LaggedStartMap(FadeIn, net, lag_ratio=0.08), run_time=1.4)

        side_lbl = Text("side = 2", font_size=24, color=BLUE).next_to(net, DOWN, buff=0.5)
        self.play(Write(side_lbl), run_time=1.4)

        face_calc = Text("Each face: 2 × 2 = 4 sq units", font_size=28).shift(RIGHT * 2.5 + UP * 1.0)
        self.play(Write(face_calc), run_time=1.4)

        total_calc = Text("6 faces × 4 = ?", font_size=30, color=YELLOW).shift(RIGHT * 2.5 + UP * 0.0)
        self.play(Write(total_calc), run_time=1.4)

        ans = Text("Surface area = 24 sq units",
                   font_size=32, color=GREEN, weight=BOLD).shift(RIGHT * 2.5 + DOWN * 1.0)
        self.play(Write(ans), run_time=1.4)
        self.wait(2.8)
# slowed
