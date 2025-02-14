import { cartItemSchema, insertBookSchema, insertCartSchema } from '@/lib/validators';
import { z } from 'zod';

export type Book = z.infer<typeof insertBookSchema> & {
  id: string
}

export type SectionTitleProps = {
  text: string;
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;