"""5.F Unit 6 examples — Coordinate plane, patterns & line plots.
Math (verified from the lesson plan):
  1. Plot: right 3, up 2 from the origin. Coordinates? -> (3,2)
  2. Pattern 0, 4, 8, … what is the 5th term? -> 16
  3. A line plot shows 2 Xs above 1/2. How many items measured 1/2? -> 2
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson5F6Examples(ExamplesDeck):
    TITLE = "Examples - Coordinate plane, patterns & line plots"
    EXAMPLES = [
        ("Plot: right 3, up 2 from the origin. Coordinates?", ["Across 3 -> x = 3.", "Up 2 -> y = 2.", "Point: (3, 2)."], "(3,2)"),
        ("Pattern 0, 4, 8, ? what is the 5th term?", ["Four jumps of +4 from 0.", "0 + 4 x 4 = 16."], "16"),
        ("A line plot shows 2 Xs above 1/2. How many items measured 1/2?", ["Each X is one item.", "Two Xs -> 2 items."], "2"),
    ]
