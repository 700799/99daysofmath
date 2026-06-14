"""Story: The Birthday Paradox. Aligned to 6.SP-4 (Displaying data).

Math: With 23 people in a room, there's a ~50.7% chance two share a birthday.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6SP4Story(StoryDeck):
    TITLE = "Story: The birthday paradox"
    DOMAIN = "6.SP"
    SUBTITLE = "How few people do you need before two share a birthday?"

    def b_guess(self, scene, pal, mascot):
        return place_right(scene, SV.big_label("365?\n180?\n100?", pal["accent"]))

    def b_real(self, scene, pal, mascot):
        return place_right(scene, SV.big_label("23.", "#83C167"))

    def b_curve(self, scene, pal, mascot):
        return place_right(scene, SV.birthday_curve(), scale=0.85)

    def b_people(self, scene, pal, mascot):
        return place_right(scene, SV.people_dots_random(count=23, radius=0.10))

    BEATS = [
        {"head": "Make a guess",
         "body": "Imagine a room. How many people do you need for a 50/50 chance that TWO of them share a birthday?",
         "visual": b_guess},
        {"head": "Most people say 180",
         "body": "Half of 365 sounds smart. But the answer is MUCH smaller — and surprises everyone.",
         "visual": b_guess},
        {"head": "Just 23!",
         "body": "Why? With 23 people, there are 23×22÷2 = 253 PAIRS to check. Plenty of chances to match.",
         "visual": b_real},
        {"head": "The pairing problem",
         "body": "Each dot is a person. Each person pairs with every other person. That's SO many pairs!",
         "visual": b_people},
        {"head": "The whole curve",
         "body": "40 people: 89%. 60 people: 99%. Try this with your classroom!",
         "visual": b_curve},
    ]
    LEARNED = "Counting PAIRS gets big fast — way faster than counting people."
