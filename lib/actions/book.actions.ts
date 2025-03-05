'use server';

import { prisma } from "@/db/prisma";
import { NUM_OF_FEATURED_BOOKS, PAGE_SIZE } from "../constants";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { insertBookSchema, updateBookSchema } from "../validators";
import { z } from "zod";
import { Book } from "@/types";
import { Prisma } from "@prisma/client";

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

export async function getAllGenres() {
  return await prisma.genre.findMany({})
}

export async function getBookById(id: string): Promise<Book | null> {
  const data = await prisma.book.findFirst({
    where: { id: id },
    include: {
      authors: {
        include: { author: true },
      },
      genres: {
        include: { genre: true },
      },
    },
  });

  if (!data) throw new Error('Book not found')
  return {
    ...convertToPlainObject(data),
    price: Number(data.price),
    rating: Number(data.rating),
    description: data.description ?? "",
  };

}

export async function getAllBooks({
  query,
  limit = PAGE_SIZE,
  page,
  genre,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  genre?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const queryFilter: Prisma.BookWhereInput =
    query && query !== 'all' ? {
      title: {
        contains: query,
        mode: 'insensitive'
      } as Prisma.StringFilter
    } : {}

  const genreFilter: Prisma.BookWhereInput =
    genre && genre !== 'all' ? {
      genres: {
        some: {
          genre: {
            name: {
              contains: genre,
              mode: 'insensitive'
            }
          }
        }
      }
    } : {}

  const priceFilter: Prisma.BookWhereInput =
    price && price !== 'all'
      ? {
        price: {
          gte: Number(price.split('-')[0]),
          lte: Number(price.split('-')[1]),
        },
      }
      : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
        rating: {
          gte: Number(rating),
        },
      }
      : {};
  const data = await prisma.book.findMany({
    where: {
      ...queryFilter,
      ...genreFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
          ? { price: 'desc' }
          : sort === 'rating'
            ? { rating: 'desc' }
            : { rating: 'asc' },
    skip: (page - 1) * limit,
    take: limit,
    include: { genres: { include: { genre: true } } }
  });
  const dataCount = await prisma.book.count();

  return data?.map((book) => ({
    ...convertToPlainObject(book),
    price: Number(book.price),
    rating: Number(book.rating),
    description: book.description ?? "",
    totalPages: Math.ceil(dataCount / limit),
  })) ?? [];
}

export async function deleteBook(id: string) {
  try {
    const book = prisma.book.findFirst({
      where: { id }
    })
    if (!book) throw new Error('Book not found');

    await prisma.book.delete({ where: { id } })
    revalidatePath('/admin/books');
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createBook(data: z.infer<typeof insertBookSchema>) {
  try {
    const book = insertBookSchema.parse(data);
    await prisma.book.create({
      data: {
        ...book,
        authors: {
          create: book.authors.map((a) => ({
            author: { connect: { id: a.author.id } },
          })),
        },
        genres: {
          create: book.genres.map((g) => ({
            genre: { connect: { id: g.genre.id } },
          })),
        },
      }
    });

    revalidatePath('/admin/books');

    return {
      success: true,
      message: 'Book created successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateBook(data: z.infer<typeof updateBookSchema>) {
  try {
    const book = updateBookSchema.parse(data);
    const bookExists = await prisma.book.findFirst({
      where: { id: book.id },
    });

    if (!bookExists) throw new Error('Book not found');
    await prisma.book.update({
      where: { id: book.id },
      data: {
        ...book,
        authors: {
          connect: book.authors?.map((author) => ({
            bookId_authorId: { bookId: book.id, authorId: author.author.id },
          })) ?? [],
        },
        genres: {
          connect: book.genres?.map((genre) => ({
            bookId_genreId: { bookId: book.id, genreId: genre.genre.id },
          })) ?? [],
        },
      },
    });

    revalidatePath('/admin/books');

    return {
      success: true,
      message: 'Book updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllGenresWithCount() {
  const genres = await prisma.bookGenre.groupBy(
    {
      by: ['genreId'],
      _count: true
    }
  )

  return await Promise.all(
    genres.map(async (g) => {
      const genre = await prisma.genre.findUnique({
        where: { id: g.genreId },
        select: { name: true }
      });

      return {
        genre: genre?.name || 'Unknown',
        count: g._count
      };
    })
  );
}

export async function getFeaturedBooks() {
  const books = await prisma.book.findMany({
    where: { isFeatured: true },
    take: 4
  })

  return books.map((book) => ({
    ...convertToPlainObject(book),
    price: Number(book.price),
    rating: Number(book.rating),
    description: book.description ?? "",
  }));
}