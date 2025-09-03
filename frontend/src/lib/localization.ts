// This file will contain the localization utility functions.

const odiaDigits = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];

const toOdiaDigits = (num: number | string): string => {
  const enDigits = '0123456789';
  return String(num).split('').map(digit => {
    const index = enDigits.indexOf(digit);
    return index !== -1 ? odiaDigits[index] : digit;
  }).join('');
};

interface LocalizeNumberOptions {
  locale: 'en' | 'or';
  style?: 'unit' | 'raw';
}

export const localizeNumber = (value: number, options: LocalizeNumberOptions): string => {
  const { locale, style = 'raw' } = options;

  if (locale === 'en') {
    if (style === 'unit') {
        if (value >= 10000000) {
            return `${(value / 10000000).toFixed(1).replace(/\.0$/, '')} Crore`;
        }
        if (value >= 100000) {
            return `${(value / 100000).toFixed(1).replace(/\.0$/, '')} Lakh`;
        }
        if (value >= 1000) {
            return `${(value / 1000)}K`;
        }
    }
    return value.toLocaleString('en-IN');
  }

  // Handle Odia localization
  if (style === 'unit') {
    if (value >= 10000000) {
      const croreValue = value / 10000000;
      return `${toOdiaDigits(croreValue.toFixed(1).replace(/\.0$/, ''))} କୋଟି`;
    }
    if (value >= 100000) {
      const lakhValue = value / 100000;
      return `${toOdiaDigits(lakhValue.toFixed(1).replace(/\.0$/, ''))} ଲକ୍ଷ`;
    }
    if (value >= 1000) {
      const thousandValue = value / 1000;
      return `${toOdiaDigits(thousandValue.toFixed(1).replace(/\.0$/, ''))} ହଜାର`;
    }
  }

  return toOdiaDigits(value);
};
