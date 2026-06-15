import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_SECTIONS } from '../data/navigationMenu';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NavigationDrawer({ open, onClose }: Props) {
  const navigate = useNavigate();

  const handleNavClick = (to: string) => {
    navigate(to);
    onClose();
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            key="nav-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 600) onClose();
            }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Drag handle */}
            <div className="pt-3 pb-2 flex justify-center shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>

            {/* Header with close button */}
            <div className="px-5 pb-3 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-display font-extrabold text-slate-900">
                Navigation
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-display font-extrabold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Navigation sections - scrollable */}
            <div className="px-5 overflow-y-auto flex-1">
              {NAV_SECTIONS.map((section, idx) => (
                <NavSection
                  key={idx}
                  title={section.title}
                  items={section.items}
                  onSelect={handleNavClick}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function NavSection({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: Array<{ label: string; icon: string; to: string }>;
  onSelect: (to: string) => void;
}) {
  return (
    <div className="py-2">
      {title && (
        <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-400 px-2 py-2">
          {title}
        </div>
      )}
      {items.map((item) => (
        <button
          key={item.to}
          type="button"
          onClick={() => onSelect(item.to)}
          className="w-full px-3 py-3 text-left rounded-xl hover:bg-slate-50 active:bg-slate-100 flex items-center gap-3 transition-colors"
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-sm font-display font-bold text-slate-900">
            {item.label}
          </span>
        </button>
      ))}
      {title && <div className="my-1" />}
    </div>
  );
}
