import ImagesDisplay from '@/components/shared/ImagesDisplay';
import PriceDisplay from '@/components/shared/PriceDisplay';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getBookBySlug } from '@/lib/actions/book.actions';

import { notFound } from 'next/navigation';

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const book = await getBookBySlug(slug);
  const genres = book?.genres.map((book) => book.name);
  const authors = book?.authors.map((book) => book.name);

  if (!book) notFound();
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ImagesDisplay images={[book.imagePath!]} />
          </div>
          <div className="col-span-2">
            <div className="flex flex-col gap-6">
              <p>
                {authors} | {genres}
              </p>
              <h1 className="h3-bold">{book.title}</h1>
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
              <CardContent className="p-4">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;
