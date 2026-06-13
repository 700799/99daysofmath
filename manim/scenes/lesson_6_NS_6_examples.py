"""6.NS Unit 6 examples — Dividing fractions.
Math (verified from the lesson plan):
  1. 1/2 ÷ 1/4 -> 2
  2. 3/4 ÷ 1/2 -> 3/2
  3. 2/3 ÷ 4 -> 1/6
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS6Examples(ExamplesDeck):
    TITLE = "Examples - Dividing fractions"
    EXAMPLES = [
        ("1/2 / 1/4", ["Keep 1/2, flip 1/4 to 4/1.", "1/2 x 4/1 = 4/2.", "= 2."], "2"),
        ("3/4 / 1/2", ["Keep-change-flip: 3/4 x 2/1.", "= 6/4.", "= 3/2."], "3/2"),
        ("2/3 / 4", ["4 = 4/1; flip to 1/4.", "2/3 x 1/4 = 2/12.", "= 1/6."], "1/6"),
    ]
