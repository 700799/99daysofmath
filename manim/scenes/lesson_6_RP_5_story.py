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

    def b_field(self, scene, pal, mascot):
        return place_right(scene, SV.penalty_box_setup(), scale=0.85)

    def b_goal(self, scene, pal, mascot):
        from manim import Text, VGroup
        return place_right(scene, VGroup(
            Text("Kicker guesses RIGHT", font_size=32, color=pal["accent"], weight="BOLD"),
            Text("↓", font_size=28, color=WHITE),
            Text("GOAL! 75%", font_size=40, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.3), scale=0.9)

    def b_save(self, scene, pal, mascot):
        from manim import Text, VGroup
        return place_right(scene, VGroup(
            Text("Keeper guesses RIGHT", font_size=32, color=pal["accent"], weight="BOLD"),
            Text("↓", font_size=28, color=WHITE),
            Text("SAVE! 25%", font_size=40, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.3), scale=0.9)

    BEATS = [
        {"head": "12 yards from goal",
         "body": "A penalty kick is a one-on-one: just you and the keeper. Goals happen about 75% of the time.",
         "visual": b_kick},
        {"head": "The setup",
         "body": "You stand at the penalty spot. The keeper stands in the goal. One shot. One guess.",
         "visual": b_field},
        {"head": "Why so often?",
         "body": "The keeper has to GUESS before you kick. If they guess wrong, you score easily.",
         "visual": b_goal},
        {"head": "3 out of 4 = 75%",
         "body": "We can write that as a fraction OR a percent. Same thing — both mean 3 in every 4 attempts.",
         "visual": b_corners},
        {"head": "Keeper's job",
         "body": "About 25% of the time the keeper guesses right and saves. Tough job!",
         "visual": b_save},
    ]
    LEARNED = "Percent = how many out of 100. Useful for comparing chances."
