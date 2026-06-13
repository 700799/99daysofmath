"""6.SP Unit 4 examples — Displaying data.
Math (verified from the lesson plan):
  1. On a box plot, what does the line inside the box show? -> median
  2. A dot plot has 3 dots above 5. How many values equal 5? -> 3
  3. Do histogram bars touch (no gaps)? (yes/no) -> yes
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6SP4Examples(ExamplesDeck):
    TITLE = "Examples - Displaying data"
    EXAMPLES = [
        ("On a box plot, what does the line inside the box show?", ["The box spans the middle half.", "The inside line is the middle.", "= the median."], "median"),
        ("A dot plot has 3 dots above 5. How many values equal 5?", ["One dot = one value.", "= 3."], "3"),
        ("Do histogram bars touch (no gaps)? (yes/no)", ["Histograms group equal intervals.", "= yes."], "yes"),
    ]
