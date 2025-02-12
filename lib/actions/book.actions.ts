import { prisma } from "@/db/prisma";
import { NUM_OF_FEATURED_BOOKS } from "../constants";

export async function getLatestBooks() {
  const data = await prisma.book.findMany({
    take: NUM_OF_FEATURED_BOOKS,
    orderBy: { publishedDate: 'desc' }
  });
  return data.map(book => ({
    ...book,
    price: Number(book.price),
    rating: Number(book.rating),
    id: book.id,
    authors: [],
    genres: []
  }));
}

export async function getBookBySlug(slug: string) {
  const book = await prisma.book.findFirst({
    where: { slug },
    include: {
      authors: {
        select: {
          author: {
            select: {
              id: true,
              name: true,
              bio: true
            }
          }
        }
      },
      genres: {
        select: {
          genre: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
  if (!book) return null;
  return {
    ...book,
    authors: book.authors.map(a => a.author),
    genres: book.genres.map(g => g.genre)
  };
}
