"""6.EE Unit 5 examples — Inequalities.
Math (verified from the lesson plan):
  1. Graph x ≥ 2 — open or closed circle at 2? -> closed
  2. Write 'a number is at most 10'. -> x≤10
  3. Is x = 5 a solution to x < 5? -> no
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE5Examples(ExamplesDeck):
    TITLE = "Examples · Inequalities"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("Graph x ≥ 2 - open or closed circle?", ["The symbol **≥** means **'greater than or equal to'**. It **includes the number 2**.", "On a number line, **use a filled (closed) circle** at 2 to show it's included."], "**closed**"),
        ("Write 'a number is at most 10'", ["**'At most'** means the number can be 10 **or less**. In math, that's **≤**.", "In inequality form: **x ≤ 10**."], "**x ≤ 10**"),
        ("Is x = 5 a solution to x < 5?", ["We substitute **x = 5** into the inequality: **Is 5 < 5?** No, **5 is not less than 5**.", "So **x = 5 is NOT a solution**."], "**no**"),
    ]
