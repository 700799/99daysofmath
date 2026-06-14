"""6.RP Unit 4 examples — Part-to-part vs part-to-whole.
Math (verified from the lesson plan):
  1. 3 boys and 2 girls. Ratio of boys to the whole class? -> 3:5
  2. A bowl has 4 apples and 6 pears. Ratio of apples to all fruit? -> 2:5
  3. In a 2:3 paint mix (red:blue), what fraction is red? -> 2/5
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck, _rt, palette_for, expert_move, pro_tip, answer_card
from _helpers import _wrap
import _mascot as M
import _visuals as V


class Lesson6RP4Examples(ExamplesDeck):
    TITLE = "Examples · Part-to-part vs part-to-whole"
    DOMAIN = "6.RP"

    def lesson(self):
        pal = self.pal
        em = expert_move(self, self.DOMAIN, self.seed, pal)
        self.play(FadeOut(em), run_time=_rt(0.4))

        # Example 1: 3 boys and 2 girls
        q1 = "3 boys and 2 girls. Ratio of boys to the whole class?"
        q_text = Text(_wrap("Q: " + q1, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        # Tape diagram: 3 boys + 2 girls
        tape1 = V.ratio_tape_diagram(3, 2, label_a="Boys", label_b="Girls",
                                    color_a=pal["accent"], color_b=pal["step"])
        tape1.scale(0.75).move_to(LEFT * 2.8 + DOWN * 1.0)
        self.play(FadeIn(tape1), run_time=_rt(0.6))

        steps1 = VGroup(
            Text("Total = 3 + 2 = 5", font_size=32, color=pal["step"]),
            Text("Boys to whole = 3:5", font_size=38, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.3).move_to(RIGHT * 3.0 + DOWN * 0.5)
        self.play(FadeIn(steps1, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans1 = answer_card(self, "= 3:5", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, tape1, steps1, ans1)), run_time=_rt(0.45))

        # Example 2: 4 apples and 6 pears
        q2 = "A bowl has 4 apples and 6 pears. Ratio of apples to all fruit?"
        q_text = Text(_wrap("Q: " + q2, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        tape2 = V.ratio_tape_diagram(4, 6, label_a="Apples", label_b="Pears",
                                    color_a=pal["accent"], color_b=pal["step"])
        tape2.scale(0.7).move_to(LEFT * 2.8 + DOWN * 1.0)
        self.play(FadeIn(tape2), run_time=_rt(0.6))

        steps2 = VGroup(
            Text("Total = 4 + 6 = 10", font_size=32, color=pal["step"]),
            Text("Apples to total = 4:10", font_size=32, color=pal["step"]),
            Text("Simplify = 2:5", font_size=38, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.25).move_to(RIGHT * 3.0 + DOWN * 0.3)
        self.play(FadeIn(steps2, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans2 = answer_card(self, "= 2:5", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, tape2, steps2, ans2)), run_time=_rt(0.45))

        # Example 3: 2:3 paint mix
        q3 = "In a 2:3 paint mix (red:blue), what fraction is red?"
        q_text = Text(_wrap("Q: " + q3, 40), font_size=36, color=pal["accent"], weight="BOLD")
        q_text.to_edge(UP, buff=0.85)
        self.play(Write(q_text), run_time=_rt(0.85))
        M.think(self, self.mascot)

        tape3 = V.ratio_tape_diagram(2, 3, label_a="Red", label_b="Blue",
                                    color_a=pal["accent"], color_b=pal["step"])
        tape3.scale(0.75).move_to(LEFT * 2.8 + DOWN * 1.0)
        self.play(FadeIn(tape3), run_time=_rt(0.6))

        steps3 = VGroup(
            Text("Total parts = 2 + 3 = 5", font_size=32, color=pal["step"]),
            Text("Red = 2 of 5 parts", font_size=32, color=pal["step"]),
            Text("Fraction = 2/5", font_size=38, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.25).move_to(RIGHT * 3.0 + DOWN * 0.3)
        self.play(FadeIn(steps3, shift=DOWN * 0.2), run_time=_rt(0.65))

        ans3 = answer_card(self, "= 2/5", pal["answer"], self.mascot, pos=DOWN * 2.7)
        self.wait(0.3)
        self.section_break()
        self.play(FadeOut(VGroup(q_text, tape3, steps3, ans3)), run_time=_rt(0.45))

        # Strategy reinforcement
        tip = pro_tip(self, self.DOMAIN, self.seed, pal)
        self.wait(0.8)
        self.play(FadeOut(tip), run_time=_rt(0.45))
