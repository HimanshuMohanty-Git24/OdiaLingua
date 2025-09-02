import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const usePageTitle = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t('pageTitle');
  }, [i18n.language, t]);
};
