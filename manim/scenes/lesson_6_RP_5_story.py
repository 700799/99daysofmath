"""Story: Soccer Penalty Kick Probability. Aligned to 6.RP-5 (Percents).

Math: pro keepers save ~25% of penalty kicks. Pros score ~75%.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6RP5Story(StoryDeck):
    TITLE = "Story: Soccer penalty kicks"
    DOMAIN = "6.RP"
    SUBTITLE = "Why do penalty kicks score 3 times out of 4?"

    def b_kick(self, scene, pal, mascot):
        return place_right(scene, SV.percent_bar(75, "Goals scored"))

    def b_corners(self, scene, pal, mascot):
        return place_right(scene, SV.fraction_eq_percent(3, 4, 75))

    def b_chance(self, scene, pal, mascot):
        return place_right(scene, SV.percent_bar(25, "Keeper saves"))

    BEATS = [
        {"head": "12 yards from goal",
         "body": "A penalty kick is a one-on-one: just you and the keeper. Goals happen about 75% of the time.",
         "visual": b_kick},
        {"head": "Why so often?",
         "body": "The keeper has to GUESS before you kick. If they guess wrong, you score easily.",
         "visual": b_kick},
        {"head": "3 out of 4 = 75%",
         "body": "We can write that as a fraction OR a percent. Same thing — both mean 3 in every 4 attempts.",
         "visual": b_corners},
        {"head": "Keeper's job",
         "body": "About 25% of the time the keeper guesses right and saves. Tough job!",
         "visual": b_chance},
    ]
    LEARNED = "Percent = how many out of 100. Useful for comparing chances."
