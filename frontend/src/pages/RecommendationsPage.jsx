import { useState, useEffect } from 'react';
import recommendationService from '../services/recommendationService';
import RecommendationList from '../components/recommendations/RecommendationList';
import { useLanguage } from '../contexts/LanguageContext';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('accepted');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recToDelete, setRecToDelete] = useState(null);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        const isAccepted = activeTab === 'accepted' ? true : null;
        
        const response = await recommendationService.getRecommendations(isAccepted);
        setRecommendations(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [activeTab]);

  const handleAccept = async (id) => {
    try {
      await recommendationService.acceptRecommendation(id);
      // Refresh list or update local
      setRecommendations(recommendations.map(rec => 
        rec.recommendation_id === id ? { ...rec, is_accepted: true } : rec
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const onRequestDelete = (id) => {
    setRecToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (recToDelete) {
      try {
        await recommendationService.deleteRecommendation(recToDelete);
        setRecommendations(recommendations.filter(rec => rec.recommendation_id !== recToDelete));
      } catch (err) {
        console.error(err);
        setError('Failed to delete recommendation');
      } finally {
        setDeleteConfirmOpen(false);
        setRecToDelete(null);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">{t('recs_title')}</h1>
      
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`py-2 px-4 transition-colors ${activeTab === 'accepted' ? 'border-b-2 border-blue-500 font-bold text-white' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('accepted')}
        >
          {t('tab_accepted')}
        </button>
        <button
          className={`py-2 px-4 transition-colors ${activeTab === 'all' ? 'border-b-2 border-blue-500 font-bold text-white' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('all')}
        >
          {t('tab_all')}
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-white">{t('loading_books')}</div>
      ) : error ? (
        <div className="p-8 text-red-500">{error}</div>
      ) : (
        <RecommendationList 
          recommendations={recommendations} 
          onAccept={handleAccept} 
          onDelete={onRequestDelete}
        />
      )}

      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message={t('delete_rec_confirm')}
      />
    </div>
  );
}
