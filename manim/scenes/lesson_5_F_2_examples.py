"""5.F Unit 2 examples — Adding & subtracting fractions.
Math (verified from the lesson plan):
  1. Add 1/2 + 1/3. -> 5/6
  2. Subtract 3/4 − 1/2. -> 1/4
  3. Add 2/3 + 3/4. -> 1 5/12
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson5F2Examples(ExamplesDeck):
    TITLE = "Examples · Adding & subtracting fractions"
    DOMAIN = "5.F"
    EXAMPLES = [
        ("Add 1/2 + 1/3.", ["Common denominator: 6.", "1/2 = 3/6 and 1/3 = 2/6.", "3/6 + 2/6 = 5/6."], "5/6"),
        ("Subtract 3/4 − 1/2.", ["1/2 = 2/4.", "3/4 − 2/4 = 1/4."], "1/4"),
        ("Add 2/3 + 3/4.", ["Twelfths: 8/12 + 9/12.", "= 17/12 = 1 5/12."], "1 5/12"),
    ]
