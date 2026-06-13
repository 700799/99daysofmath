"""5.F Unit 1 — Place value & big operations (idea + examples + trap)."""
from manim import *  # noqa: F401,F403
from _helpers import CombinedDeck


class Lesson5F1(CombinedDeck):
    TITLE = "Place value & big operations"
    DOMAIN = "5.F"
    BULLETS = [
        "Each place is 10 times the place to its right - the 7 in 47,283 is worth 7,000.",
        "To multiply big numbers, break them apart: 38 × 27 = 38 × 20 + 38 × 7.",
        "To divide, peel off easy chunks: 504 ÷ 8 -> 480 ÷ 8 = 60, then 24 ÷ 8 = 3.",
    ]
    EXAMPLES = [
        ("What is the value of the 5 in 4,562?", ["The 5 sits in the hundreds place.", "5 × 100 = 500."], "500"),
        ("Multiply 24 × 13.", ["24 × 10 = 240.", "24 × 3 = 72.", "240 + 72 = 312."], "312"),
        ("Divide 432 ÷ 6.", ["6 × 70 = 420.", "432 − 420 = 12, and 12 ÷ 6 = 2.", "70 + 2 = 72."], "72"),
    ]
    WRONG = "The VALUE of a digit is not the digit itself"
    RIGHT = "the 7 in 47,283 is worth 7,000, not 7."
