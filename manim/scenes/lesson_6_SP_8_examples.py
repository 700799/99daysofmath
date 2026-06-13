"""6.SP Unit 8 examples — Center: mean & median in depth.
Math (verified from the lesson plan):
  1. Median of {3, 5, 7, 9, 11}? -> 7
  2. Median of {2, 4, 6, 8}? -> 5
  3. Mean of {5, 5, 5, 100}? -> 28.75
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6SP8Examples(ExamplesDeck):
    TITLE = "Examples · Center: mean & median in depth"
    DOMAIN = "6.SP"
    EXAMPLES = [
        ("Median of {3, 5, 7, 9, 11}?", ["Sorted; 5 items.", "Middle is the 3rd value: 7."], "7"),
        ("Median of {2, 4, 6, 8}?", ["4 items.", "Middle two: 4 and 6.", "Average: 5."], "5"),
        ("Mean of {5, 5, 5, 100}?", ["Sum: 115. Count: 4.", "115 ÷ 4 = 28.75."], "28.75"),
    ]
