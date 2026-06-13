"""6.G Unit 5 examples — Composite figures.
Math (verified from the lesson plan):
  1. An L-shape = a 4×2 rectangle plus a 3×2 rectangle. Total area? -> 14
  2. A 5×5 square with a 2×2 square cut out. Area left? -> 21
  3. A 6×3 rectangle with a triangle (base 6, height 2) on top. Area? -> 24
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6G5Examples(ExamplesDeck):
    TITLE = "Examples · Composite figures"
    DOMAIN = "6.G"
    EXAMPLES = [
        ("An L-shape = a 4×2 rectangle plus a 3×2 rectangle. Total area?", ["4×2 = 8.", "3×2 = 6.", "8 + 6 = 14."], "14"),
        ("A 5×5 square with a 2×2 square cut out. Area left?", ["25 − 4.", "= 21."], "21"),
        ("A 6×3 rectangle with a triangle (base 6, height 2) on top. Area?", ["Rectangle = 18.", "Triangle = ½·6·2 = 6.", "18 + 6 = 24."], "24"),
    ]
