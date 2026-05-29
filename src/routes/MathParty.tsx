import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Phaser from 'phaser';
import { GameCanvas } from '../components/GameCanvas';
import { ChallengeModal } from '../components/ChallengeModal';
import { DifficultyChips } from '../components/DifficultyChips';
import { useChallengeBridge } from '../rewards/useChallengeBridge';
import { gameMeta, isGameUnlocked, starsUntilUnlock } from '../rewards/economy';
import type { ChallengeDifficulty } from '../rewards/mathChallenge';
import { useProgress } from '../state/progress';
import {
  MathPartyScene,
  PARTY_WIDTH,
  PARTY_HEIGHT,
  type PartyResult,
} from '../phaser/MathPartyScene';

const META = gameMeta('math-party');

export function MathParty() {
  const totalStars = useProgress((s) => s.totalStars());
  const record = useProgress((s) => s.recordGameResult);
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>(2);
  const [lastResult, setLastResult] = useState<PartyResult | null>(null);
  const { challenge, onChallenge, resolve } = useChallengeBridge();

  const onGameEnd = useCallback(
    (r: PartyResult) => {
      record('math-party', r.place, r.payout);
      setLastResult(r);
    },
    [record],
  );

  const boot = useCallback(
    (parent: HTMLDivElement) => {
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent,
        width: PARTY_WIDTH,
        height: PARTY_HEIGHT,
        backgroundColor: '#F8FAFC',
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: [MathPartyScene],
        banner: false,
      });
      game.scene.start('MathParty', { difficulty, onChallenge, onGameEnd });
      return game;
    },
    [difficulty, onChallenge, onGameEnd],
  );

  if (!isGameUnlocked(totalStars, 'math-party')) {
    return <LockedNotice need={starsUntilUnlock(totalStars, 'math-party')} />;
  }

  return (
    <div>
      <Link to="/rewards" className="text-sm font-display font-bold text-slate-500 hover:text-slate-700">
        ← Arcade
      </Link>

      <div className="mt-2 mb-3 text-center">
        <h1 className="text-2xl font-display font-extrabold text-slate-900">
          {META.emoji} {META.name}
        </h1>
        <p className="text-slate-600 text-sm mt-0.5">
          First to the most ⭐ Stars wins. Land on math tiles to grab coins!
        </p>
      </div>

      <div className="mb-4">
        <DifficultyChips value={difficulty} onChange={setDifficulty} accent={META.accent} />
        <p className="text-center text-xs text-slate-400 mt-1">Changing difficulty starts a new game.</p>
      </div>

      {lastResult && (
        <div
          className="mb-3 text-center rounded-2xl py-2 px-4 font-display font-extrabold text-white"
          style={{ backgroundColor: lastResult.place === 1 ? '#46A302' : '#FF9600' }}
        >
          {lastResult.place === 1 ? '🏆 You won!' : '🥈 Nice run!'} +{lastResult.payout} coins banked.
        </div>
      )}

      <GameCanvas key={difficulty} boot={boot} className="w-full max-w-md mx-auto aspect-[420/640]">
        {challenge && (
          <ChallengeModal
            challenge={challenge}
            onResolve={resolve}
            accent={META.accent}
            timeLimitMs={14000}
            title="Math tile!"
          />
        )}
      </GameCanvas>

      <HowToPlay />
    </div>
  );
}

function HowToPlay() {
  return (
    <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
      <div className="font-display font-extrabold text-slate-800 mb-2">How to play</div>
      <ul className="space-y-1">
        <li>🎲 Tap <span className="font-bold">ROLL</span> to move around the board.</li>
        <li>🔵 Blue tiles give coins, 🔴 red tiles take a few away.</li>
        <li>⭐ Land on a Star tile with 10+ coins to buy a Star — most Stars wins!</li>
        <li>× Math tiles pop a quick question: solve it for bonus coins.</li>
        <li>❓ Lucky tiles are a wildcard — bonuses, steals, even a jackpot Star.</li>
      </ul>
    </div>
  );
}

function LockedNotice({ need }: { need: number }) {
  return (
    <div className="text-center">
      <Link to="/rewards" className="text-sm font-display font-bold text-slate-500 hover:text-slate-700">
        ← Arcade
      </Link>
      <div className="mt-10 text-6xl">🔒</div>
      <h1 className="mt-3 text-2xl font-display font-extrabold text-slate-900">{META.name} is locked</h1>
      <p className="mt-2 text-slate-600">
        Earn <span className="font-bold text-amber-600">{need} more ⭐</span> on the math trails to unlock it.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 rounded-2xl bg-duo-green text-white font-display font-extrabold shadow-sm"
      >
        Go practice math
      </Link>
    </div>
  );
}
