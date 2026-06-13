"""5.F Unit 2 — Adding & subtracting fractions (idea + examples + trap)."""
from manim import *  # noqa: F401,F403
from _helpers import CombinedDeck


class Lesson5F2(CombinedDeck):
    TITLE = "Adding & subtracting fractions"
    DOMAIN = "5.F"
    BULLETS = [
        "You can only add or subtract pieces that are the SAME size - same denominator.",
        "Rewrite each fraction using a common denominator first (often the LCM).",
        "Then add or subtract just the numerators and simplify.",
    ]
    EXAMPLES = [
        ("Add 1/2 + 1/3.", ["Common denominator: 6.", "1/2 = 3/6 and 1/3 = 2/6.", "3/6 + 2/6 = 5/6."], "5/6"),
        ("Subtract 3/4 − 1/2.", ["1/2 = 2/4.", "3/4 − 2/4 = 1/4."], "1/4"),
        ("Add 2/3 + 3/4.", ["Twelfths: 8/12 + 9/12.", "= 17/12 = 1 5/12."], "1 5/12"),
    ]
    WRONG = "Never add the denominators! 1/2 + 1/3 is NOT 2/5"
    RIGHT = "make the pieces match first."
