import type { Problem } from '../types/problem';
import { MathText } from './MathText';
import { DiagramRenderer } from './DiagramRenderer';

interface Props {
  problem: Problem;
}

export function ProblemCard({ problem }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
      <div className="text-xs font-display font-bold text-slate-500 uppercase tracking-wider mb-2">
        {problem.standard}
        {problem.tags.includes('CA') && (
          <span className="ml-2 inline-block bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-[10px]">
            CA
          </span>
        )}
        {problem.tags.includes('MAP-practice') && (
          <span className="ml-2 inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[10px]">
            MAP
          </span>
        )}
      </div>
      <div className="text-lg text-slate-900 leading-relaxed">
        <MathText text={problem.prompt} />
      </div>
      {problem.diagram && <DiagramRenderer diagram={problem.diagram} />}
    </div>
  );
}
