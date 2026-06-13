"""Story: Chessboard Rice Puzzle. Aligned to 6.EE-10 (Tables & relationships).

Math: rice doubles each square. Square 64 = 2^63 grains.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6EE10Story(StoryDeck):
    TITLE = "Story: The chessboard rice puzzle"
    DOMAIN = "6.EE"
    SUBTITLE = "A king regrets making a small promise."

    def b_chess(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("64\nsquares", font_size=40, color=pal["accent"], weight="BOLD"))

    def b_table(self, scene, pal, mascot):
        return place_right(scene, SV.chess_doubling(), scale=0.95)

    def b_huge(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("18 quintillion\ngrains.", font_size=30, color=pal["answer"], weight="BOLD"))

    BEATS = [
        {"head": "The inventor's prize",
         "body": "Long ago, a wise man invented chess. The king offered any reward. The inventor asked for rice.",
         "visual": b_chess},
        {"head": "Sounds small",
         "body": "'One grain on square 1, two on square 2, four on square 3, doubling all the way.' The king laughed and agreed.",
         "visual": b_chess},
        {"head": "Filling the table",
         "body": "Square 10 = 512. Square 20 = a million. Square 32 = 2.1 billion. The numbers EXPLODE.",
         "visual": b_table},
        {"head": "Bankrupt",
         "body": "Square 64 alone needs 2⁶³ grains — more rice than has ever existed on Earth.",
         "visual": b_huge},
    ]
    LEARNED = "When a table doubles row by row, the values get scary big — fast."
