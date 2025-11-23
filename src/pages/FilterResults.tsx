import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import JobCard from '@/components/JobCard';
import { jobs } from '@/data/careers';
import { FilterOptions } from '@/types/career';
import { useTranslation } from 'react-i18next';

const FilterResults = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const filters = location.state?.filters as FilterOptions;

  if (!filters) {
    navigate('/');
    return null;
  }

  const filteredJobs = jobs.filter(job => {
    const skillsMatch = filters.skills.length === 0 || 
      filters.skills.some(skill => job.skills.includes(skill));
    const salaryMatch = job.salary.min >= filters.salaryRange[0] && 
      job.salary.max <= filters.salaryRange[1];
    const difficultyMatch = filters.difficulty.length === 0 || 
      filters.difficulty.includes(job.difficulty);
    
    return skillsMatch && salaryMatch && difficultyMatch;
  });

  return (
    <Layout>
      <div className="space-y-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{t('filter.title')}</h1>
            <p className="text-muted-foreground">
              {t('filter.resultsCount', { count: filteredJobs.length })}
            </p>
          </div>
        </motion.div>

        <div className="grid gap-3">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <JobCard job={job} />
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{t('search.noResults')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FilterResults;
