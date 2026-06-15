"""6.EE Unit 8 examples — Equivalent expressions & checking solutions.
Math (verified from the lesson plan):
  1. Is 2x + 6 equivalent to 2(x + 3)? -> yes
  2. Is x = 4 a solution to x + 5 = 9? -> yes
  3. Is x = 3 a solution to 2x = 8? -> no
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE8Examples(ExamplesDeck):
    TITLE = "Examples · Equivalent expressions & checking solutions"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("Is 2x + 6 equivalent to 2(x + 3)?", ["**Expand** the second expression using the **distributive property**: **2(x + 3) = 2·x + 2·3 = 2x + 6**.", "Both expressions simplify to **2x + 6**. They're **equivalent!**"], "**yes**"),
        ("Is x = 4 a solution to x + 5 = 9?", ["**Substitute x = 4** into the equation: **4 + 5 = 9**.", "**True!** So **x = 4 IS a solution**."], "**yes**"),
        ("Is x = 3 a solution to 2x = 8?", ["**Substitute x = 3**: **2(3) = 6**. Is **6 = 8**? No, they're not equal.", "So **x = 3 is NOT a solution**."], "**no**"),
    ]
