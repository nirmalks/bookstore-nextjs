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
