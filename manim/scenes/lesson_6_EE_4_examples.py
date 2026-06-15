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
        ("Solve x + 7 = 12", ["To **isolate x**, we need to **undo the +7**. We do this by **subtracting 7 from both sides**.", "**x + 7 − 7 = 12 − 7**. Simplify: **x = 5**."], "**5**"),
        ("Solve 3x = 15", ["To **isolate x**, we need to **undo the multiplication by 3**. We do this by **dividing both sides by 3**.", "**3x ÷ 3 = 15 ÷ 3**. Simplify: **x = 5**."], "**5**"),
        ("Solve x − 4 = 10", ["To **isolate x**, we need to **undo the subtraction of 4**. We do this by **adding 4 to both sides**.", "**x − 4 + 4 = 10 + 4**. Simplify: **x = 14**."], "**14**"),
    ]
