import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import JobCard from '@/components/JobCard';
import { sectors, jobs } from '@/data/careers';
import { Job, SortOption } from '@/types/career';
import { Button } from '@/components/ui/button';

const Sector = () => {
  const { sectorId } = useParams<{ sectorId: string }>();
  const { t } = useTranslation();
  const sector = sectors.find(s => s.id === sectorId);
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical-asc');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  let sectorJobs = jobs.filter(j => j.sectorId === sectorId);
  
  // Apply sorting
  const sortedJobs = [...sectorJobs].sort((a, b) => {
    switch (sortOption) {
      case 'alphabetical-asc':
        return a.name.localeCompare(b.name);
      case 'alphabetical-desc':
        return b.name.localeCompare(a.name);
      case 'most-viewed':
        return 0; // Keep original order
      default:
        return 0;
    }
  });
  
  const handleSort = (option: SortOption) => {
    setSortOption(option);
    setIsSortOpen(false);
  };

  if (!sector) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-2">Sector not found</h2>
          <p className="text-muted-foreground">The sector you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Sector Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-8"
          style={{
            background: `linear-gradient(135deg, ${sector.gradient.from} 0%, ${sector.gradient.to} 100%)`,
          }}
        >
          <div className="relative z-10">
            <div className="text-6xl mb-4">{sector.icon}</div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {sector.name}
            </h1>
            <p className="text-xl text-white/90">
              {sector.description}
            </p>
            <p className="text-white/70 mt-2">
              {sortedJobs.length} careers available
            </p>
          </div>
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        {/* Sort Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsSortOpen(!isSortOpen)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            {t('buttons.sort')}
          </Button>
        </div>

        {/* Sort Options */}
        {isSortOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-4 space-y-2"
          >
            {[
              { value: 'alphabetical-asc', label: t('sort.alphabeticalAsc') },
              { value: 'alphabetical-desc', label: t('sort.alphabeticalDesc') },
              { value: 'most-viewed', label: t('sort.mostViewed') },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value as SortOption)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  sortOption === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Jobs Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4"
        >
          {sortedJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <JobCard job={job} selectable onSelect={() => {}} />
            </motion.div>
          ))}
        </motion.div>

        {sortedJobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No jobs found in this sector</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Sector;
