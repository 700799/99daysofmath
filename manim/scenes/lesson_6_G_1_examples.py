"""6.G Unit 1 examples — Area of triangles & rectangles.
Math (verified from the lesson plan):
  1. Triangle with base 8 and height 5. -> 20
  2. Rectangle 7 by 3. -> 21
  3. Triangle base 10, height 4. -> 20
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck, _rt, palette_for, expert_move, pro_tip, answer_card
from _helpers import _wrap
import _mascot as M
import _visuals as V


class Lesson6G1Examples(ExamplesDeck):
    TITLE = "Examples · Area of triangles & rectangles"
    DOMAIN = "6.G"

    def lesson(self):
        pal = self.pal
        em = expert_move(self, self.DOMAIN, self.seed, pal)
        self.play(FadeOut(em), run_time=_rt(0.4))

        # Example 1: Triangle with base 8, height 5
        q1 = "Triangle with base 8 and height 5."
        q_text = Text(_wrap("Q: " + q1, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        # Show labeled triangle
        tri = V.labeled_right_triangle(base=8.0, height=5.0, base_color=pal["accent"], height_color=pal["step"])
        tri.scale(0.7).move_to(DOWN * 1.0 + LEFT * 2.5)
        self.play(FadeIn(tri), run_time=_rt(0.6))

        # Show formula calculation
        formula = V.area_formula_display(8, 5, result=20, result_color=pal["answer"])
        formula.move_to(RIGHT * 3.0 + DOWN * 0.5)
        self.play(FadeIn(formula, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans = answer_card(self, "= 20 sq units", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, tri, formula, ans)), run_time=_rt(0.45))

        # Example 2: Rectangle 7 by 3
        q2 = "Rectangle 7 by 3."
        q_text = Text(_wrap("Q: " + q2, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        rect = V.labeled_rectangle(width=7.0, height=3.0, width_color=pal["accent"], height_color=pal["step"])
        rect.scale(0.65).move_to(DOWN * 1.0 + LEFT * 2.5)
        self.play(FadeIn(rect), run_time=_rt(0.6))

        formula2 = VGroup(
            Text("7 × 3", font_size=48, color=pal["step"]),
            Text("= 21 sq units", font_size=48, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.4).move_to(RIGHT * 3.0 + DOWN * 0.5)
        self.play(FadeIn(formula2, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans2 = answer_card(self, "= 21 sq units", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, rect, formula2, ans2)), run_time=_rt(0.45))

        # Example 3: Triangle base 10, height 4
        q3 = "Triangle base 10, height 4."
        q_text = Text(_wrap("Q: " + q3, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        tri3 = V.labeled_right_triangle(base=10.0, height=4.0, base_color=pal["accent"], height_color=pal["step"])
        tri3.scale(0.65).move_to(DOWN * 1.0 + LEFT * 2.5)
        self.play(FadeIn(tri3), run_time=_rt(0.6))

        formula3 = V.area_formula_display(10, 4, result=20, result_color=pal["answer"])
        formula3.move_to(RIGHT * 3.0 + DOWN * 0.5)
        self.play(FadeIn(formula3, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans3 = answer_card(self, "= 20 sq units", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, tri3, formula3, ans3)), run_time=_rt(0.45))

        # Strategy reinforcement
        tip = pro_tip(self, self.DOMAIN, self.seed, pal)
        self.wait(0.8)
        self.play(FadeOut(tip), run_time=_rt(0.45))
