"""6.RP Unit 7 examples — Percent applications.
Math (verified from the lesson plan):
  1. What is 25% of 80? -> 20
  2. 15% of 60? -> 9
  3. A $40 shirt is 30% off. Sale price? -> $28
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6RP7Examples(ExamplesDeck):
    TITLE = "Examples · Percent applications"
    DOMAIN = "6.RP"
    EXAMPLES = [
        ("What is 25% of 80?", ["25% = 0.25.", "0.25 × 80 = 20."], "20"),
        ("15% of 60?", ["10% of 60 = 6. 5% of 60 = 3.", "10% + 5% = 6 + 3 = 9."], "9"),
        ("A 40 shirt is 30% off. Sale price?", ["30% of 40 = 12 off.", "40 − 12 = 28."], "28"),
    ]
