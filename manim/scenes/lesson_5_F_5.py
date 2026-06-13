"""5.F Unit 5 — Measurement, conversions & volume (idea + examples + trap)."""
from manim import *  # noqa: F401,F403
from _helpers import CombinedDeck


class Lesson5F5(CombinedDeck):
    TITLE = "Measurement, conversions & volume"
    DOMAIN = "5.F"
    BULLETS = [
        "Bigger unit -> smaller unit: multiply (3 m = 300 cm). Smaller -> bigger: divide.",
        "Memorize the anchors: 100 cm = 1 m, 1000 g = 1 kg, 12 in = 1 ft, 4 qt = 1 gal, 60 min = 1 hr.",
        "Volume of a box = length × width × height, measured in cubic units.",
    ]
    EXAMPLES = [
        ("Convert 2 meters to centimeters.", ["1 m = 100 cm.", "2 × 100 = 200 cm."], "200"),
        ("Volume of a 3 × 2 × 4 box?", ["3 × 2 = 6.", "6 × 4 = 24 cubic units."], "24"),
        ("Convert 5 feet to inches.", ["1 ft = 12 in.", "5 × 12 = 60 inches."], "60"),
    ]
    WRONG = "Multiply or divide? Going to a SMALLER unit means MORE of them"
    RIGHT = "multiply."
