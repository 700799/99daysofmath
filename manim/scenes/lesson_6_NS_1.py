"""6.NS Unit 1 — Adding & subtracting decimals.
Math (verified): 3.4 + 1.25 = 4.65 (write as 3.40 + 1.25 to align places).
"""
from manim import *


class Lesson6NS1(Scene):
    def construct(self):
        title = Text("Line up the decimal points", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title), run_time=1.4)

        # Stacked vertical addition; each character monospaced by using a list of Text mobs.
        # Manim's Text uses Pango which isn't monospaced by default — we'll align by
        # building each column and placing characters in a grid.
        def make_row(s, color=WHITE, font_size=44):
            return Text(s, font_size=font_size, color=color, font="Monospace")

        line_a = make_row("3.40")
        line_b = make_row("+ 1.25")
        sum_line = Line(LEFT * 1.5, RIGHT * 1.5, color=WHITE).set_stroke(width=2)
        line_c = make_row("4.65", color=GREEN)

        stack = VGroup(line_a, line_b, sum_line, line_c).arrange(DOWN, buff=0.25, aligned_edge=RIGHT)
        stack.shift(UP * 0.2)
        self.play(Write(line_a), run_time=1.4)
        self.wait(0.42)
        self.play(Write(line_b), run_time=1.4)
        self.wait(0.42)
        # Highlight the decimal column
        col_marker = Line(stack.get_left() + RIGHT * 1.6 + UP * 0.7,
                          stack.get_left() + RIGHT * 1.6 + DOWN * 0.7,
                          color=YELLOW, stroke_width=2).set_opacity(0.6)
        # (decorative — we just emphasize verbally)
        note = Text("Decimal points aligned ↓", font_size=24, color=YELLOW).next_to(stack, UP, buff=0.4)
        self.play(FadeIn(note), run_time=1.4)
        self.play(Create(sum_line), run_time=1.4)
        self.play(Write(line_c), run_time=1.4)
        self.wait(0.56)

        answer = Text("3.4 + 1.25 = 4.65", font_size=36, color=GREEN, weight=BOLD).to_edge(DOWN, buff=0.8)
        self.play(Write(answer), run_time=1.4)
        self.wait(2.8)
# slowed
