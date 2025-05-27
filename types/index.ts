import { cartItemSchema, insertAuthorSchema, insertBookSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema, insertReviewSchema, paymentResultSchema, shippingAddressSchema } from '@/lib/validators';
import { z } from 'zod';

export type Book = z.infer<typeof insertBookSchema> & {
  id: string
}

export type SectionTitleProps = {
  text: string;
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItemWithoutId = z.infer<typeof cartItemSchema>
export type CartItem = z.infer<typeof cartItemSchema> & {

};
export type ShippingAddress = z.infer<typeof shippingAddressSchema> & {
  id?: string;
  userId?: string;
};

export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  items: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type Author = z.infer<typeof insertAuthorSchema> & {
  id: string
}

export type BookWithoutNesting = {
  title: string;
  slug: string;
  stock: number;
  images: string[];
  isbn: string;
  publishedDate: Date;
  price: number;
  id: string;
  rating: number;
  numReviews: number;
  description: string | null;
  banner: string | null;
  isFeatured: boolean;
}

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};

export type PlainCartItem = {
  id: string;
  bookId: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  price: number;
};

export type PlainCart = {
  id: string;
  sessionCartId: string;
  userId?: string;
  items: PlainCartItem[];
  itemsPrice: number;
  totalPrice: number;
  shippingPrice: number;
  taxPrice: number;
};