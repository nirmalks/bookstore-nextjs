import { cartItemSchema, insertBookSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema, paymentResultSchema, shippingAddressSchema } from '@/lib/validators';
import { z } from 'zod';

export type Book = z.infer<typeof insertBookSchema> & {
  id: string
}

export type SectionTitleProps = {
  text: string;
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema> & {
  id?: string
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
