"""6.NS Unit 10 examples — Coordinate plane: distance & polygons.
Math (verified from the lesson plan):
  1. Distance from (3, 2) to (3, 7)? -> 5
  2. Distance from (−2, 4) to (5, 4)? -> 7
  3. Side lengths of the rectangle with corners (1, 1), (5, 1), (5, 4), (1, 4)? -> 4 and 3
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck, _rt, palette_for, expert_move, pro_tip, answer_card
from _helpers import _wrap
import _mascot as M
import _visuals as V


class Lesson6NS10Examples(ExamplesDeck):
    TITLE = "Examples · Coordinate plane: distance & polygons"
    DOMAIN = "6.NS"

    def lesson(self):
        pal = self.pal
        em = expert_move(self, self.DOMAIN, self.seed, pal)
        self.play(FadeOut(em), run_time=_rt(0.4))

        # Example 1: Distance from (3, 2) to (3, 7)
        q1 = "Distance from (3, 2) to (3, 7)?"
        q_text = Text(_wrap("Q: " + q1, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        # Simple visual: coordinates and distance
        coords1 = VGroup(
            Text("(3, 2)", font_size=32, color=YELLOW, weight="BOLD"),
            Text("↓ vertical distance ↓", font_size=24, color=WHITE),
            Text("(3, 7)", font_size=32, color=YELLOW, weight="BOLD"),
            Text("|7 − 2| = 5", font_size=36, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.25).move_to(LEFT * 2.8 + DOWN * 0.5)
        self.play(FadeIn(coords1), run_time=_rt(0.6))

        steps1 = VGroup(
            Text("Same x → vertical", font_size=32, color=pal["step"]),
            Text("Distance = 5 units", font_size=38, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.3).move_to(RIGHT * 3.0 + DOWN * 0.5)
        self.play(FadeIn(steps1, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans1 = answer_card(self, "= 5", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, coords1, steps1, ans1)), run_time=_rt(0.45))

        # Example 2: Distance from (−2, 4) to (5, 4)
        q2 = "Distance from (−2, 4) to (5, 4)?"
        q_text = Text(_wrap("Q: " + q2, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        coords2 = VGroup(
            Text("(−2, 4)", font_size=32, color=YELLOW, weight="BOLD"),
            Text("← horizontal distance →", font_size=24, color=WHITE),
            Text("(5, 4)", font_size=32, color=YELLOW, weight="BOLD"),
            Text("|5 − (−2)| = 7", font_size=36, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.25).move_to(LEFT * 2.8 + DOWN * 0.5)
        self.play(FadeIn(coords2), run_time=_rt(0.6))

        steps2 = VGroup(
            Text("Same y → horizontal", font_size=32, color=pal["step"]),
            Text("Distance = 7 units", font_size=38, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.3).move_to(RIGHT * 3.0 + DOWN * 0.5)
        self.play(FadeIn(steps2, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans2 = answer_card(self, "= 7", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, coords2, steps2, ans2)), run_time=_rt(0.45))

        # Example 3: Rectangle dimensions
        q3 = "Rectangle: (1,1) (5,1) (5,4) (1,4)?"
        q_text = Text(_wrap("Q: " + q3, 36), font_size=32, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        rect_visual = VGroup(
            Text("Width:  |5 − 1| = 4", font_size=32, color=pal["step"]),
            Text("Height: |4 − 1| = 3", font_size=32, color=pal["step"]),
            Text("Rectangle: 4 × 3", font_size=36, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.3).move_to(LEFT * 2.8 + DOWN * 0.3)
        self.play(FadeIn(rect_visual), run_time=_rt(0.6))

        steps3 = VGroup(
            Text("Find corners", font_size=28, color=pal["step"]),
            Text("Compute width & height", font_size=28, color=pal["step"]),
            Text("Answer: 4 and 3", font_size=38, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.25).move_to(RIGHT * 3.0 + DOWN * 0.3)
        self.play(FadeIn(steps3, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans3 = answer_card(self, "= 4 and 3", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, rect_visual, steps3, ans3)), run_time=_rt(0.45))

        # Strategy reinforcement
        tip = pro_tip(self, self.DOMAIN, self.seed, pal)
        self.wait(0.8)
        self.play(FadeOut(tip), run_time=_rt(0.45))
