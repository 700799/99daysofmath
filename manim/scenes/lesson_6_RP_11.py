"""6.RP Unit 11 — Speed: distance, rate & time  (TeachingDeck)

Math (verified):
  • d = r × t links the three. Cover-up triangle: d on top, r and t below →
    d = r × t, r = d ÷ t, t = d ÷ r.
  • Concept check: 12 mph for 3 hours → d = 12 × 3 = 36 miles.
  • Example: 60 mph for 30 MINUTES. Units must match:
    30 min ÷ 60 = 0.5 hour → d = 60 × 0.5 = 30 miles.
    (Check: an hour at 60 mph is 60 miles, half an hour is half of it = 30. ✓)
"""
from manim import *  # noqa: F401,F403
from _helpers import TeachingDeck, answer_card, _wrap


class Lesson6RP11(TeachingDeck):
    TITLE = "Speed: distance, rate & time"
    DOMAIN = "6.RP"
    HOOK = "A cyclist rides 12 mph for 3 hours. Guess: how far did she go?"
    RECAP = [
        "d = r × t",
        "Cover what you want: r = d ÷ t, t = d ÷ r",
        "Match the units FIRST (min ÷ 60 → hours)",
    ]

    def concept(self):
        pal = self.pal
        # The d-r-t triangle: d on top, r and t side by side below.
        tri = Polygon([-1.8, -1.0, 0], [1.8, -1.0, 0], [0, 1.2, 0],
                      stroke_color=pal["accent"], stroke_width=4,
                      fill_color=BLUE, fill_opacity=0.08)
        mid = Line([-1.25, 0.1, 0], [1.25, 0.1, 0],
                   stroke_color=pal["accent"], stroke_width=3)
        vert = Line([0, 0.1, 0], [0, -1.0, 0],
                    stroke_color=pal["accent"], stroke_width=3)
        d_lbl = Text("d", font_size=44, color=YELLOW, weight="BOLD")
        d_lbl.move_to([0, 0.62, 0])
        r_lbl = Text("r", font_size=40, color=GREEN, weight="BOLD")
        r_lbl.move_to([-0.75, -0.5, 0])
        t_lbl = Text("t", font_size=40, color=ORANGE, weight="BOLD")
        t_lbl.move_to([0.75, -0.5, 0])
        tri_g = VGroup(tri, mid, vert, d_lbl, r_lbl, t_lbl)
        tri_g.move_to(LEFT * 3.6 + UP * 0.9)
        name = Text("distance = rate × time", font_size=26,
                    color=pal["step"], weight="BOLD")
        name.next_to(tri_g, DOWN, buff=0.35)
        self.reveal(Create(tri), Create(mid), Create(vert), rt=1.6)
        self.reveal(FadeIn(d_lbl, scale=1.2), FadeIn(r_lbl, scale=1.2),
                    FadeIn(t_lbl, scale=1.2), FadeIn(name), rt=1.5)
        self.breathe(2.0)

        # Cover-up trick: hide the one you want, what's left is the recipe.
        trick = Text("Cover the one you want:", font_size=26,
                     color=pal["accent"], weight="BOLD")
        trick.move_to(RIGHT * 2.1 + UP * 2.05)
        self.reveal(FadeIn(trick, shift=DOWN * 0.15), rt=1.2)
        forms = VGroup(
            Text("d = r × t", font_size=32, color=YELLOW, weight="BOLD"),
            Text("r = d ÷ t", font_size=32, color=GREEN, weight="BOLD"),
            Text("t = d ÷ r", font_size=32, color=ORANGE, weight="BOLD"),
        ).arrange(DOWN, buff=0.32, aligned_edge=LEFT)
        forms.move_to(RIGHT * 2.1 + UP * 0.7)
        for f in forms:
            self.reveal(FadeIn(f, shift=UP * 0.15), rt=1.25)
            self.breathe(1.6)

        # Quick spin: the hook, answered.
        check = Text("12 mph for 3 h → d = 12 × 3 = 36 miles",
                     font_size=27, color=pal["step"], weight="BOLD")
        check.move_to(DOWN * 1.55 + LEFT * 0.7)
        cbox = SurroundingRectangle(check, color=GREEN, buff=0.16,
                                    corner_radius=0.12)
        self.reveal(FadeIn(check, shift=UP * 0.15), Create(cbox), rt=1.5)
        self.breathe(1.8)

        units = Text("Units must match: mph goes with HOURS",
                     font_size=26, color=YELLOW, weight="BOLD")
        units.move_to(DOWN * 2.5 + LEFT * 0.7)
        self.reveal(FadeIn(units, shift=UP * 0.15), rt=1.3)
        self.breathe(2.0)

        return VGroup(tri_g, name, trick, forms, check, cbox, units)

    def example(self):
        pal = self.pal
        q = Text(_wrap("A car drives 60 mph. How far does it go "
                       "in 30 minutes?", 46),
                 font_size=29, color=pal["step"], weight="BOLD")
        q.move_to(UP * 1.95)
        self.reveal(FadeIn(q, shift=DOWN * 0.15), rt=1.2)
        self.breathe(1.8)

        # One hour bar = 60 miles; we only drive HALF of it.
        hour = Rectangle(width=6.0, height=0.75, stroke_color=WHITE,
                         stroke_width=3, fill_color=BLUE, fill_opacity=0.25)
        hour.move_to(UP * 0.6 + LEFT * 1.0)
        half = Rectangle(width=3.0, height=0.75, stroke_width=0,
                         fill_color=GREEN, fill_opacity=0.65)
        half.align_to(hour, LEFT).align_to(hour, UP)
        h_lbl = Text("1 hour = 60 miles", font_size=24, color=BLUE,
                     weight="BOLD").next_to(hour, UP, buff=0.2)
        half_lbl = Text("30 min = half", font_size=24, color=GREEN,
                        weight="BOLD").next_to(half, DOWN, buff=0.2)
        self.reveal(FadeIn(hour), FadeIn(h_lbl), rt=1.4)
        self.reveal(GrowFromEdge(half, LEFT), FadeIn(half_lbl), rt=1.5)
        self.breathe(2.0)

        steps = self.step_lines([
            ("minutes ≠ hours! 30 ÷ 60 = 0.5 h", YELLOW),
            ("d = r × t = 60 × 0.5", pal["step"]),
            ("= 30 miles", GREEN),
        ], anchor=DOWN * 1.0 + LEFT * 2.9, size=28)
        self.breathe(1.6)

        ans = answer_card(self, "30 miles", pal["answer"], self.mascot,
                          pos=DOWN * 1.6 + RIGHT * 2.7)
        self.breathe(2.0)
        return VGroup(q, hour, half, h_lbl, half_lbl, steps, ans)
