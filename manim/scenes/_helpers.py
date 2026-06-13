"""Shared building blocks for lesson videos.

Three deck templates:
- ExamplesDeck(title, examples): "Worked examples" — Q → steps → answer.
- TrapDeck(title, watchout, fix): "Avoid the trap" — wrong vs right side-by-side.
- IdeaDeck(title, bullets):       "The idea" — short title + bullet reveal.

Each scene renders ≤90 seconds at -ql (480p15) for fast iteration.
"""
from manim import (
    Scene, Text, VGroup, BLUE, GREEN, RED, ORANGE, YELLOW, WHITE,
    Write, FadeIn, FadeOut, Create, LaggedStart, UP, DOWN, LEFT, RIGHT,
    SurroundingRectangle, Rectangle, Cross,
)


def _wrap(s: str, width: int = 48) -> str:
    """Soft-wrap a one-line string for Manim Text (keeps it on screen)."""
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


def title_bar(scene: Scene, text: str, color=BLUE, size: int = 36):
    """Animated title bar that pins to the top edge."""
    title = Text(text, font_size=size, weight="BOLD", color=color)
    title.to_edge(UP, buff=0.4)
    scene.play(Write(title), run_time=1.0)
    return title


def step_reveal(scene: Scene, steps, color=WHITE, size: int = 26):
    """Reveal a list of step strings one at a time, stacked below."""
    lines = VGroup(*[Text(_wrap(s, 50), font_size=size, color=color) for s in steps])
    lines.arrange(DOWN, buff=0.35, aligned_edge=LEFT)
    lines.move_to([0, 0, 0])
    for ln in lines:
        scene.play(FadeIn(ln, shift=DOWN * 0.3), run_time=0.9)
        scene.wait(0.55)
    return lines


def answer_pop(scene: Scene, answer: str, color=GREEN, size: int = 44):
    """Big highlighted answer card at the bottom."""
    a = Text(f"= {answer}", font_size=size, weight="BOLD", color=color)
    a.to_edge(DOWN, buff=0.7)
    box = SurroundingRectangle(a, color=color, buff=0.15, corner_radius=0.12)
    scene.play(FadeIn(a, scale=1.2), Create(box), run_time=1.0)
    scene.wait(1.6)
    return VGroup(a, box)


def example_panel(scene: Scene, q: str, steps, answer: str):
    """Render one worked example, then clear before the next."""
    q_text = Text(_wrap("Q: " + q, 50), font_size=28, color=YELLOW)
    q_text.to_edge(UP, buff=1.4)
    scene.play(Write(q_text), run_time=1.0)
    scene.wait(0.7)

    step_objs = VGroup(*[Text(_wrap(s, 50), font_size=24) for s in steps])
    step_objs.arrange(DOWN, buff=0.3, aligned_edge=LEFT)
    step_objs.next_to(q_text, DOWN, buff=0.5)
    for so in step_objs:
        scene.play(FadeIn(so, shift=DOWN * 0.2), run_time=0.8)
        scene.wait(0.45)

    ans = answer_pop(scene, answer)
    scene.wait(1.0)
    scene.play(FadeOut(VGroup(q_text, step_objs, ans)), run_time=0.6)


def wrong_vs_right(scene: Scene, wrong: str, right: str):
    """Two-column wrong-vs-right card."""
    w_lbl = Text("WRONG", font_size=24, weight="BOLD", color=RED).shift(LEFT * 3.2 + UP * 1.6)
    r_lbl = Text("RIGHT", font_size=24, weight="BOLD", color=GREEN).shift(RIGHT * 3.2 + UP * 1.6)

    w_body = Text(_wrap(wrong, 22), font_size=24, color=RED).shift(LEFT * 3.2)
    r_body = Text(_wrap(right, 22), font_size=24, color=GREEN).shift(RIGHT * 3.2)

    w_box = SurroundingRectangle(VGroup(w_lbl, w_body), color=RED, buff=0.25, corner_radius=0.1)
    r_box = SurroundingRectangle(VGroup(r_lbl, r_body), color=GREEN, buff=0.25, corner_radius=0.1)

    cross = Cross(w_box, color=RED, stroke_width=4)

    scene.play(LaggedStart(
        FadeIn(w_lbl), FadeIn(w_body), Create(w_box), Create(cross),
        FadeIn(r_lbl), FadeIn(r_body), Create(r_box),
        lag_ratio=0.1,
    ), run_time=2.6)
    scene.wait(3.2)


class ExamplesDeck(Scene):
    """Subclass and set TITLE + EXAMPLES = [(q, [steps], answer), ...]."""
    TITLE = "Worked examples"
    EXAMPLES = []

    def construct(self):
        title_bar(self, self.TITLE, color=BLUE)
        for q, steps, answer in self.EXAMPLES:
            example_panel(self, q, steps, answer)
        outro = Text("You try one!", font_size=32, weight="BOLD", color=YELLOW)
        self.play(FadeIn(outro), run_time=1.0)
        self.wait(2.0)


class TrapDeck(Scene):
    """Subclass and set TITLE, WRONG, RIGHT."""
    TITLE = "Avoid the trap"
    WRONG = "common mistake here"
    RIGHT = "do this instead"

    def construct(self):
        title_bar(self, self.TITLE, color=ORANGE)
        wrong_vs_right(self, self.WRONG, self.RIGHT)
        outro = Text("Read the question twice.", font_size=28, color=YELLOW)
        outro.to_edge(DOWN, buff=0.6)
        self.play(FadeIn(outro), run_time=1.0)
        self.wait(2.0)


class IdeaDeck(Scene):
    """Subclass and set TITLE + BULLETS = [...]"""
    TITLE = "The idea"
    BULLETS = []

    def construct(self):
        title_bar(self, self.TITLE, color=BLUE)
        step_reveal(self, self.BULLETS, color=WHITE, size=28)
        self.wait(2.0)
