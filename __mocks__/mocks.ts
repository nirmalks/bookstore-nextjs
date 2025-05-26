import { BookWithoutNesting } from '@/types';

export const mockBook: BookWithoutNesting[] = [{
  title: 'The Great Adventure',
  slug: 'the-great-adventure',
  stock: 12,
  images: [
    '/images/great-adventure-front.jpg',
    '/images/great-adventure-back.jpg',
  ],
  isbn: '978-3-16-148410-0',
  publishedDate: new Date('2023-05-15'),
  price: 499,
  id: 'book-1',
  rating: 4.5,
  numReviews: 124,
  description: 'A thrilling journey across mystical lands and untold secrets.',
  banner: '/images/great-adventure-banner.jpg',
  isFeatured: true,
}];


