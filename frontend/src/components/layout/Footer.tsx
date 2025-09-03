import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdiaLinguaLogo } from '../OdiaLinguaLogo';

export const Footer = () => {
  const { t } = useTranslation(['footer', 'common']);
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
          <div className="text-center md:text-left">
            <OdiaLinguaLogo />
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {t('tagline')}
            </p>
          </div>

          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => navigate('/contact')}
              className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('common:contact', { ns: 'common' })}
            </button>
            <a
              href="https://github.com/HimanshuMohanty-Git24"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('common:github', { ns: 'common' })}
            </a>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/50 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('common:madeWith', { ns: 'common' })}{' '}
            <a
              href="https://github.com/HimanshuMohanty-Git24"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Himanshu Mohanty
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
