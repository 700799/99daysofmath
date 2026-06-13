"""6.RP Unit 9 examples — Measurement conversions.
Math (verified from the lesson plan):
  1. How many inches in 2 feet? -> 24
  2. Convert 4 yards to feet. -> 12
  3. Convert 250 cm to meters. -> 2.5
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6RP9Examples(ExamplesDeck):
    TITLE = "Examples - Measurement conversions"
    EXAMPLES = [
        ("How many inches in 2 feet?", ["1 ft = 12 in.", "2 x 12 = 24 in."], "24"),
        ("Convert 4 yards to feet.", ["1 yd = 3 ft.", "4 x 3 = 12 ft."], "12"),
        ("Convert 250 cm to meters.", ["100 cm = 1 m.", "250 / 100 = 2.5 m."], "2.5"),
    ]
