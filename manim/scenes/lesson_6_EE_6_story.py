"""Story: Fibonacci's Rabbits. Aligned to 6.EE-6 (Variables that change together).

Math: Fib sequence 1,1,2,3,5,8,13,21,... each term = sum of previous two.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6EE6Story(StoryDeck):
    TITLE = "Story: Fibonacci's rabbits"
    DOMAIN = "6.EE"
    SUBTITLE = "A math riddle from 800 years ago — about bunnies."

    def b_pair(self, scene, pal, mascot):
        return place_right(scene, SV.rabbit_row(2), scale=1.4)

    def b_grow(self, scene, pal, mascot):
        return place_right(scene, SV.rabbit_row(8), scale=1.0)

    def b_seq(self, scene, pal, mascot):
        return place_right(scene, SV.fib_sequence(), scale=0.9)

    BEATS = [
        {"head": "Italy, year 1202",
         "body": "Fibonacci asks: if a pair of rabbits has a new pair every month, how many pairs after a year?",
         "visual": b_pair},
        {"head": "Each month",
         "body": "Every rabbit pair from last month is still here, PLUS every pair that was around two months ago has a new pair.",
         "visual": b_grow},
        {"head": "The pattern",
         "body": "1, 1, 2, 3, 5, 8, 13, 21… Each number = sum of the two before it.",
         "visual": b_seq},
        {"head": "It's everywhere",
         "body": "Sunflower seeds spiral in Fibonacci numbers. So do pinecones and seashells. Nature loves this pattern.",
         "visual": b_seq},
    ]
    LEARNED = "A rule that links each term to the previous ones is called a RECURRENCE."
