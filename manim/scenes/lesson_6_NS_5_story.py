"""Story: Katherine Johnson & Apollo. Aligned to 6.NS-5 (Coordinate plane).

Math: She used coordinate geometry to plot the path of Apollo 11 to the Moon.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6NS5Story(StoryDeck):
    TITLE = "Story: Katherine Johnson & Apollo"
    DOMAIN = "6.NS"
    SUBTITLE = "The mathematician who got Apollo 11 to the Moon."

    def b_kj(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text("NASA, 1962", font_size=34, color=pal["accent"], weight="BOLD"))

    def b_orbit(self, scene, pal, mascot):
        return place_right(scene, SV.apollo_curve(), scale=1.0)

    def b_check(self, scene, pal, mascot):
        from manim import Text, VGroup, DOWN
        return place_right(scene, VGroup(
            Text("'Get the girl to check", font_size=22, color=pal["step"]),
            Text("the numbers.'", font_size=22, color=pal["step"]),
            Text("— John Glenn", font_size=22, color=pal["accent"], weight="BOLD"),
        ).arrange(DOWN))

    BEATS = [
        {"head": "Math superstar",
         "body": "Katherine Johnson was a Black mathematician at NASA in the 1960s. She did some of the hardest math humans had ever attempted.",
         "visual": b_kj},
        {"head": "Plotting a path",
         "body": "She used coordinate geometry: every point in space gets an (x, y, z) label. NASA could TRACK the rocket using these coords.",
         "visual": b_orbit},
        {"head": "Astronaut's choice",
         "body": "Astronaut John Glenn refused to fly unless Katherine personally checked the trajectory math. The computers might be wrong — but she wouldn't be.",
         "visual": b_check},
        {"head": "We made it",
         "body": "Her work helped Apollo 11 land on the Moon in 1969 and come home safely. Coordinate planes don't just live in textbooks!",
         "visual": b_orbit},
    ]
    LEARNED = "The coordinate plane lets us pinpoint locations — even spacecraft."
