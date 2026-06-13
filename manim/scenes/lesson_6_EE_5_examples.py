"""6.EE Unit 5 examples — Inequalities.
Math (verified from the lesson plan):
  1. Graph x ≥ 2 — open or closed circle at 2? -> closed
  2. Write 'a number is at most 10'. -> x≤10
  3. Is x = 5 a solution to x < 5? -> no
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE5Examples(ExamplesDeck):
    TITLE = "Examples - Inequalities"
    EXAMPLES = [
        ("Graph x >= 2 - open or closed circle at 2?", [">= includes the number.", "Use a closed (filled) circle."], "closed"),
        ("Write 'a number is at most 10'.", ["'at most' means <=.", "= x <= 10."], "x<=10"),
        ("Is x = 5 a solution to x < 5?", ["5 is not less than 5.", "= no."], "no"),
    ]
