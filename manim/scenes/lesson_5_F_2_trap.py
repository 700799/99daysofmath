"""5.F Unit 2 trap — Adding & subtracting fractions.
Watch-out (from the lesson):
  Never add the denominators! 1/2 + 1/3 is NOT 2/5 — make the pieces match first.
"""
from manim import *  # noqa: F401,F403
from _helpers import TrapDeck


class Lesson5F2Trap(TrapDeck):
    TITLE = "Avoid the trap · Adding & subtracting fractions"
    DOMAIN = "5.F"
    WRONG = "Never add the denominators! 1/2 + 1/3 is NOT 2/5"
    RIGHT = "make the pieces match first."
