import 'tailwindcss';
import { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useLanguage } from '../contexts/LanguageContext';
import BookGrid from '../components/books/BookGrid';
import BookForm from '../components/books/BookForm';
import BookDetailModal from '../components/books/BookDetailModal';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function MyBooksPage() {
  const { books, loading, error, addBook, updateBook, deleteBook } = useBooks();
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');

  // Confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const filteredBooks = books ? books.filter(book => {
    const matchesStatus = filterStatus === 'all' || book.reading_status === filterStatus;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) : [];

  const handleAddBook = async (data) => {
    await addBook(data);
    setShowAddForm(false);
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleUpdateBook = async (id, data) => {
    const updated = await updateBook(id, data);
    setSelectedBook(updated);
  };

  const onRequestDelete = (id) => {
    setBookToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      await deleteBook(bookToDelete);
      setDeleteConfirmOpen(false);
      setBookToDelete(null);
    }
  };

  if (loading && !books) return <div className="p-8 text-white">{t('loading_books')}</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{t('library_title')}</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? t('cancel_btn') : t('add_book_btn')}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 max-w-2xl mx-auto">
           <h2 className="text-xl font-semibold mb-4 text-white">{t('add_new_book_title')}</h2>
           <BookForm onSubmit={handleAddBook} isLoading={loading} submitLabel={t('form_save')} />
        </div>
      )}

      <div className="flex gap-4 mb-6 flex-wrap">
        <input 
          type="text" 
          placeholder={t('search_placeholder')}
          className="bg-gray-800 text-white border border-gray-700 p-2 rounded flex-grow min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">{t('status_all')}</option>
          <option value="want_to_read">{t('status_want')}</option>
          <option value="reading">{t('status_reading')}</option>
          <option value="completed">{t('status_completed')}</option>
        </select>
      </div>

      <BookGrid 
        books={filteredBooks} 
        onDelete={onRequestDelete}
        onView={handleViewBook}
        onEdit={handleEditBook}
      />

      <BookDetailModal
        book={selectedBook}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={handleUpdateBook}
        initialMode={modalMode}
      />

      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message={t('delete_book_confirm')}
      />
    </div>
  );
}
