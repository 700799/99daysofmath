"""6.EE Unit 10 examples — Tables & relationships.
Math (verified from the lesson plan):
  1. For y = 4x, find y when x = 6. -> 24
  2. Fill in y for y = x + 3 at x = 1, 2, 3. -> 4, 5, 6
  3. Rule for the pairs (1, 5), (2, 10), (3, 15)? -> y=5x
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE10Examples(ExamplesDeck):
    TITLE = "Examples · Tables & relationships"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("For y = 4x, find y when x = 6", ["**Substitute x = 6** into the equation **y = 4x**.", "**y = 4 × 6 = 24**."], "**24**"),
        ("Fill in y for y = x + 3 at x = 1, 2, 3", ["**At x = 1**: **y = 1 + 3 = 4**. **At x = 2**: **y = 2 + 3 = 5**. **At x = 3**: **y = 3 + 3 = 6**."], "**4, 5, 6**"),
        ("Rule for pairs (1, 5), (2, 10), (3, 15)?", ["Look at the pattern: **1→5, 2→10, 3→15**. Each **y is 5 times the x value**.", "**The rule is y = 5x**."], "**y = 5x**"),
    ]
