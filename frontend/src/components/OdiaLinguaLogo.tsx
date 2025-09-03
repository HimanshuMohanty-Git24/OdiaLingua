import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface OdiaLinguaLogoProps {
  className?: string;
}

export const OdiaLinguaLogo = ({ className }: OdiaLinguaLogoProps) => {
  const { t } = useTranslation('common');

  return (
    <Link to="/" className={cn("flex items-center gap-2 group", className)}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="font-display text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300"
      >
        {t('logo')}
      </motion.div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
};
