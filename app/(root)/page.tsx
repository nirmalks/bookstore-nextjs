import Hero from '@/components/hero';
import BooksGrid from '@/components/shared/books/BooksGrid';
import { getLatestBooks } from '@/lib/actions/book.actions';

export default async function HomePage() {
  const books = await getLatestBooks();
  console.log(books);
  return (
    <>
      <Hero></Hero>
      <BooksGrid books={books}></BooksGrid>
    </>
  );
}
