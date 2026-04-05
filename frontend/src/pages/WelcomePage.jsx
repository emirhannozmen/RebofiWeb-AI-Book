import React from 'react';
import logo from '../assets/logo.png'; // Import the logo
import { useLanguage } from '../contexts/LanguageContext';

export default function WelcomePage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-br from-[#212529] via-[#343a40] to-[#6c757d] rounded-xl shadow-2xl border border-gray-700">
      <img src={logo} alt="RebofiWeb Logo" className="h-48 w-48 mb-12 object-contain drop-shadow-2xl" />
      <h1 className="text-6xl font-bold text-white text-center animate-pulse">
        {t('welcome_title')}
      </h1>
      <p className="mt-4 text-xl text-gray-200">{t('welcome_subtitle')}</p>
    </div>
  );
}
