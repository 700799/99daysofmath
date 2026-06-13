"""6.NS Unit 2 examples — Multiplying & dividing decimals.
Math (verified from the lesson plan):
  1. 0.6 × 0.4 -> 0.24
  2. 1.2 × 3 -> 3.6
  3. 4.8 ÷ 0.6 -> 8
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS2Examples(ExamplesDeck):
    TITLE = "Examples - Multiplying & dividing decimals"
    EXAMPLES = [
        ("0.6 x 0.4", ["6 x 4 = 24.", "Two decimal places total.", "= 0.24."], "0.24"),
        ("1.2 x 3", ["12 x 3 = 36.", "One decimal place.", "= 3.6."], "3.6"),
        ("4.8 / 0.6", ["Move both points one place: 48 / 6.", "= 8."], "8"),
    ]
