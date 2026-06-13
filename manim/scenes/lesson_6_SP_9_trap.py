"""6.SP Unit 9 trap — Displays: dot plots, histograms & box plots.
Watch-out (from the lesson):
  Bar HEIGHT — not width — equals the count in a histogram.
"""
from manim import *  # noqa: F401,F403
from _helpers import TrapDeck


class Lesson6SP9Trap(TrapDeck):
    TITLE = "Avoid the trap · Displays: dot plots, histograms & box plots"
    DOMAIN = "6.SP"
    WRONG = "Bar HEIGHT"
    RIGHT = "not width - equals the count in a histogram."
