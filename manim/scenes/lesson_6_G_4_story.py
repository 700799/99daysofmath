"""Story: Maryam Mirzakhani. Aligned to 6.G-4 (Surface area with nets).

The first woman to win the Fields Medal — math's Nobel Prize. She
doodled on giant sheets of paper to understand curved surfaces.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6G4Story(StoryDeck):
    TITLE = "Story: Maryam Mirzakhani"
    DOMAIN = "6.G"
    SUBTITLE = "First woman to win math's biggest prize — she got there by doodling."

    def b_iran(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text("Tehran,\n1977.", font_size=42, color=pal["accent"], weight="BOLD"))

    def b_doodle(self, scene, pal, mascot):
        return place_right(scene, SV.doodle_curves(), scale=0.95)

    def b_net(self, scene, pal, mascot):
        return place_right(scene, SV.hex_net(), scale=1.1)

    def b_saddle(self, scene, pal, mascot):
        return place_right(scene, SV.saddle_surface(), scale=0.85)

    def b_medal(self, scene, pal, mascot):
        return place_right(scene, SV.fields_medal(), scale=1.0)

    BEATS = [
        {"head": "Tehran, Iran, 1977",
         "body": "Maryam Mirzakhani is born to a normal middle-class family in Tehran. As a kid, she WANTS to be a writer. She reads novels, writes stories, dreams of being the next Jane Austen.",
         "visual": b_iran},
        {"head": "Math finds her",
         "body": "At 13, Maryam fails her first math test. She HATES the subject. But the next year, a different teacher hands her a real puzzle. Maryam solves it… and falls in love.",
         "visual": b_iran},
        {"head": "Olympiad champion",
         "body": "By age 17, Maryam wins gold at the International Math Olympiad — the world's hardest math contest for high schoolers. She's the first Iranian girl to make the team. The next year she wins gold AGAIN.",
         "visual": b_doodle},
        {"head": "Off to Harvard",
         "body": "She moves to America for grad school at Harvard. Her style is unusual: she draws GIANT doodles on huge sheets of paper. Her office floor is covered in them. Other professors think she's odd. They're wrong.",
         "visual": b_doodle},
        {"head": "Her question",
         "body": "Maryam studies SHAPES — but not flat ones. CURVED shapes like saddles, donuts, pretzels. She asks: what's the SURFACE AREA of a wavy shape? How does it bend?",
         "visual": b_saddle},
        {"head": "Nets, but curved",
         "body": "In school you learn nets — the flat shape you fold to make a cube or pyramid. Maryam asks the wild version: what does the 'net' of a shape that BENDS look like?",
         "visual": b_net},
        {"head": "Why curves matter",
         "body": "Curved surfaces appear everywhere in real life: planets, soap bubbles, eggshells, the universe itself. Knowing their surface area tells us about gravity, light, even how the universe began.",
         "visual": b_saddle},
        {"head": "The breakthrough",
         "body": "After years of giant-paper doodling, Maryam proves something nobody could prove before — a math rule about how curved surfaces deform. Other mathematicians can't believe it. It opens a brand-new branch of math.",
         "visual": b_doodle},
        {"head": "Fields Medal, 2014",
         "body": "At age 37, Maryam becomes the FIRST woman EVER to win the Fields Medal — math's biggest prize. Only 60 people have won it in 90 years. Iran throws a national celebration.",
         "visual": b_medal},
        {"head": "Her secret",
         "body": "Reporters ask her secret. She says: 'I find it more enjoyable when it's slow. The beauty comes when you give it time.' Math, for her, was art. Doodling was the work.",
         "visual": b_doodle},
        {"head": "Why she matters",
         "body": "Maryam died young in 2017, but her ideas live on. Today, kids around the world (especially girls in Iran) keep her photo on their walls. Math is for everyone — even the kid who failed her first test.",
         "visual": b_medal},
    ]
    LEARNED = "Surface area + nets aren't just for cubes — they describe any shape, even curvy ones. Maryam Mirzakhani proved it."
