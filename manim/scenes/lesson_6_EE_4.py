"""6.EE Unit 4 — One-step equations  (TeachingDeck)

Math (verified):
  • x + 7 = 12 → remove 7 from BOTH sides → x = 12 − 7 = 5.
  • 3x = 15 → divide BOTH sides by 3 → x = 15 ÷ 3 = 5. Check: 3·5 = 15 ✓.
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card


def pan(width=2.4):
    return RoundedRectangle(width=width, height=1.0, corner_radius=0.18,
                            stroke_color=WHITE, stroke_width=4,
                            fill_color=BLUE, fill_opacity=0.08)


class Lesson6EE4(TeachingDeck):
    TITLE = "One-step equations"
    DOMAIN = "6.EE"
    HOOK = "x + 7 = 12 ... what number is hiding inside x?"
    RECAP = [
        "An equation is a balanced scale",
        "Undo with the OPPOSITE operation",
        "Same move on BOTH sides — always",
    ]

    def concept(self):
        pal = self.pal
        # Build the balance scale: beam, fulcrum, two pans.
        beam = Line(LEFT * 3.1, RIGHT * 3.1, stroke_width=6, color=WHITE)
        beam.move_to(UP * 1.6 + LEFT * 0.8)
        post = Polygon([-0.45, -1.0, 0], [0.45, -1.0, 0], [0, 0, 0],
                       stroke_color=WHITE, stroke_width=4,
                       fill_color=BLUE, fill_opacity=0.25)
        post.next_to(beam.get_center(), DOWN, buff=0)
        hang_l = Line(beam.get_start(), beam.get_start() + DOWN * 0.55,
                      stroke_width=4, color=WHITE)
        hang_r = Line(beam.get_end(), beam.get_end() + DOWN * 0.55,
                      stroke_width=4, color=WHITE)
        pan_l = pan().next_to(hang_l, DOWN, buff=0)
        pan_r = pan().next_to(hang_r, DOWN, buff=0)
        scale = VGroup(beam, post, hang_l, hang_r, pan_l, pan_r)
        self.reveal(Create(beam), FadeIn(post), rt=1.4)
        self.reveal(Create(hang_l), Create(hang_r), FadeIn(pan_l), FadeIn(pan_r),
                    rt=1.3)

        # Load the pans: x-box and a 7-weight on the left, 12 on the right.
        xbox = Square(side_length=0.62, stroke_color=YELLOW, stroke_width=4,
                      fill_color=YELLOW, fill_opacity=0.15)
        xlab = Text("x", font_size=30, weight="BOLD", color=YELLOW).move_to(xbox)
        xg = VGroup(xbox, xlab)
        w7 = Circle(radius=0.34, stroke_color=ORANGE, stroke_width=4,
                    fill_color=ORANGE, fill_opacity=0.25)
        w7l = Text("7", font_size=28, weight="BOLD", color=ORANGE).move_to(w7)
        w7g = VGroup(w7, w7l)
        left_load = VGroup(xg, w7g).arrange(RIGHT, buff=0.25).move_to(pan_l)
        right_load = Text("12", font_size=36, weight="BOLD",
                          color=GREEN).move_to(pan_r)
        self.reveal(FadeIn(left_load, shift=DOWN * 0.3),
                    FadeIn(right_load, shift=DOWN * 0.3), rt=1.4)

        eq_lbl = Text("x + 7  =  12", font_size=34, color=pal["step"],
                      weight="BOLD")
        eq_lbl.move_to(DOWN * 0.6 + LEFT * 0.8)
        bal = Text("balanced: both sides equal", font_size=24, color=BLUE,
                   weight="BOLD").next_to(eq_lbl, DOWN, buff=0.25)
        self.reveal(FadeIn(eq_lbl, shift=UP * 0.15), FadeIn(bal), rt=1.3)
        self.breathe(2.0)

        # The move: take 7 off BOTH sides so it stays balanced.
        move = Text("Undo +7 → take 7 off BOTH sides", font_size=27,
                    color=YELLOW, weight="BOLD")
        move.move_to(DOWN * 1.7 + LEFT * 1.2)
        self.reveal(FadeIn(move, shift=UP * 0.15), rt=1.3)
        new_right = Text("5", font_size=36, weight="BOLD",
                         color=GREEN).move_to(pan_r)
        self.reveal(FadeOut(w7g, shift=DOWN * 0.6),
                    Transform(right_load, new_right), rt=1.5)
        self.breathe(1.6)

        result = Text("x  =  5", font_size=36, color=GREEN, weight="BOLD")
        result.move_to(DOWN * 2.5 + LEFT * 1.2)
        self.reveal(FadeIn(result, scale=1.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(scale, left_load, right_load, eq_lbl, bal, move, result)

    def example(self):
        pal = self.pal
        q = Text("Solve 3x = 15", font_size=34, color=pal["accent"],
                 weight="BOLD")
        q.move_to(UP * 2.0)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.6)

        # 3x means three x-boxes sharing 15 equally.
        boxes = VGroup(*[
            VGroup(Square(side_length=0.6, stroke_color=YELLOW, stroke_width=4,
                          fill_color=YELLOW, fill_opacity=0.15),
                   Text("x", font_size=28, weight="BOLD", color=YELLOW))
            for _ in range(3)
        ])
        for b in boxes:
            b[1].move_to(b[0])
        boxes.arrange(RIGHT, buff=0.2).move_to(UP * 0.95 + LEFT * 2.6)
        eq15 = Text("=  15", font_size=36, weight="BOLD", color=pal["step"])
        eq15.next_to(boxes, RIGHT, buff=0.4)
        hint = Text("3 equal boxes make 15", font_size=24, color=BLUE,
                    weight="BOLD").next_to(VGroup(boxes, eq15), DOWN, buff=0.25)
        self.reveal(LaggedStart(*[GrowFromCenter(b) for b in boxes],
                                lag_ratio=0.25), FadeIn(eq15), rt=1.6)
        self.reveal(FadeIn(hint, shift=UP * 0.15), rt=1.2)
        self.breathe(1.8)

        steps = self.step_lines([
            "undo ×3 → divide BOTH sides by 3",
            "x = 15 ÷ 3",
            "x = 5",
            ("check:  3 · 5 = 15  ✓", GREEN),
        ], anchor=DOWN * 0.35 + LEFT * 1.0, size=28, gap=0.3)
        self.breathe(1.6)

        ans = answer_card(self, "x = 5", pal["answer"], self.mascot,
                          pos=DOWN * 2.65 + LEFT * 1.0)
        self.breathe(1.8)
        return VGroup(q, boxes, eq15, hint, steps, ans)
