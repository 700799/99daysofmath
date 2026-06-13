"""Story: The Handshake Problem. Aligned to 6.EE-9 (Writing equations from words).

Math: n people, n(n-1)/2 handshakes.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6EE9Story(StoryDeck):
    TITLE = "Story: The handshake problem"
    DOMAIN = "6.EE"
    SUBTITLE = "How many handshakes in a room of 20 people?"

    def b_six(self, scene, pal, mascot):
        return place_right(scene, SV.handshake_graph(n=6), scale=1.0)

    def b_count(self, scene, pal, mascot):
        return place_right(scene, SV.handshake_formula(6))

    def b_twenty(self, scene, pal, mascot):
        return place_right(scene, SV.handshake_formula(20))

    BEATS = [
        {"head": "A party",
         "body": "20 friends at a party. Everyone shakes hands with everyone else, ONCE. How many handshakes total?",
         "visual": b_six},
        {"head": "Start small",
         "body": "With 6 people, draw lines between every pair. Count: 15 lines.",
         "visual": b_six},
        {"head": "The pattern",
         "body": "Each of n people shakes hands with n-1 others. Each handshake is counted TWICE, so divide by 2.",
         "visual": b_count},
        {"head": "Solve it",
         "body": "20 × 19 ÷ 2 = 190 handshakes. The formula n(n-1)/2 works for any size party.",
         "visual": b_twenty},
    ]
    LEARNED = "When you spot a pattern, write a formula — it works for ANY size."
