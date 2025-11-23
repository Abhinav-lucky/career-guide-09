import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, SlidersHorizontal, ArrowUpDown, GitCompare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import SectorCard from '@/components/SectorCard';
import JobCard from '@/components/JobCard';
import FilterSheet from '@/components/FilterSheet';
import { sectors, jobs } from '@/data/careers';
import { getRecentlyViewed, getCompareList } from '@/utils/storage';
import { FilterOptions, SortOption } from '@/types/career';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
const Home = () => {
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  const {
    compareList
  } = useApp();
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    skills: [],
    salaryRange: [0, 500000],
    difficulty: []
  });
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical-asc');
  const [displaySectors, setDisplaySectors] = useState(sectors);
  useEffect(() => {
    setRecentlyViewedIds(getRecentlyViewed());
  }, []);
  const recentlyViewedJobs = jobs.filter(job => recentlyViewedIds.includes(job.id));
  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Navigate to filter results page
    navigate('/filter-results', {
      state: {
        filters: newFilters
      }
    });
  };
  const handleSort = (option: SortOption) => {
    setSortOption(option);
    let sorted = [...sectors];
    switch (option) {
      case 'alphabetical-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alphabetical-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'most-viewed':
        // For simplicity, keep original order for most-viewed
        break;
    }
    setDisplaySectors(sorted);
    setIsSortOpen(false);
  };
  return <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Discover Your <span className="text-primary">Career Path</span>
            </h2>
            <p className="text-muted-foreground">
              Explore 40+ careers across 10 sectors
            </p>
          </div>

          <SearchBar />

          {/* Action Buttons */}
          <div className="gap-3 flex-wrap flex items-start justify-start">
            <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="flex items-center gap-2 font-thin">
              <SlidersHorizontal className="w-4 h-4" />
              {t('buttons.filter')}
            </Button>
            <Button onClick={() => setIsSortOpen(!isSortOpen)} variant="outline" className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              {t('buttons.sort')}
            </Button>
            <Button onClick={() => navigate('/favorites')} variant="outline" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              {t('buttons.favorites')}
            </Button>
            <Button onClick={() => navigate('/compare')} variant="outline" className="flex items-center gap-2 relative">
              <GitCompare className="w-4 h-4" />
              {t('buttons.compare')}
              {compareList.length > 0 && <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {compareList.length}
                </span>}
            </Button>
          </div>

          {/* Sort Options */}
          {isSortOpen && <motion.div initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="bg-card border border-border rounded-2xl p-4 space-y-2">
              {[{
            value: 'alphabetical-asc',
            label: t('sort.alphabeticalAsc')
          }, {
            value: 'alphabetical-desc',
            label: t('sort.alphabeticalDesc')
          }, {
            value: 'most-viewed',
            label: t('sort.mostViewed')
          }].map(option => <button key={option.value} onClick={() => handleSort(option.value as SortOption)} className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${sortOption === option.value ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                  {option.label}
                </button>)}
            </motion.div>}
        </motion.div>

        {/* Recently Viewed */}
        {recentlyViewedJobs.length > 0 && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.2
      }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">●</span> {t('sections.recentlyViewed')}
            </h3>
            <div className="grid gap-4">
              {recentlyViewedJobs.slice(0, 3).map(job => <JobCard key={job.id} job={job} />)}
            </div>
          </motion.div>}

        {/* Sectors */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-primary">●</span> {t('sections.exploreSectors')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displaySectors.map((sector, index) => <SectorCard key={sector.id} sector={sector} index={index} />)}
          </div>
        </div>
      </div>

      <FilterSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={handleApplyFilters} currentFilters={filters} />
    </Layout>;
};
export default Home;