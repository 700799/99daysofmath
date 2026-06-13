"""6.SP Unit 6 examples — Summarizing data sets.
Math (verified from the lesson plan):
  1. Data 3, 5, 5, 7 — the mode? -> 5
  2. How many values in 2, 4, 6, 8, 10? (n) -> 5
  3. Mean of 3, 5, 5, 7? -> 5
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6SP6Examples(ExamplesDeck):
    TITLE = "Examples · Summarizing data sets"
    DOMAIN = "6.SP"
    EXAMPLES = [
        ("Data 3, 5, 5, 7 - the mode?", ["5 appears twice.", "= 5."], "5"),
        ("How many values in 2, 4, 6, 8, 10? (n)", ["Count them.", "= 5."], "5"),
        ("Mean of 3, 5, 5, 7?", ["Sum = 20.", "20 ÷ 4.", "= 5."], "5"),
    ]
