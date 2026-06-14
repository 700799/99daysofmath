"""6.SP Unit 4 examples — Displaying data.
Math (verified from the lesson plan):
  1. On a box plot, what does the line inside the box show? -> median
  2. A dot plot has 3 dots above 5. How many values equal 5? -> 3
  3. Do histogram bars touch (no gaps)? (yes/no) -> yes
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck, _rt, palette_for, expert_move, pro_tip, answer_card
from _helpers import _wrap
import _mascot as M
import _visuals as V


class Lesson6SP4Examples(ExamplesDeck):
    TITLE = "Examples · Displaying data"
    DOMAIN = "6.SP"

    def lesson(self):
        pal = self.pal
        em = expert_move(self, self.DOMAIN, self.seed, pal)
        self.play(FadeOut(em), run_time=_rt(0.4))

        # Example 1: Box plot median
        q1 = "On a box plot, what does the line inside the box show?"
        q_text = Text(_wrap("Q: " + q1, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        # Simple box plot visualization
        box_plot = VGroup(
            Text("Data: 1, 2, 3, 4, 5, 6, 7, 8, 9", font_size=26, color=WHITE),
            Text("┌─────●─────┐", font_size=32, color=pal["accent"], weight="BOLD"),
            Text("Min    Median    Max", font_size=24, color=pal["step"]),
        ).arrange(DOWN, buff=0.35).move_to(LEFT * 2.8 + DOWN * 0.5)
        self.play(FadeIn(box_plot), run_time=_rt(0.6))

        steps1 = VGroup(
            Text("The box = middle half", font_size=32, color=pal["step"]),
            Text("The line = the middle value", font_size=32, color=pal["step"]),
            Text("= median", font_size=38, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.25).move_to(RIGHT * 3.0 + DOWN * 0.3)
        self.play(FadeIn(steps1, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans1 = answer_card(self, "= median", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, box_plot, steps1, ans1)), run_time=_rt(0.45))

        # Example 2: Dot plot
        q2 = "A dot plot has 3 dots above 5. How many values equal 5?"
        q_text = Text(_wrap("Q: " + q2, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        # Dot plot visualization
        dots_viz = VGroup(
            Text("●", font_size=40, color=YELLOW),
            Text("●", font_size=40, color=YELLOW),
            Text("●", font_size=40, color=YELLOW),
            Text("↓", font_size=32, color=WHITE),
            Text("5", font_size=40, color=pal["accent"], weight="BOLD"),
        ).arrange(DOWN, buff=0.15).move_to(LEFT * 2.8 + DOWN * 0.5)
        self.play(FadeIn(dots_viz), run_time=_rt(0.6))

        steps2 = VGroup(
            Text("Each dot = one value", font_size=32, color=pal["step"]),
            Text("3 dots above 5", font_size=32, color=pal["step"]),
            Text("= 3 values", font_size=38, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.25).move_to(RIGHT * 3.0 + DOWN * 0.3)
        self.play(FadeIn(steps2, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans2 = answer_card(self, "= 3", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, dots_viz, steps2, ans2)), run_time=_rt(0.45))

        # Example 3: Histogram bars
        q3 = "Do histogram bars touch (no gaps)? (yes/no)"
        q_text = Text(_wrap("Q: " + q3, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        # Histogram visualization
        histogram = VGroup(
            Rectangle(width=0.6, height=1.0, fill_color=pal["accent"], fill_opacity=0.7,
                     stroke_color=WHITE, stroke_width=2),
            Rectangle(width=0.6, height=1.4, fill_color=pal["accent"], fill_opacity=0.7,
                     stroke_color=WHITE, stroke_width=2),
            Rectangle(width=0.6, height=0.8, fill_color=pal["accent"], fill_opacity=0.7,
                     stroke_color=WHITE, stroke_width=2),
        ).arrange(RIGHT, buff=0).move_to(LEFT * 2.8 + DOWN * 0.8)
        self.play(FadeIn(histogram), run_time=_rt(0.6))

        steps3 = VGroup(
            Text("Histograms group data", font_size=32, color=pal["step"]),
            Text("Each bar = equal interval", font_size=32, color=pal["step"]),
            Text("Bars TOUCH (no gaps)", font_size=38, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.25).move_to(RIGHT * 3.0 + DOWN * 0.3)
        self.play(FadeIn(steps3, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans3 = answer_card(self, "= yes", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, histogram, steps3, ans3)), run_time=_rt(0.45))

        # Strategy reinforcement
        tip = pro_tip(self, self.DOMAIN, self.seed, pal)
        self.wait(0.8)
        self.play(FadeOut(tip), run_time=_rt(0.45))
