'use server';

import { prisma } from "@/db/prisma";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { z } from "zod";
import { insertAuthorSchema, updateAuthorSchema } from "../validators";

export async function getAllAuthors({
  query,
  limit = PAGE_SIZE,
  page,
}: {
  query: string;
  limit?: number;
  page: number;
}) {
  const data = await prisma.author.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.author.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteAuthor(id: string) {
  try {
    const author = prisma.book.findFirst({
      where: { id }
    })
    if (!author) throw new Error('Author not found');

    await prisma.author.delete({ where: { id } })
    revalidatePath('/admin/authors');
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createAuthor(data: z.infer<typeof insertAuthorSchema>) {
  try {
    const author = insertAuthorSchema.parse(data);
    await prisma.author.create({ data: author });

    revalidatePath('/admin/authors');

    return {
      success: true,
      message: 'Author created successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateAuthor(data: z.infer<typeof updateAuthorSchema>) {
  try {
    const author = updateAuthorSchema.parse(data);
    const authorExists = await prisma.author.findFirst({
      where: { id: author.id },
    });

    if (!authorExists) throw new Error('author not found');

    await prisma.author.update({
      where: { id: author.id },
      data: author,
    });

    revalidatePath('/admin/authors');

    return {
      success: true,
      message: 'Book updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAuthorsWithoutPagination() {
  const authors = await prisma.author.findMany({
    select: {
      id: true, name: true
    }
  });
  return authors
}