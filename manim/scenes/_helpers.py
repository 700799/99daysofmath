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
import math
import numpy as np
from manim import (
    Scene, Text, VGroup, FadeIn, FadeOut, Write, Create, Transform, GrowFromCenter,
    SurroundingRectangle, Cross, Line, Dot, Circle, RoundedRectangle,
    UP, DOWN, LEFT, RIGHT, ORIGIN, PI,
    WHITE, BLUE, GREEN, RED, ORANGE, YELLOW, GOLD,
)
import _mascot as M
import _visuals as V

# ── pacing ──────────────────────────────────────────────────────────────
# Deliberately slow for young learners. Combined with the player-side
# "Continue" overlay (auto-pause at each checkpoint), kids set their own pace.
PACE = 1.7


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

# How an expert THINKS about a problem — strategies, not just facts.
EXPERT_MOVES = {
    "6.EE": [
        "Estimate first: 2x near 2·4 is about 8 — so the answer is near 13.",
        "Always check: plug your answer back in. Does it balance?",
        "Do the multiplication BEFORE the addition.",
    ],
    "6.RP": [
        "Scale to 1 first, then multiply up to any amount.",
        "Cross-check: do both ratios give the same unit rate?",
        "Pick the friendliest number to scale from.",
    ],
    "6.NS": [
        "Plot it on a line — order becomes obvious.",
        "Line up the decimal points before you add.",
        "Ask: is the answer bigger or smaller than I started?",
    ],
    "6.G": [
        "Break a weird shape into rectangles you know.",
        "Label every side before you compute.",
        "Estimate the area by counting whole squares first.",
    ],
    "6.SP": [
        "Sort the data, THEN find the middle.",
        "Spot the outlier before you pick mean or median.",
        "Re-read: does it want the center or the spread?",
    ],
    "5.F": [
        "Make a common bottom before adding fractions.",
        "Draw it — a picture beats a guess.",
        "Estimate: is it closer to 0, ½, or 1?",
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

def title_bar(scene, text, color=YELLOW, size=40):
    title = Text(text, font_size=size, weight="BOLD", color=color)
    # Never let a long title run off the screen.
    max_w = 12.8
    if title.width > max_w:
        title.scale(max_w / title.width)
    title.to_edge(UP, buff=0.28)
    scene.play(Write(title), run_time=_rt(0.8))
    return title


def place_mascot(scene, seed):
    """Bigger, corner-anchored mascot."""
    m, name = M.mascot_for(seed)
    m.scale(1.0).to_corner(DOWN + RIGHT, buff=0.3)
    M.wave_in(scene, m)
    return m


def prediction_hook(scene, prompt, pal):
    """Cold-open beat: a big yellow 'guess first' prompt, freeze for ~1.4s."""
    box = RoundedRectangle(width=11.5, height=1.5, corner_radius=0.22,
                           stroke_color=pal["accent"], stroke_width=4,
                           fill_color=BLUE, fill_opacity=0.10)
    box.move_to(UP * 1.4)
    q = Text("Guess first!", font_size=26, color=pal["accent"], weight="BOLD")
    label = Text(prompt, font_size=40, color=WHITE, weight="BOLD")
    grp = VGroup(q, label).arrange(DOWN, buff=0.18).move_to(box)
    scene.play(Create(box), FadeIn(grp), run_time=_rt(0.7))
    scene.wait(1.4)
    return VGroup(box, grp)


def expert_move(scene, domain, seed, pal):
    """A 'how an expert thinks' strategy ribbon along the top band — blue accent."""
    moves = EXPERT_MOVES.get(domain) or EXPERT_MOVES["6.EE"]
    move = moves[seed % len(moves)]
    marker = Circle(radius=0.2, fill_color=BLUE, fill_opacity=1, stroke_color=WHITE, stroke_width=2)
    ribbon = RoundedRectangle(width=11.5, height=1.15, corner_radius=0.2,
                              stroke_color=BLUE, stroke_width=3,
                              fill_color=BLUE, fill_opacity=0.10)
    ribbon.move_to(UP * 1.2)
    head = Text("Think like a pro", font_size=22, color=BLUE, weight="BOLD")
    body = Text(_wrap(move, 44), font_size=28, color=WHITE, weight="BOLD")
    inner = VGroup(head, body).arrange(DOWN, buff=0.12).move_to(ribbon)
    marker.next_to(ribbon, LEFT, buff=0.2)
    g = VGroup(marker, ribbon, inner)
    scene.play(FadeIn(g, shift=DOWN * 0.2), run_time=_rt(0.7))
    scene.wait(1.0)
    return g


def method_label(text, color):
    return Text(text, font_size=22, weight="BOLD", color=color)


def _fit_hero(hero, max_w=5.4, max_h=3.8):
    """Shrink a hero only if it would overflow the box — never scale it DOWN
    below its built size by upscaling fonts. Heroes are built with large bold
    numbers, so capping at 1.0 keeps every number clearly readable."""
    sw = max_w / max(hero.width, 0.01)
    sh = max_h / max(hero.height, 0.01)
    hero.scale(min(1.0, sw, sh))
    return hero


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
    bulb = Circle(radius=0.26, fill_color=YELLOW, fill_opacity=1, stroke_color=GOLD, stroke_width=3)
    rays = VGroup()
    for k in range(8):
        a = k * PI / 4
        start = bulb.get_center() + 0.32 * np.array([math.cos(a), math.sin(a), 0])
        end = bulb.get_center() + 0.5 * np.array([math.cos(a), math.sin(a), 0])
        rays.add(Line(start, end, stroke_width=3, color=GOLD))
    bulb_g = VGroup(rays, bulb)
    ribbon = RoundedRectangle(width=11.5, height=1.25, corner_radius=0.22,
                              stroke_color=YELLOW, stroke_width=3,
                              fill_color=YELLOW, fill_opacity=0.10)
    ribbon.move_to(DOWN * 1.2)
    head = Text("Pro tip", font_size=22, color=GOLD, weight="BOLD")
    body = Text(_wrap(tip, 46), font_size=28, color=YELLOW, weight="BOLD")
    inner = VGroup(head, body).arrange(DOWN, buff=0.12).move_to(ribbon)
    bulb_g.next_to(ribbon, LEFT, buff=0.2)
    g = VGroup(bulb_g, ribbon, inner)
    scene.play(FadeIn(g, shift=UP * 0.2), run_time=_rt(0.7))
    return g


def answer_card(scene, expr, color, mascot, pos=ORIGIN):
    """Big highlighted answer card with mascot cheer beat."""
    a = Text(expr, font_size=56, weight="BOLD", color=color)
    a.move_to(pos)
    box = SurroundingRectangle(a, color=color, buff=0.22, corner_radius=0.16)
    scene.play(FadeIn(a, scale=1.2), Create(box), run_time=_rt(0.85))
    M.cheer(scene, mascot)
    return VGroup(a, box)


# ── decks ───────────────────────────────────────────────────────────────

class LearningExperienceDeck(Scene):
    """Base: subclasses set TITLE, DOMAIN, and override `lesson()`.

    Tracks elapsed time by wrapping play/wait so each `checkpoint()` records a
    timestamp. After construct() it writes `chapters/<Class>.json` — the player
    auto-pauses at those marks and shows a big "Continue" button so kids set
    their own pace. Call `section_break()` at the end of each teaching section
    for a mascot beat + checkpoint.
    """
    TITLE = "Lesson"
    DOMAIN = "6.NS"

    def setup(self):
        self._elapsed = 0.0
        self._checkpoints = []
        self._beat_i = 0

    def play(self, *args, **kwargs):
        rt = kwargs.get("run_time", 1.0)
        super().play(*args, **kwargs)
        self._elapsed += rt

    def wait(self, duration=1.0, **kwargs):
        super().wait(duration, **kwargs)
        self._elapsed += duration

    def checkpoint(self):
        self._checkpoints.append(round(self._elapsed, 2))

    def section_break(self, beat=None):
        """End of a concept: the mascot does an emphasis beat (wink / shake /
        rock / cheer / eureka, cycling) to drive the point home, then we mark a
        Continue checkpoint so the player can pause here."""
        if beat is not None:
            getattr(M, beat, M.bounce)(self, self.mascot)
        else:
            M.emphasis(self, self.mascot, self._beat_i)
            self._beat_i += 1
        self.wait(0.6)
        self.checkpoint()

    def _write_chapters(self):
        import os, json
        try:
            out_dir = os.path.join(os.path.dirname(__file__), "chapters")
            os.makedirs(out_dir, exist_ok=True)
            with open(os.path.join(out_dir, f"{type(self).__name__}.json"), "w") as f:
                json.dump({"checkpoints": self._checkpoints,
                           "total": round(self._elapsed, 2)}, f)
        except Exception:
            pass

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
                     font_size=34, weight="BOLD", color=pal["accent"])
        outro.to_edge(DOWN, buff=0.6)
        self.play(FadeIn(outro, scale=1.1), run_time=_rt(0.7))
        M.cheer(self, self.mascot)
        M.spin(self, self.mascot)
        self.wait(0.4)
        self._write_chapters()

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
        # One expert strategy up front so the whole deck has a "how to think" frame.
        em = expert_move(self, self.DOMAIN, self.seed, pal)
        self.play(FadeOut(em), run_time=_rt(0.4))

        for ei, (q, steps, answer) in enumerate(self.EXAMPLES):
            # Full-screen composition: question across the top, worked steps
            # filling the LEFT half, a big topical illustration on the RIGHT
            # half, and a large answer across the bottom. Even margins.
            q_text = Text(_wrap("Q:  " + q, 38), font_size=32, color=pal["accent"], weight="BOLD")
            q_text.to_edge(UP, buff=1.0)
            self.play(Write(q_text), run_time=_rt(0.85))
            M.think(self, self.mascot)

            hero = V.hero_for(self.DOMAIN)()
            _fit_hero(hero, max_w=5.4, max_h=3.6)
            hero.move_to(RIGHT * 3.5 + DOWN * 0.1)
            self.play(FadeIn(hero, shift=DOWN * 0.2), run_time=_rt(0.6))

            step_objs = VGroup(*[Text(_wrap(s, 24), font_size=30, color=pal["step"]) for s in steps])
            step_objs.arrange(DOWN, buff=0.55, aligned_edge=LEFT)
            step_objs.move_to(LEFT * 3.3 + DOWN * 0.1)
            for i, so in enumerate(step_objs):
                self.play(FadeIn(so, shift=DOWN * 0.2), run_time=_rt(0.65))
                if i == 0:
                    M.blink(self, self.mascot)
                self.wait(0.35)

            # Big answer band across the bottom; full screen is now in use.
            ans = answer_card(self, f"= {answer}", pal["answer"], self.mascot,
                              pos=DOWN * 3.0)
            self.wait(0.3)
            self.section_break()  # varied emphasis beat at the end of the concept
            self.play(FadeOut(VGroup(q_text, step_objs, hero, ans)), run_time=_rt(0.45))

        # Strategy reinforcement at the end.
        tip = pro_tip(self, self.DOMAIN, self.seed, pal)
        self.wait(0.8)
        self.play(FadeOut(tip), run_time=_rt(0.45))


class TrapDeck(LearningExperienceDeck):
    WRONG = "common mistake here"
    RIGHT = "do this instead"

    def outro_pool(self):
        return TRAP_OUTROS

    def lesson(self):
        # Full-width two-column layout with even margins.
        w_lbl = Text("WRONG", font_size=26, weight="BOLD", color=RED).shift(LEFT * 3.4 + UP * 1.7)
        r_lbl = Text("RIGHT", font_size=26, weight="BOLD", color=GREEN).shift(RIGHT * 3.4 + UP * 1.7)
        w_body = Text(_wrap(self.WRONG, 20), font_size=26, color=RED).shift(LEFT * 3.4 + DOWN * 0.2)
        r_body = Text(_wrap(self.RIGHT, 20), font_size=26, color=GREEN).shift(RIGHT * 3.4 + DOWN * 0.2)
        w_box = SurroundingRectangle(VGroup(w_lbl, w_body), color=RED, buff=0.35, corner_radius=0.12)
        r_box = SurroundingRectangle(VGroup(r_lbl, r_body), color=GREEN, buff=0.35, corner_radius=0.12)
        cross = Cross(w_box, color=RED, stroke_width=5)

        self.play(FadeIn(w_lbl), FadeIn(w_body), Create(w_box), run_time=_rt(1.0))
        M.think(self, self.mascot)
        self.play(Create(cross), run_time=_rt(0.55))
        self.checkpoint()
        self.play(FadeIn(r_lbl), FadeIn(r_body), Create(r_box), run_time=_rt(1.0))
        check = Text("✓", font_size=52, color=GREEN).move_to(r_box.get_top())
        self.play(FadeIn(check, scale=1.3), run_time=_rt(0.45))
        self.section_break()  # emphasis beat to drive the correction home


class IdeaDeck(LearningExperienceDeck):
    BULLETS = []

    def outro_pool(self):
        return IDEA_OUTROS

    def lesson(self):
        pal = self.pal
        # Big hero on the RIGHT half, concept bullets filling the LEFT half.
        hero = V.hero_for(self.DOMAIN)()
        _fit_hero(hero, max_w=5.4, max_h=3.8)
        hero.move_to(RIGHT * 3.5 + DOWN * 0.1)
        self.play(FadeIn(hero, shift=DOWN * 0.2), run_time=_rt(0.7))

        lines = VGroup(*[Text(_wrap(s, 26), font_size=26, color=pal["step"]) for s in self.BULLETS])
        lines.arrange(DOWN, buff=0.5, aligned_edge=LEFT)
        lines.move_to(LEFT * 3.2 + DOWN * 0.1)
        from manim import Polygon
        for i, ln in enumerate(lines):
            bullet = Polygon([-0.14, 0.14, 0], [-0.14, -0.14, 0], [0.12, 0, 0],
                             fill_color=pal["accent"], fill_opacity=1, stroke_width=0)
            bullet.next_to(ln, LEFT, buff=0.2)
            self.play(FadeIn(bullet), FadeIn(ln, shift=DOWN * 0.2), run_time=_rt(0.7))
            if i % 2 == 0:
                M.blink(self, self.mascot)
            else:
                M.think(self, self.mascot)
            self.wait(0.35)
        self.section_break()  # emphasis beat at the end of the concept
