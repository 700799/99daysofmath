import { motion } from 'framer-motion';
import { MathText } from './MathText';
import { Icon } from '../icons/Icon';

interface Props {
  steps: string[];
}

export function Explanation({ steps }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon name="book" size={22} />
        <span className="font-display font-bold text-blue-900">
          Step-by-step
        </span>
      </div>
      <ol className="space-y-2 list-decimal list-inside text-slate-800">
        {steps.map((step, i) => (
          <li key={i}>
            <MathText text={step} />
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
