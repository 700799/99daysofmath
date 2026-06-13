"""6.RP Unit 8 examples — Rates & unit pricing.
Math (verified from the lesson plan):
  1. 180 miles in 3 hours — what is the speed? -> 60
  2. 12 cookies cost $6. Cost per cookie? -> $0.50
  3. Is 4 lbs for $10 or 6 lbs for $12 cheaper per lb? -> 6 for $12
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6RP8Examples(ExamplesDeck):
    TITLE = "Examples · Rates & unit pricing"
    DOMAIN = "6.RP"
    EXAMPLES = [
        ("180 miles in 3 hours - what is the speed?", ["Speed = miles ÷ hours.", "180 ÷ 3 = 60 mph."], "60"),
        ("12 cookies cost 6. Cost per cookie?", ["6 ÷ 12 cookies.", "= 0.50 per cookie."], "0.50"),
        ("Is 4 lbs for 10 or 6 lbs for 12 cheaper per lb?", ["10/4 = 2.50/lb.", "12/6 = 2.00/lb.", "Pick the smaller: 2.00/lb (6 for 12)."], "6 for 12"),
    ]
