import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const { language, toggleLanguage, t } = useLanguage();

  if (!user) return null;

  return (
    <nav className="text-white p-4 shadow-md" style={{ backgroundColor: '#1a1d20' }}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/welcome" className="text-xl font-bold flex items-center gap-2">
          <img src={logo} alt="RebofiWeb Logo" className="h-8 w-8 object-contain" />
          RebofiWeb
        </Link>
        <div className="flex space-x-4 items-center">
          <div className="flex bg-gray-700 rounded p-1 mr-2">
            <button 
              onClick={() => toggleLanguage('tr')}
              className={`px-2 py-1 text-xs rounded transition-colors ${language === 'tr' ? 'bg-blue-600 text-white font-bold' : 'text-gray-300 hover:text-white'}`}
            >
              TR
            </button>
            <button 
              onClick={() => toggleLanguage('en')}
              className={`px-2 py-1 text-xs rounded transition-colors ${language === 'en' ? 'bg-blue-600 text-white font-bold' : 'text-gray-300 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          <Link to="/books" className="hover:text-gray-300">{t('nav_my_books')}</Link>
          <Link to="/recommendations/generate" className="hover:text-gray-300">{t('nav_get_recs')}</Link>
          <Link to="/recommendations" className="hover:text-gray-300">{t('nav_recs')}</Link>
          <div className="border-l border-gray-600 h-6 mx-2"></div>
          <span className="text-sm text-gray-400">{t('nav_hello')}, {user.name}</span>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm">{t('nav_logout')}</button>
        </div>
      </div>
    </nav>
  );
}
