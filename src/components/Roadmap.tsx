import { motion } from 'framer-motion';
import { RoadmapStep } from '@/types/career';
import { ArrowDown } from 'lucide-react';

interface RoadmapProps {
  steps: RoadmapStep[];
}

const Roadmap = ({ steps }: RoadmapProps) => {
  return (
    <div className="space-y-1.5">
      {steps.map((step, index) => (
        <div key={index}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 items-start"
          >
            {/* Step circle with number */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary text-sm">
              {index + 1}
            </div>
            
            {/* Step content */}
            <div className="flex-1 pt-0.5">
              <h4 className="font-semibold text-foreground mb-0.5 text-sm">{step.title}</h4>
              {step.description && (
                <p className="text-xs text-muted-foreground">{step.description}</p>
              )}
            </div>
          </motion.div>
          
          {/* Downward arrow connector (except for last item) */}
          {index < steps.length - 1 && (
            <div className="flex gap-3 py-1">
              <div className="w-7 flex justify-center">
                <ArrowDown className="w-4 h-4 text-primary/50" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Roadmap;
