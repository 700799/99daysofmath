"""6.EE Unit 7 examples — Parts of expressions.
Math (verified from the lesson plan):
  1. Coefficient of y in 4y? -> 4
  2. Constant term in 7 + 3x? -> 7
  3. How many terms in 5x − 2 + 3? -> 2
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE7Examples(ExamplesDeck):
    TITLE = "Examples - Parts of expressions"
    EXAMPLES = [
        ("Coefficient of y in 4y?", ["Number stuck to y.", "4."], "4"),
        ("Constant term in 7 + 3x?", ["No variable attached.", "7."], "7"),
        ("How many terms in 5x - 2 + 3?", ["Combine constants first: 5x - 2 + 3 = 5x + 1.", "2 terms."], "2"),
    ]
