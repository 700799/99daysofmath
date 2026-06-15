"""6.NS Unit 6 examples — Dividing fractions.
Math (verified from the lesson plan):
  1. 1/2 ÷ 1/4 -> 2
  2. 3/4 ÷ 1/2 -> 3/2
  3. 2/3 ÷ 4 -> 1/6
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS6Examples(ExamplesDeck):
    TITLE = "Examples · Dividing fractions"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("1/2 ÷ 1/4", ["To divide fractions, use **'Keep-Change-Flip'**: **Keep 1/2, flip 1/4 to 4/1**.", "**1/2 × 4/1 = 4/2 = 2**."], "**2**"),
        ("3/4 ÷ 1/2", ["**Keep 3/4, flip 1/2 to 2/1**. Now multiply: **3/4 × 2/1 = 6/4**.", "**Simplify: 6/4 = 3/2**."], "**3/2**"),
        ("2/3 ÷ 4", ["Rewrite **4 as 4/1**. **Flip to 1/4**. Multiply: **2/3 × 1/4 = 2/12**.", "**Simplify: 2/12 = 1/6**."], "**1/6**"),
    ]
