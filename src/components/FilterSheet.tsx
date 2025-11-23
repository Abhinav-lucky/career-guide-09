import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FilterOptions } from '@/types/career';
import { Button } from './ui/button';
import { formatToINR } from '@/utils/currency';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const allSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git',
  'TypeScript', 'Java', 'C++', 'Machine Learning', 'DevOps', 'Cloud',
  'Cybersecurity', 'UI/UX', 'Data Analysis', 'Mobile Development'
];

const FilterSheet = ({ isOpen, onClose, onApply, currentFilters }: FilterSheetProps) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      skills: [],
      salaryRange: [0, 500000],
      difficulty: [],
    });
  };

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter(d => d !== difficulty)
        : [...prev.difficulty, difficulty],
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">{t('filter.title')}</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">{t('filter.skills')}</h3>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <motion.button
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        filters.skills.includes(skill)
                          ? 'bg-primary text-primary-foreground glow-red'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      {skill}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">{t('filter.salary')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Min: {formatToINR(`$${(filters.salaryRange[0] / 1000).toFixed(0)}k`)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={filters.salaryRange[0]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        salaryRange: [Number(e.target.value), prev.salaryRange[1]],
                      }))}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Max: {formatToINR(`$${(filters.salaryRange[1] / 1000).toFixed(0)}k`)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={filters.salaryRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        salaryRange: [prev.salaryRange[0], Number(e.target.value)],
                      }))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">{t('filter.difficulty')}</h3>
                <div className="flex gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as const).map(difficulty => (
                    <motion.button
                      key={difficulty}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleDifficulty(difficulty)}
                      className={`flex-1 px-4 py-3 rounded-xl capitalize transition-all ${
                        filters.difficulty.includes(difficulty)
                          ? 'bg-primary text-primary-foreground glow-red'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      {t(`filter.${difficulty}`)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                {t('buttons.reset')}
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 bg-primary text-primary-foreground"
              >
                {t('buttons.apply')}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSheet;
