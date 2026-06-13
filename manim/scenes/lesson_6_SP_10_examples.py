"""6.SP Unit 10 examples — Summarizing data sets.
Math (verified from the lesson plan):
  1. Mean of {10, 20, 30, 40, 50}? -> 30
  2. Median of {3, 7, 1, 9, 5}? -> 5
  3. Range of {12, 5, 18, 7, 20}? -> 15
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6SP10Examples(ExamplesDeck):
    TITLE = "Examples · Summarizing data sets"
    DOMAIN = "6.SP"
    EXAMPLES = [
        ("Mean of {10, 20, 30, 40, 50}?", ["Sum: 150. Count: 5.", "150 ÷ 5 = 30."], "30"),
        ("Median of {3, 7, 1, 9, 5}?", ["Sort: 1, 3, 5, 7, 9.", "Middle: 5."], "5"),
        ("Range of {12, 5, 18, 7, 20}?", ["Max 20, min 5.", "20 − 5 = 15."], "15"),
    ]
