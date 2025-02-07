'use client';
import prob from '../public/images/prob.jpg';
import Image from 'next/image';
import harry from '../public/images/harry_potter.jpg';
import alchemist from '../public/images/the_alchemist.jpg';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './ui/carousel';

export const Hero = () => {
  const data = [
    { image: prob, alt: 'probablility' },
    { image: harry, alt: 'harry potters' },
    { image: alchemist, alt: 'al chemist' },
  ];
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 mx-4 gap-4">
      <div className="place-items-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          We love Books
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore
          repellat explicabo enim soluta temporibus asperiores aut obcaecati
          perferendis porro nobis.
        </p>
        <div className="mt-10">
          <Link href="/books" className="btn btn-primary">
            Visit our Full Collection
          </Link>
        </div>
      </div>
      <div className="md:ml-12 carousel max-w-full ">
        <Carousel className="w-full max-w-sm">
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-full">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex  items-center justify-center p-6">
                      <Image
                        src={data[index].image}
                        className="w-full rounded-lg h-[250]"
                        alt={data[index].alt}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Hero;
