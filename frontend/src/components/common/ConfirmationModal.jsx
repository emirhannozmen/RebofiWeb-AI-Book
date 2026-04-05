import { useLanguage } from '../../contexts/LanguageContext';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-gray-700 p-6 font-serif text-white">
        <h3 className="text-xl font-bold mb-4 text-white">{title || t('confirm_title')}</h3>
        <p className="text-gray-300 mb-6">{message || t('confirm_message')}</p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white transition-colors"
          >
            {t('cancel_btn')}
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm"
          >
            {t('confirm_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}
