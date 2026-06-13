"""Story: Florence Nightingale, founder of data visualization.
Aligned to 6.SP-9 (Displays: dot plots, histograms & box plots).

She wasn't just the Lady with the Lamp — she was one of the first
statisticians, and she invented charts that saved millions of lives.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6SP9Story(StoryDeck):
    TITLE = "Story: Florence Nightingale"
    DOMAIN = "6.SP"
    SUBTITLE = "A nurse who used GRAPHS to save a million lives."

    def b_lamp(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text("The Lady\nwith the\nLamp", font_size=32, color=pal["accent"], weight="BOLD"))

    def b_map(self, scene, pal, mascot):
        return place_right(scene, SV.crimea_map(), scale=0.95)

    def b_compare(self, scene, pal, mascot):
        return place_right(scene, SV.hospital_cost(), scale=0.85)

    def b_rose(self, scene, pal, mascot):
        return place_right(scene, SV.rose_diagram(), scale=0.95)

    def b_numbers(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text("1 in 4 soldiers\nwere dying.", font_size=32, color=pal["accent"], weight="BOLD"))

    BEATS = [
        {"head": "London, 1820",
         "body": "Florence Nightingale is born to a rich British family. Her parents expect her to marry a duke and host fancy parties. She has other plans.",
         "visual": b_lamp},
        {"head": "Off to nursing school",
         "body": "At age 16, Florence announces she wants to be a NURSE. Her parents are horrified — nursing is a low-paying, dirty job back then. She does it anyway.",
         "visual": b_lamp},
        {"head": "War, 1854",
         "body": "Britain is fighting a brutal war in Crimea, near modern Russia. Soldiers are dying by the thousands — but mostly NOT from battle wounds. Something else is killing them in the hospitals.",
         "visual": b_map},
        {"head": "What she found",
         "body": "Florence shows up to the war hospital with 38 nurses. It's a horror show: rats, no clean water, soldiers crammed in dirty rooms. She's furious. She starts WRITING DOWN every death.",
         "visual": b_numbers},
        {"head": "The math nobody wanted",
         "body": "Out of 4 soldiers who came to the hospital, ONE was dying — not from bullets, but from disease, infections, and bad food. Florence proves it with numbers.",
         "visual": b_compare},
        {"head": "Nobody listens to numbers",
         "body": "Florence sends report after report to British generals. They ignore her. Long lists of numbers don't move politicians. She needs something stronger.",
         "visual": b_lamp},
        {"head": "Her invention",
         "body": "Florence invents a brand-new kind of chart: the ROSE DIAGRAM (also called a 'coxcomb'). Each wedge shows one month. The BIGGER the wedge, the MORE soldiers died that month.",
         "visual": b_rose},
        {"head": "RED for the truth",
         "body": "She colors disease deaths RED and battle deaths a tiny blue sliver. One look and you can see it: the red wedges DWARF the blue. Disease — not the war — was the real killer.",
         "visual": b_rose},
        {"head": "Hospitals get fixed",
         "body": "Florence sends her rose diagram to Queen Victoria and Parliament. Within a year, hospitals start cleaning up: fresh water, clean bandages, better food. Deaths drop from 42% to 2%.",
         "visual": b_compare},
        {"head": "First woman in the club",
         "body": "In 1859, Florence becomes the first woman ever elected to the Royal Statistical Society. The men have to admit it: graphs that tell a clear story are math you can't argue with.",
         "visual": b_rose},
        {"head": "Why she matters",
         "body": "Every modern chart you see — bar graphs, pie charts, line charts, infographics — comes from Florence's idea: turn data into a picture and the truth jumps out.",
         "visual": b_rose},
    ]
    LEARNED = "A good chart can tell a story numbers alone cannot. Florence proved it in 1854 and saved a million lives."
