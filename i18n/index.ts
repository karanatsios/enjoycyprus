import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';
import el from './locales/el.json';
import tr from './locales/tr.json';
import pl from './locales/pl.json';
import ru from './locales/ru.json';
import ro from './locales/ro.json';

export const LANGUAGES = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'el', label: 'Ελληνικά', flag: '🇨🇾' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
];

i18n
  .use(initReactI18next)
  .init({
    resources: { de: { translation: de }, en: { translation: en }, el: { translation: el }, tr: { translation: tr }, pl: { translation: pl }, ru: { translation: ru }, ro: { translation: ro } },
    lng: 'de',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
