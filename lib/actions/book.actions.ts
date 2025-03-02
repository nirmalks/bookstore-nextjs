'use server';

import { prisma } from "@/db/prisma";
import { NUM_OF_FEATURED_BOOKS, PAGE_SIZE } from "../constants";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { insertBookSchema, updateBookSchema } from "../validators";
import { z } from "zod";

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

export async function getBookById(id: string) {
  const data = await prisma.book.findFirst({
    where: { id: id },
  });

  return convertToPlainObject(data);
}

export async function getAllBooks({
  query,
  limit = PAGE_SIZE,
  page,
  genre,
}: {
  query: string;
  limit?: number;
  page: number;
  genre?: string;
}) {
  const data = await prisma.book.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: { genres: { include: { genre: true } } }
  });

  const dataCount = await prisma.book.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
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
    console.log("Authors Connect:", book.authors.map((a) => ({ id: a.author.id })));
    console.log("Genres Connect:", book.genres.map((g) => ({ id: g.genre.id })));
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
      data: book,
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