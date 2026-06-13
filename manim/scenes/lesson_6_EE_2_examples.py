"""6.EE Unit 2 examples - Substitute & evaluate (pedagogy sample, big visuals).
Math (verified):
  1. Evaluate 2x + 5 when x = 4   -> 13
  2. Evaluate 3 + x  when x = 6   -> 9
  3. Evaluate x - 4  when x = 7   -> 3
Misconception: 2x read as 2 + x (drops the multiplication).
"""
from manim import *  # noqa: F401,F403
import _mascot as M
import _visuals as V
from _helpers import (
    LearningExperienceDeck, prediction_hook, method_label, misconception_scene,
    pro_tip, expert_move, answer_card, EXAMPLE_OUTROS, _rt,
)


class Lesson6EE2Examples(LearningExperienceDeck):
    TITLE = "Substitute & evaluate"
    DOMAIN = "6.EE"

    def outro_pool(self):
        return EXAMPLE_OUTROS

    def lesson(self):
        pal = self.pal
        mascot = self.mascot

        # ── Prediction hook (big, centered) ──────────────────────
        hook = prediction_hook(self, "If x = 4, what is 2x?", pal)
        M.think(self, mascot)
        self.play(FadeOut(hook), run_time=_rt(0.4))

        # ── Expert move: think-like-a-pro strategy ───────────────
        em = expert_move(self, self.DOMAIN, self.seed, pal)
        self.play(FadeOut(em), run_time=_rt(0.4))

        # ── Method A: ONE big picture filling the frame ──────────
        # [ 2 x 4 blue dots ]  +  [ 5 yellow dots ]  = 13
        lblA = Text("2 groups of 4  +  5 more", font_size=32, color=BLUE, weight="BOLD")
        lblA.to_edge(UP, buff=1.05)
        self.play(FadeIn(lblA, shift=UP * 0.15), run_time=_rt(0.5))

        grid = V.dot_array(rows=2, cols=4, color=BLUE, dot_r=0.30, gap=0.95)
        grid.move_to(LEFT * 3.1 + DOWN * 0.2)
        self.play(FadeIn(grid, shift=DOWN * 0.2), run_time=_rt(0.6))
        V.group_array(self, grid, run_time=1.0)

        plus = Text("+", font_size=60, color=WHITE, weight="BOLD").move_to(LEFT * 0.5 + DOWN * 0.2)
        self.play(FadeIn(plus), run_time=_rt(0.3))

        extras = VGroup(*[
            Dot([(1.2 + (i % 3) * 0.85), (0.45 - (i // 3) * 0.85), 0], radius=0.30, color=YELLOW)
            for i in range(5)
        ])
        self.play(FadeIn(extras, lag_ratio=0.1), run_time=_rt(0.9))
        M.blink(self, mascot)

        # Big running total under the picture.
        total = Text("8  +  5  =  13", font_size=40, color=WHITE, weight="BOLD")
        total.to_edge(DOWN, buff=1.4)
        self.play(Write(total), run_time=_rt(0.7))
        ans = answer_card(self, "13", pal["answer"], mascot, pos=DOWN * 3.1)
        self.section_break("eureka")
        self.play(FadeOut(VGroup(lblA, grid, plus, extras, total, ans)), run_time=_rt(0.5))

        # ── Method B: symbolic, big and centered ─────────────────
        lblB = Text("Now the symbol way", font_size=32, color=GREEN, weight="BOLD")
        lblB.to_edge(UP, buff=1.05)
        self.play(FadeIn(lblB, shift=UP * 0.15), run_time=_rt(0.5))
        sym = VGroup(
            Text("2x + 5", font_size=44, color=WHITE),
            Text("2(4) + 5", font_size=44, color=WHITE),
            Text("8 + 5  =  13", font_size=44, color=GREEN, weight="BOLD"),
        ).arrange(DOWN, buff=0.5)
        sym.move_to(DOWN * 0.2)
        for ln in sym:
            self.play(FadeIn(ln, shift=DOWN * 0.15), run_time=_rt(0.6))
        self.section_break("bounce")
        self.play(FadeOut(VGroup(lblB, sym)), run_time=_rt(0.45))

        # ── Misconception scene ──────────────────────────────────
        misc = misconception_scene(
            self,
            wrong_expr="2x = 2 + x  →  11",
            correct_expr="2x = 2·x  →  13",
            mascot=mascot,
            pal=pal,
        )
        self.section_break("wave_arm")
        self.play(FadeOut(misc), run_time=_rt(0.5))

        # ── Example 2: number bond, big ──────────────────────────
        q2 = Text("3 + x   when x = 6", font_size=34, color=YELLOW, weight="BOLD")
        q2.to_edge(UP, buff=1.05)
        self.play(Write(q2), run_time=_rt(0.6))
        nb = V.number_bond(whole=9, parts=(3, 6), color=BLUE)
        nb.scale(1.5).move_to(DOWN * 0.4)
        self.play(FadeIn(nb, shift=DOWN * 0.15), run_time=_rt(0.6))
        a2 = answer_card(self, "= 9", GREEN, mascot, pos=DOWN * 2.9)
        self.section_break("eureka")
        self.play(FadeOut(VGroup(q2, nb, a2)), run_time=_rt(0.45))

        # ── Example 3: number-line slide, big ────────────────────
        q3 = Text("x - 4   when x = 7", font_size=34, color=YELLOW, weight="BOLD")
        q3.to_edge(UP, buff=1.05)
        self.play(Write(q3), run_time=_rt(0.6))
        nl = V.number_line(lo=0, hi=8, dots=(), color=BLUE)
        nl.scale(1.25).move_to(UP * 0.1)
        self.play(FadeIn(nl), run_time=_rt(0.5))
        runner = Dot(nl.nl.n2p(7), color=YELLOW, radius=0.20)
        self.play(FadeIn(runner, scale=1.4), run_time=_rt(0.3))
        slide_label = Text("slide back 4", font_size=26, color=YELLOW).next_to(nl, UP, buff=0.3)
        self.play(FadeIn(slide_label), run_time=_rt(0.3))
        # n2p uses the scaled coordinates via the submobject transform.
        self.play(runner.animate.move_to(nl.nl.n2p(3)), run_time=_rt(1.0))
        a3 = answer_card(self, "7 - 4 = 3", GREEN, mascot, pos=DOWN * 2.6)
        self.section_break("bounce")
        self.play(FadeOut(VGroup(q3, nl, runner, slide_label, a3)), run_time=_rt(0.45))

        # ── Closing pro tip ──────────────────────────────────────
        tip = pro_tip(self, self.DOMAIN, self.seed, pal)
        self.wait(1.0)
        self.play(FadeOut(tip), run_time=_rt(0.4))
