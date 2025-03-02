import { hash } from '@/lib/encrypt';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insert Authors
  const authors = await prisma.$transaction([
    prisma.author.create({
      data: { name: 'Paulo Coelho', bio: 'Brazilian author known for The Alchemist.' },
    }),
    prisma.author.create({
      data: { name: 'J.K. Rowling', bio: 'British author known for Harry Potter series.' },
    }),
    prisma.author.create({
      data: { name: 'George Orwell', bio: 'English novelist known for 1984 and Animal Farm.' },
    }),
    prisma.author.create({
      data: { name: 'Jane Austen', bio: 'English novelist known for Pride and Prejudice.' },
    }),
    prisma.author.create({
      data: { name: 'F. Scott Fitzgerald', bio: 'American novelist known for The Great Gatsby.' },
    }),
  ]);

  // Insert Genres
  const genres = await prisma.$transaction([
    prisma.genre.create({ data: { name: 'Fiction' } }),
    prisma.genre.create({ data: { name: 'Drama' } }),
    prisma.genre.create({ data: { name: 'Fantasy' } }),
    prisma.genre.create({ data: { name: 'Dystopian' } }),
    prisma.genre.create({ data: { name: 'Classic' } }),
  ]);


  // Insert Books
  const books = await prisma.$transaction([
    prisma.book.create({
      data: {
        title: 'The Alchemist',
        slug: 'the-alchemist',
        price: 499.99,
        stock: 10,
        isbn: '978-3-16-148410-0',
        publishedDate: new Date('2024-01-01'),
        images: ['/images/the_alchemist.jpg'],
        description: 'A philosophical novel inspiring readers to follow their dreams.',
        rating: 4.6,
        numReviews: 12,
        banner: null,
        isFeatured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: 'Harry Potter and the Sorcerer’s Stone',
        slug: 'harry-potter-sorcerer-stone',
        price: 899.99,
        stock: 15,
        isbn: '978-0-7475-3269-9',
        publishedDate: new Date('1997-06-26'),
        images: ['/images/harry_potter.jpg'],
        description: 'The first book in J.K. Rowling’s Harry Potter series.',
        rating: 4.6,
        numReviews: 12,
        banner: null,
        isFeatured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: '1984',
        slug: '1984',
        price: 399.99,
        stock: 20,
        isbn: '978-0-452-28423-4',
        publishedDate: new Date('1949-06-08'),
        images: ['/images/1984.jpg'],
        description: 'A dystopian novel by George Orwell.',
        rating: 4.6,
        numReviews: 12,
        banner: null,
        isFeatured: false,
      },
    }),
    prisma.book.create({
      data: {
        title: 'Pride and Prejudice',
        slug: 'pride-and-prejudice',
        price: 299.99,
        stock: 25,
        isbn: '978-0-19-280238-5',
        publishedDate: new Date('1813-01-28'),
        images: ['/images/pride_prejudice.jpg'],
        description: 'A classic novel by Jane Austen.',
        rating: 4.6,
        numReviews: 12,
      },
    }),
    prisma.book.create({
      data: {
        title: 'The Great Gatsby',
        slug: 'the-great-gatsby',
        price: 349.99,
        stock: 30,
        isbn: '978-0-7432-7356-5',
        publishedDate: new Date('1925-04-10'),
        images: ['/images/great_gatsby.jpg'],
        description: 'A novel by F. Scott Fitzgerald set in the Jazz Age.',
        rating: 4.6,
        numReviews: 12,
      },
    }),
  ]);

  // Insert BookAuthor relations
  await prisma.$transaction([
    prisma.bookAuthor.create({ data: { bookId: books[0].id, authorId: authors[0].id } }),
    prisma.bookAuthor.create({ data: { bookId: books[1].id, authorId: authors[1].id } }),
    prisma.bookAuthor.create({ data: { bookId: books[2].id, authorId: authors[2].id } }),
    prisma.bookAuthor.create({ data: { bookId: books[3].id, authorId: authors[3].id } }),
    prisma.bookAuthor.create({ data: { bookId: books[4].id, authorId: authors[4].id } }),
  ]);


  // Insert BookGenre relations
  await prisma.$transaction(
    books.map((book, index) =>
      prisma.bookGenre.create({
        data: {
          bookId: book.id,
          genreId: genres[index].id,
        },
      })
    )
  );

  const users = [
    {
      name: 'John',
      email: 'admin@example.com',
      password: '123456',
      role: UserRole.ADMIN,
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      password: '123456',
      role: UserRole.USER,
    },
  ]
  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await hash(user.password)
    })
    ));

  await prisma.user.createMany({ data: hashedUsers });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
