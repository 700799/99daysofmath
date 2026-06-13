"""6.SP Unit 2 examples — Choosing a center.
Math (verified from the lesson plan):
  1. Data 2, 3, 4, 100 — which center is more typical? -> median
  2. Mean of 1, 2, 3, 4, 5? -> 3
  3. Does an outlier change the median much? (yes/no) -> no
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6SP2Examples(ExamplesDeck):
    TITLE = "Examples - Choosing a center"
    EXAMPLES = [
        ("Data 2, 3, 4, 100 - which center is more typical?", ["Mean = 27.25 (pulled up by 100).", "Median = 3.5.", "= median."], "median"),
        ("Mean of 1, 2, 3, 4, 5?", ["Sum = 15.", "15 / 5.", "= 3."], "3"),
        ("Does an outlier change the median much? (yes/no)", ["The median is just the middle.", "= no."], "no"),
    ]
