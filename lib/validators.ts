import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';

const currencyFormat = z
  .coerce.number()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly 2 decimal places'
  )
export const insertBookSchema = z.object({
  title: z.string(),
  stock: z.coerce.number(),
  imagePath: z.string().nullable(),
  isbn: z.string(),
  publishedDate: z.date(),
  price: currencyFormat
})

