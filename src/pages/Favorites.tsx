import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import JobCard from '@/components/JobCard';
import { jobs } from '@/data/careers';
import { useApp } from '@/contexts/AppContext';
import toast from 'react-hot-toast';
import { addFavorite } from '@/utils/storage';
import { useTranslation } from 'react-i18next';

const Favorites = () => {
  const { t } = useTranslation();
  const { favorites } = useApp();
  const [localFavorites, setLocalFavorites] = useState<string[]>(favorites);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const favoriteJobs = jobs.filter(job => localFavorites.includes(job.id));

  const handleRemove = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    setLocalFavorites(prev => prev.filter(id => id !== jobId));

    toast(
      (toastInstance) => (
        <div className="flex items-center gap-3">
          <span>{t('favorites.removed')}</span>
          <button
            onClick={() => {
              addFavorite(jobId);
              setLocalFavorites(prev => [...prev, jobId]);
              toast.dismiss(toastInstance.id);
            }}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            {t('buttons.undo')}
          </button>
        </div>
      ),
      {
        duration: 4000,
        position: 'bottom-center',
      }
    );
  };

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-primary fill-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">{t('favorites.title')}</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            {t('favorites.saved', { count: favoriteJobs.length })}
          </p>
        </motion.div>

        {favoriteJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 md:py-20"
          >
            <Heart className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">{t('favorites.empty')}</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {t('favorites.emptyDesc')}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-3 md:gap-4">
            <AnimatePresence mode="popLayout">
              {favoriteJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleRemove(job.id);
                  }}
                  onTouchStart={(e) => {
                    const timer = setTimeout(() => handleRemove(job.id), 500);
                    (e.currentTarget as any).longPressTimer = timer;
                  }}
                  onTouchEnd={(e) => {
                    if ((e.currentTarget as any).longPressTimer) {
                      clearTimeout((e.currentTarget as any).longPressTimer);
                    }
                  }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
