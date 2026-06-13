"""6.G Unit 4 examples — Surface area with nets.
Math (verified from the lesson plan):
  1. Cube with side 2 — surface area? -> 24
  2. Cube with side 3 — surface area? -> 54
  3. A box 2×3×1: area of the 2×3 face? -> 6
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6G4Examples(ExamplesDeck):
    TITLE = "Examples · Surface area with nets"
    DOMAIN = "6.G"
    EXAMPLES = [
        ("Cube with side 2 - surface area?", ["One face = 2 × 2 = 4.", "6 faces.", "6 × 4 = 24."], "24"),
        ("Cube with side 3 - surface area?", ["One face = 9.", "6 × 9.", "= 54."], "54"),
        ("A box 2×3×1: area of the 2×3 face?", ["2 × 3.", "= 6 square units."], "6"),
    ]
