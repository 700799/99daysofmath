"""6.RP Unit 1 examples — What is a ratio?.
Math (verified from the lesson plan):
  1. A box has 4 apples and 6 oranges. Ratio of apples to oranges in simplest form? -> 2:3
  2. There are 5 cats and 10 dogs. Simplest ratio of cats to dogs? -> 1:2
  3. A recipe uses 2 cups flour to 3 cups milk. Ratio of milk to flour? -> 3:2
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class Lesson6RP1Examples(ExamplesDeck):
    TITLE = "Examples · What is a ratio?"
    DOMAIN = "6.RP"
    EXAMPLES = [
        ("Ratio of apples to oranges (simplest)?", ["We have **4 apples and 6 oranges**. The ratio is **4:6**. Find the **GCF: 2**.", "**Divide both by 2**: **4÷2 : 6÷2 = 2:3**."], "**2:3**"),
        ("Simplest ratio of cats to dogs?", ["**5 cats and 10 dogs** gives us **5:10**. The **GCF is 5**.", "**Divide both by 5**: **5÷5 : 10÷5 = 1:2**."], "**1:2**"),
        ("Ratio of milk to flour (2 flour, 3 milk)?", ["**Be careful about order!** Milk is asked first. **Milk = 3, flour = 2**.", "**Ratio of milk to flour = 3:2**."], "**3:2**"),
    ]
