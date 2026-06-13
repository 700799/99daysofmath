"""6.EE Unit 1 examples — Exponents.
Math (verified from the lesson plan):
  1. Evaluate 3³. -> 27
  2. Evaluate 5². -> 25
  3. Evaluate 2⁴. -> 16
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE1Examples(ExamplesDeck):
    TITLE = "Examples · Exponents"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("Evaluate 3.", ["3 × 3 × 3.", "= 27."], "27"),
        ("Evaluate 5.", ["5 × 5.", "= 25."], "25"),
        ("Evaluate 2.", ["2 × 2 × 2 × 2.", "= 16."], "16"),
    ]
