"""5.F Unit 1 examples — Place value & big operations.
Math (verified from the lesson plan):
  1. What is the value of the 5 in 4,562? -> 500
  2. Multiply 24 × 13. -> 312
  3. Divide 432 ÷ 6. -> 72
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson5F1Examples(ExamplesDeck):
    TITLE = "Examples - Place value & big operations"
    EXAMPLES = [
        ("What is the value of the 5 in 4,562?", ["The 5 sits in the hundreds place.", "5 x 100 = 500."], "500"),
        ("Multiply 24 x 13.", ["24 x 10 = 240.", "24 x 3 = 72.", "240 + 72 = 312."], "312"),
        ("Divide 432 / 6.", ["6 x 70 = 420.", "432 - 420 = 12, and 12 / 6 = 2.", "70 + 2 = 72."], "72"),
    ]
