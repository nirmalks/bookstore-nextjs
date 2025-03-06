'use server'

import { auth } from "@/auth";
import { z } from "zod";
import { formatError } from "../utils";
import { insertReviewSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>) {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');
    console.log(session.user.id)
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    console.log('user existis', userExists)
    if (!userExists) throw new Error('User does not exist');
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id
    })

    const book = await prisma.book.findFirst({
      where: {
        id: review.bookId,
      }
    })

    if (!book) throw new Error('Book not found');

    const existingReview = await prisma.review.findFirst({
      where: {
        bookId: review.bookId,
        userId: review.userId
      }
    })

    await prisma.$transaction(async (tx) => {
      if (existingReview) {
        await tx.review.update({
          where: { id: existingReview.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating
          }
        })
      } else {
        await tx.review.create({ data: review })
      }

      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { bookId: review.bookId }
      })

      const numReviews = await tx.review.count({
        where: { bookId: review.bookId }
      })

      await tx.book.update({
        where: { id: review.bookId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews
        }
      })
    })


    revalidatePath(`/books/${book.slug}`);

    return {
      success: true,
      message: 'Review Updated Successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }

}

export async function getReviews({ bookId }: { bookId: string }) {
  const data = await prisma.review.findMany({
    where: {
      bookId: bookId
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return { data }
}

export async function getReviewByBookId({
  bookId,
}: {
  bookId: string;
}) {
  const session = await auth();

  if (!session) throw new Error('User is not authenticated');

  return await prisma.review.findFirst({
    where: {
      bookId,
      userId: session?.user?.id,
    },
  });
}