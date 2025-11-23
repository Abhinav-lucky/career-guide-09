import { motion } from 'framer-motion';
import { GitCompare, X, DollarSign, TrendingUp, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { jobs } from '@/data/careers';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { formatToINR } from '@/utils/currency';

const Compare = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { compareList, toggleCompare, clearCompareList: clearList } = useApp();

  const compareJobs = jobs.filter(job => compareList.includes(job.id));

  const getDifficultyScore = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 1;
      case 'intermediate': return 2;
      case 'advanced': return 3;
      default: return 0;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl mx-auto px-4 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <GitCompare className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">{t('compare.title')}</h1>
            </div>
            <p className="text-muted-foreground">
              {t('compare.selectUp')}
            </p>
          </div>
          {compareJobs.length > 0 && (
            <Button onClick={clearList} variant="outline">
              {t('buttons.clearAll')}
            </Button>
          )}
        </motion.div>

        {compareJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <GitCompare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">{t('compare.empty')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('compare.emptyDesc')}
            </p>
            <Button onClick={() => navigate('/')}>
              {t('nav.home')}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Jobs Overview - Horizontal Layout */}
            <div className={`grid gap-3 ${compareJobs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {compareJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-card border border-border rounded-2xl p-4"
                >
                  <button
                    onClick={() => toggleCompare(job.id)}
                    className="absolute top-3 right-3 p-1 bg-secondary hover:bg-destructive/20 rounded-full transition-colors flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-3xl mb-3">{job.icon}</div>
                  <h3 className="font-bold text-base mb-1.5">{job.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Comparison Sections - Horizontal Layout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {/* Salary */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-3 bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-sm">{t('compare.salary')}</h3>
                  </div>
                </div>
                <div className={`grid ${compareJobs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} divide-x divide-border`}>
                  {compareJobs.map((job) => (
                    <div key={job.id} className="p-3">
                      <p className="text-base font-bold">
                        {formatToINR(`$${job.salary.min / 1000}k - $${job.salary.max / 1000}k`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-3 bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-sm">{t('compare.difficulty')}</h3>
                  </div>
                </div>
                <div className={`grid ${compareJobs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} divide-x divide-border`}>
                  {compareJobs.map((job) => (
                    <div key={job.id} className="p-3">
                      <p className="text-sm font-bold capitalize mb-1.5">
                        {t(`filter.${job.difficulty}`)}
                      </p>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full ${
                              level <= getDifficultyScore(job.difficulty)
                                ? 'bg-primary'
                                : 'bg-secondary'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-3 bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-sm">{t('compare.skills')}</h3>
                  </div>
                </div>
                <div className={`grid ${compareJobs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} divide-x divide-border`}>
                  {compareJobs.map((job) => (
                    <div key={job.id} className="p-3">
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-secondary rounded-full text-[10px]"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-2 py-0.5 bg-secondary rounded-full text-[10px] text-muted-foreground">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roadmap */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-3 bg-secondary/50">
                  <h3 className="font-bold text-sm">{t('sections.roadmap')}</h3>
                </div>
                <div className={`grid ${compareJobs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} divide-x divide-border`}>
                  {compareJobs.map((job) => (
                    <div key={job.id} className="p-3">
                      <p className="text-base font-bold mb-0.5">
                        {job.roadmap.length} Steps
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {job.certificates.length} certifications
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className={`grid gap-3 ${compareJobs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {compareJobs.map((job) => (
                <Button
                  key={job.id}
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="w-full"
                  size="sm"
                >
                  View Details
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Compare;
