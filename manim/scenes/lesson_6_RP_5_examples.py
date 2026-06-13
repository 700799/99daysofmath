"""6.RP Unit 5 examples — Percents.
Math (verified from the lesson plan):
  1. What is 20% of 45? -> 9
  2. What is 50% of 80? -> 40
  3. Write 3/4 as a percent. -> 75%
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6RP5Examples(ExamplesDeck):
    TITLE = "Examples - Percents"
    EXAMPLES = [
        ("What is 20% of 45?", ["20% = 0.20.", "0.20 x 45.", "= 9."], "9"),
        ("What is 50% of 80?", ["50% = one half.", "Half of 80.", "= 40."], "40"),
        ("Write 3/4 as a percent.", ["3/4 = 0.75.", "0.75 = 75 per hundred.", "= 75%."], "75%"),
    ]
