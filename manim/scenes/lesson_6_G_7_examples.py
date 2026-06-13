"""6.G Unit 7 examples — Composite figures (area).
Math (verified from the lesson plan):
  1. Two rectangles side-by-side: 4 × 3 and 4 × 2. Total area? -> 20
  2. A 6 × 5 rectangle with a 2 × 2 square cut out. Area left? -> 26
  3. A "house": rectangle 8 × 5 plus triangle base 8, height 4 on top. -> 56
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6G7Examples(ExamplesDeck):
    TITLE = "Examples - Composite figures (area)"
    EXAMPLES = [
        ("Two rectangles side-by-side: 4 x 3 and 4 x 2. Total area?", ["Piece 1: 4 x 3 = 12.", "Piece 2: 4 x 2 = 8.", "Total: 20."], "20"),
        ("A 6 x 5 rectangle with a 2 x 2 square cut out. Area left?", ["Big: 6 x 5 = 30.", "Cutout: 2 x 2 = 4.", "Left: 30 - 4 = 26."], "26"),
        ("A \"house\": rectangle 8 x 5 plus triangle base 8, height 4 on top.", ["Rectangle: 8 x 5 = 40.", "Triangle: ? x 8 x 4 = 16.", "Total: 56."], "56"),
    ]
