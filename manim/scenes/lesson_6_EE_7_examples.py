"""6.EE Unit 7 examples — Parts of expressions.
Math (verified from the lesson plan):
  1. Coefficient of y in 4y? -> 4
  2. Constant term in 7 + 3x? -> 7
  3. How many terms in 5x − 2 + 3? -> 2
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6EE7Examples(ExamplesDeck):
    TITLE = "Examples · Parts of expressions"
    DOMAIN = "6.EE"
    EXAMPLES = [
        ("Coefficient of y in 4y?", ["The **coefficient** is the **number multiplied by the variable**. In **4y**, the number stuck to the y is **4**."], "**4**"),
        ("Constant term in 7 + 3x?", ["A **constant** is a number with **no variable attached**. In **7 + 3x**, the constant term is **7** (3x is a variable term)."], "**7**"),
        ("How many terms in 5x − 2 + 3?", ["First, **combine like terms**: **−2 + 3 = 1**. So the expression becomes **5x + 1**.", "That's **2 terms**: **5x** (variable term) and **1** (constant term)."], "**2**"),
    ]
