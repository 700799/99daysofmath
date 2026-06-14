"""6.G Unit 3 examples — Volume of prisms.
Math (verified from the lesson plan):
  1. Box 1/2 by 3 by 4. -> 6
  2. Box 2 by 3 by 5. -> 30
  3. Cube with side 3. -> 27
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck, _rt, palette_for, expert_move, pro_tip, answer_card
from _helpers import _wrap
import _mascot as M
import _visuals as V


class Lesson6G3Examples(ExamplesDeck):
    TITLE = "Examples · Volume of prisms"
    DOMAIN = "6.G"

    def lesson(self):
        pal = self.pal
        em = expert_move(self, self.DOMAIN, self.seed, pal)
        self.play(FadeOut(em), run_time=_rt(0.4))

        # Example 1: Box 0.5 by 3 by 4
        q1 = "Box 1/2 by 3 by 4."
        q_text = Text(_wrap("Q: " + q1, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        box1 = V.box_wireframe(width=2, height=3, depth=4, labels=True, label_size=20)
        box1.scale(0.5).move_to(LEFT * 2.8 + DOWN * 1.0)
        self.play(FadeIn(box1), run_time=_rt(0.6))

        formula1 = V.volume_formula_display(0.5, 3, 4, result=6, result_color=pal["answer"])
        formula1.scale(0.75).move_to(RIGHT * 3.0 + DOWN * 0.5)
        self.play(FadeIn(formula1, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans1 = answer_card(self, "= 6 cubic units", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, box1, formula1, ans1)), run_time=_rt(0.45))

        # Example 2: Box 2 by 3 by 5
        q2 = "Box 2 by 3 by 5."
        q_text = Text(_wrap("Q: " + q2, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        box2 = V.box_wireframe(width=2, height=3, depth=5, labels=True, label_size=20)
        box2.scale(0.55).move_to(LEFT * 2.8 + DOWN * 1.0)
        self.play(FadeIn(box2), run_time=_rt(0.6))

        formula2 = V.volume_formula_display(2, 3, 5, result=30, result_color=pal["answer"])
        formula2.scale(0.8).move_to(RIGHT * 3.0 + DOWN * 0.5)
        self.play(FadeIn(formula2, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans2 = answer_card(self, "= 30 cubic units", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, box2, formula2, ans2)), run_time=_rt(0.45))

        # Example 3: Cube with side 3
        q3 = "Cube with side 3."
        q_text = Text(_wrap("Q: " + q3, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        cube = V.box_wireframe(width=3, height=3, depth=3, labels=True, label_size=20)
        cube.scale(0.55).move_to(LEFT * 2.8 + DOWN * 1.0)
        self.play(FadeIn(cube), run_time=_rt(0.6))

        formula3 = V.volume_formula_display(3, 3, 3, result=27, result_color=pal["answer"])
        formula3.scale(0.8).move_to(RIGHT * 3.0 + DOWN * 0.5)
        self.play(FadeIn(formula3, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans3 = answer_card(self, "= 27 cubic units", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, cube, formula3, ans3)), run_time=_rt(0.45))

        # Strategy reinforcement
        tip = pro_tip(self, self.DOMAIN, self.seed, pal)
        self.wait(0.8)
        self.play(FadeOut(tip), run_time=_rt(0.45))
