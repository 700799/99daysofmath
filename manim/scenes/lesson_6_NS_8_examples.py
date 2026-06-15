"""6.NS Unit 8 examples — Comparing & ordering signed numbers.
Math (verified from the lesson plan):
  1. Which is greater: −3 or 1? -> 1
  2. Order −2, 0, −5 from least to greatest. -> -5,-2,0
  3. Which is greater: −4 or −9? -> -4
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS8Examples(ExamplesDeck):
    TITLE = "Examples · Comparing & ordering signed numbers"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("Which is greater: -3 or 1?", ["On a **number line**, **positive 1 is to the right of 0**, while **-3 is to the left**. **Numbers on the right are bigger**.", "**1 > -3**."], "**1**"),
        ("Order -2, 0, -5 from least to greatest", ["**Arrange on a number line**: **-5 is leftmost (smallest)**, then **-2**, then **0 (rightmost, largest)**.", "**Order: -5, -2, 0**."], "**-5, -2, 0**"),
        ("Which is greater: -4 or -9?", ["**Both are negative**. Which is **closer to 0**? **-4 is closer to 0 than -9 is**. Numbers closer to 0 are **bigger** (less negative).", "**-4 > -9**."], "**-4**"),
    ]
