"""6.NS Unit 1 examples — Adding & subtracting decimals.
Math (verified from the lesson plan):
  1. 3.4 + 1.25 -> 4.65
  2. 5 − 2.3 -> 2.7
  3. 0.75 + 0.5 -> 1.25
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS1Examples(ExamplesDeck):
    TITLE = "Examples · Adding & subtracting decimals"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("3.4 + 1.25", ["Write 3.40 to match places.", "3.40 + 1.25.", "= 4.65."], "4.65"),
        ("5 − 2.3", ["Write 5 as 5.0.", "5.0 − 2.3.", "= 2.7."], "2.7"),
        ("0.75 + 0.5", ["Write 0.50 to match places.", "0.75 + 0.50.", "= 1.25."], "1.25"),
    ]
