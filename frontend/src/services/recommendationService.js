import api from './api';

const generateRecommendations = (bookId, language = 'tr') => {
  return api.post('/api/recommendations/generate', {
    reference_book_id: bookId,
    language: language 
  });
};

const getRecommendations = (is_accepted = null) => {
  const params = {};
  if (is_accepted !== null) params.is_accepted = is_accepted;
  return api.get('/api/recommendations/', { params });
};

const acceptRecommendation = (id) => {
  return api.put(`/api/recommendations/${id}/accept`);
};

const deleteRecommendation = (id) => {
  return api.delete(`/api/recommendations/${id}`);
};

export default {
  generateRecommendations,
  getRecommendations,
  acceptRecommendation,
  deleteRecommendation
};
