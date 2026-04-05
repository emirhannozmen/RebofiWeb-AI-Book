import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function LandingPage() {
  const { t, language, toggleLanguage } = useLanguage();
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen text-center text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-700 via-gray-900 to-black">
      </div>
      
      {/* Language Buttons */}
      <div className="absolute top-6 right-6 flex space-x-2">
         <button 
          onClick={() => toggleLanguage('tr')}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${language === 'tr' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          TR
        </button>
        <button 
          onClick={() => toggleLanguage('en')}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          EN
        </button>
      </div>

      <h1 className="text-5xl font-bold mb-6">{t('landing_title')}</h1>
      <p className="text-2xl mb-10 max-w-2xl mx-auto px-4">{t('landing_subtitle')}</p>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition duration-300 shadow-lg">
          {t('landing_login')}
        </Link>
        <Link to="/register" className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300 shadow-lg">
          {t('landing_register')}
        </Link>
      </div>
    </div>
  );
}
