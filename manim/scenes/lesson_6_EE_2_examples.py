"""6.EE Unit 2 examples - Substitute & evaluate (pedagogy sample).
Math (verified):
  1. Evaluate 2x + 5 when x = 4   -> 13
  2. Evaluate 3 + x  when x = 6   -> 9
  3. Evaluate x - 4  when x = 7   -> 3
Misconception shown: 2x + 5 read as 2 + x + 5 (drops the multiplication).
"""
from manim import *  # noqa: F401,F403
import _mascot as M
import _visuals as V
from _helpers import (
    LearningExperienceDeck, title_bar, place_mascot,
    prediction_hook, method_label, misconception_scene, pro_tip, answer_card,
    EXAMPLE_OUTROS, palette_for, _seed, _rt,
)


class Lesson6EE2Examples(LearningExperienceDeck):
    TITLE = "Substitute & evaluate"
    DOMAIN = "6.EE"

    def outro_pool(self):
        return EXAMPLE_OUTROS

    def lesson(self):
        pal = self.pal
        mascot = self.mascot

        # ── Prediction hook ───────────────────────────────────────
        hook = prediction_hook(self, "If x = 4, what is 2x?", pal)
        M.think(self, mascot)
        self.wait(0.3)
        self.play(FadeOut(hook), run_time=_rt(0.4))

        # ── Method A: dot array (visual / intuitive) ─────────────
        lblA = method_label("Visual: 2 groups of 4", BLUE)
        lblA.to_edge(UP, buff=1.1).shift(LEFT * 3.1)
        self.play(FadeIn(lblA, shift=UP * 0.15), run_time=_rt(0.5))

        grid = V.dot_array(rows=2, cols=4, color=BLUE, dot_r=0.18, gap=0.55)
        grid.move_to(LEFT * 3.0 + DOWN * 0.4)
        self.play(FadeIn(grid, shift=DOWN * 0.2), run_time=_rt(0.6))
        # Pulse each row to encode "2 × 4 = 8" as motion.
        V.group_array(self, grid, run_time=0.9)
        eq_8 = Text("= 8", font_size=28, color=BLUE, weight="BOLD").next_to(grid, DOWN, buff=0.3)
        self.play(Write(eq_8), run_time=_rt(0.5))
        M.blink(self, mascot)

        # Add 5 yellow dots for "+ 5".
        plus = Text("+ 5", font_size=28, color=YELLOW, weight="BOLD").next_to(eq_8, RIGHT, buff=0.35)
        self.play(FadeIn(plus, shift=RIGHT * 0.2), run_time=_rt(0.4))
        extras = VGroup(*[Dot([(-2.6 + i * 0.45), -2.0, 0], radius=0.16, color=YELLOW) for i in range(5)])
        self.play(FadeIn(extras, lag_ratio=0.08), run_time=_rt(0.8))
        self.wait(0.3)

        # ── Method B: symbolic (right side) ──────────────────────
        lblB = method_label("Symbolic", GREEN)
        lblB.to_edge(UP, buff=1.1).shift(RIGHT * 3.0)
        self.play(FadeIn(lblB, shift=UP * 0.15), run_time=_rt(0.5))

        sym_lines = VGroup(
            Text("2x + 5", font_size=28, color=WHITE),
            Text("2(4) + 5", font_size=28, color=WHITE),
            Text("8 + 5", font_size=28, color=WHITE),
        ).arrange(DOWN, buff=0.32, aligned_edge=LEFT)
        sym_lines.next_to(lblB, DOWN, buff=0.3)
        for ln in sym_lines:
            self.play(FadeIn(ln, shift=DOWN * 0.15), run_time=_rt(0.55))
        # Big green answer card centered between the two methods.
        ans = answer_card(self, "= 13", GREEN, mascot, pos=DOWN * 2.7 + RIGHT * 2.6)
        self.wait(0.5)

        # Clear out the example before the misconception.
        self.play(FadeOut(VGroup(lblA, grid, eq_8, plus, extras, lblB, sym_lines, ans)),
                  run_time=_rt(0.55))

        # ── Misconception scene ──────────────────────────────────
        misc = misconception_scene(
            self,
            wrong_expr="2x = 2 + x  → 11",
            correct_expr="2x = 2·x  → 13",
            mascot=mascot,
            pal=pal,
        )
        self.wait(0.6)
        self.play(FadeOut(misc), run_time=_rt(0.5))

        # ── A second quick example to hit the ≥3 example bar ─────
        q2 = Text("Q: 3 + x   when x = 6", font_size=26, color=YELLOW, weight="BOLD")
        q2.to_edge(UP, buff=1.1).shift(LEFT * 2.4)
        self.play(Write(q2), run_time=_rt(0.6))
        nb = V.number_bond(whole=9, parts=(3, 6), color=BLUE)
        nb.move_to(LEFT * 2.8 + DOWN * 0.4)
        self.play(FadeIn(nb, shift=DOWN * 0.15), run_time=_rt(0.6))
        sym2 = VGroup(
            Text("3 + x", font_size=26, color=WHITE),
            Text("3 + 6", font_size=26, color=WHITE),
            Text("= 9", font_size=30, color=GREEN, weight="BOLD"),
        ).arrange(DOWN, buff=0.28, aligned_edge=LEFT).next_to(q2, DOWN, buff=0.3).shift(RIGHT * 4.6)
        for ln in sym2:
            self.play(FadeIn(ln, shift=DOWN * 0.15), run_time=_rt(0.45))
        M.cheer(self, mascot)
        self.wait(0.4)
        self.play(FadeOut(VGroup(q2, nb, sym2)), run_time=_rt(0.45))

        # ── Third example ────────────────────────────────────────
        q3 = Text("Q: x - 4   when x = 7", font_size=26, color=YELLOW, weight="BOLD")
        q3.to_edge(UP, buff=1.1).shift(LEFT * 2.4)
        self.play(Write(q3), run_time=_rt(0.6))
        nl = V.number_line(lo=0, hi=8, dots=(7,), color=BLUE)
        nl.move_to(LEFT * 1.5 + DOWN * 0.5)
        self.play(FadeIn(nl), run_time=_rt(0.5))
        runner = Dot(nl.nl.n2p(7), color=YELLOW, radius=0.14)
        self.play(FadeIn(runner), run_time=_rt(0.3))
        # Slide the marker 4 steps left to encode subtraction.
        V.slide_on_number_line(self, nl, runner, 7, 3, run_time=0.9)
        sym3 = Text("7 - 4 = 3", font_size=32, color=GREEN, weight="BOLD")
        sym3.next_to(nl, DOWN, buff=0.45)
        self.play(Write(sym3), run_time=_rt(0.6))
        M.cheer(self, mascot)
        self.wait(0.4)
        self.play(FadeOut(VGroup(q3, nl, runner, sym3)), run_time=_rt(0.45))

        # ── Pro tip ──────────────────────────────────────────────
        tip = pro_tip(self, self.DOMAIN, self.seed, pal)
        self.wait(0.9)
        self.play(FadeOut(tip), run_time=_rt(0.4))
