import { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useLanguage } from '../contexts/LanguageContext';
import recommendationService from '../services/recommendationService';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function GetRecommendationsPage() {
  const { books, loading: booksLoading } = useBooks();
  const { language, t } = useLanguage();
  const [selectedBookId, setSelectedBookId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recToDelete, setRecToDelete] = useState(null);

  const handleGenerate = async () => {
    if (!selectedBookId) return;
    setLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      const response = await recommendationService.generateRecommendations(selectedBookId, language);
      setRecommendations(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await recommendationService.acceptRecommendation(id);
      // Update local state to show as accepted
      setRecommendations(recommendations.map(rec => 
        rec.recommendation_id === id ? { ...rec, is_accepted: true } : rec
      ));
      // Optionally navigate or show toast
      // navigate('/recommendations'); 
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
        // Don't show error to user for this flow as it might be transient
      } finally {
        setDeleteConfirmOpen(false);
        setRecToDelete(null);
      }
    }
  };

  if (booksLoading && books.length === 0) return <div className="p-8 text-white">{t('loading_books')}</div>;

  return (
    <div className="max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">{t('get_recs_title')}</h1>
      
      <div className="bg-gray-800 p-6 rounded shadow mb-8 border border-gray-700">
        <label className="block mb-2 font-medium text-gray-300">{t('select_book_label')}</label>
        <div className="flex gap-4 flex-col sm:flex-row">
          <select 
            className="flex-grow bg-gray-700 border border-gray-600 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
          >
            <option value="">{t('select_default')}</option>
            {books.map(book => (
              <option key={book.book_id} value={book.book_id}>{book.title} by {book.author}</option>
            ))}
          </select>
          <button 
            onClick={handleGenerate}
            disabled={!selectedBookId || loading}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:bg-purple-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('generating_btn') : t('generate_btn')}
          </button>
        </div>
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">{t('loading_ai')}</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('found_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map(rec => (
              <RecommendationCard 
                key={rec.recommendation_id} 
                recommendation={rec} 
                onAccept={handleAccept} 
                onDelete={onRequestDelete}
              />
            ))}
          </div>
        </div>
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
