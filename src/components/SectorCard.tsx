import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sector } from '@/types/career';
import { ChevronRight } from 'lucide-react';

interface SectorCardProps {
  sector: Sector;
  index: number;
}

const SectorCard = ({ sector, index }: SectorCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/sector/${sector.id}`)}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${sector.gradient.from} 0%, ${sector.gradient.to} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      
      <div className="relative p-6 min-h-[140px] flex flex-col justify-between">
        <div>
          <div className="text-4xl mb-3">{sector.icon}</div>
          <h3 className="text-xl font-bold text-white mb-1">
            {sector.name}
          </h3>
          <p className="text-sm text-white/80">
            {sector.description}
          </p>
        </div>
        
        <div className="flex items-center justify-end">
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            className="text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at 50% 50%, ${sector.gradient.to}33 0%, transparent 70%)`,
        }} />
      </div>
    </motion.div>
  );
};

export default SectorCard;
