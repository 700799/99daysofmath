"""6.EE Unit 9 examples — Writing & solving equations from words.
Math (verified from the lesson plan):
  1. Marcos saves $25 per week for w weeks. Expression for total? -> 25w
  2. Equation for "a number plus 6 equals 14". -> x+6=14
  3. Solve x + 6 = 14. -> 8
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE9Examples(ExamplesDeck):
    TITLE = "Examples · Writing & solving equations from words"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("Marcos saves 25 per week for w weeks. Expression for total?", ["Total = price per week × number of weeks.", "25w."], "25w"),
        ("Equation for \"a number plus 6 equals 14\".", ["Let the number be x.", "x + 6 = 14."], "x+6=14"),
        ("Solve x + 6 = 14.", ["Subtract 6 from both sides.", "x = 8."], "8"),
    ]
