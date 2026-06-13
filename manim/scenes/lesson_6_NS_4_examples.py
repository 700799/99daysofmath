"""6.NS Unit 4 examples — Integers & absolute value.
Math (verified from the lesson plan):
  1. What is |-7|? -> 7
  2. Which is greater, -5 or -2? -> -2
  3. A diver is at -30 ft, a kite at 12 ft. Who is farther from sea level (0)? -> diver
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS4Examples(ExamplesDeck):
    TITLE = "Examples - Integers & absolute value"
    EXAMPLES = [
        ("What is |-7|?", ["Distance of -7 from 0.", "= 7."], "7"),
        ("Which is greater, -5 or -2?", ["-2 is to the right of -5.", "So -2 is greater."], "-2"),
        ("A diver is at -30 ft, a kite at 12 ft. Who is farther from sea level (0)?", ["|-30| = 30, |12| = 12.", "30 > 12.", "The diver."], "diver"),
    ]
