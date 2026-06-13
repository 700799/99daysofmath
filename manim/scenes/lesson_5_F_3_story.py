"""Story: The Pizza Size Scam. Aligned to 5.F-3 (Multiplying & dividing fractions).

Math: area = π·r². 12" pie area ≈ 113 in², 10" pie ≈ 78. Two 10s = 156, one 14 = 154.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson5F3Story(StoryDeck):
    TITLE = "Story: The pizza size scam"
    DOMAIN = "5.F"
    SUBTITLE = "Is a 14-inch pizza twice as big as a 7-inch?"

    def b_pies(self, scene, pal, mascot):
        return place_right(scene, SV.pizza_pair(big_d=1.6, small_d=0.8), scale=0.9)

    def b_area(self, scene, pal, mascot):
        return place_right(scene, SV.area_compare(154, 38))

    def b_deal(self, scene, pal, mascot):
        return place_right(scene, SV.big_label("BIG > 2 small", "#83C167"))

    BEATS = [
        {"head": "The diner offer",
         "body": "Two 7-inch pizzas for $12, or one 14-inch for $12. The 14-inch is double the diameter — same deal, right?",
         "visual": b_pies},
        {"head": "Diameters double, areas QUADRUPLE",
         "body": "Pizza is round. Area = π × radius × radius. Double the radius means 4× the area.",
         "visual": b_pies},
        {"head": "The numbers",
         "body": "One 7-inch ≈ 38 in² of pizza. One 14-inch ≈ 154 in². Two 7-inchers? Only 76 in².",
         "visual": b_area},
        {"head": "Pick the big one",
         "body": "Always. A bigger circle gives WAY more pizza per dollar than two small ones at the same diameter total.",
         "visual": b_deal},
    ]
    LEARNED = "Area grows by the SQUARE of the size — circles especially."
