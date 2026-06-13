"""6.G Unit 2 examples — Polygons on the grid.
Math (verified from the lesson plan):
  1. Length from (2, 1) to (2, 6)? -> 5
  2. Length from (1, 3) to (7, 3)? -> 6
  3. Rectangle with corners (0,0),(4,0),(4,2),(0,2). Area? -> 8
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6G2Examples(ExamplesDeck):
    TITLE = "Examples · Polygons on the grid"
    DOMAIN = "6.G"
    EXAMPLES = [
        ("Length from (2, 1) to (2, 6)?", ["Same x -> vertical.", "6 − 1.", "= 5."], "5"),
        ("Length from (1, 3) to (7, 3)?", ["Same y -> horizontal.", "7 − 1.", "= 6."], "6"),
        ("Rectangle with corners (0,0),(4,0),(4,2),(0,2). Area?", ["Width 4, height 2.", "4 × 2.", "= 8."], "8"),
    ]
