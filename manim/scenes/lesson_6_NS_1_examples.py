"""6.NS Unit 1 examples — Adding & subtracting decimals.
Math (verified from the lesson plan):
  1. 3.4 + 1.25 -> 4.65
  2. 5 − 2.3 -> 2.7
  3. 0.75 + 0.5 -> 1.25
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS1Examples(ExamplesDeck):
    TITLE = "Examples · Adding & subtracting decimals"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("3.4 + 1.25", ["**Line up the decimal points** and **match decimal places**. Rewrite **3.4 as 3.40** so both have two decimal places.", "Now add: **3.40 + 1.25 = 4.65**."], "**4.65**"),
        ("5 − 2.3", ["Write **5 as 5.0** to match decimal places with **2.3**.", "Now subtract: **5.0 − 2.3 = 2.7**."], "**2.7**"),
        ("0.75 + 0.5", ["Rewrite **0.5 as 0.50** to match two decimal places with **0.75**.", "Add: **0.75 + 0.50 = 1.25**."], "**1.25**"),
    ]
