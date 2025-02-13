import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';

const genreSchema = z.object({
  genre: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

const authorSchema = z.object({
  author: z.object({
    id: z.string(),
    name: z.string(),
  }),
});
const currencyFormat = z
  .coerce.number()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly 2 decimal places'
  )
export const insertBookSchema = z.object({
  title: z.string(),
  slug: z.string(),
  stock: z.coerce.number(),
  imagePath: z.string().nullable(),
  isbn: z.string(),
  publishedDate: z.date(),
  price: currencyFormat,
  authors: z.array(authorSchema),
  genres: z.array(genreSchema),
  rating: z.coerce.number(),
  numReviews: z.number()
})

export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const signUpFormSchema = z.object({
  name: z.string().min(2, 'Name must be atleast 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})