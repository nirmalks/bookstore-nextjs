import { cartItemSchema, insertBookSchema, insertCartSchema, shippingAddressSchema } from '@/lib/validators';
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