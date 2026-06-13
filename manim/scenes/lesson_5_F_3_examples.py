"""5.F Unit 3 examples — Multiplying & dividing fractions.
Math (verified from the lesson plan):
  1. Multiply 1/2 × 1/4. -> 1/8
  2. Divide 6 ÷ 1/2. -> 12
  3. Find 2/3 of 12. -> 8
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson5F3Examples(ExamplesDeck):
    TITLE = "Examples - Multiplying & dividing fractions"
    EXAMPLES = [
        ("Multiply 1/2 x 1/4.", ["1 x 1 = 1 and 2 x 4 = 8.", "Product: 1/8."], "1/8"),
        ("Divide 6 / 1/2.", ["Each whole holds 2 halves.", "6 x 2 = 12."], "12"),
        ("Find 2/3 of 12.", ["1/3 of 12 is 4.", "2/3 is 2 x 4 = 8."], "8"),
    ]
