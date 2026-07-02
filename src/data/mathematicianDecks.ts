// Story-style slide decks for the Famous Mathematicians page. Each deck has
// 12–20 slides (~3 short sentences each) telling: their life → the big idea →
// how it works (worked mini-examples a 6th grader can follow) → why it matters
// today → how it ties to this app's units. `visual` is an emoji scene (2–4
// emoji) rendered LARGE in the illustration pane, matching the app's art style.
export interface MathSlide {
  head: string;
  body: string;
  visual: string; // 2–4 emoji drawn big in the right pane
}

export interface MathematicianDeck {
  id: string; // matches the name in Mathematicians.tsx
  name: string;
  era: string;
  emoji: string;
  tieIn: string; // which app unit(s) this connects to, shown on the title slide
  slides: MathSlide[];
}

export const MATHEMATICIAN_DECKS: MathematicianDeck[] = [
  {
    id: 'Euclid',
    name: 'Euclid',
    era: '300 BC',
    emoji: '📐',
    tieIn: '6.G · Geometry',
    slides: [
      {
        head: 'A teacher in Alexandria',
        body: 'Around 300 BC, Euclid taught mathematics in Alexandria, Egypt — home of the most famous library of the ancient world. Scholars sailed there from everywhere to study. Euclid gathered everything the Greeks knew about shapes and numbers into one grand plan.',
        visual: '🏛️📜🌊',
      },
      {
        head: 'No royal road',
        body: 'A famous story says King Ptolemy asked Euclid for a shortcut to learn geometry. Euclid replied, "There is no royal road to geometry." Even kings have to practice step by step — just like you!',
        visual: '👑🚫🛣️',
      },
      {
        head: 'The Elements',
        body: 'Euclid wrote a set of 13 books called the Elements. It became the most successful textbook in history, studied for more than 2,000 years. Even Abraham Lincoln worked through it to sharpen his thinking.',
        visual: '📚🕰️',
      },
      {
        head: 'Start with the obvious',
        body: 'Euclid\'s big idea: begin with a few simple rules everyone agrees on, called axioms. For example: you can draw a straight line between any two points. From those tiny seeds, he grew all of geometry.',
        visual: '🌱📏',
      },
      {
        head: 'Words with exact meanings',
        body: 'Euclid carefully defined his building blocks first. A point is a location with no size at all. A line is perfectly straight and thin, and a circle is every point sitting the same distance from a center.',
        visual: '⚫📏⭕',
      },
      {
        head: 'Prove it!',
        body: 'Instead of saying "trust me," Euclid proved every fact with a chain of logic. Each step follows from the one before, like stepping stones across a river. If every step is solid, the conclusion must be true.',
        visual: '🪜✅',
      },
      {
        head: 'A rope trick from Egypt',
        body: 'Ancient Egyptian builders used a rope tied with 12 equally spaced knots. They stretched it into a triangle with sides of 3, 4, and 5 knots. Like magic, the corner between the 3 and 4 sides was a perfect right angle.',
        visual: '🪢📐',
      },
      {
        head: 'Why 3-4-5 works',
        body: 'Greek geometry proved the rule behind it: in a right triangle, the two short sides squared add up to the long side squared. Check it: 3 × 3 = 9 and 4 × 4 = 16. And 9 + 16 = 25.',
        visual: '3️⃣4️⃣5️⃣',
      },
      {
        head: 'The perfect check',
        body: 'Now square the long side: 5 × 5 = 25. It matches 9 + 16 exactly! Because the numbers fit the rule, the triangle must contain a right angle — perfect for building square walls and pyramids.',
        visual: '✅🔺',
      },
      {
        head: 'Tear the corners',
        body: 'Here\'s another gem from the Elements: the three angles of any triangle add up to 180°, a straight line. Try it — draw a triangle, tear off the corners, and line them up. They form a straight edge every time.',
        visual: '🔺✂️➖',
      },
      {
        head: 'Geometry builds the world',
        body: 'Architects, engineers, and carpenters still use Euclid\'s rules every single day. Bridges, skyscrapers, and even soccer balls depend on triangles and angles. Triangles are extra strong, which is why you see them in towers and cranes.',
        visual: '🌉🏗️',
      },
      {
        head: 'Geometry in your pocket',
        body: 'Video games draw every 3D world out of millions of tiny triangles. GPS finds your location using circles and distances, straight from Euclid\'s toolbox. Two-thousand-year-old math is running inside your phone right now.',
        visual: '🎮📱🛰️',
      },
      {
        head: 'Your turn: 6.G Geometry',
        body: 'Everything in this app\'s Geometry unit — areas of triangles, nets of 3D shapes, distances on grids — grows from Euclid\'s Elements. When you explain why a formula works, you\'re walking in his footsteps.',
        visual: '📐🧒✨',
      },
    ],
  },
  {
    id: 'Isaac Newton',
    name: 'Isaac Newton',
    era: '1642–1727',
    emoji: '🍎',
    tieIn: '6.RP · Rates of change',
    slides: [
      {
        head: 'A tiny baby on a farm',
        body: 'Isaac Newton was born on Christmas Day, 1642, on a farm in Woolsthorpe, England. He was born so small that no one expected him to survive. He grew up quiet and curious, building model windmills and sundials.',
        visual: '🏡🐑🌾',
      },
      {
        head: 'The plague years',
        body: 'In 1665, sickness closed Cambridge University, so 22-year-old Newton went home to the farm. In under two years there he invented calculus, split sunlight with prisms, and puzzled out gravity. He called it his "year of wonders."',
        visual: '🚪🌈🔭',
      },
      {
        head: 'The famous apple',
        body: 'Sitting in his garden, Newton watched an apple fall and asked a wild question. If gravity pulls the apple down, could the same pull reach all the way up to the Moon? Nobody had ever connected the sky to the ground before.',
        visual: '🍎🌳💫',
      },
      {
        head: 'The math of change',
        body: 'Newton invented calculus, the mathematics of things that change. How fast is a rocket speeding up? How quickly does hot cocoa cool down? Calculus answers questions about change — and change is everywhere you look.',
        visual: '🚀📈',
      },
      {
        head: 'One rule for everything',
        body: 'His law of gravity says every object pulls on every other object. The same rule guides a falling apple, the Moon circling Earth, and Earth circling the Sun. One short equation explains the whole solar system.',
        visual: '🌍🌙☀️',
      },
      {
        head: 'Three laws of motion',
        body: 'Newton also wrote three famous laws of motion. Objects keep doing what they\'re doing unless a force acts, bigger forces mean faster speeding up, and every push gets an equal push back. Rockets literally fly on law number three.',
        visual: '🎳➡️💥',
      },
      {
        head: 'Speed is a rate',
        body: 'Newton\'s math starts with rates. If you bike 30 kilometers in 2 hours, your speed is 30 ÷ 2 = 15 kilometers per hour. A rate compares two changing things — here, distance and time.',
        visual: '🚴⏱️',
      },
      {
        head: 'Picture it as a graph',
        body: 'Plot distance against time and your journey becomes a line. A steep line means you covered lots of distance quickly — you were fast. A flat line means you stopped for a snack. Steepness IS speed.',
        visual: '📈⛰️',
      },
      {
        head: 'Newton\'s zoom trick',
        body: 'But what if your speed keeps changing, like a skateboard rolling downhill? Newton\'s trick: zoom in on one tiny instant and find the rate right there. That zooming idea is the heart of calculus — a speedometer is calculus in action.',
        visual: '🛹🔎',
      },
      {
        head: 'To the Moon',
        body: 'NASA used Newton\'s laws to steer astronauts to the Moon in 1969 — three centuries after he wrote them. His equations still guide every rocket, satellite, and space probe today. Not bad for ideas born on a quiet farm.',
        visual: '🚀🌕',
      },
      {
        head: 'Newton in your day',
        body: 'Weather forecasts, car safety tests, and roller coaster designs all run on Newton\'s math. Video game characters jump and fall using his laws of motion. Even the physics in your favorite games owes him a thank-you.',
        visual: '🎢🎮🌦️',
      },
      {
        head: 'Your turn: 6.RP Rates',
        body: 'In this app\'s Ratios and Rates unit, you\'re learning Newton\'s starting point: speed, unit rates, and comparing quantities that change together. Master rates now, and calculus will one day feel like the natural next step.',
        visual: '🍎📈🧒',
      },
    ],
  },
  {
    id: 'Leonhard Euler',
    name: 'Leonhard Euler',
    era: '1707–1783',
    emoji: '📊',
    tieIn: '6.EE · Exponents & graphs',
    slides: [
      {
        head: 'A boy from Basel',
        body: 'Leonhard Euler was born in Basel, Switzerland, in 1707, the son of a pastor. He had an astonishing memory and could recite an entire epic poem by heart. He could also do enormous calculations entirely in his head.',
        visual: '🏔️🧠',
      },
      {
        head: 'Math at the kitchen table',
        body: 'Euler worked in the great cities of St. Petersburg and Berlin. He had thirteen children and often wrote world-changing papers with a baby on his lap. Family noise never slowed him down one bit.',
        visual: '👨‍👩‍👧‍👦📝',
      },
      {
        head: 'Unstoppable',
        body: 'Later in life Euler lost his eyesight, but he simply did the math in his head and spoke it aloud for helpers to write down. He produced more mathematics than anyone in history — over 850 books and papers.',
        visual: '💡🗣️✍️',
      },
      {
        head: 'The seven bridges',
        body: 'The city of Königsberg had seven bridges connecting its riverbanks and islands. Citizens wondered: could you take a walk that crosses every bridge exactly once? Nobody could do it, but nobody could explain why.',
        visual: '🌉🌉🚶',
      },
      {
        head: 'Turn the city into dots',
        body: 'Euler\'s genius move: ignore the buildings and distances. Draw each piece of land as a dot and each bridge as a line between dots. Suddenly a messy city map became a simple diagram — the very first "graph."',
        visual: '⚫➖⚪',
      },
      {
        head: 'Count the connections',
        body: 'Euler counted the lines touching each dot. To walk every bridge once, at most two dots may have an odd number of lines — your start and your finish. In Königsberg all four dots were odd, so the walk is impossible. Proven forever!',
        visual: '🔢❌🚶',
      },
      {
        head: 'The power of doubling',
        body: 'Euler loved powers, like 2¹⁰ — that means multiplying 2 by itself ten times. Watch it grow: 2, 4, 8, 16, 32. After just five doublings you\'ve already passed thirty.',
        visual: '2️⃣✖️2️⃣',
      },
      {
        head: 'Doubling to 1,024',
        body: 'Keep going: 64, 128, 256, 512, and finally 2¹⁰ = 1,024. Ten little doublings blew past one thousand! That explosive growth is why folding a paper just 42 times would, in theory, reach the Moon.',
        visual: '📄🌕',
      },
      {
        head: 'The alphabet of math',
        body: 'Euler invented much of the notation you\'ll use forever: f(x) for functions, the letter e for growth, and the symbol Σ for sums. He made π famous too. Clear symbols made hard ideas easy to write and share.',
        visual: '🔤✨',
      },
      {
        head: 'Graphs run the internet',
        body: 'Euler\'s dots and lines grew into graph theory, the math of networks. GPS apps find your fastest route by searching a graph of roads. Social networks, airline maps, and the internet itself are all Euler-style graphs.',
        visual: '🗺️📍🛰️',
      },
      {
        head: 'Powers in your computer',
        body: 'Computers count in powers of 2, which is why a kilobyte is exactly 1,024 bytes. Doubling also describes viral videos and growing colonies of bacteria. Euler\'s exponents are quietly working inside every device you own.',
        visual: '💻🔢',
      },
      {
        head: 'Your turn: 6.EE',
        body: 'In this app\'s Expressions unit, you\'re learning to read exponents like 2¹⁰ and to spot patterns in tables and graphs. Every time you evaluate a power or trace a network, give Euler a little nod.',
        visual: '📊🧒✨',
      },
    ],
  },
  {
    id: 'Carl Friedrich Gauss',
    name: 'Carl Friedrich Gauss',
    era: '1777–1855',
    emoji: '👑',
    tieIn: '6.EE · Clever sums',
    slides: [
      {
        head: 'A spark in Brunswick',
        body: 'Carl Friedrich Gauss was born in 1777 in Brunswick, Germany, to a poor family. At age three, watching his father tally wages, little Carl spotted an arithmetic mistake — and he was right. Word of the wonder boy spread fast.',
        visual: '👶🔢',
      },
      {
        head: 'The busy-work backfire',
        body: 'One day the schoolmaster wanted a quiet hour, so he told the class to add every number from 1 to 100. The students began scribbling: 1 + 2 = 3, then + 3 = 6, then + 4 = 10... it would take ages.',
        visual: '🏫✏️😮‍💨',
      },
      {
        head: 'Done in seconds',
        body: 'Almost immediately, ten-year-old Gauss walked up and laid his slate on the desk. On it was a single number: 5,050. It was the only correct answer in the whole class. How did he do it so fast?',
        visual: '🧒📋✨',
      },
      {
        head: 'Don\'t grind — find a pattern',
        body: 'Gauss\'s secret wasn\'t speed; it was seeing structure. Instead of adding numbers one by one, he asked, "Can I rearrange this to make it easy?" Great mathematicians are lazy in the smartest possible way.',
        visual: '🔍🧩',
      },
      {
        head: 'Make friendly pairs',
        body: 'Here\'s the trick. Pair the first number with the last: 1 + 100 = 101. Then the next pair: 2 + 99 = 101. Then 3 + 98 = 101. Every single pair adds up to exactly 101!',
        visual: '🤝💯',
      },
      {
        head: 'Count the pairs',
        body: 'The numbers 1 to 100 form exactly 50 pairs, and each pair is worth 101. So the whole sum is 50 × 101 = 5,050. A boring hour of adding became one quick multiplication — the answer young Gauss wrote down.',
        visual: '5️⃣0️⃣✖️',
      },
      {
        head: 'Try it yourself',
        body: 'Test the trick on 1 to 10. The pairs are 1 + 10, 2 + 9, 3 + 8, 4 + 7, and 5 + 6 — five pairs of 11. So the sum is 5 × 11 = 55. Add the long way to check; it matches!',
        visual: '🔟🤝✅',
      },
      {
        head: 'A formula for any number',
        body: 'The pattern works for any ending number n: the sum equals n × (n + 1) ÷ 2. For 100, that\'s 100 × 101 ÷ 2 = 5,050. One tiny formula replaces a whole mountain of addition.',
        visual: '🧮⛰️',
      },
      {
        head: 'Prince of Mathematicians',
        body: 'The Duke of Brunswick heard about the boy and paid for his education. Gauss went on to transform algebra, geometry, statistics, and astronomy. Other mathematicians crowned him the "Prince of Mathematicians."',
        visual: '👑🎓',
      },
      {
        head: 'Finding a lost planet',
        body: 'In 1801, astronomers spotted the dwarf planet Ceres, then lost it behind the Sun. Using just a few observations and clever math, Gauss predicted exactly where it would reappear. Telescopes turned — and there it was.',
        visual: '🔭🪐',
      },
      {
        head: 'Gauss all around you',
        body: 'Gauss\'s bell curve helps scientists study everything from test scores to heights. His work on magnetism is honored in a unit called the "gauss." And his clever-sum thinking powers shortcuts inside every computer.',
        visual: '🧲📊',
      },
      {
        head: 'Your turn: 6.EE',
        body: 'In this app\'s Expressions unit, you rewrite expressions into easier equivalent forms — exactly Gauss\'s move on that school slate. Next time a problem looks long and boring, pause and hunt for the hidden pattern.',
        visual: '👑🧒💡',
      },
    ],
  },
  {
    id: 'Srinivasa Ramanujan',
    name: 'Srinivasa Ramanujan',
    era: '1887–1920',
    emoji: '✨',
    tieIn: '6.NS · The number system',
    slides: [
      {
        head: 'A boy in South India',
        body: 'Srinivasa Ramanujan was born in 1887 in southern India and grew up in the temple town of Kumbakonam. His family had very little money. From early on, numbers fascinated him more than anything else in the world.',
        visual: '🛕🌴',
      },
      {
        head: 'One book changed everything',
        body: 'At fifteen, Ramanujan borrowed a book containing 5,000 math results with almost no explanations. He worked them all out himself, then went far beyond. He filled notebook after notebook with discoveries, recording only his final gems.',
        visual: '📖💡✍️',
      },
      {
        head: 'A letter to England',
        body: 'In 1913 he mailed nine pages of formulas to G. H. Hardy, a famous professor at Cambridge. Hardy was stunned — the results "must be true, because no one would have the imagination to invent them." He invited Ramanujan to England.',
        visual: '✉️🚢',
      },
      {
        head: 'Numbers were his friends',
        body: 'Ramanujan seemed to know numbers personally, the way you know your friends. He said his ideas often arrived in dreams, like gifts. His big idea: every number, if you look closely enough, has its own personality and secrets.',
        visual: '🔢💫',
      },
      {
        head: 'The taxicab number',
        body: 'Hardy once visited Ramanujan and mentioned his taxi\'s "boring" number: 1729. "No!" Ramanujan replied instantly. "It is the smallest number expressible as the sum of two cubes in two different ways." He saw it in a heartbeat.',
        visual: '🚕✨',
      },
      {
        head: 'Check 1729, part one',
        body: 'A cube means a number times itself three times. First way: 1³ + 12³. Compute 1 × 1 × 1 = 1, and 12 × 12 × 12 = 1,728. Add them: 1 + 1,728 = 1,729. It works!',
        visual: '🧊➕',
      },
      {
        head: 'Check 1729, part two',
        body: 'Second way: 9³ + 10³. Compute 9 × 9 × 9 = 729, and 10 × 10 × 10 = 1,000. Add them: 729 + 1,000 = 1,729 again! Two completely different cube pairs, one special number.',
        visual: '9️⃣🔟✅',
      },
      {
        head: 'Counting partitions',
        body: 'Ramanujan loved partitions: the ways to split a number into sums. For 4 there are five: 4, 3+1, 2+2, 2+1+1, and 1+1+1+1. Try 5 yourself — there are seven! He found astonishing patterns hiding in these counts.',
        visual: '🍫✂️',
      },
      {
        head: 'Racing toward π',
        body: 'He also discovered infinite series — sums that go on forever — that race toward π faster than anyone dreamed possible. Each extra term of his most famous series adds about eight more correct digits of π.',
        visual: '🥧♾️',
      },
      {
        head: 'The notebooks live on',
        body: 'Ramanujan became ill in England and returned home, passing away at just 32. But his notebooks were only the beginning. In 1976, a "lost notebook" of his final discoveries turned up in a library box — genuine buried treasure.',
        visual: '📓🔍💎',
      },
      {
        head: 'Formulas of the future',
        body: 'Today, computers use Ramanujan-style series to calculate π to trillions of digits. His "mock theta functions" even help physicists study black holes. A century later, scientists still mine his notebooks and find new mathematics.',
        visual: '🌌💻',
      },
      {
        head: 'Your turn: 6.NS',
        body: 'In this app\'s Number System unit, you explore factors, multiples, and how numbers fit together — Ramanujan\'s favorite playground. Keep a math notebook of your own; you never know which scribble becomes a treasure.',
        visual: '✨🧒📓',
      },
    ],
  },
  {
    id: 'Emmy Noether',
    name: 'Emmy Noether',
    era: '1882–1935',
    emoji: '⭐',
    tieIn: '6.EE · Structure & symmetry',
    slides: [
      {
        head: 'A girl who loved puzzles',
        body: 'Emmy Noether was born in 1882 in Erlangen, Germany, where her father taught mathematics. At the time, girls weren\'t allowed to enroll at the university. Emmy sat in on classes anyway, one of only two women among hundreds of men.',
        visual: '🏫👧',
      },
      {
        head: 'Working for free',
        body: 'Noether earned her doctorate and became one of the best algebra experts alive. Yet for years the university refused to pay a woman, so she taught without a salary, sometimes under a man\'s name. She kept doing brilliant math anyway.',
        visual: '📝🚫💰',
      },
      {
        head: 'Hilbert fights for Emmy',
        body: 'The great mathematician David Hilbert demanded she be hired at Göttingen, arguing that talent is all that matters. He won. Later, in 1933, Noether moved to America and taught at Bryn Mawr College, beloved by her students.',
        visual: '🤝🎓',
      },
      {
        head: 'What is symmetry?',
        body: 'A symmetry is a change that leaves something looking the same. Rotate a square a quarter turn: still the same square. Slide a wallpaper pattern one tile over: identical. Noether saw symmetry as a deep clue about how the universe works.',
        visual: '🔷🔄',
      },
      {
        head: 'Noether\'s theorem',
        body: 'Her most famous discovery links symmetry to things that never change. Every symmetry in nature comes with a "conserved" quantity — something the universe keeps constant forever. Physicists call it one of the most beautiful ideas ever found.',
        visual: '⚖️✨',
      },
      {
        head: 'Count a square\'s symmetries',
        body: 'Try it: a square can be rotated 90°, 180°, 270°, or 360° and look unchanged — four rotations. It can also be flipped across four different lines. That\'s eight symmetries in total. You just did Noether-style algebra!',
        visual: '🔲🔁',
      },
      {
        head: 'Symmetry in time',
        body: 'Here\'s the physics magic. The laws of nature are the same today as tomorrow — a symmetry in time. Noether proved that this alone forces energy to be conserved: it can change form, but the total never disappears.',
        visual: '⏰🔋',
      },
      {
        head: 'Same rules, easier math',
        body: 'Symmetry lives in arithmetic too. Since 3 + 5 = 5 + 3, order doesn\'t matter — so compute 2 + 38 + 8 by regrouping: (2 + 8) + 38 = 48. Rules that stay the same let you rearrange problems into easy ones.',
        visual: '🔀🧮',
      },
      {
        head: 'The shape of algebra',
        body: 'Noether studied whole systems of numbers at once, called rings, asking what rules they all share. Instead of solving one equation, she revealed the structure behind millions of them. Mathematicians say she taught algebra to think big.',
        visual: '💍🔢',
      },
      {
        head: 'Physics runs on Noether',
        body: 'Every particle discovered at giant colliders was predicted using Noether\'s theorem. Einstein himself called her a creative genius. When physicists hunt for new laws of nature, symmetry is the flashlight — and Emmy built it.',
        visual: '⚛️🔦',
      },
      {
        head: 'Hidden in your messages',
        body: 'Her abstract algebra grew into the codes that protect passwords and repair scratched game discs. Error-correcting codes rebuild missing data using ring structure. Every text you send is quietly guarded by Noether\'s kind of math.',
        visual: '🔐💬',
      },
      {
        head: 'Your turn: 6.EE',
        body: 'In this app\'s Expressions unit, properties like the commutative and distributive laws are your first taste of mathematical structure. Every time you regroup numbers to make a problem easier, you\'re thinking like Emmy Noether.',
        visual: '⭐🧒🔷',
      },
    ],
  },
  {
    id: 'David Hilbert',
    name: 'David Hilbert',
    era: '1862–1943',
    emoji: '🧩',
    tieIn: 'Problem solving',
    slides: [
      {
        head: 'The boy from Königsberg',
        body: 'David Hilbert was born in 1862 in Königsberg — the very city of Euler\'s seven bridges! In school he was slow at memorizing but unbeatable at understanding. "I hardly ever memorized," he said. "I always worked things out."',
        visual: '🌉🏙️',
      },
      {
        head: 'The math capital',
        body: 'Hilbert became a professor at Göttingen, then the math capital of the world. He thought while gardening and bicycling, and scribbled ideas on a huge blackboard in his backyard. Students crossed oceans just to hear him teach.',
        visual: '🚲🌼🧠',
      },
      {
        head: 'The 23 problems',
        body: 'In 1900, in Paris, Hilbert gave the most famous math talk ever. He listed 23 unsolved problems as homework for the entire twentieth century. Solving even one could make a mathematician famous — and everyone raced to try.',
        visual: '🗼📜',
      },
      {
        head: 'We must know!',
        body: 'Hilbert believed no question is forever unanswerable. His motto: "Wir müssen wissen — wir werden wissen," meaning "We must know — we will know." It is carved on his memorial stone, a battle cry for every curious kid.',
        visual: '📣❓',
      },
      {
        head: 'The Infinite Hotel',
        body: 'Hilbert\'s most famous thought experiment is a hotel with infinitely many rooms, numbered 1, 2, 3, and on forever. One night every single room is full. Then a new guest walks in. Is the hotel really out of space?',
        visual: '🏨♾️',
      },
      {
        head: 'Room for one more',
        body: 'The clever manager announces: everyone move up one room! Room 1 goes to 2, room 2 goes to 3, and room n goes to n + 1. Nobody falls off the end, because there is no end. Room 1 is now free!',
        visual: '🚪➡️1️⃣',
      },
      {
        head: 'Room for infinitely more',
        body: 'Then a bus with infinitely many passengers arrives. Still no problem: everyone moves to double their room number, so room 3 goes to room 6. Now all the odd rooms — 1, 3, 5, 7, and so on — are empty. Infinitely many free rooms!',
        visual: '🚌♾️🔑',
      },
      {
        head: 'Hilbert\'s problem-solving moves',
        body: 'Hilbert attacked hard problems with simple moves: try small cases first, hunt for a pattern, and simplify before you generalize. The art of mathematics, he said, is finding the special case that contains everything.',
        visual: '🪜🔍',
      },
      {
        head: 'Try it: the handshake puzzle',
        body: 'Five people all shake hands once — how many handshakes? Go small: 2 people make 1, 3 people make 3, 4 people make 6. The jumps are +2, then +3, so next comes +4, giving 10. Small cases cracked it!',
        visual: '🤝🖐️',
      },
      {
        head: 'A century of chasing',
        body: 'Mathematicians spent the 1900s chasing Hilbert\'s list. Some problems fell quickly, others took decades, and a few are still open today. The solvers became legends — proof that a great question is a gift to the world.',
        visual: '🏆⏳',
      },
      {
        head: 'From logic to laptops',
        body: 'Hilbert asked whether a machine could, in principle, answer every math question. Alan Turing tackled that puzzle — and invented the blueprint for the computer while doing it. "Hilbert spaces" also power today\'s quantum computers.',
        visual: '💻⚛️',
      },
      {
        head: 'Your turn: Problem solving',
        body: 'This app\'s problem-solving challenges train Hilbert\'s moves: start small, hunt patterns, and never give up on a good question. Remember his promise — we must know, we will know. That includes you.',
        visual: '🧩🧒🔥',
      },
    ],
  },
  {
    id: 'Georg Cantor',
    name: 'Georg Cantor',
    era: '1845–1918',
    emoji: '♾️',
    tieIn: '6.NS · Number sets & infinity',
    slides: [
      {
        head: 'A musical mathematician',
        body: 'Georg Cantor was born in 1845 in St. Petersburg, Russia, and grew up in Germany. He was a talented violinist from a family full of musicians. He chose mathematics — but his math turned out as bold as any symphony.',
        visual: '🎻🎼',
      },
      {
        head: 'The forbidden question',
        body: 'As a professor in Halle, Germany, Cantor dared to ask a question most mathematicians avoided: how big is infinity? Can one infinity be bigger than another? People said infinity was only for philosophers. Cantor decided to measure it.',
        visual: '♾️❓',
      },
      {
        head: 'Think in sets',
        body: 'Cantor\'s tool was the set — simply a collection of things: the set of your socks, the set of even numbers. His genius idea: to compare two sets\' sizes, you don\'t need to count them. You just need to match them up.',
        visual: '🧦🔢',
      },
      {
        head: 'The cupcake test',
        body: 'Imagine cupcakes and kids at a party. Give each kid exactly one cupcake. If nothing is left over and no one is left out, the sets are the same size — even if you never counted either one. Matching beats counting!',
        visual: '🧁🧒',
      },
      {
        head: 'Evens vs. all numbers',
        body: 'Now the shocker. Match every counting number with its double: 1 pairs with 2, 2 pairs with 4, 3 pairs with 6, and n pairs with 2n. Every number gets exactly one partner, and none are missed.',
        visual: '2️⃣4️⃣6️⃣',
      },
      {
        head: 'A part as big as the whole',
        body: 'That perfect matching means the even numbers are exactly as numerous as ALL the counting numbers — even though evens seem like only half of them! With infinite sets, a part can equal the whole. Cantor proved it cleanly.',
        visual: '🤯♾️',
      },
      {
        head: 'Even fractions line up',
        body: 'Cantor arranged all the fractions in a giant grid and walked through it in a zigzag, giving each fraction a place in line: first, second, third... So even the fractions match the counting numbers. Same size of infinity again!',
        visual: '🐍🔢',
      },
      {
        head: 'A bigger infinity!',
        body: 'Then Cantor found the limit. The decimal numbers cannot all be listed: given any list, he could build a new decimal that differs from every entry, digit by digit. Decimals form a genuinely BIGGER infinity. Infinity comes in sizes!',
        visual: '📏♾️♾️',
      },
      {
        head: 'Climbing the alephs',
        body: 'Cantor named the sizes of infinity with the Hebrew letter aleph: first ℵ₀, then bigger and bigger, an endless tower of infinities. Mathematics suddenly had a whole new universe upstairs to explore.',
        visual: '🪜🌌',
      },
      {
        head: 'Believing anyway',
        body: 'Cantor\'s ideas were so strange that some famous mathematicians rejected them, which hurt him deeply. But he kept going, and the next generation embraced set theory. Hilbert declared, "No one shall expel us from the paradise Cantor created."',
        visual: '🌈🏝️',
      },
      {
        head: 'Sets under everything',
        body: 'Today set theory is the foundation stone of mathematics — nearly everything is defined using sets. Databases filter with unions and intersections, and search engines think in sets. Cantor\'s "strange" idea became everyone\'s toolbox.',
        visual: '🗄️🔍',
      },
      {
        head: 'Knowing the limits',
        body: 'Cantor\'s different infinities help computer scientists prove that some problems can never be solved by any program, no matter how clever. Knowing what is impossible saves us from impossible quests — deep wisdom from comparing infinities.',
        visual: '💻🚧',
      },
      {
        head: 'Your turn: 6.NS',
        body: 'In this app\'s Number System unit, you meet nested sets of numbers: whole numbers inside integers inside rationals. Every time you sort numbers into these families, you\'re doing Cantor\'s set theory — no infinite hotel required.',
        visual: '♾️🧒🔢',
      },
    ],
  },
];
