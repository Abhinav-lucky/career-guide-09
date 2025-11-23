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
          <div className="flex items-center gap-2.5">{/* Removed overflow-x-auto and pb-1 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(true)}
              className="whitespace-nowrap text-xs px-2 py-1 h-7"
            >
              <SlidersHorizontal className="w-3 h-3 mr-1.5" />
              {t('buttons.filter')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="whitespace-nowrap text-xs px-2 py-1 h-7"
            >
              <ArrowUpDown className="w-3 h-3 mr-1.5" />
              {t('buttons.sort')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/favorites')}
              className="whitespace-nowrap text-xs px-2 py-1 h-7"
            >
              <Heart className="w-3 h-3 mr-1.5" />
              {t('buttons.favorites')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/compare')}
              className="whitespace-nowrap relative text-xs px-2 py-1 h-7"
            >
              <GitCompare className="w-3 h-3 mr-1.5" />
              {t('buttons.compare')}
              {compareList.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                  {compareList.length}
                </span>
              )}
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
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {recentlyViewedJobs.map(job => (
                <div key={job.id} className="flex-shrink-0 w-[280px]">
                  <JobCard job={job} compact />
                </div>
              ))}
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