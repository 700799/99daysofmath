"""Story: Why Honeycombs are Hexagons. Aligned to 6.G-6 (Area & volume review).

Math: Hexagons tile a plane with the LEAST wall material for the same area.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6G6Story(StoryDeck):
    TITLE = "Story: Why honeycombs are hexagons"
    DOMAIN = "6.G"
    SUBTITLE = "How bees solved a math problem millions of years ago."

    def b_q(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("Why not\nsquares?\nCircles?", font_size=30, color=pal["accent"]))

    def b_hexes(self, scene, pal, mascot):
        return place_right(scene, SV.hex_tiling(), scale=0.9)

    def b_efficient(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("Least wax,\nsame area.", font_size=32, color=pal["answer"], weight="BOLD"))

    BEATS = [
        {"head": "Inside a hive",
         "body": "Honeybees build cells in PERFECT hexagons — every single one. They've been doing this for 100 million years.",
         "visual": b_hexes},
        {"head": "Why not squares?",
         "body": "Squares tile fine. Circles waste tons of space. But hexagons use the LEAST wall material to enclose the same area.",
         "visual": b_q},
        {"head": "Why it matters",
         "body": "Bees have to make wax — and wax is expensive! Less wall means more honey storage with less wax.",
         "visual": b_hexes},
        {"head": "Bees know math",
         "body": "Without ever taking a class, evolution found the most EFFICIENT shape. Hexagons win.",
         "visual": b_efficient},
    ]
    LEARNED = "Shape choice matters. Hexagons pack space the most efficiently."
