"""6.SP Unit 1 examples — Mean, median & mode.
Math (verified from the lesson plan):
  1. Mean of 4, 6, 8? -> 6
  2. Median of 3, 7, 5? -> 5
  3. Mode of 2, 4, 4, 9? -> 4
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6SP1Examples(ExamplesDeck):
    TITLE = "Examples · Mean, median & mode"
    DOMAIN = "6.SP"
    EXAMPLES = [
        ("Mean of 4, 6, 8?", ["Add: 4+6+8 = 18.", "Divide by 3.", "= 6."], "6"),
        ("Median of 3, 7, 5?", ["Sort: 3, 5, 7.", "Middle value.", "= 5."], "5"),
        ("Mode of 2, 4, 4, 9?", ["4 appears most.", "= 4."], "4"),
    ]
