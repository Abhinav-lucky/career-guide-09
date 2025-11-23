import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types/career';
import { useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatToINR } from '@/utils/currency';
import { useTranslation } from 'react-i18next';

interface JobCardProps {
  job: Job;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (jobId: string) => void;
}

const JobCard = ({ job, selectable, selected, onSelect }: JobCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useApp();
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const longPressRef = useRef(false);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(job.id);
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
      className={`relative bg-card border-2 rounded-2xl p-4 md:p-5 cursor-pointer transition-all glow-subtle hover:border-primary group ${
        selected ? 'border-primary bg-primary/10' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3 md:gap-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1">
          <div className="text-3xl md:text-4xl flex-shrink-0">{job.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base md:text-lg mb-1 group-hover:text-primary transition-colors">
              {job.name}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2 md:mb-3">
              {job.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs px-2 md:px-3 py-1 rounded-full bg-secondary capitalize ${getDifficultyColor(job.difficulty)}`}>
                {t(`filter.${job.difficulty}`)}
              </span>
              <span className="text-xs px-2 md:px-3 py-1 rounded-full bg-secondary text-foreground">
                {salaryDisplay}
              </span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteToggle}
          className="p-2 hover:bg-secondary rounded-full transition-colors flex-shrink-0"
        >
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite(job.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default JobCard;
