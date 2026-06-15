"""6.NS Unit 4 examples — Integers & absolute value.
Math (verified from the lesson plan):
  1. What is |-7|? -> 7
  2. Which is greater, -5 or -2? -> -2
  3. A diver is at -30 ft, a kite at 12 ft. Who is farther from sea level (0)? -> diver
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS4Examples(ExamplesDeck):
    TITLE = "Examples · Integers & absolute value"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("What is |-7|?", ["**Absolute value** is the **distance from 0**, always positive. **-7 is 7 units away from 0**.", "**|-7| = 7**."], "**7**"),
        ("Which is greater, -5 or -2?", ["On a **number line**, **-2 is to the right of -5**. Numbers on the right are **bigger**.", "So **-2 > -5**."], "**-2**"),
        ("Diver at -30 ft, kite at 12 ft. Farther from sea level?", ["**Absolute values**: **|-30| = 30 ft** and **|12| = 12 ft**. Compare: **30 > 12**.", "The **diver is farther from sea level**."], "**diver**"),
    ]
