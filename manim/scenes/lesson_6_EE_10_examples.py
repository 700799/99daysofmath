"""6.EE Unit 10 examples — Tables & relationships.
Math (verified from the lesson plan):
  1. For y = 4x, find y when x = 6. -> 24
  2. Fill in y for y = x + 3 at x = 1, 2, 3. -> 4, 5, 6
  3. Rule for the pairs (1, 5), (2, 10), (3, 15)? -> y=5x
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE10Examples(ExamplesDeck):
    TITLE = "Examples · Tables & relationships"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("For y = 4x, find y when x = 6.", ["Substitute x = 6.", "y = 4 × 6 = 24."], "24"),
        ("Fill in y for y = x + 3 at x = 1, 2, 3.", ["x = 1 -> 4. x = 2 -> 5. x = 3 -> 6."], "4, 5, 6"),
        ("Rule for the pairs (1, 5), (2, 10), (3, 15)?", ["y is 5 times x.", "y = 5x."], "y=5x"),
    ]
