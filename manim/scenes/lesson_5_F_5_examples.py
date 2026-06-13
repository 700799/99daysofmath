"""5.F Unit 5 examples — Measurement, conversions & volume.
Math (verified from the lesson plan):
  1. Convert 2 meters to centimeters. -> 200
  2. Volume of a 3 × 2 × 4 box? -> 24
  3. Convert 5 feet to inches. -> 60
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson5F5Examples(ExamplesDeck):
    TITLE = "Examples · Measurement, conversions & volume"
    DOMAIN = "5.F"
    EXAMPLES = [
        ("Convert 2 meters to centimeters.", ["1 m = 100 cm.", "2 × 100 = 200 cm."], "200"),
        ("Volume of a 3 × 2 × 4 box?", ["3 × 2 = 6.", "6 × 4 = 24 cubic units."], "24"),
        ("Convert 5 feet to inches.", ["1 ft = 12 in.", "5 × 12 = 60 inches."], "60"),
    ]
