"""Story: What's a Batting Average? Aligned to 6.RP-2 (Unit rates).

Math: 150 hits / 500 at-bats = 0.300 (a .300 hitter).
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6RP2Story(StoryDeck):
    TITLE = "Story: Baseball batting average"
    DOMAIN = "6.RP"
    SUBTITLE = "Why are baseball players proud of '.300'?"

    def b_q(self, scene, pal, mascot):
        return place_right(scene, SV.big_label("Is .300\ngood?", pal["accent"]))

    def b_math(self, scene, pal, mascot):
        return place_right(scene, SV.fraction_eq_percent(150, 500, 30))

    def b_meaning(self, scene, pal, mascot):
        return place_right(scene, SV.percent_bar(30, "Hits per at-bat"))

    def b_batter(self, scene, pal, mascot):
        return place_right(scene, SV.batter_at_plate(), scale=0.9)

    def b_hit(self, scene, pal, mascot):
        return place_right(scene, SV.ball_trajectory_arc(distance=2.0, success=True), scale=0.85)

    def b_miss(self, scene, pal, mascot):
        return place_right(scene, SV.ball_trajectory_arc(distance=1.5, success=False), scale=0.85)

    BEATS = [
        {"head": "A weird number",
         "body": "A baseball announcer says 'he's batting three-hundred'. What does .300 even mean?",
         "visual": b_q},
        {"head": "It's a rate",
         "body": "Batting average = hits per at-bat. 150 hits in 500 tries is 150 ÷ 500 = 0.300.",
         "visual": b_math},
        {"head": "At the plate",
         "body": "Imagine a batter stepping up. Each at-bat is a chance to hit the ball.",
         "visual": b_batter},
        {"head": "The hit",
         "body": "A .300 hitter connects 3 times out of every 10 at-bats. That's a home run arc!",
         "visual": b_hit},
        {"head": "The miss",
         "body": "The other 7 times? Out, strike, or foul. That's the challenge of baseball.",
         "visual": b_miss},
        {"head": "Per ONE",
         "body": "0.300 means '0.3 hits per 1 at-bat' — a UNIT rate. We always scale down to per-one to compare.",
         "visual": b_meaning},
        {"head": "Why it's good",
         "body": "Most major leaguers hit around .250. Hitting .300 means succeeding 3 of every 10 tries — and that's elite!",
         "visual": b_meaning},
    ]
    LEARNED = "A UNIT RATE answers 'how much per ONE' — perfect for comparing."
