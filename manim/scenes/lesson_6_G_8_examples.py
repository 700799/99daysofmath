"""6.G Unit 8 examples — Volume of right rectangular prisms.
Math (verified from the lesson plan):
  1. Volume of a 1 × 3 × 5 box? -> 15
  2. Volume of a 2 × 4 × 5 box? -> 40
  3. Volume of a ½ × ½ × 4 box? -> 1
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6G8Examples(ExamplesDeck):
    TITLE = "Examples - Volume of right rectangular prisms"
    EXAMPLES = [
        ("Volume of a 1 x 3 x 5 box?", ["1 x 3 x 5 = 15 cubic units."], "15"),
        ("Volume of a 2 x 4 x 5 box?", ["2 x 4 = 8.", "8 x 5 = 40."], "40"),
        ("Volume of a ? x ? x 4 box?", ["? x ? = ?.", "? x 4 = 1."], "1"),
    ]
