import Hero from '@/components/hero';
import FeaturedBooks from '@/components/shared/books/FeaturedBooks';
import { getFeaturedBooks } from '@/lib/actions/book.actions';

export default async function HomePage() {
  const books = await getFeaturedBooks();
  console.log(books);
  return (
    <>
      <Hero books={books}></Hero>
      <FeaturedBooks books={books}></FeaturedBooks>
    </>
  );
}
