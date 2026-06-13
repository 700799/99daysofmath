"""Story: Ramanujan's Taxi Number. Aligned to 6.NS-3 (GCF, LCM & distributing).

Math: 1729 = 1³+12³ = 9³+10³ — smallest number expressible as sum of two cubes
in two different ways. Number theory wonderland.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6NS3Story(StoryDeck):
    TITLE = "Story: Ramanujan's taxi number"
    DOMAIN = "6.NS"
    SUBTITLE = "How a math genius made 1729 famous."

    def b_taxi(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("Taxi #1729", font_size=40, color=pal["accent"], weight="BOLD"))

    def b_boring(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("\"Dull number,\nright?\"", font_size=28, color=pal["step"]))

    def b_wow(self, scene, pal, mascot):
        return place_right(scene, SV.taxi_1729(), scale=0.85)

    BEATS = [
        {"head": "Hospital visit",
         "body": "Ramanujan was the world's greatest self-taught mathematician. His friend G.H. Hardy visited him in the hospital.",
         "visual": b_taxi},
        {"head": "Boring taxi",
         "body": "Hardy said: 'I came in taxi #1729 — a rather dull number.' Ramanujan instantly disagreed.",
         "visual": b_boring},
        {"head": "Two ways!",
         "body": "'1729 is the smallest number that's the sum of TWO cubes in two different ways!' he said. 1³ + 12³ AND 9³ + 10³.",
         "visual": b_wow},
        {"head": "Check it",
         "body": "1 + 1728 = 1729. 729 + 1000 = 1729. Both. He saw it instantly.",
         "visual": b_wow},
    ]
    LEARNED = "Numbers hide secrets. The deeper you look, the more patterns appear."
