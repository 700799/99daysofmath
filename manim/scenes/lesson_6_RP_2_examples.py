"""6.RP Unit 2 examples — Unit rates.
Math (verified from the lesson plan):
  1. 6 muffins cost $9. Cost per muffin? -> $1.50
  2. A car goes 150 miles in 3 hours. Miles per hour? -> 50
  3. 4 notebooks cost $10. Price per notebook? -> $2.50
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6RP2Examples(ExamplesDeck):
    TITLE = "Examples · Unit rates"
    DOMAIN = "6.RP"
    EXAMPLES = [
        ("6 muffins cost 9. Cost per muffin?", ["Per muffin means money ÷ muffins.", "9 ÷ 6.", "= 1.50."], "1.50"),
        ("A car goes 150 miles in 3 hours. Miles per hour?", ["Per hour means miles ÷ hours.", "150 ÷ 3.", "= 50 mph."], "50"),
        ("4 notebooks cost 10. Price per notebook?", ["Divide cost by notebooks.", "10 ÷ 4.", "= 2.50."], "2.50"),
    ]
