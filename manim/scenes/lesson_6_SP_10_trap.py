"""6.SP Unit 10 trap — Summarizing data sets.
Watch-out (from the lesson):
  SORT data before finding median or range — unsorted data hides the extremes.
"""
from manim import *  # noqa: F401,F403
from _helpers import TrapDeck


class Lesson6SP10Trap(TrapDeck):
    TITLE = "Avoid the trap · Summarizing data sets"
    DOMAIN = "6.SP"
    WRONG = "SORT data before finding median or range"
    RIGHT = "unsorted data hides the extremes."
