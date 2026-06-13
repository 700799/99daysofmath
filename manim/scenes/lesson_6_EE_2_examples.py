"""6.EE Unit 2 examples — Writing & evaluating expressions.
Math (verified from the lesson plan):
  1. Evaluate 2x + 5 when x = 4. -> 13
  2. Write 'six more than a number n'. -> n+6
  3. Evaluate 3(a − 2) when a = 5. -> 9
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE2Examples(ExamplesDeck):
    TITLE = "Examples - Writing & evaluating expressions"
    EXAMPLES = [
        ("Evaluate 2x + 5 when x = 4.", ["Substitute: 2-4 + 5.", "8 + 5.", "= 13."], "13"),
        ("Write 'six more than a number n'.", ["'more than' means add.", "= n + 6."], "n+6"),
        ("Evaluate 3(a - 2) when a = 5.", ["Substitute: 3(5 - 2).", "3 - 3.", "= 9."], "9"),
    ]
