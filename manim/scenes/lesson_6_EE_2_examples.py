"""6.EE Unit 2 examples — Writing & evaluating expressions.
Math (verified from the lesson plan):
  1. Evaluate 2x + 5 when x = 4. -> 13
  2. Write 'six more than a number n'. -> n+6
  3. Evaluate 3(a − 2) when a = 5. -> 9
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE2Examples(ExamplesDeck):
    TITLE = "Examples · Writing & evaluating expressions"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("Evaluate 2x + 5 when x = 4", ["We **substitute** **x = 4** into the expression: **2·4 + 5**.", "**2 × 4 = 8**. Now we have **8 + 5**.", "**8 + 5 = 13**. That's our answer!"], "**13**"),
        ("Write 'six more than a number n'", ["'**More than**' means we're **adding**. Start with **n**, then add **6**.", "In math notation: **n + 6**."], "**n + 6**"),
        ("Evaluate 3(a − 2) when a = 5", ["We **substitute a = 5** into **3(a − 2)**. This becomes **3(5 − 2)**.", "First, solve inside the parentheses: **5 − 2 = 3**. Now we have **3 · 3**.", "**3 × 3 = 9**. Final answer!"], "**9**"),
    ]
