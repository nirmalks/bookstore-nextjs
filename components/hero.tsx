'use client';

import Link from 'next/link';

import BooksCarousel from './shared/books/books-carousel';
import { BookWithoutNesting } from '@/types';
import { Button } from './ui/button';

const Hero = ({ books }: { books: BookWithoutNesting[] }) => {
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
          <Link href="/search" className="btn btn-primary">
            <Button>Visit our Full Collection</Button>
          </Link>
        </div>
      </div>
      <div className="md:ml-12 carousel max-w-full ">
        <BooksCarousel books={books}></BooksCarousel>
      </div>
    </section>
  );
};

export default Hero;
