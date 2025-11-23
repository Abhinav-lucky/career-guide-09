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
      <div className="space-y-6 max-w-6xl mx-auto">
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
            {/* Jobs Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-card border border-border rounded-2xl p-6"
                >
                  <button
                    onClick={() => toggleCompare(job.id)}
                    className="absolute top-4 right-4 p-1.5 bg-secondary hover:bg-destructive/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="text-4xl mb-4">{job.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{job.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Comparison Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {/* Salary */}
              <div className="border-b border-border">
                <div className="p-4 bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">{t('compare.salary')}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-border">
                  {compareJobs.map((job) => (
                    <div key={job.id} className="p-4">
                      <p className="text-2xl font-bold">
                        {formatToINR(`$${job.salary.min / 1000}k - $${job.salary.max / 1000}k`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="border-b border-border">
                <div className="p-4 bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">{t('compare.difficulty')}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-border">
                  {compareJobs.map((job) => (
                    <div key={job.id} className="p-4">
                      <p className="text-xl font-bold capitalize mb-2">
                        {t(`filter.${job.difficulty}`)}
                      </p>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full ${
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
              <div className="border-b border-border">
                <div className="p-4 bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">{t('compare.skills')}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-border">
                  {compareJobs.map((job) => (
                    <div key={job.id} className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-secondary rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roadmap Length */}
              <div>
                <div className="p-4 bg-secondary/50">
                  <h3 className="font-bold">{t('sections.roadmap')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-border">
                  {compareJobs.map((job) => (
                    <div key={job.id} className="p-4">
                      <p className="text-2xl font-bold mb-1">
                        {job.roadmap.length} Steps
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {job.certificates.length} certifications
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareJobs.map((job) => (
                <Button
                  key={job.id}
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="w-full"
                >
                  View {job.name}
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
