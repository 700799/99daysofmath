"""6.NS Unit 5 — The coordinate plane.
Math (verified):  Point (-3, 5) has x < 0 and y > 0, so it is in Quadrant II.
"""
from manim import *


class Lesson6NS5(Scene):
    def construct(self):
        title = Text("The four quadrants", font_size=40, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        self.play(Write(title))

        axes = Axes(
            x_range=[-6, 6, 1],
            y_range=[-6, 6, 1],
            x_length=6.0,
            y_length=6.0,
            tips=False,
            axis_config={"color": GREY, "include_numbers": False},
        ).shift(DOWN * 0.3)
        x_lbl = Text("x", font_size=22).next_to(axes.x_axis.get_right(), DOWN, buff=0.1)
        y_lbl = Text("y", font_size=22).next_to(axes.y_axis.get_top(), LEFT, buff=0.1)
        self.play(Create(axes), Write(x_lbl), Write(y_lbl))

        # Label the four quadrants
        q_offsets = [
            ("I",   2.5,  2.5),
            ("II", -2.5,  2.5),
            ("III",-2.5, -2.5),
            ("IV",  2.5, -2.5),
        ]
        q_mobs = []
        for name, dx, dy in q_offsets:
            t = Text(name, font_size=24, color=GREY).move_to(axes.c2p(dx, dy))
            q_mobs.append(t)
        self.play(*[FadeIn(m) for m in q_mobs])
        self.wait(0.4)

        # Plot the point (-3, 5)
        pt = Dot(axes.c2p(-3, 5), color=RED, radius=0.12)
        pt_lbl = Text("(-3, 5)", font_size=26, color=RED).next_to(pt, UP, buff=0.18)
        self.play(FadeIn(pt), Write(pt_lbl))

        # Highlight Quadrant II
        q2_label = q_mobs[1]
        self.play(q2_label.animate.set_color(GREEN).scale(1.4))

        # Conclusion
        ans = Text("(-3, 5)  is in  Quadrant II",
                   font_size=32, color=GREEN, weight=BOLD).to_edge(DOWN, buff=0.6)
        self.play(Write(ans))
        self.wait(2)
