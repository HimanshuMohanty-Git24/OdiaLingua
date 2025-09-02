import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'or' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      <motion.div
        key={i18n.language}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Languages className="h-4 w-4" />
      </motion.div>
      <span className="ml-2">{i18n.language === 'en' ? 'Odia' : 'English'}</span>
    </Button>
  );
};
