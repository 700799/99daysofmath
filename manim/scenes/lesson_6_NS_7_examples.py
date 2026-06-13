"""6.NS Unit 7 examples — Whole-number addition & subtraction.
Math (verified from the lesson plan):
  1. 425 + 376? -> 801
  2. 952 − 387? -> 565
  3. 1003 − 247? -> 756
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS7Examples(ExamplesDeck):
    TITLE = "Examples - Whole-number addition & subtraction"
    EXAMPLES = [
        ("425 + 376?", ["5+6 = 11. Write 1, carry 1.", "2+7+1 = 10. Write 0, carry 1.", "4+3+1 = 8. Answer: 801."], "801"),
        ("952 - 387?", ["Borrow: 2->12, ten becomes 4. 12-7 = 5.", "4->14 (borrowed), hundred becomes 8. 14-8 = 6.", "8-3 = 5. Answer: 565."], "565"),
        ("1003 - 247?", ["Borrow across zeros carefully.", "1003 - 247 = 756."], "756"),
    ]
