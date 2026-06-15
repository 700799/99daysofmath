"""6.NS Unit 3 examples — GCF, LCM & distributing.
Math (verified from the lesson plan):
  1. GCF of 12 and 18? -> 6
  2. LCM of 4 and 6? -> 12
  3. Rewrite 18 + 24 using the GCF. -> 6(3+4)
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS3Examples(ExamplesDeck):
    TITLE = "Examples · GCF, LCM & distributing"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("GCF of 12 and 18?", ["**Factor both**: **12 = 2 × 2 × 3** and **18 = 2 × 3 × 3**. The **common factors are 2 and 3**.", "**GCF = 2 × 3 = 6**."], "**6**"),
        ("LCM of 4 and 6?", ["List **multiples of 6**: **6, 12, 18...**  Which is also a **multiple of 4**?", "**12 ÷ 4 = 3**, so **12 is a multiple of both**. **LCM = 12**."], "**12**"),
        ("Rewrite 18 + 24 using GCF", ["The **GCF(18, 24) = 6**. Rewrite: **18 = 6 × 3** and **24 = 6 × 4**.", "**18 + 24 = 6(3 + 4)**. Factor out the **GCF**."], "**6(3 + 4)**"),
    ]
