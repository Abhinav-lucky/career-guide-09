import { motion } from 'framer-motion';
import { RoadmapStep } from '@/types/career';
import { ArrowDown } from 'lucide-react';

interface RoadmapProps {
  steps: RoadmapStep[];
}

const Roadmap = ({ steps }: RoadmapProps) => {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div key={index}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 items-start"
          >
            {/* Step circle with number */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary">
              {index + 1}
            </div>
            
            {/* Step content */}
            <div className="flex-1 pt-1.5">
              <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
              {step.description && (
                <p className="text-sm text-muted-foreground">{step.description}</p>
              )}
            </div>
          </motion.div>
          
          {/* Downward arrow connector (except for last item) */}
          {index < steps.length - 1 && (
            <div className="flex gap-4 py-2">
              <div className="w-10 flex justify-center">
                <ArrowDown className="w-5 h-5 text-primary/50" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Roadmap;
