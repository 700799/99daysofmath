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

    BEATS = [
        {"head": "A weird number",
         "body": "A baseball announcer says 'he's batting three-hundred'. What does .300 even mean?",
         "visual": b_q},
        {"head": "It's a rate",
         "body": "Batting average = hits per at-bat. 150 hits in 500 tries is 150 ÷ 500 = 0.300.",
         "visual": b_math},
        {"head": "Per ONE",
         "body": "0.300 means '0.3 hits per 1 at-bat' — a UNIT rate. We always scale down to per-one to compare.",
         "visual": b_meaning},
        {"head": "Why it's good",
         "body": "Most major leaguers hit around .250. Hitting .300 means succeeding 3 of every 10 tries — and that's elite!",
         "visual": b_meaning},
    ]
    LEARNED = "A UNIT RATE answers 'how much per ONE' — perfect for comparing."
