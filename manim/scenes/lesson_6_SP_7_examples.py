"""6.SP Unit 7 examples — Statistical questions.
Math (verified from the lesson plan):
  1. Is "How tall am I?" statistical? -> no
  2. Is "How tall are the students in my class?" statistical? -> yes
  3. Is "How many days are in February 2025?" statistical? -> no
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6SP7Examples(ExamplesDeck):
    TITLE = "Examples · Statistical questions"
    DOMAIN = "6.SP"
    EXAMPLES = [
        ("Is \"How tall am I?\" statistical?", ["One answer - about ME.", "No."], "no"),
        ("Is \"How tall are the students in my class?\" statistical?", ["Many students, many heights.", "Yes."], "yes"),
        ("Is \"How many days are in February 2025?\" statistical?", ["One fact, one answer.", "No."], "no"),
    ]
