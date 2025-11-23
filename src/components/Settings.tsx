import { motion, AnimatePresence } from 'framer-motion';
import { X, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp, themeColors } from '@/contexts/AppContext';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings = ({ isOpen, onClose }: SettingsProps) => {
  const { t, i18n } = useTranslation();
  const { themeColor, setThemeColor } = useApp();

  const languages = [
    { code: 'en', name: t('languages.en') },
    { code: 'hi', name: t('languages.hi') },
    { code: 'te', name: t('languages.te') },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  const handleThemeColorChange = (colorValue: string) => {
    setThemeColor(colorValue);
  };

  const handleGithubClick = () => {
    window.open('https://github.com/Abhinav-lucky/career-guide-09', '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('settings.title')}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Theme Color */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{t('settings.theme')}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {themeColors.map((color) => (
                    <motion.button
                      key={color.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleThemeColorChange(color.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        themeColor === color.value
                          ? 'border-primary'
                          : 'border-border'
                      }`}
                      style={{
                        background: `hsl(${color.value})`,
                      }}
                    >
                      <span className="text-white font-medium capitalize">
                        {t(`colors.${color.name}`)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{t('settings.language')}</h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        i18n.language === lang.code
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-secondary'
                      }`}
                    >
                      <span className="font-medium">{lang.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* About */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-3 pt-6 border-t border-border"
              >
                <h3 className="text-lg font-semibold">{t('settings.about')}</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">{t('app.name')}</span>{' '}
                    {t('app.version')}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">{t('settings.developers')}:</span>
                    <br />
                    M Abhinav, V Aditya & K M Rushee Varan
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGithubClick}
                    className="flex items-center gap-2 mt-4 px-3.5 py-1.5 bg-black text-white border border-white/20 rounded-lg hover:bg-white hover:text-black transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm">{t('settings.github')}</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Settings;
