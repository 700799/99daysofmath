"""6.SP Unit 5 examples — Describing a distribution.
Math (verified from the lesson plan):
  1. Scores cluster near 80 with one 30. The 30 is a what? -> outlier
  2. Most values bunch left with a long right tail. The shape is…? -> skewed right
  3. A center plus one more thing describe a distribution. The other thing is…? -> spread
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6SP5Examples(ExamplesDeck):
    TITLE = "Examples · Describing a distribution"
    DOMAIN = "6.SP"
    EXAMPLES = [
        ("Scores cluster near 80 with one 30. The 30 is a what?", ["It sits far from the rest.", "= an outlier."], "outlier"),
        ("Most values bunch left with a long right tail. The shape is?", ["Tail points right.", "= skewed right."], "skewed right"),
        ("A center plus one more thing describe a distribution. The other thing is?", ["Center plus spread.", "= spread."], "spread"),
    ]
