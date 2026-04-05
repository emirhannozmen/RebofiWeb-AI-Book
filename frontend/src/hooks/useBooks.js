import { useState, useEffect, useCallback } from 'react';
import bookService from '../services/bookService';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookService.getBooks();
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (data) => {
    setLoading(true);
    try {
      const response = await bookService.createBook(data);
      setBooks([response.data, ...books]);
      return response.data;
    } catch (err) {
      setError('Failed to add book');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id, data) => {
    setLoading(true);
    try {
      const response = await bookService.updateBook(id, data);
      setBooks(books.map(book => book.book_id === id ? response.data : book));
      return response.data;
    } catch (err) {
      setError('Failed to update book');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    try {
      await bookService.deleteBook(id);
      setBooks(books.filter(book => book.book_id !== id));
    } catch (err) {
      setError('Failed to delete book');
      console.error(err);
      throw err; // Re-throw so component can handle if needed
    }
  };

  return { books, loading, error, addBook, updateBook, deleteBook, refreshBooks: fetchBooks };
};
