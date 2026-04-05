import { useLanguage } from '../../contexts/LanguageContext';

export default function RecommendationCard({ recommendation, onAccept, onDelete }) {
  const { t } = useLanguage();
  return (
    <div className="bg-gray-800 rounded shadow p-4 border border-gray-700 h-full flex flex-col font-serif">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-lg font-bold text-white">{recommendation.recommended_title}</h3>
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(recommendation.recommendation_id); }}
            className="text-gray-500 hover:text-red-500 transition-colors"
            title={t('rec_delete_btn')}
          >
            &times;
          </button>
        )}
      </div>
      <p className="text-gray-400 mb-3">{t('rec_by')} {recommendation.recommended_author}</p>
      <div className="bg-gray-700 p-3 rounded mb-4 text-sm flex-grow border border-gray-600">
        <p className="font-semibold mb-1 text-gray-300">{t('rec_why')}</p>
        <p className="text-gray-200">{recommendation.recommendation_reason}</p>
      </div>
      <div className="mt-auto">
        {!recommendation.is_accepted && onAccept && (
          <button 
            onClick={() => onAccept(recommendation.recommendation_id)}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          >
            {t('rec_accept_btn')}
          </button>
        )}
        {recommendation.is_accepted && (
          <div className="text-center text-green-400 font-semibold py-2">
            {t('rec_accepted')}
          </div>
        )}
      </div>
    </div>
  );
}
