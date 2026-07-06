"""6.G Unit 3 — Volume of prisms  (TeachingDeck)

Math (verified):
  • Concept box: length 4, depth 2, height 3.
      One layer (top view) = length × depth = 4 × 2 = 8 unit cubes.
      Stack 3 layers: 8 × 3 = 24 unit cubes. V = l × w × h = 4 × 2 × 3 = 24.
  • Example box: ½ × 3 × 4.
      3 × 4 = 12 (the flat footprint).
      ½ × 12 = 6.  So V = 6 cubic units.
"""
import numpy as np
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card
import _geo as G


class Lesson6G3(TeachingDeck):
    TITLE = "Volume of prisms"
    DOMAIN = "6.G"
    HOOK = "A toy chest is 4 cubes long, 2 cubes deep, 3 cubes tall. How many unit cubes fill it?"
    RECAP = [
        "V = length × width × height",
        "One layer = l × w, then stack h layers",
        "Answer is always in CUBIC units",
    ]

    def concept(self):
        pal = self.pal
        u = 0.55
        l, w, h = 4, 2, 3
        ov = np.array([-5.9, -1.55, 0.0])
        box = G.cuboid(l, w, h, u=u, color=BLUE, grid=True).shift(ov)
        W, H = l * u, h * u
        Dx, Dy = w * 0.62 * u, w * 0.38 * u

        self.reveal(Create(box), rt=1.8)
        self.breathe(1.6)

        len_lbl = Text("4", font_size=28, color=YELLOW, weight="BOLD")
        len_lbl.move_to(G.P(W / 2, -0.35) + ov)
        hgt_lbl = Text("3", font_size=28, color=YELLOW, weight="BOLD")
        hgt_lbl.move_to(G.P(-0.35, H / 2) + ov)
        dep_lbl = Text("2", font_size=28, color=YELLOW, weight="BOLD")
        dep_lbl.move_to(G.P(W + Dx / 2 + 0.25, H + Dy / 2 + 0.15) + ov)
        self.reveal(FadeIn(len_lbl), FadeIn(hgt_lbl), FadeIn(dep_lbl), rt=1.3)
        self.breathe(1.6)

        # Highlight the top face: it IS one layer, seen from above.
        top_face = Polygon(G.P(0, H) + ov, G.P(W, H) + ov,
                           G.P(W + Dx, H + Dy) + ov, G.P(Dx, H + Dy) + ov,
                           stroke_color=YELLOW, stroke_width=4,
                           fill_color=YELLOW, fill_opacity=0.35)
        self.reveal(FadeIn(top_face), rt=1.3)
        note1 = Text("One layer from above: 4 × 2 = 8 cubes", font_size=26,
                     color=pal["step"], weight="BOLD").move_to(RIGHT * 1.5 + UP * 2.15)
        self.reveal(FadeIn(note1, shift=UP * 0.15), rt=1.2)
        self.breathe(1.8)

        note2 = Text("Stack 3 layers: 8 × 3 = 24", font_size=26,
                     color=YELLOW, weight="BOLD").next_to(note1, DOWN, buff=0.4)
        self.reveal(FadeIn(note2, shift=UP * 0.15), rt=1.2)
        self.breathe(1.8)

        formula = Text("V = l × w × h", font_size=32, color=pal["answer"],
                       weight="BOLD").next_to(note2, DOWN, buff=0.5)
        self.reveal(FadeIn(formula, scale=1.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(box, len_lbl, hgt_lbl, dep_lbl, top_face, note1, note2, formula)

    def example(self):
        pal = self.pal
        q = Text("A box is ½ tall, 3 long, 4 deep. Volume?", font_size=28,
                 color=pal["accent"], weight="BOLD").move_to(UP * 2.35)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        u = 0.62
        l, w, h = 3, 4, 0.5
        ov = np.array([-5.9, -1.5, 0.0])
        box = G.cuboid(l, w, h, u=u, color=ORANGE, grid=False).shift(ov)
        W, H = l * u, h * u
        Dx, Dy = w * 0.62 * u, w * 0.38 * u
        len_lbl = Text("3", font_size=26, color=YELLOW, weight="BOLD")
        len_lbl.move_to(G.P(W / 2, -0.35) + ov)
        dep_lbl = Text("4", font_size=26, color=YELLOW, weight="BOLD")
        dep_lbl.move_to(G.P(W + Dx / 2 + 0.25, H + Dy / 2 + 0.15) + ov)
        hgt_lbl = Text("½", font_size=26, color=YELLOW, weight="BOLD")
        hgt_lbl.move_to(G.P(-0.4, H / 2 + 0.1) + ov)

        self.reveal(Create(box), FadeIn(len_lbl), FadeIn(dep_lbl), FadeIn(hgt_lbl), rt=1.6)
        note = Text("Short box — only ½ a unit tall!", font_size=24,
                    color=pal["step"], weight="BOLD").move_to(RIGHT * 1.9 + DOWN * 2.35)
        self.reveal(FadeIn(note, shift=UP * 0.15), rt=1.2)
        self.breathe(1.8)

        steps = self.step_lines([
            ("V = l × w × h", pal["step"]),
            ("½ × 3 × 4 = ½ × 12", pal["step"]),
        ], anchor=RIGHT * 1.9 + UP * 1.2, size=28, gap=0.4)

        ans = answer_card(self, "V = 6 cubic units", pal["answer"],
                          self.mascot, pos=RIGHT * 1.9 + DOWN * 0.9)
        self.breathe(2.0)
        return VGroup(q, box, len_lbl, dep_lbl, hgt_lbl, note, steps, ans)
