"""6.NS Unit 3 examples — GCF, LCM & distributing.
Math (verified from the lesson plan):
  1. GCF of 12 and 18? -> 6
  2. LCM of 4 and 6? -> 12
  3. Rewrite 18 + 24 using the GCF. -> 6(3+4)
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS3Examples(ExamplesDeck):
    TITLE = "Examples - GCF, LCM & distributing"
    EXAMPLES = [
        ("GCF of 12 and 18?", ["12 = 2-2-3, 18 = 2-3-3.", "Common factors 2-3.", "= 6."], "6"),
        ("LCM of 4 and 6?", ["Multiples of 6: 6, 12?", "12 is also a multiple of 4.", "= 12."], "12"),
        ("Rewrite 18 + 24 using the GCF.", ["GCF(18,24) = 6.", "18 = 6-3, 24 = 6-4.", "= 6(3 + 4)."], "6(3+4)"),
    ]
