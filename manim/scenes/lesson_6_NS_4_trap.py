"""6.NS Unit 4 trap — Integers & absolute value.
Watch-out (from the lesson):
  -7 is LESS than -2, even though 7 is bigger than 2.
"""
from manim import *  # noqa: F401,F403
from _helpers import TrapDeck


class Lesson6NS4Trap(TrapDeck):
    TITLE = "Avoid the trap · Integers & absolute value"
    DOMAIN = "6.NS"
    WRONG = "-7 is LESS than -2, even though 7 is bigger than 2."
    RIGHT = "Slow down and re-read."
