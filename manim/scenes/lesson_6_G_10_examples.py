"""6.G Unit 10 examples — Surface area & nets.
Math (verified from the lesson plan):
  1. Surface area of a cube with edge 3? -> 54
  2. How many faces does a rectangular prism have? -> 6
  3. SA of a 2 × 3 × 4 prism? -> 52
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6G10Examples(ExamplesDeck):
    TITLE = "Examples - Surface area & nets"
    EXAMPLES = [
        ("Surface area of a cube with edge 3?", ["Each face: 3 x 3 = 9.", "6 faces.", "6 x 9 = 54."], "54"),
        ("How many faces does a rectangular prism have?", ["Top, bottom, front, back, left, right.", "6 faces."], "6"),
        ("SA of a 2 x 3 x 4 prism?", ["Pairs: 2-3 = 6, 2-4 = 8, 3-4 = 12.", "2(6 + 8 + 12) = 2-26 = 52."], "52"),
    ]
