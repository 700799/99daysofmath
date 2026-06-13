"""Story: Alan Turing's Secret Codes. Aligned to 6.RP-4 (Part-to-part vs part-to-whole).

Math: Letter frequencies — E is ~13% of English text. Use ratios to crack codes.
"""
from _helpers import StoryDeck
import story_visuals as SV
from _story_util import place_right


class Lesson6RP4Story(StoryDeck):
    TITLE = "Story: Turing's secret codes"
    DOMAIN = "6.RP"
    SUBTITLE = "How counting letters helped win World War II."

    def b_enigma(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("ENIGMA\nMACHINE", font_size=36, color=pal["accent"], weight="BOLD"))

    def b_letters(self, scene, pal, mascot):
        return place_right(scene, SV.letter_freq(), scale=0.95)

    def b_win(self, scene, pal, mascot):
        from manim import Text
        return place_right(scene, Text("Cracked.", font_size=42, color=pal["answer"], weight="BOLD"))

    BEATS = [
        {"head": "Unbreakable code",
         "body": "In World War II, Germany used a machine called Enigma to scramble messages. Billions of possible settings.",
         "visual": b_enigma},
        {"head": "Frequency trick",
         "body": "In English, the letter E shows up ~13% of the time, T about 9%, A about 8%. Every language has its own 'fingerprint'.",
         "visual": b_letters},
        {"head": "Pattern hunting",
         "body": "Alan Turing built a machine that compared letter frequencies in coded messages to known patterns — until they matched.",
         "visual": b_letters},
        {"head": "History changed",
         "body": "Code-cracking shortened the war by years. Counting RATIOS literally saved lives.",
         "visual": b_win},
    ]
    LEARNED = "A ratio (E : everything else) is a powerful clue, even in spy stuff."
