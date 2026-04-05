import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookCard({ book, onDelete, onView, onEdit }) {
  const { t } = useLanguage();
  let imageUrl = 'https://via.placeholder.com/150';
  if (book.cover_image_url) {
    // Normalize backslashes to forward slashes and remove leading ./ or /
    const cleanPath = book.cover_image_url.replace(/\\/g, '/').replace(/^(\.\/|\/)/, '');
    const apiUrl = import.meta.env.VITE_API_URL === '/' ? '' : import.meta.env.VITE_API_URL;
    imageUrl = `${apiUrl}/${cleanPath}`;
  }

  const statusColors = {
    want_to_read: '#ffd966',
    reading: '#93c47d',
    completed: '#6fa8dc',
  };

  const backgroundColor = statusColors[book.reading_status] || '#ffffff';

  return (
    <div 
      className="rounded shadow p-4 flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow font-serif" 
      style={{ backgroundColor }}
      onClick={() => onView && onView(book)}
    >
      <img 
        src={imageUrl} 
        alt={book.title} 
        className="h-48 w-full object-cover mb-4 rounded bg-gray-200" 
      />
      <h3 className="text-lg font-bold mb-1 truncate text-black" title={book.title}>{book.title}</h3>
      <p className="text-black text-sm truncate" title={book.author}>{book.author}</p>
      {(book.publisher || book.publication_date) && (
        <p className="text-black text-xs truncate">
          {book.publisher} {book.publisher && book.publication_date && '•'} {book.publication_date}
        </p>
      )}
      {book.isbn && <p className="text-black text-xs mb-2 truncate">ISBN: {book.isbn}</p>}
      <div className="mt-auto flex justify-between items-center pt-2 border-t border-black/20 gap-2">
        <span className="text-yellow-600">{'★'.repeat(book.personal_rating || 0)}</span>
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(book); }} 
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors shadow-sm"
          >
            {t('card_update')}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(book.book_id); }} 
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors shadow-sm"
          >
            {t('card_delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
