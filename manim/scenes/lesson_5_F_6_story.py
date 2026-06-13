"""Story: Olympic Running Shortcut. Aligned to 5.F-6 (Coordinate plane / patterns).

Math: Pythagorean shortcut — going (3, 4) in one straight line is 5, not 7.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson5F6Story(StoryDeck):
    TITLE = "Story: The Olympic running shortcut"
    DOMAIN = "5.F"
    SUBTITLE = "Why do sprinters cut to the inside of the lane?"

    def b_grid(self, scene, pal, mascot):
        return place_right(scene, SV.shortcut_path(), scale=0.9)

    def b_paths(self, scene, pal, mascot):
        from manim import VGroup, Text, DOWN
        return place_right(scene, VGroup(
            Text("Long way: 7 steps", font_size=28, color=pal["accent"], weight="BOLD"),
            Text("Diagonal: ≈ 4.2", font_size=32, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN))

    BEATS = [
        {"head": "Track day",
         "body": "A runner wants to get from point A to point B on the track. They could run east 3 meters, then north 4. Or just go diagonally.",
         "visual": b_grid},
        {"head": "Which is shorter?",
         "body": "East 3 + North 4 = 7 meters total. The diagonal is shorter — but how much?",
         "visual": b_grid},
        {"head": "Pythagoras to the rescue",
         "body": "Diagonal² = 3² + 4² = 25. So diagonal = 5. Six steps shorter? Actually only 2.",
         "visual": b_grid},
        {"head": "Coords matter",
         "body": "On a coordinate plane, going (3, 4) means 3 right and 4 up. The straight-line distance is what really counts.",
         "visual": b_paths},
    ]
    LEARNED = "Diagonal distance on the grid is ALWAYS shorter than the L-shape."
