"""6.NS Unit 7 examples — Whole-number addition & subtraction.
Math (verified from the lesson plan):
  1. 425 + 376? -> 801
  2. 952 − 387? -> 565
  3. 1003 − 247? -> 756
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS7Examples(ExamplesDeck):
    TITLE = "Examples · Whole-number addition & subtraction"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("425 + 376?", ["**Add from right to left**: **5 + 6 = 11**. Write **1**, carry **1**. Then **2 + 7 + 1 = 10**. Write **0**, carry **1**. Finally **4 + 3 + 1 = 8**.", "**Answer: 801**."], "**801**"),
        ("952 − 387?", ["**Start on the right**: **2 < 7**, so **borrow 10** from the tens place. **12 − 7 = 5**. Now the tens: **4 − 8** needs borrowing again. **14 − 8 = 6**. Hundreds: **8 − 3 = 5**.", "**Answer: 565**."], "**565**"),
        ("1003 − 247?", ["**Borrowing with zeros**: Starting right: **3 < 7**, borrow from tens... but tens is 0! **Borrow from hundreds (1 → 0, tens 10 → 9)**. **13 − 7 = 6**. Tens: **9 − 4 = 5**. Hundreds: **0 − 2**, need to borrow. **10 − 2 = 8**. Thousands: **0**.", "**Answer: 756**."], "**756**"),
    ]
