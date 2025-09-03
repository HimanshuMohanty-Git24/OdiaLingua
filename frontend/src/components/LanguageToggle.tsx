import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LanguageToggle = () => {
  const { t, i18n } = useTranslation(['common', 'languageToggle']);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'or' : 'en';
    i18n.changeLanguage(newLang);
  };

  const currentLanguage = i18n.language === 'en' ? 'odia' : 'english';
  const buttonText = t(currentLanguage, { ns: 'languageToggle' });

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={t('label', { ns: 'languageToggle' })}
    >
      <Languages className="h-4 w-4" />
      <div className="relative ml-2 w-14 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={i18n.language}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {buttonText}
          </motion.span>
        </AnimatePresence>
      </div>
    </Button>
  );
};
