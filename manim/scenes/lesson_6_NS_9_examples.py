"""6.NS Unit 9 examples — Opposites & absolute value.
Math (verified from the lesson plan):
  1. What is the opposite of 7? -> -7
  2. What is |−12|? -> 12
  3. Opposite of (opposite of −3)? -> -3
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS9Examples(ExamplesDeck):
    TITLE = "Examples · Opposites & absolute value"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("What is the opposite of 7?", ["Mirror across 0.", "Opposite of 7 is −7."], "-7"),
        ("What is |−12|?", ["Distance from 0 to −12 is 12.", "|−12| = 12."], "12"),
        ("Opposite of (opposite of −3)?", ["Opposite of −3 = 3.", "Opposite of 3 = −3."], "-3"),
    ]
