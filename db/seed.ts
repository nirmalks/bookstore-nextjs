import { hash } from '@/lib/encrypt';
import { PrismaClient, UserRole } from '@prisma/client';
import booksData from './sample-data';
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
  const books = await prisma.$transaction(
    booksData.map((book) => prisma.book.create({ data: book }))
  );

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