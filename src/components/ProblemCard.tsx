import type { Problem } from '../types/problem';
import { MathText } from './MathText';
import { DiagramRenderer } from './DiagramRenderer';

interface Props {
  problem: Problem;
}

export function ProblemCard({ problem }: Props) {
  return (
    <div className="bg-surface rounded-3xl shadow-sm border border-line p-5">
      <div className="text-xs font-display font-bold text-ink-muted uppercase tracking-wider mb-2">
        {problem.standard}
        {problem.tags.includes('CA') && (
          <span className="ml-2 inline-block bg-warn-soft text-warn px-2 py-0.5 rounded-full text-[10px]">
            CA
          </span>
        )}
        {problem.tags.includes('MAP-practice') && (
          <span className="ml-2 inline-block bg-accent-soft text-accent px-2 py-0.5 rounded-full text-[10px]">
            MAP
          </span>
        )}
      </div>
      <div className="text-lg text-ink leading-relaxed">
        <MathText text={problem.prompt} />
      </div>
      {problem.diagram && <DiagramRenderer diagram={problem.diagram} />}
    </div>
  );
}
