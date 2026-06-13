"""6.G Unit 6 examples — Area & volume review.
Math (verified from the lesson plan):
  1. Rectangular prism 2×3×5 — volume? -> 30
  2. Rectangle 8×4 — area? -> 32
  3. Triangle base 6, height 9 — area? -> 27
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6G6Examples(ExamplesDeck):
    TITLE = "Examples - Area & volume review"
    EXAMPLES = [
        ("Rectangular prism 2x3x5 - volume?", ["l-w-h = 2-3-5.", "= 30 cubic units."], "30"),
        ("Rectangle 8x4 - area?", ["8 x 4.", "= 32 square units."], "32"),
        ("Triangle base 6, height 9 - area?", ["?-6-9.", "= 27 square units."], "27"),
    ]
