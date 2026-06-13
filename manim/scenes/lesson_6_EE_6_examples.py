"""6.EE Unit 6 examples — Variables that change together.
Math (verified from the lesson plan):
  1. If y = 3x, what is y when x = 5? -> 15
  2. A car drives d = 60t miles. How far in 2 hours? -> 120
  3. If y = x + 4, what is y when x = 10? -> 14
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE6Examples(ExamplesDeck):
    TITLE = "Examples - Variables that change together"
    EXAMPLES = [
        ("If y = 3x, what is y when x = 5?", ["Substitute x = 5.", "y = 3-5.", "= 15."], "15"),
        ("A car drives d = 60t miles. How far in 2 hours?", ["t = 2.", "d = 60-2.", "= 120 miles."], "120"),
        ("If y = x + 4, what is y when x = 10?", ["y = 10 + 4.", "= 14."], "14"),
    ]
