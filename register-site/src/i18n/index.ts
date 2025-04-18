import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './lang/en';
import vi from './lang/vi';

const lng: string | any = localStorage.getItem('i18nextLng');
if (lng === null) {
    localStorage.setItem('i18nextLng', 'it');
};

i18n.use(LanguageDetector).use(initReactI18next).init({
    detection: {
        lookupQuerystring: 'lang',
        htmlTag: document.documentElement,
        order: ['localStorage'],
    },
    fallbackLng: 'vi',
    interpolation: {
        escapeValue: false,
    },
    ns: ['common'],
    defaultNS: 'common',
    resources: {
        en,
        vi,
    }
});

i18n.changeLanguage(lng);

export default i18n;
