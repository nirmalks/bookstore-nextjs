import SectionTitle from '../SectionTitle';
import BooksGrid from './BooksGrid';
import { Book } from '@/types';

const FeaturedBooks = ({ books }: { books: Book[] }) => {
  return (
    <div className="pt-24 p-8">
      <SectionTitle text="Featured Books" />
      <BooksGrid books={books} />
    </div>
  );
};

export default FeaturedBooks;
