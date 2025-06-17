import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { BookWithoutNesting } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
const BooksCarousel = ({ books }: { books: BookWithoutNesting[] }) => {
  return (
    <Carousel
      className="w-full max-w-sm"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {books &&
          books.map((book: BookWithoutNesting) => {
            const image = book.images[0] || '/default-book-cover.jpg';
            return (
              <CarouselItem
                key={book.id}
                className="md:basis-1/2 lg:basis-full"
              >
                <div className="p-1">
                  <Card>
                    <CardContent className="flex  items-center justify-center p-6">
                      <Image
                        src={image}
                        className="w-full rounded-lg h-[250]"
                        alt={book.title}
                        width={200}
                        height={200}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default BooksCarousel;
