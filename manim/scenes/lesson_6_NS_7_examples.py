"""6.NS Unit 7 examples — Whole-number addition & subtraction.

This deck OVERRIDES the generic ExamplesDeck so the standard-algorithm steps
get visible place-value columns: each digit sits in a boxed ones / tens /
hundreds cell, carries appear above the next column like a teacher would
tick them, and the answer row fills in green digit by digit.  Exactly what
the user asked for ("boxes for each number placement to track the ones,
tens, hundreds").

Math (verified from the lesson plan):
  1. 425 + 376 = 801
  2. 952 − 387 = 565
  3. 1003 − 247 = 756
"""
from manim import (
    Text, VGroup, FadeIn, FadeOut, Write,
    UP, DOWN, LEFT, RIGHT,
    WHITE, BLUE, GREEN, ORANGE, YELLOW, GOLD,
)
import _mascot as M
import _visuals as V
from _helpers import (
    LearningExperienceDeck, EXAMPLE_OUTROS, _rt, _wrap,
    expert_move, pro_tip,
)


def _column_add(scene, mascot, pal, top: int, bot: int, places: int,
                steps: list[tuple[int, str, str]]) -> VGroup:
    """Build a stacked addition, animate each step with carries.
    `steps` is a list of (col_idx_from_right, result_digit, carry_or_blank)."""
    stack = V.place_value_stack(top, bot, op="+", places=places,
                                top_color=BLUE, bot_color=ORANGE)
    label_band = V.column_label_band(places=places)
    label_band.next_to(stack.top, UP, buff=0.55)
    # Result row blanks below the rule.
    result = V.place_value_row(0, places=places, color=GREEN, box_color=GREEN)
    for n in result.nums:
        n.set_opacity(0)
    result.next_to(stack.rule, DOWN, buff=0.18)
    group = VGroup(label_band, stack, result).move_to(LEFT * 0.5 + DOWN * 0.1)

    scene.play(FadeIn(label_band, shift=DOWN * 0.1), run_time=_rt(0.5))
    scene.play(FadeIn(stack.top, shift=DOWN * 0.1), run_time=_rt(0.6))
    scene.play(FadeIn(stack.bot), Write(stack.op_sym),
               run_time=_rt(0.6))
    scene.play(Write(stack.rule), FadeIn(result), run_time=_rt(0.5))
    M.think(scene, mascot)

    carries = []
    for (col_from_right, result_digit, carry_digit) in steps:
        col = places - 1 - col_from_right
        V.highlight_column(scene, stack.top, col, YELLOW, run_time=_rt(0.3))
        V.highlight_column(scene, stack.bot, col, YELLOW, run_time=_rt(0.3))
        V.write_result_digit(scene, result, col, result_digit, GREEN,
                             run_time=_rt(0.45))
        if carry_digit:
            target_col = col - 1
            if 0 <= target_col < places:
                c = V.carry_above(scene, stack.top, target_col, carry_digit,
                                  YELLOW, run_time=_rt(0.5))
                carries.append(c)
        scene.wait(0.35)
    return VGroup(group, *carries)


def _column_sub(scene, mascot, pal, top: int, bot: int, places: int,
                steps: list[tuple[int, str, str | None]]) -> VGroup:
    """Same shape as _column_add but the op is `−` and the carries
    represent the borrowed digit (small `1` above the next column showing
    a ten was borrowed)."""
    stack = V.place_value_stack(top, bot, op="−", places=places,
                                top_color=BLUE, bot_color=ORANGE)
    label_band = V.column_label_band(places=places)
    label_band.next_to(stack.top, UP, buff=0.55)
    result = V.place_value_row(0, places=places, color=GREEN, box_color=GREEN)
    for n in result.nums:
        n.set_opacity(0)
    result.next_to(stack.rule, DOWN, buff=0.18)
    group = VGroup(label_band, stack, result).move_to(LEFT * 0.5 + DOWN * 0.1)

    scene.play(FadeIn(label_band, shift=DOWN * 0.1), run_time=_rt(0.5))
    scene.play(FadeIn(stack.top, shift=DOWN * 0.1), run_time=_rt(0.6))
    scene.play(FadeIn(stack.bot), Write(stack.op_sym),
               run_time=_rt(0.6))
    scene.play(Write(stack.rule), FadeIn(result), run_time=_rt(0.5))
    M.think(scene, mascot)

    extras = []
    for (col_from_right, result_digit, borrow) in steps:
        col = places - 1 - col_from_right
        V.highlight_column(scene, stack.top, col, YELLOW, run_time=_rt(0.3))
        V.highlight_column(scene, stack.bot, col, YELLOW, run_time=_rt(0.3))
        if borrow:
            target_col = col - 1
            if 0 <= target_col < places:
                c = V.carry_above(scene, stack.top, target_col, borrow,
                                  ORANGE, run_time=_rt(0.5))
                extras.append(c)
        V.write_result_digit(scene, result, col, result_digit, GREEN,
                             run_time=_rt(0.45))
        scene.wait(0.35)
    return VGroup(group, *extras)


class Lesson6NS7Examples(LearningExperienceDeck):
    TITLE = "Examples · Whole-number addition & subtraction"
    DOMAIN = "6.NS"

    def outro_pool(self):
        return EXAMPLE_OUTROS

    def lesson(self):
        pal = self.pal

        # Frame the deck with one expert strategy at the top.
        em = expert_move(self, self.DOMAIN, self.seed, pal)
        self.play(FadeOut(em), run_time=_rt(0.4))

        # ── Example 1: 425 + 376 ───────────────────────────────────────
        q1 = Text("Q:  425 + 376 = ?", font_size=48, weight="BOLD",
                  color=pal["accent"]).to_edge(UP, buff=0.9)
        self.play(Write(q1), run_time=_rt(0.9))
        M.blink(self, self.mascot)
        ex1 = _column_add(
            self, self.mascot, pal, top=425, bot=376, places=3,
            steps=[
                (0, "1", "1"),   # ones: 5+6=11, write 1, carry 1
                (1, "0", "1"),   # tens: 2+7+1=10, write 0, carry 1
                (2, "8", ""),    # hundreds: 4+3+1=8
            ],
        )
        ans1 = Text("= 801", font_size=72, weight="BOLD", color=GREEN)
        ans1.to_edge(DOWN, buff=0.55)
        self.play(FadeIn(ans1, scale=1.15), run_time=_rt(0.6))
        M.cheer(self, self.mascot)
        self.wait(0.6)
        self.checkpoint()
        self.play(FadeOut(VGroup(q1, ex1, ans1)), run_time=_rt(0.5))

        # ── Example 2: 952 − 387 ───────────────────────────────────────
        q2 = Text("Q:  952 − 387 = ?", font_size=48, weight="BOLD",
                  color=pal["accent"]).to_edge(UP, buff=0.9)
        self.play(Write(q2), run_time=_rt(0.9))
        M.think(self, self.mascot)
        ex2 = _column_sub(
            self, self.mascot, pal, top=952, bot=387, places=3,
            steps=[
                (0, "5", "1"),   # 2→12 by borrowing 1 from tens; 12-7=5
                (1, "6", "1"),   # tens now 4→14 by borrowing 1 from hundreds; 14-8=6
                (2, "5", None),  # hundreds 9→8 (since borrowed) − 3 = 5
            ],
        )
        ans2 = Text("= 565", font_size=72, weight="BOLD", color=GREEN)
        ans2.to_edge(DOWN, buff=0.55)
        self.play(FadeIn(ans2, scale=1.15), run_time=_rt(0.6))
        M.cheer(self, self.mascot)
        self.wait(0.6)
        self.checkpoint()
        self.play(FadeOut(VGroup(q2, ex2, ans2)), run_time=_rt(0.5))

        # ── Example 3: 1003 − 247 (4-column variant) ───────────────────
        q3 = Text("Q:  1003 − 247 = ?", font_size=48, weight="BOLD",
                  color=pal["accent"]).to_edge(UP, buff=0.9)
        self.play(Write(q3), run_time=_rt(0.9))
        ex3 = _column_sub(
            self, self.mascot, pal, top=1003, bot=247, places=4,
            steps=[
                (0, "6", "1"),
                (1, "5", "1"),
                (2, "7", "1"),
                (3, "0", None),
            ],
        )
        ans3 = Text("= 756", font_size=72, weight="BOLD", color=GREEN)
        ans3.to_edge(DOWN, buff=0.55)
        self.play(FadeIn(ans3, scale=1.15), run_time=_rt(0.6))
        M.cheer(self, self.mascot)
        self.section_break()
        self.play(FadeOut(VGroup(q3, ex3, ans3)), run_time=_rt(0.5))

        # Strategy reinforcement at the end.
        tip = pro_tip(self, self.DOMAIN, self.seed, pal)
        self.wait(0.8)
        self.play(FadeOut(tip), run_time=_rt(0.45))
