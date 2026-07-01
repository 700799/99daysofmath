import type { HowToSection } from './HowToPlay';
import type { ArcadeGameDef } from './shared';

// Central "how to play" registry, keyed by game id. The arcade gate shows these
// directions AFTER the splash and BEFORE the 3·2·1 countdown, so every game gets
// a consistent splash → directions → countdown → play entry. Games not listed
// here fall back to a one-card summary built from their `blurb` (see getHowTo).
//
// The richer games below keep their own in-game "How to play" drawer
// (GameInstructions) using their local constants; these copies feed the gate's
// directions screen. Keep the two in rough sync when you edit a game's rules.

export type GameHowTo = { sections: HowToSection[]; controls?: string };

export const GAME_HOWTO: Record<string, GameHowTo> = {
  taiko: {
    sections: [
      { heading: 'Goal', body: 'Notes scroll in along 3 drum lanes toward the hit-ring on the left. Tap each note right as it lands in its ring for points and combo!' },
      { heading: 'Timing', body: 'The closer to the ring center you tap, the better the judgement — Perfect beats Good. Keep a streak going to build your combo and trigger Fever mode 🔥.' },
      { heading: 'Tempo shifts', body: 'The song speeds up through phases (Warm-up → Groovy → Fast → Frenzy). Notes scroll faster and spawn more often — stay on the beat!' },
      { heading: 'Lives', body: 'Missing notes costs a life. Run out and the song ends — so don’t let notes slip past the ring.' },
    ],
    controls: 'Tap the lane (or the matching key) as a note reaches its hit-ring. Three lanes — keep all three covered.',
  },

  shinobi: {
    sections: [
      { heading: 'Goal', body: 'Match runes to fight off foes that creep down 3 lanes toward your shinobi 🥷. Survive as many levels as you can!' },
      { heading: 'Match-3', body: 'Swap two neighbouring runes to line up 3 or more of a kind. Each successful swap is one turn — then every foe steps closer.' },
      { heading: 'What runes do', body: '⚔️ Strike the front foe · 🌀 Shuriken hits a whole lane · 🛡️ Guard adds block · 💚 Heal restores HP · ⚡ Chi charges your ultimate.' },
      { heading: 'Ninjutsu', body: 'When the ⚡ chi meter is full, tap Ninjutsu and solve a math problem to clear the whole screen!' },
      { heading: 'Danger', body: 'If a foe reaches your shinobi it hurts you (block absorbs some). Lose all HP and the run ends.' },
    ],
    controls: 'Tap a rune then a neighbour, or swipe to swap. Fill the ⚡ chi meter, then tap 🌟 Ninjutsu and solve to clear the board.',
  },

  starhop: {
    sections: [
      { heading: 'Goal', body: 'Classic Chinese Checkers vs the computer. Move all 10 of your red pegs from the top point of the star to the bottom point before the computer fills your start.' },
      { heading: 'Two kinds of move', body: 'Tap a peg to select it, then tap a glowing hole: either STEP to a touching empty hole, or JUMP over a neighbouring peg into the empty hole beyond.' },
      { heading: 'Chain jumps', body: 'After a jump you can keep jumping — long chains rocket you across the board. Glowing holes show every place the selected peg can land.' },
      { heading: 'Win', body: 'First player to completely fill the opposite star point wins. Plan paths that set up big jump chains!' },
    ],
    controls: 'Tap a red peg, then tap a glowing target hole. Step to a neighbour or jump over pegs (including chains).',
  },

  chess: {
    sections: [
      { heading: 'Goal', body: 'Each puzzle gives YOU a big material lead and a winning line — you PLAY IT OUT move by move. Choose each of your moves; the computer’s forced reply plays automatically until checkmate (or you win the queen). Solve all 5 endgames!' },
      { heading: 'How to move', body: 'Tap your (white) piece, then tap the square to move it to. White pieces are ♔♕♖♗♘♙; the computer is black. Some wins take more than one move — a counter shows “Your move 1 of 2”.' },
      { heading: 'Stuck? Show the move', body: 'Tap “💡 Show me the move” to light up where your piece should go (amber = from, green = to). Then make the move yourself.' },
      { heading: 'The big idea', body: 'Sometimes extra material is a LIABILITY (zugzwang), sometimes you SACRIFICE your queen to force mate, and sometimes a few minor pieces out-coordinate a queen. Read the lesson on each puzzle.' },
      { heading: 'Wrong move?', body: 'No problem — you’ll see exactly how the computer would pounce, then you can replay the whole line again.' },
    ],
    controls: 'Tap a white piece, then its destination. Play out the winning line one move at a time; tap 💡 if you need the next move shown.',
  },

  fraction: {
    sections: [
      { heading: 'Goal', body: 'Run the pizzeria! Each customer orders a fraction of a pizza — serve them exactly that many slices.' },
      { heading: 'Read the order', body: 'The ticket shows a fraction like 3/4. The bottom number (denominator) is how many equal slices the pizza is cut into; the top number (numerator) is how many you shade.' },
      { heading: 'Shade & serve', body: 'Tap slices to add a topping. When the shaded slices match the numerator, tap “Serve it!”. Correct orders score; serve 8 to win.' },
      { heading: 'Math', body: 'A fraction is parts of a whole. 3/4 means 3 of 4 equal pieces. The pizza makes it easy to see.' },
    ],
    controls: 'Tap pizza slices to shade them, then tap “Serve it!”. Beat the clock and fill 8 orders.',
  },

  speedlab: {
    sections: [
      { heading: 'The big idea', body: 'Distance = rate × time, written d = r × t. "Rate" just means speed — how much distance you cover each second (or hour). Know any TWO of the three and you can always find the third.' },
      { heading: 'The triangle trick', body: 'Picture d on top, with r and t underneath: d over (r · t). Cover the one you want and the triangle shows the math. Cover d → d = r × t. Cover r → r = d ÷ t. Cover t → t = d ÷ r. Top-over-bottom means divide; side-by-side means multiply.' },
      { heading: 'Example — find DISTANCE', body: 'A car drives 60 mph for 2 hours. d = r × t = 60 × 2 = 120 miles. Drive twice as long → twice the distance.' },
      { heading: 'Example — find RATE (speed)', body: 'You ran 100 meters in 20 seconds. r = d ÷ t = 100 ÷ 20 = 5 meters per second. Distance shared out over the time.' },
      { heading: 'Example — find TIME', body: 'You need to travel 150 miles at 50 mph. t = d ÷ r = 150 ÷ 50 = 3 hours. Farther to go, or slower speed → more time.' },
      { heading: 'Same triangle, both ways', body: 'A train at 80 km/h for 3 h covers d = 80 × 3 = 240 km. And a 240 km trip in 3 h means r = 240 ÷ 3 = 80 km/h. Just covering a different corner.' },
      { heading: 'In the game', body: 'You start with easy SINGLE-DIGIT numbers to get the idea, then step up to TWO-DIGIT ones. Level 1 find the DISTANCE (d = r × t, e.g. 2 × 3 = 6), Level 2 find the TIME (t = d ÷ r), Level 3 find the RATE with bigger numbers (r = d ÷ t = 40 ÷ 4 = 10). Count the units on the ruler and watch the telemetry so you SEE the formula come true.' },
    ],
    controls: 'Tap a value chip to launch the car at that setting. Read the telemetry, then tap to continue between stages.',
  },

  mathpop: {
    sections: [
      { heading: 'Goal', body: 'Numbered bubbles float up the screen. Pop a group of bubbles that ADDS UP to the target number 🎯!' },
      { heading: 'How to pop', body: 'Tap bubbles to select them — the running total shows at the top. When your selected bubbles add up to the target, they POP for points.' },
      { heading: 'Watch the top', body: 'Bubbles that reach the top get stuck. If too many pile up, the screen fills and it’s game over — so keep popping!' },
      { heading: 'Math', body: 'Quick addition and number composition: there are many ways to make a number. Go too high? Your selection clears — try again.' },
    ],
    controls: 'Tap bubbles to add them to your total. Hit the target to pop. Tap a selected bubble again to deselect.',
  },

  rig: {
    sections: [
      { heading: 'Goal', body: 'Defend your War Rig 🛻! A horde of raiders races across the desert toward you — hold the line as long as you can.' },
      { heading: 'Solve to shoot', body: 'A math problem is always on screen. Type the answer on the keypad and hit FIRE 🔫 to blast the nearest raider. Solve fast — speed is everything!' },
      { heading: 'Drop a bomb', body: 'Tap 💣 Bomb for a tougher problem. Solve it to detonate an AoE blast that clears a whole cluster of raiders at once.' },
      { heading: 'Don’t let them reach you', body: 'Every raider that reaches the rig damages it. Bosses 🚛 hit hard. The waves get faster — keep your mental math sharp!' },
      { heading: 'Math', body: 'Quick questions from your chosen unit + level. Right answers fire; wrong answers briefly jam the gun.' },
    ],
    controls: 'Type the answer, FIRE 🔫 to shoot the nearest raider, or 💣 Bomb to clear a cluster. Survive the waves!',
  },

  tank: {
    sections: [
      { heading: 'Goal', body: 'Blow up every evil robot 🤖 with your tank. Clear all the robots in a level to roll on to the next one.' },
      { heading: 'Pick an angle', body: 'Choose an acute launch angle — 15°, 30°, 45°, 60°, or 75°. Each one is also shown in radians (π/12, π/6, π/4, π/3, 5π/12) on the protractor.' },
      { heading: 'The right triangle (SOH-CAH-TOA)', body: 'Your power V is the HYPOTENUSE. It splits into a flat part vx = V·cosθ (adjacent → CAH) and an up part vy = V·sinθ (opposite → SOH). tanθ = opp ÷ adj = vy ÷ vx (TOA). Watch the triangle change as you aim!' },
      { heading: 'Power = hypotenuse length', body: 'Slide the power up or down. More power = a longer hypotenuse = a faster, farther rocket.' },
      { heading: 'Gravity makes the arc', body: 'The rocket curves down as it flies, so you arc OVER walls and hills to reach robots behind them. Late levels add wind that nudges the rocket sideways.' },
      { heading: 'Targeting Computer', body: 'Stuck? Tap 🎯 Firing solution and answer a trig question — get it right and the computer reveals the perfect angle + power with a dotted preview arc.' },
    ],
    controls: 'Tap an angle chip (or ◀▶ keys), slide the power (or ▲▼), then Fire 🚀 (or space). Tap 🎯 for a trig firing solution.',
  },

  dress: {
    sections: [
      { heading: 'Goal', body: 'Each round gives you a theme (Beach Day, Royal Ball, Winter Gala, Neon Night). Style a head-to-toe outfit that fits the theme, then walk the runway for a score!' },
      { heading: 'Beat the clock', body: 'You have a timer to put together your look. Tap a wardrobe item to wear it; tap another in the same spot to swap.' },
      { heading: 'Match the palette (ratios)', body: 'Every theme wants a warm ☀ : cool ❄ color ratio — like 3 ☀ : 1 ❄ for Beach Day. The closer your outfit matches that ratio, the higher your score.' },
      { heading: 'Stay on budget (decimals)', body: 'You have a styling budget. Items have prices (some are on sale — a % off the original!). You can’t spend more than your budget, and at checkout you’ll figure out your change.' },
      { heading: 'Runway score (percent)', body: 'Your runway score is a percent built from: filling all your slots, matching the theme, and matching the palette ratio. 70%+ wins the round!' },
      { heading: 'Outfit bonus (counting)', body: 'Between looks, earn bonus style coins by counting how many different outfits your wardrobe can make: tops × bottoms × shoes!' },
    ],
    controls: 'Tap items to wear/swap them. Watch your budget and the warm:cool ratio. Tap “Walk the runway” when ready (or when the timer ends).',
  },

  escape: {
    sections: [
      { heading: 'Goal', body: 'Escape each room before the timer runs out — escape all 5 rooms to win! No math here, just clever thinking.' },
      { heading: 'Locks', body: 'Tap a lock 🔒 to face a logic puzzle — a riddle, a pattern, an analogy, or an odd-one-out. Pick the right answer to pop the lock open.' },
      { heading: 'Think it through', body: 'The clues are indirect — the puzzle never gives the answer away. Reason it out: what fits the riddle? what comes next? what does NOT belong?' },
      { heading: 'The door', body: 'Open every lock, then crack the door’s deduction puzzle to escape to the next room.' },
      { heading: 'Clock', body: 'Each room is timed and pauses for brain breaks. Beat the clock for a bonus!' },
    ],
    controls: 'Tap a lock, then tap the answer you reason out. Solve the door puzzle to escape.',
  },

  survival: {
    sections: [
      { heading: 'Goal', body: 'Survive in the forest for as many days as you can! No math — just explore, gather, and stay alive.' },
      { heading: 'Move around', body: 'Use the arrow pad (or arrow keys / WASD) to walk your explorer 🧑‍🌾 around the woods.' },
      { heading: 'Chop & hunt (weapons)', body: 'Stand next to a tree 🌳 and tap ⚔️ with the 🪓 Axe to chop wood. Switch to the 🗡️ Spear to hunt animals 🐰🦌 for food. Tap the weapon button to swap.' },
      { heading: 'Eat & stay safe', body: 'Your hunger 🍗 drops over time — tap 🍖 Eat to use food. At night 🌙 wolves 🐺 appear and bite! Tap 🔥 to build a campfire (costs wood) — it heals you and scares wolves away.' },
      { heading: 'Survive', body: 'If your health ❤️ hits zero, the adventure ends. Beat your best day streak!' },
    ],
    controls: 'Arrow pad / arrow keys / WASD to move. ⚔️ attack, 🍖 eat, 🔥 build fire, and tap the weapon to swap axe/spear.',
  },

  hero: {
    sections: [
      { heading: 'Goal', body: 'Get all the treasure 💰 to your hero 🦸. Pull the pins to let things drop — but in the right ORDER!' },
      { heading: 'Danger', body: 'If lava 🌋 or a monster 👹 reaches the hero, it’s game over. Plan before you pull!' },
      { heading: 'Tricks', body: 'Water 💧 + lava 🌋 cancel each other out (quench the lava first). Drop a monster 👹 into an empty pit to clear its chamber.' },
      { heading: 'Solve to pull', body: 'Each pin is locked with a math problem — solve it to pull that pin.' },
    ],
    controls: 'Tap a pin 🔩 to try to pull it (solve the math first). Use Retry if a plan goes wrong.',
  },

  turbo: {
    sections: [
      { heading: 'Goal', body: 'Race as far as you can! Reach each checkpoint before the timer hits zero to keep going. New scenery every stage.' },
      { heading: 'Steering', body: 'Drag your finger left/right on the road to steer (or use ◀ ▶ / arrow keys). The road curves — lean into the bend or you’ll slide onto the grass and slow down.' },
      { heading: 'Watch out', body: 'Dodge traffic 🚗🚌🚜 — bumping one slows you and costs time!' },
      { heading: 'Pit stops', body: 'Every 30 seconds you pull into a pit stop — solve a quick math problem for a nitro speed boost, then keep racing.' },
    ],
    controls: 'Drag to steer · ◀ ▶ buttons · arrow keys. Auto-accelerates.',
  },

  wordle: {
    sections: [
      { heading: 'Goal', body: 'Guess the hidden 5-letter word in 6 tries.' },
      { heading: 'Clues', body: 'After each guess: 🟩 green = right letter, right spot · 🟨 yellow = right letter, wrong spot · ⬜ gray = letter not in the word.' },
      { heading: 'Tips', body: 'Start with a word full of common letters. Use the clues to narrow it down. Each guess must be a real 5-letter word.' },
    ],
    controls: 'Tap the on-screen keys (or use your keyboard). Enter to submit, ⌫ to delete.',
  },

  monster: {
    sections: [
      { heading: 'Goal', body: 'Pick a starter critter and climb an endless gauntlet of turn-based battles. Survive as many waves as you can!' },
      { heading: 'Elements', body: '🔥Ember 💧Aqua 🍃Leaf ⚡Spark 🪨Stone ❄️Frost. Some beat others (×1.5) and are weak to others (×0.66) — match types to hit hard!' },
      { heading: 'Your turn', body: 'Attack = normal hit. Special = a CRITICAL (×2) hit, but you must solve a real math problem (an exponent or a word problem from the lesson — medium to hard). Get it right to crit, or Fizzle for a weak hit. Catch = add a weakened wild critter to your party (up to 4). Swap = change your active critter.' },
      { heading: 'Leveling', body: 'Win a battle and your active critter levels up (and may evolve!). A boss appears every 5th wave.' },
      { heading: 'Game over', body: 'If your whole party faints, the run ends. Climb for your best wave!' },
    ],
    controls: 'Tap the action buttons. Special problems use the on-screen keypad — scroll the problem if it is long.',
  },

  racer: {
    sections: [
      { heading: 'Goal', body: "You're the big-helmeted racer at the bottom — it's a first-person dash! The road rushes toward you and hazards come barreling in from the horizon, getting bigger as they get closer. Survive 45 seconds and drive as far as you can." },
      { heading: 'Dodge everything', body: 'Swerve between the three lanes to avoid 🪨 rocks, 🥚 eggs, 🥕 carrots, 👹 toothy heads, 🐍 snakes and 🔺 spikes. Each one you hit costs a life — three hits and the run ends.' },
      { heading: 'Grab the stars', body: 'Catch ⭐ stars in your lane for a +3 second time bonus. The longer you last, the faster everything comes!' },
    ],
    controls: 'Tap ← Left / Right → (or the arrow keys) to switch lanes. Line up the gaps and grab the stars!',
  },

  carpenter: {
    sections: [
      { heading: 'Goal', body: 'Build a cozy cottage across 8 levels — measure each piece, saw it, and raise it. Survive the Big Bad Wolf (Level 7), then size a SQUARE trapdoor and spring a dramatic capture (Level 8) — and cute raccoons move in! This is a GEOMETRY (6.G) build: it’s all about AREA and ANGLES.' },
      { heading: 'How to play', body: 'Each level shows a measuring question — tap the correct answer chip. Then SWIPE back and forth across the board to saw it (it buzzes and rasps!), and the piece snaps onto your cottage.' },
      { heading: 'The math — AREA', body: 'Rectangle area = length × width. Square (the trapdoor) = side × side. Triangle (roof) area = ½ × base × height. Circle (round window & yard) area = π × r × r — we use π ≈ 3 to keep it tidy (real π ≈ 3.14). Trim/siding SUBTRACTS: wall area − window area.' },
      { heading: 'The math — ANGLES', body: 'Square corner = 90°, straight line = 180°, roof pitch = 45°, a gentle trim = 15°, and a three-quarter turn = 270°.' },
      { heading: 'The trap (Level 8)', body: 'The wolf’s paw needs a trap of about 36 sq units. Pick the JUST-RIGHT square: too small won’t catch him, too big and he’ll see it. 6 × 6 = 36 is just right — then watch the zoom-in capture!' },
      { heading: 'Stuck?', body: 'Tap “📝 How to solve” for a step-by-step hint on the current piece.' },
    ],
    controls: 'Tap an answer chip, then swipe the board back and forth to saw. Tap 📝 for a hint.',
  },

  crawler: {
    sections: [
      { heading: 'Goal', body: 'Push your luck through a treasure vault and BANK 50 gold to win. Each room you enter adds loot to your pot — but the alarm gets more likely the deeper you go.' },
      { heading: 'Push or Bank', body: 'After each room, choose: 🎲 Push deeper for a bigger pot (and bigger risk), or 🏦 Bank to lock your pot into the safe and start a fresh run. If the alarm trips on a push, you LOSE the whole un-banked pot!' },
      { heading: 'The math — expected value', body: 'The panel shows the odds. PUSH is worth (chance to survive) × (pot + next reward) on average. BANK is your pot for sure. When the "expected value" of pushing drops below your pot, it is smarter to bank!' },
      { heading: 'Example', body: 'Pot 12, next room is 70% safe for +5. Push ≈ 0.70 × (12 + 5) = 11.9, which is LESS than banking 12 — so bank it. Early on (high odds, small pot) pushing usually wins.' },
      { heading: 'Bonus puzzle', body: 'Each time you bank, solve a quick word problem for extra coins, then start your next run.' },
    ],
    controls: 'Tap 🎲 Push deeper or 🏦 Bank. Watch the expected-value panel to decide!',
  },
};

// Directions for the gate: the game's detailed how-to if we have one, else a
// simple one-card summary built from its tile blurb.
export function getHowTo(game: ArcadeGameDef): GameHowTo {
  return GAME_HOWTO[game.id] ?? { sections: [{ heading: 'How to play', body: game.blurb }] };
}
