"""Story: Penny Doubles Every Day. Aligned to 6.EE-1 (Exponents).

Math: After 30 days of doubling, $0.01 -> 2^29 cents = $5,368,709.12.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6EE1Story(StoryDeck):
    TITLE = "Story: Penny doubles every day"
    DOMAIN = "6.EE"
    SUBTITLE = "Would you take a penny that doubles… or $1,000,000?"

    def b_choice(self, scene, pal, mascot):
        return place_right(scene, SV.big_label("$1,000,000\nor 1¢?", pal["accent"]))

    def b_table(self, scene, pal, mascot):
        return place_right(scene, SV.doubling_table(), scale=0.95)

    def b_million(self, scene, pal, mascot):
        return place_right(scene, SV.big_label("$5.3 million!", "#83C167"))

    BEATS = [
        {"head": "The deal",
         "body": "Your boss offers: $1,000,000 cash, OR one penny today that doubles every day for 30 days. Which wins?",
         "visual": b_choice},
        {"head": "Most kids pick the million",
         "body": "It looks like a no-brainer. But that 'tiny' penny is hiding a secret: exponents grow scary fast.",
         "visual": b_choice},
        {"head": "Let's count",
         "body": "Day 5: 16¢. Day 10: $5. Day 20: $5,000. Day 30: BOOM.",
         "visual": b_table},
        {"head": "The winner",
         "body": "Day 30: $5,368,709.12. Five times the million!",
         "visual": b_million},
    ]
    LEARNED = "Exponents (doubling, tripling…) explode much faster than adding."
