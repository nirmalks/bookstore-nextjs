import { BookWithoutNesting } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
const BooksGrid = ({ books }: { books: BookWithoutNesting[] }): JSX.Element => {
  console.log(books);
  return (
    <div className="pt-24 p-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book: BookWithoutNesting) => {
        const { title, price, images } = book;

        const image = images[0];
        return (
          <Link
            key={book.id}
            href={`/books/${book.slug}`}
            className="card w-full shadow-xl hover:shadow-2xl transition duration-300"
          >
            <figure className="px-4 pt-4">
              <Image
                src={image}
                alt={title}
                width={300}
                height={300}
                className="rounded-xl h-64 md:h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title capitalize tracking-wider">{title}</h2>
              <span className="text-secondary">{price}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default BooksGrid;
