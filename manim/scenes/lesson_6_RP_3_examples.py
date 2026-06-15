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
        ("If 2 → 6 and 3 → 9, what does 5 → ?", ["**Find the pattern**: **2 → 6** means **×3**. **3 → 9** also means **×3**. The rule is **multiply by 3**.", "**5 × 3 = 15**."], "**15**"),
        ("Table shows 1 → 4, 2 → 8. Output for 6?", ["**Find the pattern**: **1 × 4 = 4** and **2 × 4 = 8**. The rule is **multiply input by 4**.", "**6 × 4 = 24**."], "**24**"),
        ("4 pens cost $3. What do 8 pens cost?", ["**8 is double 4** (8 = 4 × 2). So if **4 pens cost $3**, then **8 pens cost $3 × 2 = $6**."], "**$6**"),
    ]
