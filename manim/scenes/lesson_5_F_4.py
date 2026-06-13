"""5.F Unit 4 — Decimals: place value & operations (idea + examples + trap)."""
from manim import *  # noqa: F401,F403
from _helpers import CombinedDeck


class Lesson5F4(CombinedDeck):
    TITLE = "Decimals: place value & operations"
    DOMAIN = "5.F"
    BULLETS = [
        "Line up the decimal points to add or subtract - 2.5 is 2.50.",
        "To compare decimals, give them the same number of places: 0.5 = 0.50 > 0.45.",
        "When multiplying, count decimal places: tenths × tenths = hundredths.",
    ]
    EXAMPLES = [
        ("Add 0.3 + 0.45.", ["Write 0.3 as 0.30.", "0.30 + 0.45 = 0.75."], "0.75"),
        ("Subtract 2 − 0.85.", ["Count up: 0.85 + 0.15 = 1.", "1 + 1 = 2, so total counted = 1.15."], "1.15"),
        ("Multiply 0.5 × 0.8.", ["5 × 8 = 40.", "Two decimal places -> 0.40 = 0.4."], "0.4"),
    ]
    WRONG = "Longer is not bigger"
    RIGHT = "0.5 beats 0.45 even though 45 has more digits."
