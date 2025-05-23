import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';
import { PAYMENT_METHODS } from './constants';

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
    bio: z.string().optional().nullable()
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
  images: z.array(z.string()).min(1, 'Book must have at least one image'),
  isbn: z.string(),
  publishedDate: z.coerce.date(),
  price: currencyFormat,
  authors: z.array(authorSchema),
  genres: z.array(genreSchema),
  rating: z.coerce.number(),
  numReviews: z.number(),
  description: z.string(),
  banner: z.string().optional().nullable(),
  isFeatured: z.boolean()
})

export const updateBookSchema = insertBookSchema.extend({
  id: z.string().min(1, 'Id is required'),
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

export const cartItemSchema = z.object({
  id: z.string().uuid().optional(),
  bookId: z.string().min(1, 'Book id is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  quantity: z.number().int().nonnegative('Quantity must be positive'),
  image: z.string().min(1, 'Image is required'),
  price: currencyFormat
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currencyFormat,
  totalPrice: currencyFormat,
  shippingPrice: currencyFormat,
  taxPrice: currencyFormat,
  sessionCartId: z.string().min(1, 'session cart id is required'),
  userId: z.string().optional(),
  id: z.string().uuid().optional(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(3, 'City must be at least 3 characters'),
  state: z.string().min(3, 'State must be at least 3 characters'),
  pinCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  id: z.string().optional(),
  isDefault: z.boolean().optional()
});

export const paymentMethodSchema = z.object({
  type: z.string().min(1, 'payment type is required')
}).refine((data) => PAYMENT_METHODS.includes(data.type), {
  path: ['type'],
  message: 'Invalid payment method'
})

export const insertOrderSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  itemsPrice: currencyFormat,
  shippingPrice: currencyFormat,
  taxPrice: currencyFormat,
  totalPrice: currencyFormat,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: 'Invalid payment method',
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  bookId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currencyFormat,
  quantity: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export const UserRoleEnum = z.enum(["ADMIN", "USER"]);

export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at leaast 3 characters'),
  email: z.string().min(3, 'Email must be at leaast 3 characters'),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, 'ID is required'),
  role: UserRoleEnum,
});

export const insertAuthorSchema = z.object({
  name: z.string().min(1, 'name is required'),
  bio: z.string(),
})

export const updateAuthorSchema = insertAuthorSchema.extend({
  id: z.string()
})

export const insertReviewSchema = z.object({
  rating: z.number().int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  bookId: z.string().min(1, 'Book is required'),
  userId: z.string().min(1, 'User is required'),
})