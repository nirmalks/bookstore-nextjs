export const APP_NAME = process.env.APP_NAME || 'Bookstore'
export const APP_DESCRIPTION = process.env.APP_DESCRIPTION || 'Ecommerce platform for books'
export const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000"
export const NUM_OF_FEATURED_BOOKS = 4
export const BASE_IMAGE_URL = "/images/";
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'secret'

export const signInDefaultValues = {
  email: '',
  password: ''
};

export const signUpDefaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
};

export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  pinCode: '',
  country: '',
  state: ''
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD =
  process.env.NEXT_PUBLIC_DEFAULT_PAYMENT_METHOD || 'PayPal';
export const PAYPAL_PAYMENT_METHOD = 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10

export const bookDefaultValues = {
  title: '',
  slug: '',
  genres: [],
  images: [],
  description: '',
  price: 0,
  stock: 0,
  rating: 0,
  numReviews: 0,
  isFeatured: false,
  banner: undefined,
  authors: [],
  publishedDate: new Date(),
  id: ''
};

export const authorDefaultValues = {
  name: '',
  bio: '',
};