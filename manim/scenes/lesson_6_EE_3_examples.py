"""6.EE Unit 3 examples — Equivalent expressions.
Math (verified from the lesson plan):
  1. Expand 3(x + 2). -> 3x+6
  2. Combine 4x + 5x. -> 9x
  3. Simplify 2x + 3 + x. -> 3x+3
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE3Examples(ExamplesDeck):
    TITLE = "Examples · Equivalent expressions"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("Expand 3(x + 2).", ["Multiply 3 by each term.", "3·x + 3·2.", "= 3x + 6."], "3x+6"),
        ("Combine 4x + 5x.", ["Same variable, add coefficients.", "4 + 5 = 9.", "= 9x."], "9x"),
        ("Simplify 2x + 3 + x.", ["Combine x terms: 2x + x = 3x.", "= 3x + 3."], "3x+3"),
    ]
