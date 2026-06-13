"""6.RP Unit 10 examples — Ratio & proportion problem-solving.
Math (verified from the lesson plan):
  1. 4 servings need 6 cups of flour. Flour for 6 servings? -> 9
  2. A shelter has dogs : cats = 3 : 5, with 20 cats. How many dogs? -> 12
  3. Is 2:3 equivalent to 8:12? -> yes
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6RP10Examples(ExamplesDeck):
    TITLE = "Examples - Ratio & proportion problem-solving"
    EXAMPLES = [
        ("4 servings need 6 cups of flour. Flour for 6 servings?", ["Scale factor = 6 / 4 = 1.5.", "6 x 1.5 = 9 cups."], "9"),
        ("A shelter has dogs : cats = 3 : 5, with 20 cats. How many dogs?", ["Cat ratio number is 5; actual count is 20.", "Multiplier = 20 / 5 = 4.", "Dogs = 3 x 4 = 12."], "12"),
        ("Is 2:3 equivalent to 8:12?", ["Multiply 2:3 by 4: 8:12. ?", "Yes, equivalent."], "yes"),
    ]
