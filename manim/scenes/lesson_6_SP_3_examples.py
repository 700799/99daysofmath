"""6.SP Unit 3 examples — Spread: range, IQR & MAD.
Math (verified from the lesson plan):
  1. Range of 5, 9, 12, 20? -> 15
  2. Range of 3, 3, 3? -> 0
  3. Mean of 2,4,6 is 4. Distance of 6 from the mean? -> 2
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6SP3Examples(ExamplesDeck):
    TITLE = "Examples · Spread: range, IQR & MAD"
    DOMAIN = "6.SP"
    EXAMPLES = [
        ("Range of 5, 9, 12, 20?", ["Max 20, min 5.", "20 − 5.", "= 15."], "15"),
        ("Range of 3, 3, 3?", ["Max = min = 3.", "3 − 3.", "= 0."], "0"),
        ("Mean of 2,4,6 is 4. Distance of 6 from the mean?", ["|6 − 4|.", "= 2."], "2"),
    ]
