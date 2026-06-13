"""6.G Unit 3 examples — Volume of prisms.
Math (verified from the lesson plan):
  1. Box 1/2 by 3 by 4. -> 6
  2. Box 2 by 3 by 5. -> 30
  3. Cube with side 3. -> 27
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6G3Examples(ExamplesDeck):
    TITLE = "Examples - Volume of prisms"
    EXAMPLES = [
        ("Box 1/2 by 3 by 4.", ["V = l-w-h.", "? - 3 - 4 = ? - 12.", "= 6 cubic units."], "6"),
        ("Box 2 by 3 by 5.", ["2 - 3 - 5.", "= 30 cubic units."], "30"),
        ("Cube with side 3.", ["3 - 3 - 3.", "= 27 cubic units."], "27"),
    ]
