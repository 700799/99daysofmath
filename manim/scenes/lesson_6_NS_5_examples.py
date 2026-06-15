"""6.NS Unit 5 examples — The coordinate plane.
Math (verified from the lesson plan):
  1. Which quadrant is (-3, 5) in? -> II
  2. Distance from (2, 1) to (2, 6)? -> 5
  3. Reflect (4, 3) across the y-axis. -> (-4,3)
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS5Examples(ExamplesDeck):
    TITLE = "Examples · The coordinate plane"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("Which quadrant is (-3, 5)?", ["**x = -3 (negative)** and **y = 5 (positive)**. **Negative x, positive y** = **top-left = Quadrant II**."], "**II**"),
        ("Distance from (2, 1) to (2, 6)?", ["Both points have the **same x-coordinate (2)**, so distance is **vertical only**.", "**Distance = |6 − 1| = 5**."], "**5**"),
        ("Reflect (4, 3) across y-axis", ["**Reflecting across the y-axis** means flipping the **x-coordinate's sign**. **y stays the same**.", "**(4, 3) → (-4, 3)**."], "**(-4, 3)**"),
    ]
