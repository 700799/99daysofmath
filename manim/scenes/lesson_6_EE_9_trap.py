"""6.EE Unit 9 trap — Writing & solving equations from words.
Watch-out (from the lesson):
  "n less than 12" is 12 − n, NOT n − 12. Order of "less than" is reversed.
"""
from manim import *  # noqa: F401,F403
from _helpers import TrapDeck


class Lesson6EE9Trap(TrapDeck):
    TITLE = "Avoid the trap · Writing & solving equations from words"
    DOMAIN = "6.EE"
    WRONG = "\"n less than 12\" is 12 − n, NOT n − 12"
    RIGHT = "Order of \"less than\" is reversed."
