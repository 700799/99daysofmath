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
};

// Directions for the gate: the game's detailed how-to if we have one, else a
// simple one-card summary built from its tile blurb.
export function getHowTo(game: ArcadeGameDef): GameHowTo {
  return GAME_HOWTO[game.id] ?? { sections: [{ heading: 'How to play', body: game.blurb }] };
}
