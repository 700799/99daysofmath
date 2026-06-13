"""Story: Benjamin Banneker. Aligned to 6.NS-1 (Adding & subtracting decimals).

A self-taught Black astronomer + surveyor who helped lay out the original
boundaries of Washington, D.C.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6NS1Story(StoryDeck):
    TITLE = "Story: Benjamin Banneker"
    DOMAIN = "6.NS"
    SUBTITLE = "Self-taught American mathematician who surveyed Washington, D.C."

    def b_year(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text("Maryland,\n1731.", font_size=42, color=pal["accent"], weight="BOLD"))

    def b_clock(self, scene, pal, mascot):
        return place_right(scene, SV.wooden_clock(), scale=1.0)

    def b_almanac(self, scene, pal, mascot):
        return place_right(scene, SV.almanac_grid(), scale=0.85)

    def b_dc(self, scene, pal, mascot):
        return place_right(scene, SV.dc_compass(), scale=0.95)

    def b_letter(self, scene, pal, mascot):
        from manim import Text, DOWN
        return place_right(scene, Text('"All men\nare equal."', font_size=32, color=pal["answer"], weight="BOLD"))

    BEATS = [
        {"head": "Maryland, 1731",
         "body": "Benjamin Banneker is born to a free Black father and a former slave mother in colonial Maryland. He gets only about six weeks of formal school — his family needs him on the tobacco farm.",
         "visual": b_year},
        {"head": "He teaches himself",
         "body": "Benjamin borrows books from his neighbor — math books, astronomy books, surveying books. He reads them by candlelight after farm work. He works through every problem.",
         "visual": b_year},
        {"head": "The wooden clock",
         "body": "At 22, he borrows a pocket watch from a traveling salesman. He takes it apart, draws every gear, then carves an entire LIFE-SIZE clock out of WOOD. His clock keeps perfect time for 40 years.",
         "visual": b_clock},
        {"head": "Stars on the ceiling",
         "body": "Decades later, neighbors lend him an old telescope. Benjamin teaches himself ASTRONOMY — predicting the exact moment of a solar eclipse before any famous European does.",
         "visual": b_clock},
        {"head": "The almanac",
         "body": "He starts publishing an almanac — a yearly book of sunrise times, tide tables, weather predictions, moon phases. To make it, he has to compute thousands of DECIMAL numbers by hand. Down to the second.",
         "visual": b_almanac},
        {"head": "Why decimals matter",
         "body": "Sunrise at 6.32 means 6 hours and just past 1/3 of the next hour. Each tiny decimal makes a big difference. Off by 0.05 means 3 minutes off — and a wrong fishing tide.",
         "visual": b_almanac},
        {"head": "Surveying D.C.",
         "body": "In 1791, President Washington picks Banneker to help mark the boundary of America's new capital city. Benjamin uses a telescope and decimal math to lay out the perfect square that becomes Washington, D.C.",
         "visual": b_dc},
        {"head": "The famous letter",
         "body": "Around the same time, Banneker writes to Thomas Jefferson — author of the Declaration of Independence and slave owner. He sends Jefferson a copy of his almanac as PROOF that Black people can do math just as well as anyone.",
         "visual": b_letter},
        {"head": "Jefferson replies",
         "body": "Jefferson writes back, admitting he's impressed. He shares the almanac with the French Academy of Sciences as evidence of African American genius. The letters are still studied today.",
         "visual": b_letter},
        {"head": "Decimals = precision",
         "body": "Every calculation Banneker did — eclipses, tides, the angles of Washington — used DECIMALS. Add a decimal place, double the precision. Hidden behind every almanac entry is the same math you do today.",
         "visual": b_almanac},
    ]
    LEARNED = "Decimals turn 'about 6 hours' into 'exactly 6.32 hours'. Banneker used them by candlelight to predict the sky."
