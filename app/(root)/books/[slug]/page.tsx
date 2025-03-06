import AddToCart from '@/components/shared/books/add-to-cart';
import ImagesDisplay from '@/components/shared/ImagesDisplay';
import PriceDisplay from '@/components/shared/PriceDisplay';
import Rating from '@/components/shared/Rating';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getBookBySlug } from '@/lib/actions/book.actions';
import { getMyCart } from '@/lib/actions/cart.actions';

import { notFound } from 'next/navigation';
import ReviewList from './review-list';
import { auth } from '@/auth';

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const book = await getBookBySlug(slug);
  const genres = book?.genres.map((book) => book.name);
  const authors = book?.authors.map((book) => book.name);
  if (!book) notFound();
  const session = await auth();
  const userId = session?.user?.id;
  const cart = await getMyCart();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ImagesDisplay images={book.images} />
          </div>
          <div className="col-span-2">
            <div className="flex flex-col gap-6">
              <p>
                {authors} | {genres}
              </p>
              <h1 className="h3-bold">{book.title}</h1>
              <Rating value={Number(book.rating)} />
              <p>{book.numReviews} reviews</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <PriceDisplay
                  value={Number(book.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{book.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <PriceDisplay value={Number(book.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {book.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out Of Stock</Badge>
                  )}
                </div>

                {book.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      cartItem={{
                        bookId: book.id,
                        name: book.title,
                        slug: book.slug,
                        price: Number(book.price),
                        quantity: 1,
                        image: book.images![0],
                      }}
                    ></AddToCart>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold mb-5">Customer Reviews</h2>
        <ReviewList
          userId={userId || ''}
          bookId={book.id}
          bookSlug={book.slug}
        />
      </section>
    </>
  );
};

export default ProductDetailsPage;
