"""6.EE Unit 1 trap — Exponents.
Watch-out (from the lesson):
  2³ is 8, not 6 — do not multiply the base by the exponent.
"""
from manim import *  # noqa: F401,F403
from _helpers import TrapDeck


class Lesson6EE1Trap(TrapDeck):
    TITLE = "Avoid the trap · Exponents"
    DOMAIN = "6.EE"
    WRONG = "2 is 8, not 6"
    RIGHT = "do not multiply the base by the exponent."
