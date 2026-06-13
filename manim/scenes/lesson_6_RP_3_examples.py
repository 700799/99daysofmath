"""6.RP Unit 3 examples — Ratio tables.
Math (verified from the lesson plan):
  1. If 2 → 6 and 3 → 9, what does 5 map to? -> 15
  2. A table shows 1 → 4 and 2 → 8. Output for 6? -> 24
  3. If 4 pens cost $3, what do 8 pens cost? -> $6
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6RP3Examples(ExamplesDeck):
    TITLE = "Examples · Ratio tables"
    DOMAIN = "6.RP"
    EXAMPLES = [
        ("If 2 -> 6 and 3 -> 9, what does 5 map to?", ["Each input is ×3.", "5 × 3.", "= 15."], "15"),
        ("A table shows 1 -> 4 and 2 -> 8. Output for 6?", ["Pattern: output = input × 4.", "6 × 4.", "= 24."], "24"),
        ("If 4 pens cost 3, what do 8 pens cost?", ["8 is 4 × 2, so double the cost.", "3 × 2.", "= 6."], "6"),
    ]
