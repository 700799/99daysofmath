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
        ("6 muffins cost $9. Cost per muffin?", ["**'Per muffin'** means we **divide total cost by number of muffins**: **$9 ÷ 6**.", "**$9 ÷ 6 = $1.50** per muffin."], "**$1.50**"),
        ("Car goes 150 miles in 3 hours. Miles per hour?", ["**'Per hour'** means we **divide miles by hours**: **150 ÷ 3**.", "**150 ÷ 3 = 50 mph**."], "**50**"),
        ("4 notebooks cost $10. Price per notebook?", ["**'Per notebook'** means **total cost divided by number of notebooks**: **$10 ÷ 4**.", "**$10 ÷ 4 = $2.50** per notebook."], "**$2.50**"),
    ]
