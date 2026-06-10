import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Phaser from 'phaser';
import { GameCanvas } from '../components/GameCanvas';
import { ChallengeModal } from '../components/ChallengeModal';
import { DifficultyChips } from '../components/DifficultyChips';
import { LockedNotice } from '../components/LockedNotice';
import { useChallengeBridge } from '../rewards/useChallengeBridge';
import { gameMeta, isGameUnlocked, starsUntilUnlock } from '../rewards/economy';
import type { ChallengeDifficulty } from '../rewards/mathChallenge';
import { useProgress } from '../state/progress';
import { Icon } from '../icons/Icon';
import {
  GrandPrixScene,
  PRIX_WIDTH,
  PRIX_HEIGHT,
  type PrixResult,
} from '../phaser/GrandPrixScene';

const META = gameMeta('grand-prix');

export function GrandPrix() {
  const totalStars = useProgress((s) => s.totalStars());
  const record = useProgress((s) => s.recordGameResult);
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>(2);
  const [lastResult, setLastResult] = useState<PrixResult | null>(null);
  const { challenge, onChallenge, resolve } = useChallengeBridge();

  const onGameEnd = useCallback(
    (r: PrixResult) => {
      record('grand-prix', r.place, r.payout);
      setLastResult(r);
    },
    [record],
  );

  const boot = useCallback(
    (parent: HTMLDivElement) => {
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent,
        width: PRIX_WIDTH,
        height: PRIX_HEIGHT,
        backgroundColor: '#0f172a',
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: [GrandPrixScene],
        banner: false,
      });
      game.scene.start('GrandPrix', { difficulty, onChallenge, onGameEnd });
      return game;
    },
    [difficulty, onChallenge, onGameEnd],
  );

  if (!isGameUnlocked(totalStars, 'grand-prix')) {
    return <LockedNotice gameName={META.name} need={starsUntilUnlock(totalStars, 'grand-prix')} />;
  }

  return (
    <div>
      <Link to="/rewards" className="text-sm font-display font-bold text-slate-500 hover:text-slate-700">
        ← Arcade
      </Link>

      <div className="mt-2 mb-3 text-center">
        <h1 className="text-2xl font-display font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <Icon name={META.icon} size={30} />
          <span>{META.name}</span>
        </h1>
        <p className="text-slate-600 text-sm mt-0.5">
          The rivals never stop — answer fast to boost your kart to the flag!
        </p>
      </div>

      <div className="mb-4">
        <DifficultyChips value={difficulty} onChange={setDifficulty} accent={META.accent} />
        <p className="text-center text-xs text-slate-400 mt-1">Changing difficulty starts a new race.</p>
      </div>

      {lastResult && (
        <div
          className="mb-3 text-center rounded-2xl py-2 px-4 font-display font-extrabold text-white"
          style={{ backgroundColor: lastResult.place === 1 ? '#FF9600' : '#64748b' }}
        >
          {lastResult.place === 1 ? 'First place!' : `Finished P${lastResult.place}.`} +
          {lastResult.payout} coins banked.
        </div>
      )}

      <GameCanvas key={difficulty} boot={boot} className="w-full max-w-md mx-auto aspect-[420/460]">
        {challenge && (
          <ChallengeModal
            challenge={challenge}
            onResolve={resolve}
            accent={META.accent}
            timeLimitMs={9000}
            title="Speed boost!"
          />
        )}
      </GameCanvas>

      <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
        <div className="font-display font-extrabold text-slate-800 mb-2 flex items-center gap-2">
          <Icon name="flag" size={20} />
          <span>How to play</span>
        </div>
        <ul className="space-y-1.5">
          <li className="flex items-center gap-2">
            <Icon name="bolt" size={16} className="shrink-0" />
            <span>Every correct answer boosts your kart forward.</span>
          </li>
          <li className="flex items-center gap-2">
            <Icon name="check" size={16} className="shrink-0" />
            <span>Beat the timer — running out counts as a miss and you slip back.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex shrink-0">
              <Icon name="turtle" size={18} />
              <Icon name="rabbit" size={18} />
            </span>
            <span>The rivals drive at a steady pace, so keep solving to stay ahead!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
