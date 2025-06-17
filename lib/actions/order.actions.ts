'use server';

import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult, PlainOrder, ShippingAddress } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { sendPurchaseReceipt } from "@/email";

export async function createOrder(address: ShippingAddress, paymentMethod: string) {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error('User not found');

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty',
        redirectTo: '/cart',
      };
    }

    if (!user.addresses.length) {
      return {
        success: false,
        message: 'No shipping address',
        redirectTo: '/shipping-address',
      };
    }

    if (!paymentMethod) {
      return {
        success: false,
        message: 'No payment method',
        redirectTo: '/payment-method',
      };
    }

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: address,
      paymentMethod: paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.purchaseOrder.create({ data: order });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const { id, ...item } of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    const paymentResult = {
      id: insertedOrderId,
      email_address: '',
      status: 'COMPLETED',
      pricePaid: order.itemsPrice.toString(),
    }
    await prisma.purchaseOrder.update({
      where: { id: insertedOrderId },
      data: {
        paymentResult
      },
    });

    updateOrderToPaid({ orderId: insertedOrderId, paymentResult })

    if (!insertedOrderId) throw new Error('Order not created');

    return {
      success: true,
      message: 'Order created',
      redirectTo: `/orders/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

export async function getOrderById(orderId: string) {
  const data = await prisma.purchaseOrder.findFirst({
    where: {
      id: orderId,
    },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
  });
  if (!data) return null;
  return {
    ...data,
    paidAt: data.paidAt?.toISOString() ?? null,
    createdAt: data.createdAt?.toISOString() ?? null,
    deliveredAt: data.deliveredAt?.toISOString() ?? null,
    itemsPrice: Number(data.itemsPrice),
    taxPrice: Number(data.taxPrice),
    shippingPrice: Number(data.shippingPrice),
    totalPrice: Number(data.totalPrice),
    items: data.items.map(item => ({
      ...item,
      price: Number(item.price),
    })),
    shippingAddress: data.shippingAddress as ShippingAddress,
    paymentResult: data.paymentResult as PaymentResult,
  } as PlainOrder;
}

export async function createPayPalOrder(orderId: string) {
  try {
    const order = await prisma.purchaseOrder.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
      const paymentResult = {
        id: paypalOrder.id,
        email_address: '',
        status: 'COMPLETED',
        pricePaid: order.itemsPrice.toString(),
      }
      await prisma.purchaseOrder.update({
        where: { id: orderId },
        data: {
          paymentResult
        },
      });

      updateOrderToPaid({ orderId: orderId, paymentResult })

      return {
        success: true,
        message: 'Item order created successfully',
        data: paypalOrder.id,
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function approvePayPalOrder(orderId: string, data: { orderID: string }) {
  try {
    const order = await prisma.purchaseOrder.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in PayPal payment');
    }

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Your order has been paid',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  const order = await prisma.purchaseOrder.findFirst({
    where: {
      id: orderId,
    },
    include: {
      items: true,
    },
  });

  if (!order) throw new Error('Order not found');
  if (order.isPaid) throw new Error('Order is already paid');

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.book.update({
        where: { id: item.bookId },
        data: { stock: { increment: -item.quantity } },
      });
    }

    await tx.purchaseOrder.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  const updatedOrder = await prisma.purchaseOrder.findFirst({
    where: { id: orderId },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Order not found');
  sendPurchaseReceipt(
    {
      order: {
        ...updatedOrder,
        itemsPrice: Number(updatedOrder.itemsPrice),
        shippingPrice: Number(updatedOrder.shippingPrice),
        taxPrice: Number(updatedOrder.taxPrice),
        totalPrice: Number(updatedOrder.totalPrice),
        items: updatedOrder.items.map((item) => ({
          ...item,
          price: Number(item.price),
        })),
        shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
        paymentResult: updatedOrder.paymentResult as PaymentResult
      }
    }
  )
}

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number,
  page: number,
}) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized to access this page')

  const data = await prisma.purchaseOrder.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  })

  const count = await prisma.purchaseOrder.count({
    where: { userId: session?.user?.id }
  })

  return {
    data,
    totalPages: Math.ceil(count / limit)
  }
}

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

export async function getOrderSummary() {
  const ordersCount = await prisma.purchaseOrder.count();
  const booksCount = await prisma.book.count();
  const usersCount = await prisma.user.count();

  const totalSales = await prisma.purchaseOrder.aggregate({
    _sum: { totalPrice: true },
  });

  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "PurchaseOrder" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  const latestSales = await prisma.purchaseOrder.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    booksCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

export async function deleteOrder(id: string) {
  try {
    await prisma.purchaseOrder.delete({
      where: { id: id }
    })

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.PurchaseOrderWhereInput =
    query && query !== 'all'
      ? {
        user: {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        },
      }
      : {};

  const data = await prisma.purchaseOrder.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.purchaseOrder.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/orders/${orderId}`);

    return { success: true, message: 'Order marked as paid' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.purchaseOrder.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');
    if (!order.isPaid) throw new Error('Order is not paid');

    await prisma.purchaseOrder.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      message: 'Order has been marked delivered',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}