'use server';

import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hash } from "../encrypt";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password')
    })

    await signIn('credentials', user)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Invalid credentials' }
  }
}

export async function signOutUser() {
  await signOut();
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
    })
    const plainPassword = user.password
    user.password = await hash(user.password)

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password
      }
    })
    await signIn('credentials', {
      email: user.email,
      password: plainPassword
    })
    return {
      success: true,
      message: 'User signed up successfully'
    }
  } catch (error) {
    console.log('insdie signup catch')
    if (isRedirectError(error)) {
      throw error;
    }


    return { success: false, message: formatError(error) }
  }
}