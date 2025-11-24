import { motion } from 'framer-motion';
import { Heart, Check, GitCompare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types/career';
import { useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatToINR } from '@/utils/currency';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface JobCardProps {
  job: Job;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (jobId: string) => void;
  compact?: boolean;
  showCompare?: boolean;
  tapToSelect?: boolean;
}

const JobCard = ({ job, selectable, selected, onSelect, compact = false, showCompare = false, tapToSelect = false }: JobCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite, isInCompare, toggleCompare, compareList } = useApp();
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const longPressRef = useRef(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(job.id);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInCompare(job.id) && compareList.length >= 3) {
      toast.error('You can compare up to 3 careers at a time.');
      return;
    }
    toggleCompare(job.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectable) return;
    e.preventDefault();
    longPressRef.current = false;
    const timer = setTimeout(() => {
      longPressRef.current = true;
      if (onSelect) {
        onSelect(job.id);
      }
    }, 500);
    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!selectable) return;
    longPressRef.current = false;
    const timer = setTimeout(() => {
      longPressRef.current = true;
      if (onSelect) {
        onSelect(job.id);
      }
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleClick = () => {
    if (longPressRef.current) {
      longPressRef.current = false;
      return;
    }
    
    // If tap-to-select is enabled and card is selectable, select instead of navigate
    if (tapToSelect && selectable && onSelect) {
      onSelect(job.id);
      return;
    }
    
    navigate(`/job/${job.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-foreground';
    }
  };

  const salaryDisplay = formatToINR(`$${job.salary.min / 1000}k - $${job.salary.max / 1000}k`);

  const cardPadding = compact ? 'p-2' : 'p-2.5 md:p-3';
  const iconSize = compact ? 'text-xl' : 'text-2xl md:text-2xl';
  const titleSize = compact ? 'text-sm' : 'text-sm md:text-base';
  const descSize = compact ? 'text-[0.7rem]' : 'text-xs md:text-sm';
  const cardHeight = compact ? 'h-[100px]' : '';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      className={`relative bg-card border-2 rounded-2xl ${cardPadding} ${cardHeight} cursor-pointer transition-all glow-subtle hover:border-primary group ${
        selected ? 'border-primary bg-primary/10' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 md:gap-3 flex-1">
          <div className={`${iconSize} flex-shrink-0`}>{job.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold ${titleSize} mb-0.5 group-hover:text-primary transition-colors`}>
              {job.name}
            </h3>
            <p className={`${descSize} text-muted-foreground line-clamp-2 mb-1.5`}>
              {job.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full bg-secondary capitalize ${getDifficultyColor(job.difficulty)}`}>
                {t(`filter.${job.difficulty}`)}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">
                {salaryDisplay}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className="p-1.5 hover:bg-secondary rounded-full transition-colors flex-shrink-0 flex items-center justify-center"
          >
            <Heart
              className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isFavorite(job.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
            />
          </motion.button>
          
          {showCompare && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCompareToggle}
              className="p-1.5 hover:bg-secondary rounded-full transition-colors flex-shrink-0 flex items-center justify-center"
            >
              {isInCompare(job.id) ? (
                <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              ) : (
                <GitCompare className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
