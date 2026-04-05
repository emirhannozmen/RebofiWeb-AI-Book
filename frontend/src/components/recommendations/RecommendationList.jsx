import RecommendationCard from './RecommendationCard';
import { useLanguage } from '../../contexts/LanguageContext';

export default function RecommendationList({ recommendations, onAccept, onDelete }) {
  const { t } = useLanguage();

  if (!recommendations || recommendations.length === 0) {
    return <div className="text-center py-10 text-gray-400">{t('no_recs')}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map(rec => (
        <RecommendationCard 
          key={rec.recommendation_id} 
          recommendation={rec} 
          onAccept={onAccept} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
