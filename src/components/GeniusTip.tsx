import { motion } from 'framer-motion';
import { tipForProblem } from '../data/geniusTips';
import type { Domain } from '../types/problem';

interface Props {
  problemId: string;
  domain: Domain;
}

// Occasionally drops a "genius tip" onto correct-answer feedback (about 1 in 4
// problems, deterministic per problem id so it doesn't flicker on re-render).
export function GeniusTipCard({ problemId, domain }: Props) {
  const tip = tipForProblem(problemId, domain);
  if (!tip) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mt-3 text-left rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 border-2 border-violet-200 p-3"
    >
      <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-violet-700">
        🧠 Genius tip
      </div>
      <p className="text-sm text-slate-800 mt-1">{tip.text}</p>
    </motion.div>
  );
}
