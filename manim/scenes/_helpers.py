"""Shared building blocks for lesson videos.

Pedagogy-first decks: every video has a prediction hook, motion-as-reasoning
visuals (Method A), a symbolic Method B, a misconception scene, an optional
pro tip, and a varied closer. Mascot reacts (peek / think / cheer / eureka)
during natural beats. Layout fills the frame; no dead space.

Text color rule (hard): every text role is bright-on-black. We use only
YELLOW, WHITE, BLUE (manim's bright cyan #58C4DD), GREEN (manim's #83C167),
ORANGE, GOLD. Coral RED (#FC6255) is reserved for the misconception "WRONG"
label and its strikethrough.
"""
from manim import (
    Scene, Text, VGroup, FadeIn, FadeOut, Write, Create, Transform, GrowFromCenter,
    SurroundingRectangle, Cross, Line, Dot, Circle, RoundedRectangle,
    UP, DOWN, LEFT, RIGHT, ORIGIN, PI,
    WHITE, BLUE, GREEN, RED, ORANGE, YELLOW, GOLD,
)
import _mascot as M
import _visuals as V

# ── pacing ──────────────────────────────────────────────────────────────
PACE = 1.25


def _rt(t):
    return t * PACE


# ── palettes: only high-contrast-on-black roles ─────────────────────────
# Every entry uses colors from the legible set. Steps always WHITE.
PALETTES = [
    {"title": YELLOW, "accent": BLUE,   "step": WHITE, "answer": GREEN},
    {"title": GOLD,   "accent": YELLOW, "step": WHITE, "answer": BLUE},
    {"title": BLUE,   "accent": YELLOW, "step": WHITE, "answer": GREEN},
    {"title": GREEN,  "accent": YELLOW, "step": WHITE, "answer": ORANGE},
    {"title": ORANGE, "accent": YELLOW, "step": WHITE, "answer": GREEN},
    {"title": YELLOW, "accent": GREEN,  "step": WHITE, "answer": ORANGE},
]


def _seed(text: str) -> int:
    h = 0
    for ch in text:
        h = (h * 31 + ord(ch)) & 0x7FFFFFFF
    return h


def palette_for(seed: int):
    return PALETTES[seed % len(PALETTES)]


# Varied closers (no more "Read the question twice")
EXAMPLE_OUTROS = ["Now you try!", "Your turn!", "Give one a go!", "Ready to practice?", "You've got this!"]
TRAP_OUTROS = ["Now you know!", "Trap dodged!", "Watch for that one!", "Nice catch!", "Too easy now!"]
IDEA_OUTROS = ["That's the idea!", "Now it clicks!", "Keep that in mind!", "Mind = blown!"]

PRO_TIPS = {
    "6.EE": [
        "When you see 2x, that's 2 times x. The dot is hiding.",
        "Plug it in, then do the math in order.",
        "Like terms snap together: 3x + 4x = 7x.",
    ],
    "6.RP": [
        "Rates love friendly numbers. Find the 'for one' first.",
        "Ratios scale. Multiply BOTH sides.",
        "Tables make patterns pop out.",
    ],
    "6.NS": [
        "Negatives flip the order — bigger digits, smaller value.",
        "Number lines never lie. Plot it first.",
        "Decimals are just fractions in disguise.",
    ],
    "6.G": [
        "Big shape - holes = real area.",
        "Area is rows times columns. Always.",
        "Cubic units for volume. Don't mix them up.",
    ],
    "6.SP": [
        "Sort first. Median loves order.",
        "Mean = sum / count. Median = middle.",
        "Outliers yank the mean, not the median.",
    ],
    "5.F": [
        "Same bottom = add the tops.",
        "Pizza slices first. Math second.",
        "Halves of halves are fourths.",
    ],
}


def _wrap(s: str, width: int = 40) -> str:
    if len(s) <= width:
        return s
    out, line = [], ""
    for word in s.split():
        if len(line) + len(word) + 1 > width and line:
            out.append(line)
            line = word
        else:
            line = (line + " " + word).strip()
    if line:
        out.append(line)
    return "\n".join(out)


# ── reusable furniture ──────────────────────────────────────────────────

def title_bar(scene, text, color=YELLOW, size=32):
    title = Text(text, font_size=size, weight="BOLD", color=color)
    title.to_edge(UP, buff=0.3)
    scene.play(Write(title), run_time=_rt(0.8))
    return title


def place_mascot(scene, seed):
    """Bigger, corner-anchored mascot (scale ~0.85)."""
    m, name = M.mascot_for(seed)
    m.scale(0.85).to_corner(DOWN + RIGHT, buff=0.35)
    M.wave_in(scene, m)
    return m


def prediction_hook(scene, prompt, pal):
    """Cold-open beat: a yellow 'guess first' prompt, freeze for ~1.2s."""
    box = RoundedRectangle(width=8.6, height=1.0, corner_radius=0.18,
                           stroke_color=pal["accent"], stroke_width=3,
                           fill_color=BLUE, fill_opacity=0.08)
    box.to_edge(UP, buff=1.2)
    label = Text("🤔  " + prompt, font_size=26, color=pal["accent"], weight="BOLD")
    label.move_to(box)
    scene.play(Create(box), FadeIn(label), run_time=_rt(0.7))
    scene.wait(1.2)
    return VGroup(box, label)


def method_label(text, color):
    return Text(text, font_size=22, weight="BOLD", color=color)


def misconception_scene(scene, wrong_expr, correct_expr, mascot, pal):
    """Show a red wrong attempt, strike it through, then reveal green correction.
    Stacked vertically and centered so long expressions still fit on 480p15."""
    header = Text("Common slip-up", font_size=24, weight="BOLD", color=RED)
    header.to_edge(UP, buff=1.0)
    wrong = Text(wrong_expr, font_size=32, color=RED)
    wrong.next_to(header, DOWN, buff=0.35)
    scene.play(Write(header), Write(wrong), run_time=_rt(0.9))
    M.think(scene, mascot)

    strike = Line(wrong.get_left() + LEFT * 0.1, wrong.get_right() + RIGHT * 0.1,
                  stroke_width=5, color=RED)
    scene.play(Create(strike), run_time=_rt(0.45))
    scene.wait(0.35)

    arrow = Text("↓", font_size=36, color=YELLOW, weight="BOLD").next_to(wrong, DOWN, buff=0.25)
    correct = Text(correct_expr, font_size=32, color=GREEN, weight="BOLD")
    correct.next_to(arrow, DOWN, buff=0.25)
    scene.play(FadeIn(arrow, shift=DOWN * 0.2), FadeIn(correct, shift=DOWN * 0.2),
               run_time=_rt(0.7))
    M.cheer(scene, mascot)
    scene.wait(0.45)
    return VGroup(header, wrong, strike, arrow, correct)


def pro_tip(scene, domain, seed, pal):
    """Pro tip ribbon along the bottom-center; yellow on black."""
    tips = PRO_TIPS.get(domain) or PRO_TIPS["6.EE"]
    tip = tips[seed % len(tips)]
    bulb = Circle(radius=0.18, fill_color=YELLOW, fill_opacity=1, stroke_color=GOLD, stroke_width=2)
    ribbon = RoundedRectangle(width=9.0, height=0.9, corner_radius=0.18,
                              stroke_color=YELLOW, stroke_width=2,
                              fill_color=YELLOW, fill_opacity=0.08)
    ribbon.to_edge(DOWN, buff=0.55)
    label = Text("Pro tip:  " + tip, font_size=22, color=YELLOW, weight="BOLD")
    label.move_to(ribbon)
    bulb.next_to(ribbon, LEFT, buff=0.18)
    g = VGroup(bulb, ribbon, label)
    scene.play(FadeIn(g, shift=UP * 0.2), run_time=_rt(0.7))
    return g


def answer_card(scene, expr, color, mascot, pos=ORIGIN):
    """Big highlighted answer card with mascot cheer beat."""
    a = Text(expr, font_size=44, weight="BOLD", color=color)
    a.move_to(pos)
    box = SurroundingRectangle(a, color=color, buff=0.18, corner_radius=0.14)
    scene.play(FadeIn(a, scale=1.2), Create(box), run_time=_rt(0.85))
    M.cheer(scene, mascot)
    return VGroup(a, box)


# ── decks ───────────────────────────────────────────────────────────────

class LearningExperienceDeck(Scene):
    """Base: subclasses set TITLE, DOMAIN, and override `lesson()`."""
    TITLE = "Lesson"
    DOMAIN = "6.NS"

    def construct(self):
        seed = _seed(self.TITLE)
        pal = palette_for(seed)
        title_bar(self, self.TITLE, color=pal["title"])
        self.mascot = place_mascot(self, seed)
        self.pal = pal
        self.seed = seed
        self.lesson()
        # Closer beat: varied outro + cheer cartwheel.
        outro_pool = self.outro_pool()
        outro = Text(outro_pool[seed % len(outro_pool)],
                     font_size=32, weight="BOLD", color=pal["accent"])
        outro.to_edge(DOWN, buff=0.6)
        self.play(FadeIn(outro, scale=1.1), run_time=_rt(0.7))
        M.cheer(self, self.mascot)
        M.spin(self, self.mascot)
        self.wait(0.4)

    def outro_pool(self):
        return EXAMPLE_OUTROS

    def lesson(self):
        raise NotImplementedError


# ── thin back-compat subclasses so existing 118 generated scenes keep working ──

class ExamplesDeck(LearningExperienceDeck):
    EXAMPLES = []

    def outro_pool(self):
        return EXAMPLE_OUTROS

    def lesson(self):
        pal = self.pal
        for q, steps, answer in self.EXAMPLES:
            q_text = Text(_wrap("Q: " + q, 40), font_size=24, color=pal["accent"])
            q_text.to_edge(UP, buff=1.1).shift(LEFT * 1.0)
            self.play(Write(q_text), run_time=_rt(0.85))
            M.think(self, self.mascot)

            step_objs = VGroup(*[Text(_wrap(s, 38), font_size=22, color=pal["step"]) for s in steps])
            step_objs.arrange(DOWN, buff=0.25, aligned_edge=LEFT)
            step_objs.next_to(q_text, DOWN, buff=0.4).shift(LEFT * 0.2)
            for i, so in enumerate(step_objs):
                self.play(FadeIn(so, shift=DOWN * 0.2), run_time=_rt(0.65))
                if i == 0:
                    M.blink(self, self.mascot)
                self.wait(0.35)

            ans = answer_card(self, f"= {answer}", pal["answer"], self.mascot,
                              pos=DOWN * 2.4 + LEFT * 1.0)
            self.wait(0.6)
            self.play(FadeOut(VGroup(q_text, step_objs, ans)), run_time=_rt(0.45))


class TrapDeck(LearningExperienceDeck):
    WRONG = "common mistake here"
    RIGHT = "do this instead"

    def outro_pool(self):
        return TRAP_OUTROS

    def lesson(self):
        w_lbl = Text("WRONG", font_size=22, weight="BOLD", color=RED).shift(LEFT * 3.0 + UP * 1.4)
        r_lbl = Text("RIGHT", font_size=22, weight="BOLD", color=GREEN).shift(RIGHT * 3.0 + UP * 1.4)
        w_body = Text(_wrap(self.WRONG, 18), font_size=22, color=RED).shift(LEFT * 3.0)
        r_body = Text(_wrap(self.RIGHT, 18), font_size=22, color=GREEN).shift(RIGHT * 3.0)
        w_box = SurroundingRectangle(VGroup(w_lbl, w_body), color=RED, buff=0.25, corner_radius=0.1)
        r_box = SurroundingRectangle(VGroup(r_lbl, r_body), color=GREEN, buff=0.25, corner_radius=0.1)
        cross = Cross(w_box, color=RED, stroke_width=4)

        self.play(FadeIn(w_lbl), FadeIn(w_body), Create(w_box), run_time=_rt(1.0))
        M.think(self, self.mascot)
        self.play(Create(cross), run_time=_rt(0.55))
        self.play(FadeIn(r_lbl), FadeIn(r_body), Create(r_box), run_time=_rt(1.0))
        check = Text("✓", font_size=42, color=GREEN).move_to(r_box.get_top())
        self.play(FadeIn(check, scale=1.3), run_time=_rt(0.45))
        M.cheer(self, self.mascot)
        self.wait(0.7)


class IdeaDeck(LearningExperienceDeck):
    BULLETS = []

    def outro_pool(self):
        return IDEA_OUTROS

    def lesson(self):
        pal = self.pal
        # The hero visual sits to the right; bullets stack on the left.
        hero = V.hero_for(self.DOMAIN)()
        hero.scale(0.65).to_edge(RIGHT, buff=0.6).shift(DOWN * 0.1)
        self.play(FadeIn(hero, shift=DOWN * 0.2), run_time=_rt(0.7))

        lines = VGroup(*[Text(_wrap(s, 30), font_size=22, color=pal["step"]) for s in self.BULLETS])
        lines.arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        lines.to_edge(LEFT, buff=0.8).shift(DOWN * 0.1)
        for i, ln in enumerate(lines):
            from manim import Polygon
            bullet = Polygon([-0.12, 0.12, 0], [-0.12, -0.12, 0], [0.1, 0, 0],
                             fill_color=pal["accent"], fill_opacity=1, stroke_width=0)
            bullet.next_to(ln, LEFT, buff=0.18)
            self.play(FadeIn(bullet), FadeIn(ln, shift=DOWN * 0.2), run_time=_rt(0.7))
            if i % 2 == 0:
                M.blink(self, self.mascot)
            else:
                M.think(self, self.mascot)
            self.wait(0.3)
