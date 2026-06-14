"""Story: The Invention of Zero. Aligned to 6.NS-4 (Integers & absolute value).

Math: Zero is the origin of the number line — without it negatives can't exist.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6NS4Story(StoryDeck):
    TITLE = "Story: The invention of zero"
    DOMAIN = "6.NS"
    SUBTITLE = "Someone had to INVENT 'nothing'."

    def b_old(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("1, 2, 3...\nbut no 0?", font_size=32, color=pal["accent"]))

    def b_brahma(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("India,\n628 AD", font_size=34, color=pal["accent"], weight="BOLD"))

    def b_line(self, scene, pal, mascot):
        return place_right(scene, SV.number_line_zero(), scale=0.95)

    def b_crossing(self, scene, pal, mascot):
        return place_right(scene, SV.number_line_crossing(), scale=0.9)

    def b_progression(self, scene, pal, mascot):
        return place_right(scene, SV.negative_positive_progression())

    BEATS = [
        {"head": "No zero?!",
         "body": "Most ancient cultures had no symbol for 'nothing'. Try doing math without zero — it's a nightmare.",
         "visual": b_old},
        {"head": "Indian breakthrough",
         "body": "A mathematician named Brahmagupta in India officially defined zero in 628 AD: a number that means 'nothing here'.",
         "visual": b_brahma},
        {"head": "Negatives unlocked",
         "body": "Once you have zero, you can have NEGATIVE numbers — anything less than zero. Hello, integers!",
         "visual": b_crossing},
        {"head": "The crossing",
         "body": "Watch: negative numbers on the LEFT of zero, positive numbers on the RIGHT. Zero is the anchor in the middle.",
         "visual": b_progression},
        {"head": "Modern math",
         "body": "Every number line, every coordinate plane, every computer chip uses zero. Quietly the most important number ever.",
         "visual": b_line},
    ]
    LEARNED = "Zero is the ANCHOR of the number line. Positives right, negatives left."
