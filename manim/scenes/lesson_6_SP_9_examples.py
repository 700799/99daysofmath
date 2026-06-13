"""6.SP Unit 9 examples — Displays: dot plots, histograms & box plots.
Math (verified from the lesson plan):
  1. On a dot plot, each dot represents? -> one data value
  2. A histogram bar over 10–19 has height 5. How many values in 10–19? -> 5
  3. On a box plot, what does the box show? -> middle 50%
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6SP9Examples(ExamplesDeck):
    TITLE = "Examples - Displays: dot plots, histograms & box plots"
    EXAMPLES = [
        ("On a dot plot, each dot represents?", ["One data value.", "A single observation."], "one data value"),
        ("A histogram bar over 10-19 has height 5. How many values in 10-19?", ["Bar height = count.", "5 values."], "5"),
        ("On a box plot, what does the box show?", ["Middle 50% of the data.", "From Q1 to Q3."], "middle 50%"),
    ]
