"""6.NS Unit 10 examples — Coordinate plane: distance & polygons.
Math (verified from the lesson plan):
  1. Distance from (3, 2) to (3, 7)? -> 5
  2. Distance from (−2, 4) to (5, 4)? -> 7
  3. Side lengths of the rectangle with corners (1, 1), (5, 1), (5, 4), (1, 4)? -> 4 and 3
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS10Examples(ExamplesDeck):
    TITLE = "Examples - Coordinate plane: distance & polygons"
    EXAMPLES = [
        ("Distance from (3, 2) to (3, 7)?", ["Same x -> vertical distance.", "|7 - 2| = 5 units."], "5"),
        ("Distance from (-2, 4) to (5, 4)?", ["Same y -> horizontal.", "|5 - (-2)| = 7 units."], "7"),
        ("Side lengths of the rectangle with corners (1, 1), (5, 1), (5, 4), (1, 4)?", ["Width = |5 - 1| = 4.", "Height = |4 - 1| = 3."], "4 and 3"),
    ]
