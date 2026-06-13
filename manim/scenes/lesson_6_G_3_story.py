"""Story: Archimedes & the Golden Crown. Aligned to 6.G-3 (Volume of prisms).

Math: Different volumes displace different amounts of water -> density.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6G3Story(StoryDeck):
    TITLE = "Story: Archimedes & the golden crown"
    DOMAIN = "6.G"
    SUBTITLE = "How a bath revealed a king was getting scammed."

    def b_crown(self, scene, pal, mascot):
        from manim import Polygon, Text, VGroup, DOWN
        crown = Polygon([0, 0.6, 0], [-0.6, 0.2, 0], [-0.7, -0.2, 0],
                        [0.7, -0.2, 0], [0.6, 0.2, 0],
                        fill_color="#DAA520", fill_opacity=0.95, stroke_color=pal["accent"], stroke_width=3)
        return place_right(scene, VGroup(crown, Text("Solid gold?", font_size=28, color=pal["accent"]).next_to(crown, DOWN, buff=0.2)))

    def b_tub(self, scene, pal, mascot):
        return place_right(scene, SV.water_displacement(), scale=0.9)

    def b_eureka(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text("EUREKA!", font_size=56, color=pal["answer"], weight="BOLD"))

    BEATS = [
        {"head": "Suspicious king",
         "body": "A Greek king gave his goldsmith pure gold for a crown. He suspects the smith mixed in cheap silver.",
         "visual": b_crown},
        {"head": "How to test?",
         "body": "The crown weighs the right amount. But silver is LIGHTER per volume than gold — so a fake would take up MORE space.",
         "visual": b_crown},
        {"head": "Bath time",
         "body": "Archimedes hops in a full tub and water spills over. He realizes: an object pushes out water equal to its OWN volume.",
         "visual": b_tub},
        {"head": "Caught!",
         "body": "He dunks the crown. It pushes out more water than pure gold would. The crown was a fake.",
         "visual": b_eureka},
    ]
    LEARNED = "Volume = space something takes up. Water can measure it directly."
