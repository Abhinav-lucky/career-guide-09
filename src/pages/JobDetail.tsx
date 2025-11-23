import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, DollarSign, TrendingUp, BookOpen, Award, Check, GitCompare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import Roadmap from '@/components/Roadmap';
import PlatformIcon from '@/components/PlatformIcon';
import { jobs, sectors } from '@/data/careers';
import { addRecentlyViewed, incrementViewCount } from '@/utils/storage';
import { formatToINR } from '@/utils/currency';
import { useApp } from '@/contexts/AppContext';

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite, isInCompare, toggleCompare, compareList } = useApp();
  const job = jobs.find(j => j.id === jobId);
  const sector = job ? sectors.find(s => s.id === job.sectorId) : null;

  useEffect(() => {
    if (jobId) {
      addRecentlyViewed(jobId);
      incrementViewCount(jobId);
    }
  }, [jobId]);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInCompare(jobId!) && compareList.length >= 3) {
      toast.error('At most three careers can be compared.');
      return;
    }
    toggleCompare(jobId!);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(jobId!);
  };

  if (!job || !sector) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-2">Job not found</h2>
          <p className="text-muted-foreground">The career you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  const salaryDisplay = formatToINR(`$${job.salary.min / 1000}k - $${job.salary.max / 1000}k`);


  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Hero Section with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-3xl p-6"
          style={{
            background: `linear-gradient(135deg, ${sector.gradient.from} 0%, ${sector.gradient.to} 100%)`,
          }}
        >
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-5xl mb-4 inline-block"
            >
              {job.icon}
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-1.5">
              {job.name}
            </h1>
            <p className="text-lg text-white/90">
              {job.description}
            </p>
          </div>
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavoriteToggle}
              className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite(job.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCompareToggle}
              className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              {isInCompare(job.id) ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <GitCompare className="w-5 h-5 text-white" />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats - Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-card border border-border rounded-2xl p-3">
            <DollarSign className="w-4 h-4 text-primary mb-1.5" />
            <p className="text-[10px] text-muted-foreground mb-0.5">{t('sections.salary')}</p>
            <p className="text-[11px] font-bold leading-tight">
              {salaryDisplay}
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3">
            <TrendingUp className="w-4 h-4 text-primary mb-1.5" />
            <p className="text-[10px] text-muted-foreground mb-0.5">{t('filter.difficulty')}</p>
            <p className="text-[11px] font-bold capitalize leading-tight">{t(`filter.${job.difficulty}`)}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3">
            <BookOpen className="w-4 h-4 text-primary mb-1.5" />
            <p className="text-[10px] text-muted-foreground mb-0.5">{t('sections.roadmap')}</p>
            <p className="text-[11px] font-bold leading-tight">{job.roadmap.length} steps</p>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-4"
        >
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-primary">●</span> {t('sections.description')}
          </h2>
          <p className="text-base leading-relaxed text-foreground/90">
            {job.detailedDescription}
          </p>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-4"
        >
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-primary">●</span> {t('sections.skills')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="px-3 py-1.5 bg-secondary rounded-full text-xs font-medium"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Roadmap */}
        <Roadmap steps={job.roadmap} />

        {/* Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-2xl p-4"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            {t('sections.certificates')}
          </h2>
          <div className="space-y-3">
            {job.certificates.filter(c => c.type === 'required').length > 0 && (
              <div>
                <h3 className="font-semibold text-base mb-2 text-primary">{t('sections.required')}</h3>
                <div className="space-y-1.5">
                  {job.certificates.filter(c => c.type === 'required').map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="flex items-center gap-2 p-2 bg-primary/10 rounded-xl"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="font-medium text-sm">{cert.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {job.certificates.filter(c => c.type === 'optional').length > 0 && (
              <div>
                <h3 className="font-semibold text-base mb-2 text-muted-foreground">{t('sections.optional')}</h3>
                <div className="space-y-1.5">
                  {job.certificates.filter(c => c.type === 'optional').map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.75 + index * 0.05 }}
                      className="flex items-center gap-2 p-2 bg-secondary rounded-xl"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      <span className="font-medium text-sm">{cert.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Learning Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border rounded-2xl p-4"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-primary">●</span> {t('sections.resources')}
          </h2>
          <div className="space-y-3">
            {/* Free Resources */}
            {job.links.filter(l => l.type === 'free').length > 0 && (
              <div>
                <h3 className="font-semibold text-base mb-2 text-neon-green">{t('sections.free')}</h3>
                <div className="grid gap-2">
                  {job.links.filter(l => l.type === 'free').map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-secondary hover:bg-primary/10 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={link.platform} />
                        <span className="font-medium text-sm">{link.name}</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Paid Resources */}
            {job.links.filter(l => l.type === 'paid').length > 0 && (
              <div>
                <h3 className="font-semibold text-base mb-2 text-neon-yellow">{t('sections.paid')}</h3>
                <div className="grid gap-2">
                  {job.links.filter(l => l.type === 'paid').map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.85 + index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-secondary hover:bg-primary/10 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={link.platform} />
                        <span className="font-medium text-sm">{link.name}</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default JobDetail;
