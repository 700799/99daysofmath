"""6.G Unit 9 examples — Polygons on the coordinate plane.
Math (verified from the lesson plan):
  1. Length from (2, 1) to (7, 1)? -> 5
  2. Length from (−3, 4) to (2, 4)? -> 5
  3. Area of rectangle with corners (0, 0), (4, 0), (4, 3), (0, 3)? -> 12
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6G9Examples(ExamplesDeck):
    TITLE = "Examples - Polygons on the coordinate plane"
    EXAMPLES = [
        ("Length from (2, 1) to (7, 1)?", ["Same y, horizontal.", "|7 - 2| = 5."], "5"),
        ("Length from (-3, 4) to (2, 4)?", ["Same y, horizontal.", "|2 - (-3)| = 5."], "5"),
        ("Area of rectangle with corners (0, 0), (4, 0), (4, 3), (0, 3)?", ["Width = 4. Height = 3.", "Area = 12."], "12"),
    ]
