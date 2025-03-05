import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { BookWithoutNesting } from '@/types';
import Rating from '../Rating';

const BookCard = ({ book }: { book: BookWithoutNesting }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${book.slug}`}>
          <Image
            src={book.images[0]}
            alt={book.title}
            height={300}
            width={300}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <Link href={`/product/${book.slug}`}>
          <h2 className="text-sm font-medium">{book.title}</h2>
        </Link>
        <div className="flex-between gap-4">
          <Rating value={Number(book.rating)} />
          {book.stock > 0 ? (
            Number(book.price)
          ) : (
            <p className="text-destructive">Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
