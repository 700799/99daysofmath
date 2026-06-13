"""Story: Tic-Tac-Toe Strategy. Aligned to 6.SP-1 (Mean, median & mode).

Math: count the 8 winning lines; center cell is in 4 of them.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6SP1Story(StoryDeck):
    TITLE = "Story: Tic-tac-toe strategy"
    DOMAIN = "6.SP"
    SUBTITLE = "Why do experts always take the CENTER first?"

    def b_board(self, scene, pal, mascot):
        return place_right(scene, SV.tictac_board(), scale=1.2)

    def b_8lines(self, scene, pal, mascot):
        from manim import Text, VGroup, DOWN
        return place_right(scene, VGroup(
            Text("3 rows + 3 cols", font_size=26, color=pal["step"]),
            Text("+ 2 diagonals", font_size=26, color=pal["step"]),
            Text("= 8 lines.", font_size=34, color=pal["answer"], weight="BOLD"),
        ).arrange(DOWN, buff=0.18))

    def b_center(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text("Center: 4 of 8\nCorners: 3 each\nEdges: 2 each", font_size=28, color=pal["accent"], weight="BOLD"))

    BEATS = [
        {"head": "First move",
         "body": "Watch any expert: they grab the CENTER square first, every time. Why?",
         "visual": b_board},
        {"head": "Count the lines",
         "body": "There are 8 ways to win: 3 rows, 3 columns, 2 diagonals. Every winning line goes through certain cells.",
         "visual": b_8lines},
        {"head": "Center wins",
         "body": "The center square is on 4 of the 8 lines. Corners are on 3. Edges only on 2.",
         "visual": b_center},
        {"head": "Most chances",
         "body": "By taking center, you start in the cell with the MOST chances to win. It's a stats decision — find the spot with the most chances!",
         "visual": b_center},
    ]
    LEARNED = "Counting OPTIONS helps you pick the smartest move."
