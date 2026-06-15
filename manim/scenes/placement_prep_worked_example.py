"""Placement Prep Worked Example — Multi-step word problem (shopping with discount).

This video demonstrates how to **read, translate, and solve** a typical
placement exam word problem step-by-step. Format mirrors famous mathematician
stories but teaches problem-solving process.

Problem: "You buy 3 items at $4.50 each and use a $5 coupon. What is the total cost?"

Concepts covered:
- Reading comprehension (English → math)
- Multiplication fluency
- Multi-step reasoning
- Real-world application (shopping)

Target audience: 5th graders preparing for 6th grade placement exams
"""
from manim import *  # noqa: F401,F403


class PlacementPrepWorkedExample(Scene):
    """Solve a multi-step word problem: 3 items × $4.50 − $5 coupon."""

    def construct(self):
        # ===== SCENE 1: PROBLEM SETUP =====
        problem_text = Text(
            "You buy 3 items at $4.50 each\nand use a $5 coupon.\n\nWhat is the total cost?",
            font_size=40,
            color=BLUE,
        )
        problem_text.to_edge(UP)

        self.add(problem_text)
        self.wait(2)

        # Visual: Show 3 items with price tags
        items = VGroup()
        for i in range(3):
            item_circle = Circle(radius=0.4, color=BLUE, fill_opacity=0.3)
            item_circle.shift(RIGHT * (i - 1) * 2)
            price_tag = Text("$4.50", font_size=24, color=BLUE)
            price_tag.next_to(item_circle, DOWN, buff=0.3)
            items.add(VGroup(item_circle, price_tag))

        items.next_to(problem_text, DOWN, buff=1)
        self.play(FadeIn(items))
        self.wait(1.5)

        # ===== SCENE 2: STEP 1 REVEAL (Calculate cost of 3 items) =====
        step1_label = Text("STEP 1: Cost of 3 items", font_size=32, color=GREEN)
        step1_label.to_edge(LEFT).shift(UP * 0.5)

        step1_math = MathTex(
            r"3 \times \$4.50 = ?", font_size=36, color=BLACK
        )
        step1_math.next_to(step1_label, DOWN, buff=0.4)

        self.play(FadeIn(step1_label), FadeIn(step1_math))
        self.wait(1)

        # Animate the calculation
        calculation_steps = VGroup(
            MathTex(r"3 \times \$4.50", font_size=32, color=BLUE),
            MathTex(r"= \$4.50 + \$4.50 + \$4.50", font_size=28, color=BLUE),
            MathTex(r"= \$13.50", font_size=32, color=GREEN),
        )
        calculation_steps.arrange(DOWN, buff=0.3)
        calculation_steps.next_to(step1_math, DOWN, buff=0.6)

        self.play(FadeIn(calculation_steps[0]))
        self.wait(0.8)
        self.play(FadeIn(calculation_steps[1]))
        self.wait(0.8)
        self.play(FadeIn(calculation_steps[2]))
        self.wait(1.5)

        # ===== SCENE 3: STEP 2 REVEAL (Apply coupon) =====
        step2_label = Text("STEP 2: Apply the $5 coupon", font_size=32, color=GREEN)
        step2_label.to_edge(LEFT).shift(DOWN * 1.5)

        step2_math = MathTex(
            r"\$13.50 - \$5 = ?", font_size=36, color=BLACK
        )
        step2_math.next_to(step2_label, DOWN, buff=0.4)

        self.play(FadeIn(step2_label), FadeIn(step2_math))
        self.wait(1)

        # Animate the subtraction
        subtraction_steps = VGroup(
            MathTex(r"\$13.50 - \$5.00", font_size=32, color=BLUE),
            MathTex(r"= \$8.50", font_size=32, color=GREEN),
        )
        subtraction_steps.arrange(DOWN, buff=0.3)
        subtraction_steps.next_to(step2_math, DOWN, buff=0.6)

        self.play(FadeIn(subtraction_steps[0]))
        self.wait(0.8)
        self.play(FadeIn(subtraction_steps[1]))
        self.wait(1.5)

        # ===== SCENE 4: FINAL ANSWER =====
        self.play(
            FadeOut(items),
            FadeOut(problem_text),
            FadeOut(step1_label),
            FadeOut(step1_math),
            FadeOut(calculation_steps),
            FadeOut(step2_label),
            FadeOut(step2_math),
            FadeOut(subtraction_steps),
        )

        answer_box = Rectangle(width=4, height=1, color=GREEN, stroke_width=3)
        answer_text = VGroup(
            Text("Total Cost:", font_size=28, color=BLACK),
            MathTex(r"\$8.50", font_size=48, color=GREEN),
        )
        answer_text.arrange(DOWN, buff=0.2)
        answer_text.move_to(answer_box)

        self.play(FadeIn(answer_box), FadeIn(answer_text))
        self.wait(2)

        # ===== BONUS: KEY INSIGHT =====
        insight = Text(
            "💡 KEY: Read carefully!\n"
            "Step 1: Find the subtotal (before coupon)\n"
            "Step 2: Apply the discount\n"
            "Order matters!",
            font_size=24,
            color=BLUE,
        )
        insight.next_to(answer_box, DOWN, buff=0.8)

        self.play(FadeIn(insight))
        self.wait(2)
