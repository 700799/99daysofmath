"""6.RP Unit 6 examples — Converting with rates.
Math (verified from the lesson plan):
  1. How many inches are in 3 feet? -> 36
  2. How many feet are in 48 inches? -> 4
  3. A recipe needs 2 quarts. How many cups? (1 quart = 4 cups) -> 8
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6RP6Examples(ExamplesDeck):
    TITLE = "Examples - Converting with rates"
    EXAMPLES = [
        ("How many inches are in 3 feet?", ["1 foot = 12 inches.", "3 x 12.", "= 36 inches."], "36"),
        ("How many feet are in 48 inches?", ["12 inches = 1 foot.", "48 / 12.", "= 4 feet."], "4"),
        ("A recipe needs 2 quarts. How many cups? (1 quart = 4 cups)", ["1 quart = 4 cups.", "2 x 4.", "= 8 cups."], "8"),
    ]
