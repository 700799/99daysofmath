"""6.EE Unit 4 examples — One-step equations.
Math (verified from the lesson plan):
  1. Solve x + 7 = 12. -> 5
  2. Solve 3x = 15. -> 5
  3. Solve x − 4 = 10. -> 14
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE4Examples(ExamplesDeck):
    TITLE = "Examples · One-step equations"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("Solve x + 7 = 12.", ["Subtract 7 from both sides.", "x = 12 − 7.", "x = 5."], "5"),
        ("Solve 3x = 15.", ["Divide both sides by 3.", "x = 15 ÷ 3.", "x = 5."], "5"),
        ("Solve x − 4 = 10.", ["Add 4 to both sides.", "x = 10 + 4.", "x = 14."], "14"),
    ]
