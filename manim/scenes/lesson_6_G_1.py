"""6.G Unit 1 — Area of triangles & rectangles.

Math content (verified):
  • Rectangle 7 by 3: Area = 7 × 3 = 21 square units.
  • Triangle base 8, height 5: Area = ½ × 8 × 5 = 20 square units.
"""
from manim import *


class Lesson6G1(Scene):
    def construct(self):
        title = Text("Area: rectangles & triangles", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)
        self.wait(0.42)

        # ---- Rectangle 7 × 3 = 21 ----
        rect_label = Text("Rectangle", font_size=28, color=BLUE).next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(rect_label, shift=DOWN * 0.2), run_time=1.4)

        rect = Rectangle(width=4.2, height=1.8, color=BLUE, fill_color=BLUE, fill_opacity=0.15)
        rect.shift(LEFT * 2.6 + DOWN * 0.3)
        w_lbl = Text("7", font_size=30).next_to(rect, DOWN, buff=0.15)
        h_lbl = Text("3", font_size=30).next_to(rect, LEFT, buff=0.15)
        self.play(Create(rect), Write(w_lbl), Write(h_lbl), run_time=1.4)
        self.wait(0.42)

        formula_r = Text("Area = length × width", font_size=30).move_to(RIGHT * 2.6 + UP * 0.6)
        self.play(Write(formula_r), run_time=1.4)
        calc_r = Text("= 7 × 3", font_size=32).next_to(formula_r, DOWN, buff=0.3).align_to(formula_r, LEFT)
        self.play(Write(calc_r), run_time=1.4)
        answer_r = Text("= 21 square units", font_size=34, color=GREEN, weight=BOLD).next_to(calc_r, DOWN, buff=0.3).align_to(calc_r, LEFT)
        self.play(Write(answer_r), run_time=1.4)
        self.wait(2.1)

        self.play(
            FadeOut(rect_label),
            FadeOut(rect),
            FadeOut(w_lbl),
            FadeOut(h_lbl),
            FadeOut(formula_r),
            FadeOut(calc_r),
            FadeOut(answer_r),
        )

        # ---- Triangle base 8, height 5 = 20 ----
        tri_label = Text("Triangle", font_size=28, color=ORANGE).next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(tri_label, shift=DOWN * 0.2), run_time=1.4)

        # Triangle drawn at left, with explicit perpendicular height marker.
        # Vertices chosen so the base is horizontal and the apex sits above it.
        base_y = -1.2
        base_left = LEFT * 4.6 + UP * base_y
        base_right = LEFT * 0.6 + UP * base_y
        apex = LEFT * 2.0 + UP * 1.2  # apex is above the base; foot of perpendicular falls on the base
        tri = Polygon(base_left, base_right, apex, color=ORANGE, fill_color=ORANGE, fill_opacity=0.15)
        # Foot of the perpendicular from the apex to the base (same x as apex, y = base_y)
        foot = LEFT * 2.0 + UP * base_y
        height_line = DashedLine(apex, foot, color=YELLOW)
        # Small right-angle marker at the foot
        sq_size = 0.18
        right_angle = Polygon(
            foot,
            foot + RIGHT * sq_size,
            foot + RIGHT * sq_size + UP * sq_size,
            foot + UP * sq_size,
            color=YELLOW,
            stroke_width=2,
            fill_opacity=0,
        )

        base_lbl = Text("base = 8", font_size=26).next_to(tri, DOWN, buff=0.2)
        height_lbl = Text("h = 5", font_size=26, color=YELLOW).next_to(height_line, LEFT, buff=0.15)

        self.play(Create(tri), Write(base_lbl), run_time=1.4)
        self.play(Create(height_line), Create(right_angle), Write(height_lbl), run_time=1.4)
        self.wait(0.42)

        formula_t = Text("Area = ½ × base × height", font_size=30).move_to(RIGHT * 2.6 + UP * 0.6)
        self.play(Write(formula_t), run_time=1.4)
        calc_t = Text("= ½ × 8 × 5", font_size=32).next_to(formula_t, DOWN, buff=0.3).align_to(formula_t, LEFT)
        self.play(Write(calc_t), run_time=1.4)
        answer_t = Text("= 20 square units", font_size=34, color=GREEN, weight=BOLD).next_to(calc_t, DOWN, buff=0.3).align_to(calc_t, LEFT)
        self.play(Write(answer_t), run_time=1.4)
        self.wait(2.8)
# slowed
