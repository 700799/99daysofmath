"""Story: Hypatia of Alexandria. Aligned to 6.G-2 (Polygons on the grid).

The first woman mathematician we know by name. Taught geometry at the
greatest library the world has ever seen.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6G2Story(StoryDeck):
    TITLE = "Story: Hypatia of Alexandria"
    DOMAIN = "6.G"
    SUBTITLE = "The first famous woman mathematician — 1,600 years ago."

    def b_scroll(self, scene, pal, mascot):
        return place_right(scene, SV.alexandria_scroll(), scale=1.1)

    def b_polys(self, scene, pal, mascot):
        return place_right(scene, SV.regular_polygons(), scale=0.95)

    def b_cone(self, scene, pal, mascot):
        return place_right(scene, SV.cone_section(), scale=0.9)

    def b_label(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text("415 AD", font_size=48, color=pal["accent"], weight="BOLD"))

    BEATS = [
        {"head": "Ancient Egypt, 350 AD",
         "body": "A baby girl named Hypatia is born in the city of Alexandria, Egypt. Her father runs the most famous school of math and astronomy in the entire world: the Library of Alexandria.",
         "visual": b_scroll},
        {"head": "Her dad's bet",
         "body": "Most girls of her time would learn to weave cloth. Her father makes a wild bet: he'll teach her math, science, and philosophy — the same way he'd teach a son. Hypatia turns out to be a prodigy.",
         "visual": b_scroll},
        {"head": "The shapes nobody could explain",
         "body": "Hypatia falls in love with POLYGONS — triangles, squares, pentagons, hexagons. Especially regular ones, where every side and every angle is exactly the same.",
         "visual": b_polys},
        {"head": "Why polygons matter",
         "body": "Builders used polygons to make pillars. Sailors used them to navigate. Painters used them to make perspective work. Polygons were like the LEGO bricks of the ancient world.",
         "visual": b_polys},
        {"head": "Slicing a cone",
         "body": "Her best work was about 'conic sections' — what shapes you get when you slice a cone at different angles. A flat slice gives a circle. A tilted slice gives a stretched circle called an ellipse. Wild stuff.",
         "visual": b_cone},
        {"head": "Famous teacher",
         "body": "By age 30, Hypatia is the most respected teacher in Alexandria. Students travel for months from Italy, Greece, Syria, and Persia just to sit in her classroom. Her name appears in letters across the Mediterranean.",
         "visual": b_scroll},
        {"head": "Her style",
         "body": "She wears a philosopher's robe instead of fancy clothes. She invents teaching tools — a hydrometer, an astrolabe — so students can SEE the math instead of just hearing it.",
         "visual": b_polys},
        {"head": "Dangerous times",
         "body": "But Alexandria is splitting apart. Different religious groups fight for power. Hypatia refuses to pick a side — she just wants to do math. That makes her enemies in 415 AD.",
         "visual": b_label},
        {"head": "Her math survives",
         "body": "Even though her enemies destroy much of her work, students copy what they remember and carry it abroad. Her commentaries on polygons and conic sections survive for 1,600 years — long enough for us to read them today.",
         "visual": b_polys},
        {"head": "Why she matters",
         "body": "Hypatia proved that math has no gender, no nationality, no religion. A polygon is a polygon for anyone who studies it carefully. That idea is the foundation of every math class you'll ever take.",
         "visual": b_polys},
    ]
    LEARNED = "Polygons (3 sides, 4 sides, 6 sides…) are the LEGO bricks of geometry. Hypatia studied them 1,600 years ago and the same rules still work today."
