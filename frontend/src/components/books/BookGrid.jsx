import BookCard from './BookCard';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookGrid({ books, onDelete, onView, onEdit }) {
  const { t } = useLanguage();

  if (!books || books.length === 0) {
    return <div className="text-center py-10 text-gray-400">{t('no_books')}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard 
          key={book.book_id} 
          book={book} 
          onDelete={onDelete} 
          onView={onView}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
