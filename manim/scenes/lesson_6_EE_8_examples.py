"""6.EE Unit 8 examples — Equivalent expressions & checking solutions.
Math (verified from the lesson plan):
  1. Is 2x + 6 equivalent to 2(x + 3)? -> yes
  2. Is x = 4 a solution to x + 5 = 9? -> yes
  3. Is x = 3 a solution to 2x = 8? -> no
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE8Examples(ExamplesDeck):
    TITLE = "Examples - Equivalent expressions & checking solutions"
    EXAMPLES = [
        ("Is 2x + 6 equivalent to 2(x + 3)?", ["Distribute: 2(x + 3) = 2x + 6.", "Same expression. Yes."], "yes"),
        ("Is x = 4 a solution to x + 5 = 9?", ["Substitute: 4 + 5 = 9. ?", "Yes."], "yes"),
        ("Is x = 3 a solution to 2x = 8?", ["Check: 2(3) = 6, not 8.", "No."], "no"),
    ]
