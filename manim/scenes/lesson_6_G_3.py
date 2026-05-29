"""6.G Unit 3 — Volume of rectangular prisms.
Math (verified):  V = l × w × h = 2 × 3 × 5 = 30 cubic units.
"""
from manim import *


class Lesson6G3(Scene):
    def construct(self):
        title = Text("Volume of a rectangular prism", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        # Pseudo-3D box drawn with two overlapping quadrilaterals (front + back) and 4 edges.
        # Dimensions chosen for clarity, labeled 2 × 3 × 5.
        # Front face
        fl = LEFT * 2.5 + DOWN * 0.6
        fr = LEFT * 0.5 + DOWN * 0.6
        ftl = LEFT * 2.5 + UP * 0.8
        ftr = LEFT * 0.5 + UP * 0.8
        front = Polygon(fl, fr, ftr, ftl, color=BLUE, fill_color=BLUE, fill_opacity=0.15, stroke_width=3)
        # Back face (shifted up-right for depth)
        off = RIGHT * 0.9 + UP * 0.5
        back = Polygon(fl + off, fr + off, ftr + off, ftl + off, color=BLUE, fill_opacity=0.07, stroke_width=2)
        # Connecting edges
        edges = VGroup(
            Line(fl, fl + off, color=BLUE),
            Line(fr, fr + off, color=BLUE),
            Line(ftl, ftl + off, color=BLUE),
            Line(ftr, ftr + off, color=BLUE),
        )
        self.play(Create(front))
        self.play(Create(back), Create(edges))

        # Dimension labels
        l_lbl = Text("length = 2", font_size=24, color=BLUE).next_to(front, DOWN, buff=0.3)
        h_lbl = Text("height = 3", font_size=24, color=BLUE).next_to(front, LEFT, buff=0.2)
        w_lbl = Text("width = 5", font_size=24, color=BLUE).move_to(back.get_center() + RIGHT * 1.2 + UP * 0.6)
        self.play(Write(l_lbl), Write(h_lbl), Write(w_lbl))

        formula = Text("V = length × width × height", font_size=28).shift(RIGHT * 2.7 + UP * 0.8)
        self.play(Write(formula))
        calc = Text("V = 2 × 5 × 3", font_size=32).shift(RIGHT * 2.7 + DOWN * 0.2)
        self.play(Write(calc))
        ans = Text("V = 30 cubic units", font_size=34, color=GREEN, weight=BOLD).shift(RIGHT * 2.7 + DOWN * 1.3)
        self.play(Write(ans))
        self.wait(2)
