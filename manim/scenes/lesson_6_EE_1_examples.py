"""6.EE Unit 1 examples — Exponents.
Math (verified from the lesson plan):
  1. Evaluate 3³. -> 27
  2. Evaluate 5². -> 25
  3. Evaluate 2⁴. -> 16
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE1Examples(ExamplesDeck):
    TITLE = "Examples · Exponents"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("Evaluate 3³", ["The notation **3³** means **'3 multiplied by itself 3 times'**. So we write it as **3 × 3 × 3**.", "First: **3 × 3 = 9**. Then: **9 × 3 = 27**."], "**27**"),
        ("Evaluate 5²", ["**5²** means **'5 multiplied by itself 2 times'**. That's **5 × 5**.", "**5 × 5 = 25**. Done!"], "**25**"),
        ("Evaluate 2⁴", ["**2⁴** means **'2 multiplied by itself 4 times'**: **2 × 2 × 2 × 2**.", "**2 × 2 = 4**. Then **4 × 2 = 8**. Then **8 × 2 = 16**."], "**16**"),
    ]
