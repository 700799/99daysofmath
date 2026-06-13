"""6.RP Unit 4 examples — Part-to-part vs part-to-whole.
Math (verified from the lesson plan):
  1. 3 boys and 2 girls. Ratio of boys to the whole class? -> 3:5
  2. A bowl has 4 apples and 6 pears. Ratio of apples to all fruit? -> 2:5
  3. In a 2:3 paint mix (red:blue), what fraction is red? -> 2/5
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6RP4Examples(ExamplesDeck):
    TITLE = "Examples · Part-to-part vs part-to-whole"
    DOMAIN = "6.RP"
    EXAMPLES = [
        ("3 boys and 2 girls. Ratio of boys to the whole class?", ["Whole = 3 + 2 = 5.", "Boys to whole = 3 to 5.", "= 3:5."], "3:5"),
        ("A bowl has 4 apples and 6 pears. Ratio of apples to all fruit?", ["Total = 4 + 6 = 10.", "Apples to total = 4:10.", "Simplify: 2:5."], "2:5"),
        ("In a 2:3 paint mix (red:blue), what fraction is red?", ["Whole = 2 + 3 = 5 parts.", "Red = 2 of 5.", "= 2/5."], "2/5"),
    ]
