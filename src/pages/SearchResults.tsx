import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Layout from '@/components/Layout';
import JobCard from '@/components/JobCard';
import { jobs } from '@/data/careers';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState(jobs);

  useEffect(() => {
    if (query.trim()) {
      const filtered = jobs.filter(
        job =>
          job.name.toLowerCase().includes(query.toLowerCase()) ||
          job.description.toLowerCase().includes(query.toLowerCase()) ||
          job.detailedDescription.toLowerCase().includes(query.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults(jobs);
    }
  }, [query]);

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Search Results</h1>
          </div>
          <p className="text-muted-foreground">
            {query && (
              <>
                Showing {results.length} {results.length === 1 ? 'result' : 'results'} for{' '}
                <span className="font-semibold text-foreground">"{query}"</span>
              </>
            )}
          </p>
        </motion.div>

        {results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try searching with different keywords
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {results.map((job, index) => (
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
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;
