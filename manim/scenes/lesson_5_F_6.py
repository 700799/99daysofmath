"""5.F Unit 6 — Coordinate plane, patterns & line plots (idea + examples + trap)."""
from manim import *  # noqa: F401,F403
from _helpers import CombinedDeck


class Lesson5F6(CombinedDeck):
    TITLE = "Coordinate plane, patterns & line plots"
    DOMAIN = "5.F"
    BULLETS = [
        "A point is (x, y): go ACROSS x first, then UP y. \"Run before you jump.\"",
        "A pattern with a constant jump: term n = start + jump × (n − 1).",
        "On a line plot, every X is one data value - count Xs to answer questions.",
    ]
    EXAMPLES = [
        ("Plot: right 3, up 2 from the origin. Coordinates?", ["Across 3 -> x = 3.", "Up 2 -> y = 2.", "Point: (3, 2)."], "(3,2)"),
        ("Pattern 0, 4, 8,  what is the 5th term?", ["Four jumps of +4 from 0.", "0 + 4 × 4 = 16."], "16"),
        ("A line plot shows 2 Xs above 1/2. How many items measured 1/2?", ["Each X is one item.", "Two Xs -> 2 items."], "2"),
    ]
    WRONG = "Do not swap the coordinates"
    RIGHT = "(3, 2) and (2, 3) are different points."
