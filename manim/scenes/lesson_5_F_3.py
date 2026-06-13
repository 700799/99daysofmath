"""5.F Unit 3 — Multiplying & dividing fractions (idea + examples + trap)."""
from manim import *  # noqa: F401,F403
from _helpers import CombinedDeck


class Lesson5F3(CombinedDeck):
    TITLE = "Multiplying & dividing fractions"
    DOMAIN = "5.F"
    BULLETS = [
        "To multiply fractions: tops together, bottoms together - then simplify.",
        "\"Of\" means multiply: 3/5 of 40 is 3/5 × 40.",
        "Dividing asks \"how many fit?\": 4 ÷ 1/3 = 12 because each whole holds 3 thirds.",
    ]
    EXAMPLES = [
        ("Multiply 1/2 × 1/4.", ["1 × 1 = 1 and 2 × 4 = 8.", "Product: 1/8."], "1/8"),
        ("Divide 6 ÷ 1/2.", ["Each whole holds 2 halves.", "6 × 2 = 12."], "12"),
        ("Find 2/3 of 12.", ["1/3 of 12 is 4.", "2/3 is 2 × 4 = 8."], "8"),
    ]
    WRONG = "Dividing by a fraction makes the answer BIGGER, not smaller"
    RIGHT = "4 ÷ 1/3 = 12."
