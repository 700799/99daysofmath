"""Tiny helper for story scenes: place a story visual in the RIGHT pane and
animate its entrance."""
from manim import FadeIn, RIGHT, DOWN, VGroup


RIGHT_ANCHOR = RIGHT * 3.4 + DOWN * 0.3


def place_right(scene, vgroup, scale=1.0):
    vgroup.scale(scale)
    vgroup.move_to(RIGHT_ANCHOR)
    scene.play(FadeIn(vgroup, shift=DOWN * 0.2), run_time=0.7 * 1.25)
    return vgroup
