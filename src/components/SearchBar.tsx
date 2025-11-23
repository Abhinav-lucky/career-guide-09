import { useState, useEffect, useRef } from 'react';
import { Search, X, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jobs } from '@/data/careers';
import { getSearchHistory, addSearchHistory, clearSearchHistory } from '@/utils/storage';

const SearchBar = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof jobs>([]);
  const [history, setHistory] = useState<string[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const filtered = jobs.filter(
        job =>
          job.name.toLowerCase().includes(query.toLowerCase()) ||
          job.description.toLowerCase().includes(query.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setQuery('');
      setIsOpen(false);
    }
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
  };

  const placeholders = [
    t('search.beginSearch'),
    t('search.searchDreams'),
  ];
  const [placeholder, setPlaceholder] = useState(placeholders[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(prev => {
        const currentIndex = placeholders.indexOf(prev);
        return placeholders[(currentIndex + 1) % placeholders.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-card border border-border rounded-2xl focus:outline-none focus:border-primary transition-all glow-subtle"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || history.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 glow-subtle"
          >
            {query && suggestions.length > 0 && (
              <div className="p-2">
                <p className="px-3 py-2 text-xs text-muted-foreground font-semibold">Suggestions</p>
                {suggestions.map((job) => (
                  <motion.button
                    key={job.id}
                    whileHover={{ backgroundColor: 'hsl(var(--secondary))' }}
                    onClick={() => {
                      navigate(`/job/${job.id}`);
                      setQuery('');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left"
                  >
                    <span className="text-2xl">{job.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{job.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{job.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {!query && history.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-xs text-muted-foreground font-semibold">{t('search.searchHistory')}</p>
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-primary hover:underline"
                  >
                    {t('buttons.clearAll')}
                  </button>
                </div>
                {history.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ backgroundColor: 'hsl(var(--secondary))' }}
                    onClick={() => handleSearch(item)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left"
                  >
                    <History className="w-4 h-4 text-muted-foreground" />
                    <span>{item}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
