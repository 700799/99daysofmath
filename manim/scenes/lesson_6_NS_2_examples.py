"""6.NS Unit 2 examples — Multiplying & dividing decimals.
Math (verified from the lesson plan):
  1. 0.6 × 0.4 -> 0.24
  2. 1.2 × 3 -> 3.6
  3. 4.8 ÷ 0.6 -> 8
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS2Examples(ExamplesDeck):
    TITLE = "Examples · Multiplying & dividing decimals"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("0.6 × 0.4", ["Ignore decimals and multiply: **6 × 4 = 24**. Count decimal places: **0.6** has 1 place, **0.4** has 1 place = **2 total**.", "Place the decimal 2 places from the right: **0.24**."], "**0.24**"),
        ("1.2 × 3", ["Multiply: **12 × 3 = 36**. **1.2** has **1 decimal place**, so place the decimal 1 place from right.", "**3.6**."], "**3.6**"),
        ("4.8 ÷ 0.6", ["To divide by a decimal, **move the decimal point right in BOTH numbers** to make a whole divisor. **4.8 ÷ 0.6 becomes 48 ÷ 6**.", "**48 ÷ 6 = 8**."], "**8**"),
    ]
