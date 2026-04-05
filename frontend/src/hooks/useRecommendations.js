import { useState, useCallback } from 'react';
import recommendationService from '../services/recommendationService';
import bookService from '../services/bookService';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async (isAccepted) => {
    setLoading(true);
    try {
      const response = await recommendationService.getRecommendations(isAccepted);
      setRecommendations(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptRecommendation = async (id) => {
    try {
      await recommendationService.acceptRecommendation(id);
      setRecommendations(prev => prev.map(rec => 
        rec.recommendation_id === id ? { ...rec, is_accepted: true } : rec
      ));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const moveToLibrary = async (id) => {
      try {
          await bookService.createFromRecommendation(id);
          // Maybe mark as read or something?
          // Or remove from list?
      } catch (err) {
          console.error(err);
          throw err;
      }
  };

  return { recommendations, loading, error, fetchRecommendations, acceptRecommendation, moveToLibrary };
};
