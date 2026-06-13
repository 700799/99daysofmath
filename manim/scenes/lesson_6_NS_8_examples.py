"""6.NS Unit 8 examples — Comparing & ordering signed numbers.
Math (verified from the lesson plan):
  1. Which is greater: −3 or 1? -> 1
  2. Order −2, 0, −5 from least to greatest. -> -5,-2,0
  3. Which is greater: −4 or −9? -> -4
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6NS8Examples(ExamplesDeck):
    TITLE = "Examples · Comparing & ordering signed numbers"
    DOMAIN = "6.NS"
    EXAMPLES = [
        ("Which is greater: −3 or 1?", ["1 is to the right of 0; −3 is left.", "1 > −3."], "1"),
        ("Order −2, 0, −5 from least to greatest.", ["−5 is leftmost.", "Then −2, then 0.", "−5, −2, 0."], "-5,-2,0"),
        ("Which is greater: −4 or −9?", ["Both negative; −4 is closer to 0.", "−4 > −9."], "-4"),
    ]
