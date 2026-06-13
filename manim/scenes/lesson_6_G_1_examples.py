"""6.G Unit 1 examples — Area of triangles & rectangles.
Math (verified from the lesson plan):
  1. Triangle with base 8 and height 5. -> 20
  2. Rectangle 7 by 3. -> 21
  3. Triangle base 10, height 4. -> 20
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6G1Examples(ExamplesDeck):
    TITLE = "Examples · Area of triangles & rectangles"
    DOMAIN = "6.G"
    EXAMPLES = [
        ("Triangle with base 8 and height 5.", ["Area = ½ · base · height.", "½ · 8 · 5.", "= 20 square units."], "20"),
        ("Rectangle 7 by 3.", ["Area = length × width.", "7 × 3.", "= 21 square units."], "21"),
        ("Triangle base 10, height 4.", ["½ · 10 · 4.", "= 20 square units."], "20"),
    ]
