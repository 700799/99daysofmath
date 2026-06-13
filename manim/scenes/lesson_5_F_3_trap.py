"""5.F Unit 3 trap — Multiplying & dividing fractions.
Watch-out (from the lesson):
  Dividing by a fraction makes the answer BIGGER, not smaller — 4 ÷ 1/3 = 12.
"""
from manim import *  # noqa: F401,F403
from _helpers import TrapDeck


class Lesson5F3Trap(TrapDeck):
    TITLE = "Avoid the trap · Multiplying & dividing fractions"
    DOMAIN = "5.F"
    WRONG = "Dividing by a fraction makes the answer BIGGER, not smaller"
    RIGHT = "4 ÷ 1/3 = 12."
