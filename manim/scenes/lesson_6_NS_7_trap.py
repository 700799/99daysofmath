"""6.NS Unit 7 trap — Whole-number addition & subtraction.
Watch-out (from the lesson):
  Carrying and borrowing pass to the NEXT-LARGER column. Don't skip a place.
"""
from manim import *  # noqa: F401,F403
from _helpers import TrapDeck


class Lesson6NS7Trap(TrapDeck):
    TITLE = "Avoid the trap · Whole-number addition & subtraction"
    DOMAIN = "6.NS"
    WRONG = "Carrying and borrowing pass to the NEXT-LARGER column"
    RIGHT = "Don't skip a place."
