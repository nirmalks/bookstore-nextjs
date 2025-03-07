import { BookWithoutNesting } from '@/types';
import { JSX } from 'react';
import BookCard from './book-card';
const BooksGrid = ({ books }: { books: BookWithoutNesting[] }): JSX.Element => {
  return (
    <div className="pt-24 p-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book: BookWithoutNesting) => {
        return <BookCard book={book} key={book.id}></BookCard>;
      })}
    </div>
  );
};

export default BooksGrid;
