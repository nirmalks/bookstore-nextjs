import Hero from '@/components/hero';
import FeaturedBooks from '@/components/shared/books/FeaturedBooks';
import { getLatestBooks } from '@/lib/actions/book.actions';

export default async function HomePage() {
  const books = await getLatestBooks();
  return (
    <>
      <Hero></Hero>
      <FeaturedBooks books={books}></FeaturedBooks>
    </>
  );
}
