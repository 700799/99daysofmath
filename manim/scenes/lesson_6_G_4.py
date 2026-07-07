"""6.G Unit 4 — Surface area with nets  (TeachingDeck)

Math (verified):
  • A net has 3 pairs of matching faces (front/back, left/right, top/bottom).
  • Example: cube with edge 3.
      One face = 3 × 3 = 9 square units.
      6 faces × 9 = 54.  So SA = 54 square units.
"""
import numpy as np
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card
import _geo as G


class Lesson6G4(TeachingDeck):
    TITLE = "Surface area with nets"
    DOMAIN = "6.G"
    HOOK = "A cube-shaped gift box — if you unfold it flat, what shape do the faces make?"
    RECAP = [
        "A net = the solid unfolded flat",
        "Surface area = add up EVERY face",
        "A box has 3 pairs of matching faces",
    ]

    def concept(self):
        pal = self.pal
        cube = G.cuboid(2, 2, 2, u=0.55, color=BLUE, grid=False)
        cube.shift(np.array([-5.6, -0.9, 0.0]))
        lbl = Text("A solid box...", font_size=26, color=pal["step"],
                   weight="BOLD").move_to(RIGHT * 1.0 + UP * 0.9)
        self.reveal(Create(cube), FadeIn(lbl), rt=1.7)
        self.breathe(1.8)
        self.reveal(FadeOut(cube), FadeOut(lbl), rt=1.2)

        s = 0.72
        pairs = [
            ((0, 1), GREEN, "left"), ((1, 1), BLUE, "front"),
            ((2, 1), GREEN, "right"), ((3, 1), BLUE, "back"),
            ((1, 2), ORANGE, "top"), ((1, 0), ORANGE, "bottom"),
        ]
        net = VGroup()
        for (col, row), color, name in pairs:
            sq = Square(side_length=s, stroke_color=WHITE, stroke_width=2.5,
                       fill_color=color, fill_opacity=0.55)
            sq.move_to(RIGHT * col * s + UP * row * s)
            net.add(sq)
        net.move_to(LEFT * 3.3 + UP * 0.1)

        self.reveal(LaggedStart(*[FadeIn(sq, scale=1.1) for sq in net], lag_ratio=0.15), rt=1.8)
        note1 = Text("...unfolds into a flat NET", font_size=27, color=pal["step"],
                     weight="BOLD").move_to(RIGHT * 1.6 + UP * 1.7)
        self.reveal(FadeIn(note1, shift=UP * 0.15), rt=1.2)
        self.breathe(1.8)

        note2 = Text("Same color = matching pair", font_size=27, color=YELLOW,
                     weight="BOLD").next_to(note1, DOWN, buff=0.5)
        self.reveal(FadeIn(note2, shift=UP * 0.15), rt=1.2)
        self.breathe(1.6)

        note3 = Text("3 pairs → 6 faces total", font_size=27, color=pal["answer"],
                     weight="BOLD").next_to(note2, DOWN, buff=0.5)
        self.reveal(FadeIn(note3, shift=UP * 0.15), rt=1.2)
        self.breathe(2.0)

        return VGroup(net, note1, note2, note3)

    def example(self):
        pal = self.pal
        q = Text("Cube with edge 3. Surface area?", font_size=30,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.2)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        u = 0.6
        cube = G.cuboid(3, 3, 3, u=u, color=ORANGE, grid=True)
        cube.shift(np.array([-5.6, -1.5, 0.0]))
        W = 3 * u
        edge_lbl = Text("3", font_size=28, color=YELLOW, weight="BOLD")
        edge_lbl.move_to(G.P(W / 2, -0.35) + np.array([-5.6, -1.5, 0.0]))
        self.reveal(Create(cube), FadeIn(edge_lbl), rt=1.6)
        self.breathe(1.6)

        one_face = Text("One face: 3 × 3 = 9", font_size=26, color=pal["step"],
                        weight="BOLD").move_to(RIGHT * 1.8 + DOWN * 2.4)
        self.reveal(FadeIn(one_face, shift=UP * 0.15), rt=1.2)
        self.breathe(1.6)

        steps = self.step_lines([
            ("6 faces, each = 9", pal["step"]),
            ("6 × 9", YELLOW),
        ], anchor=RIGHT * 1.8 + UP * 1.1, size=30, gap=0.4)

        ans = answer_card(self, "SA = 54 square units", pal["answer"],
                          self.mascot, pos=RIGHT * 1.8 + DOWN * 0.6)
        self.breathe(2.0)
        return VGroup(q, cube, edge_lbl, one_face, steps, ans)
