"""6.NS Unit 8 trap — Comparing & ordering signed numbers.
Watch-out (from the lesson):
  Negative numbers reverse the size order — −10 is SMALLER than −2, not bigger.
"""
from manim import *  # noqa: F401,F403
from _helpers import TrapDeck


class Lesson6NS8Trap(TrapDeck):
    TITLE = "Avoid the trap - Comparing & ordering signed numbers"
    WRONG = "Negative numbers reverse the size order"
    RIGHT = "-10 is SMALLER than -2, not bigger."
