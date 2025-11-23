import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Settings from './Settings';
import ThemeToggle from './ThemeToggle';
interface LayoutProps {
  children: ReactNode;
}
const Layout = ({
  children
}: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    t
  } = useTranslation();
  const isHome = location.pathname === '/';
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 opacity-100 shadow-sm bg-slate-950 text-slate-50">
          <div className="flex items-center gap-3">
            {!isHome && <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-secondary transition-colors flex items-center justify-center" aria-label={t('nav.back')}>
                <ArrowLeft className="w-5 h-5" />
              </motion.button>}
            <h1 className="text-xl font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/')}>
              Career<span className="text-primary">Guide</span>
            </h1>
          </div>
          
          <div className="gap-2 flex items-center justify-start opacity-100">
            {isHome && <ThemeToggle />}
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-secondary transition-colors flex items-center justify-center" aria-label={t('buttons.settings')}>
              <SettingsIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-6">
        {children}
      </main>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>;
};
export default Layout;