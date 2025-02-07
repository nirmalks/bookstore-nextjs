import Hero from '@/components/hero';
import BooksList from '@/components/shared/books/BooksList';
import { getLatestBooks } from '@/lib/actions/book.actions';

export default async function HomePage() {
  const books = await getLatestBooks();
  console.log(books);
  return (
    <>
      <Hero></Hero>
      <BooksList books={books}></BooksList>
    </>
  );
}
