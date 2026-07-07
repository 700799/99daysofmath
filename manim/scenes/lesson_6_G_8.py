"""6.G Unit 8 — Volume of right rectangular prisms (fractional edges)  (TeachingDeck)

Math (verified):
  • ½ × ½ × 4: ½×½=¼ (base area), ¼×4=1. V = 1 cubic unit.
  • Check: 1×3×5=15; 2×4×5: 2×4=8, 8×5=40.
"""
import numpy as np
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card
import _geo as G


class Lesson6G8(TeachingDeck):
    TITLE = "Volume with fractional edges"
    DOMAIN = "6.G"
    HOOK = "A tiny box: ½ unit by ½ unit by 4 units tall — is its volume bigger or smaller than 1?"
    RECAP = [
        "V = length × width × height",
        "Multiply fractions straight across",
        "Answer is always in CUBIC units",
    ]

    def concept(self):
        pal = self.pal
        u = 1.1
        ov = np.array([-5.4, -1.9, 0.0])
        cube = G.cuboid(1, 1, 1, u=u, color=BLUE, grid=False).shift(ov)
        cube_lbl = Text("a whole unit cube", font_size=22, color=BLUE, weight="BOLD").next_to(cube, DOWN, buff=0.3)
        self.reveal(Create(cube), FadeIn(cube_lbl), rt=1.6)
        self.breathe(1.6)

        u2 = 1.1
        ov2 = np.array([-2.6, -1.9, 0.0])
        base = Square(side_length=0.5 * u2, color=ORANGE, fill_color=ORANGE, fill_opacity=0.4, stroke_width=3)
        base.move_to(G.P(0.25 * u2, 0.25 * u2) + ov2)
        base_lbl = Text("½ × ½ base = ¼", font_size=22, color=ORANGE, weight="BOLD").next_to(base, DOWN, buff=0.3)
        self.reveal(FadeIn(base), FadeIn(base_lbl), rt=1.4)
        self.breathe(1.6)

        tower = Rectangle(width=0.5 * u2, height=2.2, color=GREEN, fill_color=GREEN,
                          fill_opacity=0.35, stroke_width=3).move_to(base.get_center() + UP * 1.5)
        tower_lbl = Text("stacked 4 tall", font_size=22, color=GREEN, weight="BOLD").next_to(tower, RIGHT, buff=0.3)
        self.reveal(Transform(base.copy(), tower), FadeIn(tower_lbl), rt=1.6)
        self.breathe(1.8)

        cap = Text("¼ base × 4 tall = 1", font_size=28, color=pal["accent"],
                   weight="BOLD").move_to(UP * 2.3)
        self.reveal(FadeIn(cap, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(cube, cube_lbl, base, base_lbl, tower, tower_lbl, cap)

    def example(self):
        pal = self.pal
        q = Text("Box: ½ × ½ × 4. Volume?", font_size=30, color=pal["accent"], weight="BOLD")
        q.move_to(UP * 2.3)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.8)

        u = 1.0
        ov = np.array([-5.6, -1.9, 0.0])
        box = Rectangle(width=0.5 * u, height=2.4, color=ORANGE, fill_color=ORANGE,
                        fill_opacity=0.4, stroke_width=3).move_to(G.P(0.25 * u, 1.2) + ov)
        lbl_w = Text("½", font_size=24, color=YELLOW, weight="BOLD").next_to(box, DOWN, buff=0.15)
        lbl_h = Text("4", font_size=24, color=YELLOW, weight="BOLD").next_to(box, LEFT, buff=0.2)
        self.reveal(Create(box), FadeIn(lbl_w), FadeIn(lbl_h), rt=1.5)
        self.breathe(1.6)

        steps = self.step_lines([
            ("½ × ½ = ¼", pal["step"]),
            ("¼ × 4 = 1", pal["step"]),
        ], anchor=RIGHT * 1.8 + UP * 1.0, size=28, gap=0.4)

        ans = answer_card(self, "V = 1 cubic unit", pal["answer"], self.mascot, pos=RIGHT * 1.8 + DOWN * 1.2)
        self.breathe(2.0)
        return VGroup(q, box, lbl_w, lbl_h, steps, ans)
