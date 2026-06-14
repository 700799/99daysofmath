"""Story: Descartes & the fly. Aligned to 6.NS-10 (Coordinate plane).

Lying in bed, watching a fly walk across the ceiling, Descartes invented
the entire coordinate plane.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6NS10Story(StoryDeck):
    TITLE = "Story: The fly that invented coordinates"
    DOMAIN = "6.NS"
    SUBTITLE = "How a sick man + a wandering fly = every coordinate plane ever."

    def b_bed(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text("Paris,\n1637.", font_size=42, color=pal["accent"], weight="BOLD"))

    def b_fly(self, scene, pal, mascot):
        return place_right(scene, SV.ceiling_fly(), scale=1.0)

    def b_grid(self, scene, pal, mascot):
        return place_right(scene, SV.coord_with_fly(), scale=0.85)

    def b_anywhere(self, scene, pal, mascot):
        return place_right(scene, SV.x_y_anywhere())

    def b_descartes(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text("(x, y)", font_size=72, color=pal["answer"], weight="BOLD"))

    def b_fly_position_1(self, scene, pal, mascot):
        from manim import VGroup, Dot, Text
        grid = SV.coordinate_grid_simple()
        p1 = Dot(grid.c2p(2, 1), radius=0.12, color=pal["accent"])
        label = Text("(2, 1)", font_size=26, color=pal["accent"], weight="BOLD").next_to(p1, DOWN, buff=0.2)
        return place_right(scene, VGroup(grid, p1, label), scale=0.85)

    def b_fly_position_2(self, scene, pal, mascot):
        from manim import VGroup, Dot, Text
        grid = SV.coordinate_grid_simple()
        p2 = Dot(grid.c2p(4, 3), radius=0.12, color=pal["step"])
        label = Text("(4, 3)", font_size=26, color=pal["step"], weight="BOLD").next_to(p2, DOWN, buff=0.2)
        return place_right(scene, VGroup(grid, p2, label), scale=0.85)

    BEATS = [
        {"head": "Paris, winter 1637",
         "body": "A French philosopher named René Descartes is in bed with the flu. He's bored out of his mind. To kill time, he stares at the ceiling above his bed.",
         "visual": b_bed},
        {"head": "Enter: the fly",
         "body": "A fly lands on the ceiling and starts crawling around. Descartes watches it walk to one corner, then the other, then the middle. He gets curious.",
         "visual": b_fly},
        {"head": "The question",
         "body": "Can I describe EXACTLY where the fly is — without pointing? Could I write the fly's spot in a letter to a friend who can't see my ceiling?",
         "visual": b_fly},
        {"head": "His insight",
         "body": "Pick any corner of the ceiling. Now I just need TWO numbers: how far ACROSS the fly is, and how far UP from that corner. Boom — exact location, no pointing required.",
         "visual": b_fly},
        {"head": "First position",
         "body": "The fly is 2 steps across and 1 step up from the corner. Descartes writes: (2, 1).",
         "visual": b_fly_position_1},
        {"head": "Moving to a new spot",
         "body": "Now the fly crawls to a different place — 4 steps across, 3 steps up. New name: (4, 3). Simple!",
         "visual": b_fly_position_2},
        {"head": "x and y are born",
         "body": "Descartes labels the across number 'x' and the up number 'y'. Every point on the ceiling — every point on ANY flat surface — can be named with just two numbers: (x, y).",
         "visual": b_grid},
        {"head": "The big leap",
         "body": "If I can name a POINT with two numbers, I can name a whole LINE. And a CURVE. And a SHAPE. Anything geometric becomes pairs of numbers I can compute with.",
         "visual": b_grid},
        {"head": "Math fuses with geometry",
         "body": "Before Descartes, math and geometry were separate subjects. He glued them together. Algebra problems became pictures; pictures became algebra. Game changer.",
         "visual": b_anywhere},
        {"head": "Every screen, every map",
         "body": "Every map app, every video game, every weather radar uses Descartes' idea. They all describe locations as pairs (x, y) — or, in 3D, triples (x, y, z).",
         "visual": b_descartes},
        {"head": "Apollo and beyond",
         "body": "300 years later, NASA used Descartes' coordinate plane to plot the path of Apollo 11 to the Moon. (Katherine Johnson did those calculations by hand!) Same idea, same math.",
         "visual": b_anywhere},
        {"head": "Look around",
         "body": "Look at any screen, any grid, any graph in your math book. The two axes — x going right, y going up — are Descartes' fly, ascended to the world of pure math.",
         "visual": b_grid},
    ]
    LEARNED = "Any point on a plane = two numbers, (x, y). Descartes saw it first while watching a fly walk on his ceiling."
