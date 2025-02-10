import { PrismaClient } from "@prisma/client";

export async function getLatestBooks() {
  const prisma = new PrismaClient();
  const data = await prisma.book.findMany({
    take: 5,
    orderBy: { publishedDate: 'desc' }
  });
  return data.map(book => ({
    ...book,
    price: Number(book.price),
    id: Number(book.id),
  }));
}