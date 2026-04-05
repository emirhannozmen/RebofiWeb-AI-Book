import { useState, useEffect } from 'react';
import BookForm from './BookForm';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookDetailModal({ book, isOpen, onClose, onUpdate, initialMode = 'view' }) {
  const [mode, setMode] = useState(initialMode);
  const { t } = useLanguage();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen || !book) return null;

  let imageUrl = 'https://via.placeholder.com/300x450';
  if (book.cover_image_url) {
    const cleanPath = book.cover_image_url.replace(/\\/g, '/').replace(/^(\.\/|\/)/, '');
    imageUrl = `${import.meta.env.VITE_API_URL}/${cleanPath}`;
  }

  const handleUpdate = async (data) => {
    // Pass all data including image (bookService now handles FormData)
    await onUpdate(book.book_id, data);
    setMode('view'); // Switch back to view after update
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col font-serif text-white border border-gray-700">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold z-20 bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-colors"
        >
          &times;
        </button>

        <div className="p-8 mt-4">
          {mode === 'view' ? (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img 
                  src={imageUrl} 
                  alt={book.title} 
                  className="w-full h-auto rounded shadow-lg object-cover border border-gray-700" 
                />
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <div className="flex justify-between items-start pr-12">
                  <div>
                    <h2 className="text-3xl font-bold text-white leading-tight">{book.title}</h2>
                    <p className="text-xl text-gray-300 font-semibold mt-1">{book.author}</p>
                  </div>
                  <button
                    onClick={() => setMode('edit')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-sm whitespace-nowrap ml-4"
                  >
                    {t('modal_edit')}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300 border-t border-gray-700 pt-4">
                  <div>
                    <span className="font-bold block text-gray-500">{t('form_publisher')}:</span>
                    {book.publisher || t('modal_na')}
                  </div>
                  <div>
                    <span className="font-bold block text-gray-500">{t('form_pub_year')}:</span>
                    {book.publication_date || t('modal_na')}
                  </div>
                  <div>
                    <span className="font-bold block text-gray-500">{t('form_isbn')}:</span>
                    {book.isbn || t('modal_na')}
                  </div>
                  <div>
                    <span className="font-bold block text-gray-500">{t('form_status')}:</span>
                    <span className="capitalize">{book.reading_status?.replace('_', ' ') || t('modal_na')}</span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg font-bold mb-2 text-white">{t('modal_rating')}</h3>
                  <div className="text-yellow-500 text-2xl">
                    {'★'.repeat(book.personal_rating || 0)}
                    <span className="text-gray-600">{'★'.repeat(5 - (book.personal_rating || 0))}</span>
                  </div>
                </div>

                {book.personal_notes && (
                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-lg font-bold mb-2 text-white">{t('modal_notes')}</h3>
                    <p className="whitespace-pre-wrap text-gray-300">{book.personal_notes}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{t('form_update')}</h2>
                <button 
                  onClick={() => setMode('view')}
                  className="text-gray-400 hover:text-white underline"
                >
                  {t('cancel_btn')}
                </button>
              </div>
              {/* Force re-render of form when book changes by using key */}
              <BookForm 
                key={book.book_id} 
                initialValues={book} 
                onSubmit={handleUpdate} 
                isLoading={false} // Loading state handling could be improved in parent
                submitLabel={t('form_update')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
