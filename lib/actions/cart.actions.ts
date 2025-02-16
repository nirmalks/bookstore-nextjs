'use server';


import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { CartItem } from "@/types";

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value

    if (!sessionCartId) throw new Error('Cart session not found')
    const session = await auth();
    const userId = session?.user?.id;
    const cart = await getMyCart();
    console.log('cart', cart)
    if (!cart) {
      console.log("Cart not found, creating a new one...");
    }

    const book = await prisma.book.findUnique({
      where: { id: data.bookId }
    });

    if (!book) throw new Error('Book not found')
    const item = cartItemSchema.parse(data);
    if (!cart) {
      const prices = calculatePrice([item]);

      await prisma.cart.create({
        data: {
          userId: userId ?? null,
          sessionCartId,
          itemsPrice: new Prisma.Decimal(prices.itemsPrice),
          totalPrice: new Prisma.Decimal(prices.totalPrice),
          shippingPrice: new Prisma.Decimal(prices.shippingPrice),
          taxPrice: new Prisma.Decimal(prices.taxPrice),
          items: {
            create: [{
              bookId: item.bookId,
              name: item.name,
              slug: item.slug,
              image: item.image,
              quantity: item.quantity,
              price: item.price
            }]
          }
        }
      })

      revalidatePath(`/books/${book?.slug}`)
      return ({
        success: true,
        message: 'Item added to cart'
      })

    } else {
      if (!cart?.id) {
        throw new Error("Cart ID is undefined");
      }
      const existingItem = (cart.items as CartItem[]).find((existing) => existing.bookId === item.bookId)

      if (existingItem) {
        if (book.stock < existingItem.quantity + 1) {
          throw new Error("Insufficient stock")
        }

        await prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: { increment: 1 }
          }
        });
      } else {
        if (book.stock < 1) throw new Error('Not enough stock')
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            bookId: item.bookId,
            name: item.name,
            slug: item.slug,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          }
        });
      }

      revalidatePath(`/books/${book?.slug}`)
      return ({
        success: true,
        message: `${book.title} ${existingItem ? 'updated to' : 'added to'} cart`
      })
    }
  } catch (error) {
    return ({
      success: false,
      message: formatError(error)
    })
  }

}

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    include: {
      items: { include: { book: true } }
    }
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    id: cart.id || undefined,
    sessionCartId: cart.sessionCartId,
    userId: cart.userId || undefined,
    items: cart.items.map((item) => ({
      bookId: item.bookId,
      name: item.book.title,
      slug: item.book.slug,
      image: item.book.imagePath || '',
      quantity: item.quantity,
      price: Number(item.price),
      id: item.id || undefined,
    })),
    itemsPrice: Number(cart.itemsPrice),
    totalPrice: Number(cart.totalPrice),
    shippingPrice: Number(cart.shippingPrice),
    taxPrice: Number(cart.taxPrice),
  });
}

const calculatePrice = (items: CartItem[]) => {
  //individual price without tax and shipping
  const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0))
  const shippingPrice = round2(itemsPrice > 500 ? 0 : 30)
  const taxPrice = round2(0.10 * itemsPrice)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2)
  }
}

export async function removeItemFromCart(bookId: string) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart session not found')

    const book = await prisma.book.findFirst({
      where: { id: bookId }
    })
    if (!book) throw new Error("Book not found")
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found")

    const existingItem = (cart.items as CartItem[]).find((item) => item.bookId === bookId)
    if (!existingItem) throw new Error("item not found in cart")

    if (existingItem.quantity === 1) {
      await prisma.cartItem.delete({ where: { id: existingItem.id } });
      const remainingItems = await prisma.cartItem.count({
        where: { cartId: cart.id },
      });

      if (remainingItems === 0) {
        await prisma.cart.delete({ where: { id: cart.id } });
      }
    } else {
      await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: { decrement: 1 } } });
    }

    revalidatePath(`/books/${book?.slug}`)
    return ({
      success: true,
      message: `${book.title} removed from cart`
    })
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}