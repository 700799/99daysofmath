"""5.F Unit 4 examples — Decimals: place value & operations.
Math (verified from the lesson plan):
  1. Add 0.3 + 0.45. -> 0.75
  2. Subtract 2 − 0.85. -> 1.15
  3. Multiply 0.5 × 0.8. -> 0.4
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson5F4Examples(ExamplesDeck):
    TITLE = "Examples - Decimals: place value & operations"
    EXAMPLES = [
        ("Add 0.3 + 0.45.", ["Write 0.3 as 0.30.", "0.30 + 0.45 = 0.75."], "0.75"),
        ("Subtract 2 - 0.85.", ["Count up: 0.85 + 0.15 = 1.", "1 + 1 = 2, so total counted = 1.15."], "1.15"),
        ("Multiply 0.5 x 0.8.", ["5 x 8 = 40.", "Two decimal places -> 0.40 = 0.4."], "0.4"),
    ]
