import api from './api';

const getBooks = () => api.get('/api/books/');
const getBook = (id) => api.get(`/api/books/${id}`);
const createBook = (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      if (typeof data[key] === 'number' && isNaN(data[key])) continue;
      formData.append(key, data[key]);
    }
  }
  // data.image is expected to be a File object
  return api.post('/api/books/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const updateBook = (id, data) => {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      if (typeof data[key] === 'number' && isNaN(data[key])) continue;
      // Handle image specifically if it's a File object
      if (key === 'image' && !(data[key] instanceof File)) continue; 
      
      formData.append(key, data[key]);
    }
  }
  return api.put(`/api/books/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const deleteBook = (id) => api.delete(`/api/books/${id}`);
const createFromRecommendation = (recId) => api.post(`/api/books/from-recommendation/${recId}`);

export default {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  createFromRecommendation,
};
