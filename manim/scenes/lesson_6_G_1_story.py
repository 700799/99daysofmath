"""Story: Egyptian 3-4-5 Triangle. Aligned to 6.G-1 (Area of triangles & rectangles).

Math: 3² + 4² = 9 + 16 = 25 = 5² — first right triangle.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6G1Story(StoryDeck):
    TITLE = "Story: The Egyptian 3-4-5 triangle"
    DOMAIN = "6.G"
    SUBTITLE = "How did Egyptians build perfect pyramid corners?"

    def b_tri(self, scene, pal, mascot):
        return place_right(scene, SV.triangle_345(), scale=0.95)

    def b_check(self, scene, pal, mascot):
        from manim import VGroup, Text, WHITE
        return place_right(scene, VGroup(
            Text("3² + 4² = 9 + 16", font_size=30, color=WHITE),
            Text("= 25 = 5²", font_size=34, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN))

    def b_rope(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("Knotted rope", font_size=32, color=pal["accent"], weight="BOLD"))

    BEATS = [
        {"head": "4,500 years ago",
         "body": "Egyptians had no rulers or fancy tools — yet the Pyramid corners are PERFECT right angles. How?",
         "visual": b_rope},
        {"head": "A knotted rope",
         "body": "They tied 12 evenly spaced knots in a rope. Three workers stretched it into a triangle with sides 3, 4, and 5 knots.",
         "visual": b_tri},
        {"head": "Why those numbers?",
         "body": "3² + 4² = 5². When sides are 3, 4, 5 (or any 3:4:5 ratio), the corner is EXACTLY 90°. Magic.",
         "visual": b_tri},
        {"head": "Still used today",
         "body": "Carpenters, builders, and gardeners still use this trick to make square corners without fancy tools.",
         "visual": b_tri},
    ]
    LEARNED = "The 3-4-5 ratio always makes a right angle. Ancient tech, still works."
