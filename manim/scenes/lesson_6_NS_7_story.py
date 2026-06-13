"""Story: Gauss adds 1 to 100. Aligned to 6.NS-7 (Whole-number ops).

Math (verified):
  1 + 2 + ... + 100 = 50 pairs × 101 = 5050.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6NS7Story(StoryDeck):
    TITLE = "Story: Gauss adds 1 to 100"
    DOMAIN = "6.NS"
    SUBTITLE = "A 7-year-old beats his teacher in 30 seconds."

    def b_class(self, scene, pal, mascot):
        return place_right(scene, SV.big_label("Class. Silence!", pal["accent"]))

    def b_trick(self, scene, pal, mascot):
        return place_right(scene, SV.pair_sums(), scale=0.85)

    def b_total(self, scene, pal, mascot):
        return place_right(scene, SV.big_total())

    BEATS = [
        {"head": "Long, long ago",
         "body": "Young Carl Gauss is in class. His teacher is grumpy and wants the kids to be quiet for an hour.",
         "visual": b_class},
        {"head": "The mean assignment",
         "body": "She says: 'Add every number from 1 to 100.' She thinks that should take all day.",
         "visual": b_class},
        {"head": "Gauss's trick",
         "body": "Gauss sees 1+100 = 101, 2+99 = 101, 3+98 = 101. Each pair sums to 101 — and there are 50 pairs.",
         "visual": b_trick},
        {"head": "30 seconds later",
         "body": "Gauss walks up: 50 × 101 = 5050. The teacher's jaw drops.",
         "visual": b_total},
    ]
    LEARNED = "Look for PATTERNS, not just brute force. Math is sneaky."
