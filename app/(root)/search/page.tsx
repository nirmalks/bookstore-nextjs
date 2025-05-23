import BookCard from '@/components/shared/books/book-card';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { getAllBooks, getAllGenres } from '@/lib/actions/book.actions';

import Link from 'next/link';

const prices = [
  {
    name: '₹1 to ₹50',
    value: '1-50',
  },
  {
    name: '₹51 to ₹100',
    value: '51-100',
  },
  {
    name: '₹101 to ₹200',
    value: '101-200',
  },
  {
    name: '₹201 to ₹500',
    value: '201-500',
  },
  {
    name: '₹501 to ₹1000',
    value: '501-1000',
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ['newest', 'price-lowest', 'price-highest', 'rating'];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    genre: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = 'all',
    genre = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isGenreSet = genre && genre !== 'all' && genre.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isGenreSet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ''}
      ${isGenreSet ? `: Genre ${genre}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}`,
    };
  } else {
    return {
      title: 'Search Books',
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    genre?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = 'all',
    genre = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await props.searchParams;

  const getFilterUrl = ({
    g,
    p,
    s,
    r,
    pg,
  }: {
    g?: string;
    p?: string;
    s?: string;
    r?: string;
    pg?: string;
  }) => {
    const params: Record<string, string> = {
      q: q ?? 'all',
      g: genre ?? 'all',
      price: price ?? 'all',
      rating: rating ?? 'all',
      sort: sort ?? 'newest',
      page: page ?? '1',
    };

    if (g) params.genre = g;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const { books, totalPages } = await getAllBooks({
    query: q,
    genre: genre,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const genres = await getAllGenres();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        <div className="text-xl mb-2 mt-3">Genre</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (genre === 'all' || genre === '') && 'font-bold'
                }`}
                href={getFilterUrl({ g: 'all' })}
              >
                Any
              </Link>
            </li>
            {genres.map((g) => (
              <li key={g.name}>
                <Link
                  className={`${genre === g.name && 'font-bold'}`}
                  href={getFilterUrl({ g: g.name })}
                >
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Links */}
        <div className="text-xl mb-2 mt-8">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === 'all' && 'font-bold'}`}
                href={getFilterUrl({ p: 'all' })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`${price === p.value && 'font-bold'}`}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Rating Links */}
        <div className="text-xl mb-2 mt-8">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === 'all' && 'font-bold'}`}
                href={getFilterUrl({ r: 'all' })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`${rating === r.toString() && 'font-bold'}`}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  {`${r} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== 'all' && q !== '' && 'Query: ' + q}
            {genre !== 'all' && genre !== '' && 'Genre: ' + genre}
            {price !== 'all' && ' Price: ' + price}
            {rating !== 'all' && ' Rating: ' + rating + ' stars & up'}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            (genre !== 'all' && genre !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Button variant={'link'} asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort == s && 'font-bold'}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {books.length === 0 && <div>No books found</div>}
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <Pagination page={Number(page) || 1} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default SearchPage;
