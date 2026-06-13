"""Shared building blocks for lesson videos.

Three deck templates, now with a cute corner mascot, a topical hero
illustration, a consistent per-video color palette, gentle pacing, and
varied (non-repetitive) closers:
- ExamplesDeck: Q -> steps -> answer, with the mascot reacting.
- TrapDeck:     wrong-vs-right card.
- IdeaDeck:     concept bullets.

Set DOMAIN on a subclass (e.g. "6.EE") to pick the matching hero visual.
Each scene stays phone-friendly and under ~90 s at -ql.
"""
from manim import (
    Scene, Text, VGroup, FadeIn, FadeOut, Write, Create,
    SurroundingRectangle, Cross, LaggedStart, Polygon,
    UP, DOWN, LEFT, RIGHT,
    WHITE, BLUE, GREEN, RED, ORANGE, YELLOW, PURPLE, TEAL, PINK, GOLD,
)
import _mascot as M
import _visuals as V

# ── pacing ──────────────────────────────────────────────────────────────
PACE = 1.25  # +25% on every animation vs the previous timing


def _rt(t):
    return t * PACE


# ── palettes: one per video, consistent across its text roles ───────────
PALETTES = [
    {"title": BLUE, "accent": YELLOW, "step": WHITE, "answer": GREEN},
    {"title": PURPLE, "accent": TEAL, "step": WHITE, "answer": GOLD},
    {"title": TEAL, "accent": PINK, "step": WHITE, "answer": GREEN},
    {"title": ORANGE, "accent": GOLD, "step": WHITE, "answer": GREEN},
    {"title": GREEN, "accent": BLUE, "step": WHITE, "answer": YELLOW},
    {"title": PINK, "accent": YELLOW, "step": WHITE, "answer": TEAL},
]


def _seed(text: str) -> int:
    h = 0
    for ch in text:
        h = (h * 31 + ord(ch)) & 0x7FFFFFFF
    return h


def palette_for(seed: int):
    return PALETTES[seed % len(PALETTES)]


EXAMPLE_OUTROS = ["Now you try!", "Your turn!", "You've got this!", "Give one a go!", "Ready to practice?"]
TRAP_OUTROS = ["Now you know!", "Trap dodged!", "You'll spot it next time!", "Nice catch!", "Too easy now!"]
IDEA_OUTROS = ["That's the idea!", "Now it clicks!", "You've got it!", "Keep it in mind!"]


def _wrap(s: str, width: int = 46) -> str:
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

def title_bar(scene, text, color=BLUE, size=34):
    title = Text(text, font_size=size, weight="BOLD", color=color)
    title.to_edge(UP, buff=0.35)
    scene.play(Write(title), run_time=_rt(0.9))
    return title


def place_mascot(scene, seed):
    m, name = M.mascot_for(seed)
    m.scale(0.5).to_corner(DOWN + RIGHT, buff=0.35)
    M.wave_in(scene, m)
    return m


def place_hero(scene, domain):
    hero = V.hero_for(domain)()
    hero.scale(0.66).to_corner(UP + RIGHT, buff=0.5).shift(DOWN * 0.95)
    scene.play(FadeIn(hero, shift=DOWN * 0.2), run_time=_rt(0.7))
    return hero


def answer_pop(scene, answer, mascot, color=GREEN, size=42):
    a = Text(f"= {answer}", font_size=size, weight="BOLD", color=color)
    a.to_edge(DOWN, buff=0.6).shift(LEFT * 1.1)
    box = SurroundingRectangle(a, color=color, buff=0.15, corner_radius=0.12)
    scene.play(FadeIn(a, scale=1.2), Create(box), run_time=_rt(0.9))
    M.cheer(scene, mascot)
    M.spin(scene, mascot)
    return VGroup(a, box)


# ── decks ───────────────────────────────────────────────────────────────

class ExamplesDeck(Scene):
    TITLE = "Worked examples"
    EXAMPLES = []
    DOMAIN = "6.NS"

    def construct(self):
        seed = _seed(self.TITLE)
        pal = palette_for(seed)
        title_bar(self, self.TITLE, color=pal["title"])
        mascot = place_mascot(self, seed)
        hero = place_hero(self, self.DOMAIN)

        for q, steps, answer in self.EXAMPLES:
            q_text = Text(_wrap("Q: " + q, 40), font_size=26, color=pal["accent"])
            q_text.to_edge(UP, buff=1.3).shift(LEFT * 0.9)
            self.play(Write(q_text), run_time=_rt(0.9))
            M.think(self, mascot)

            step_objs = VGroup(*[Text(_wrap(s, 40), font_size=23, color=pal["step"]) for s in steps])
            step_objs.arrange(DOWN, buff=0.28, aligned_edge=LEFT)
            step_objs.next_to(q_text, DOWN, buff=0.45).shift(LEFT * 0.2)
            for i, so in enumerate(step_objs):
                self.play(FadeIn(so, shift=DOWN * 0.2), run_time=_rt(0.7))
                if i == 0:
                    M.blink(self, mascot)
                self.wait(0.4)

            ans = answer_pop(self, answer, mascot, color=pal["answer"])
            self.wait(0.7)
            self.play(FadeOut(VGroup(q_text, step_objs, ans)), run_time=_rt(0.5))

        outro = Text(EXAMPLE_OUTROS[seed % len(EXAMPLE_OUTROS)],
                     font_size=32, weight="BOLD", color=pal["accent"])
        outro.shift(LEFT * 0.6)
        self.play(FadeIn(outro, scale=1.1), run_time=_rt(0.7))
        M.cheer(self, mascot)
        self.wait(0.9)


class TrapDeck(Scene):
    TITLE = "Avoid the trap"
    WRONG = "common mistake here"
    RIGHT = "do this instead"
    DOMAIN = "6.NS"

    def construct(self):
        seed = _seed(self.TITLE)
        pal = palette_for(seed)
        title_bar(self, self.TITLE, color=ORANGE)
        mascot = place_mascot(self, seed)

        w_lbl = Text("WRONG", font_size=22, weight="BOLD", color=RED).shift(LEFT * 3.0 + UP * 1.5)
        r_lbl = Text("RIGHT", font_size=22, weight="BOLD", color=GREEN).shift(RIGHT * 3.0 + UP * 1.5)
        w_body = Text(_wrap(self.WRONG, 20), font_size=22, color=RED).shift(LEFT * 3.0)
        r_body = Text(_wrap(self.RIGHT, 20), font_size=22, color=GREEN).shift(RIGHT * 3.0)
        w_box = SurroundingRectangle(VGroup(w_lbl, w_body), color=RED, buff=0.25, corner_radius=0.1)
        r_box = SurroundingRectangle(VGroup(r_lbl, r_body), color=GREEN, buff=0.25, corner_radius=0.1)
        cross = Cross(w_box, color=RED, stroke_width=4)

        self.play(FadeIn(w_lbl), FadeIn(w_body), Create(w_box), run_time=_rt(1.1))
        M.think(self, mascot)
        self.play(Create(cross), run_time=_rt(0.6))
        self.play(FadeIn(r_lbl), FadeIn(r_body), Create(r_box), run_time=_rt(1.1))
        check = Text("✓", font_size=44, color=GREEN).move_to(r_box.get_top())
        self.play(FadeIn(check, scale=1.3), run_time=_rt(0.5))
        M.cheer(self, mascot)
        self.wait(0.8)

        outro = Text(TRAP_OUTROS[seed % len(TRAP_OUTROS)], font_size=28, color=pal["accent"])
        outro.to_edge(DOWN, buff=0.6)
        self.play(FadeIn(outro), run_time=_rt(0.6))
        self.wait(0.9)


class IdeaDeck(Scene):
    TITLE = "The idea"
    BULLETS = []
    DOMAIN = "6.NS"

    def construct(self):
        seed = _seed(self.TITLE)
        pal = palette_for(seed)
        title_bar(self, self.TITLE, color=pal["title"])
        mascot = place_mascot(self, seed)
        hero = place_hero(self, self.DOMAIN)

        lines = VGroup(*[Text(_wrap(s, 42), font_size=24, color=pal["step"]) for s in self.BULLETS])
        lines.arrange(DOWN, buff=0.4, aligned_edge=LEFT)
        lines.move_to(LEFT * 0.6 + DOWN * 0.2)
        for i, ln in enumerate(lines):
            bullet = Polygon([-0.12, 0.12, 0], [-0.12, -0.12, 0], [0.1, 0, 0],
                             fill_color=pal["accent"], fill_opacity=1, stroke_width=0)
            bullet.next_to(ln, LEFT, buff=0.18)
            self.play(FadeIn(bullet), FadeIn(ln, shift=DOWN * 0.2), run_time=_rt(0.8))
            if i % 2 == 0:
                M.blink(self, mascot)
            else:
                M.think(self, mascot)
            self.wait(0.35)

        outro = Text(IDEA_OUTROS[seed % len(IDEA_OUTROS)], font_size=30, weight="BOLD", color=pal["accent"])
        outro.to_edge(DOWN, buff=0.7)
        self.play(FadeIn(outro, scale=1.1), run_time=_rt(0.7))
        M.cheer(self, mascot)
        self.wait(0.9)
