'use server';

import { auth, signIn, signOut } from "@/auth";
import { shippingAddressSchema, signInFormSchema, signUpFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hash } from "../encrypt";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { ShippingAddress } from "@/types";

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
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) }
  }
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      addresses: true
    }
  })
  if (!user) throw new Error("User not found")
  return user;
}

export async function getAddresses(userId: string) {
  const addresses = await prisma.address.findMany({
    where: { userId },
    select: {
      id: true,
      userId: true,
      fullName: true,
      streetAddress: true,
      city: true,
      state: true,
      country: true,
      pinCode: true,
      isDefault: true,
      lat: true,
      lng: true,
    },
  });

  if (!addresses) return null;

  return addresses
}
export async function getDefaultAddress(userId: string) {
  const address = await prisma.address.findFirst({
    where: { userId, isDefault: true },
    select: {
      id: true,
      userId: true,
      fullName: true,
      streetAddress: true,
      city: true,
      state: true,
      country: true,
      pinCode: true,
      isDefault: true,
      lat: true,
      lng: true,
    },
  });

  if (!address) return null;

  return {
    ...address,
    lat: address.lat ?? undefined,
    lng: address.lng ?? undefined,
  };
}


export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    const userId = session?.user?.id;
    if (!currentUser) throw new Error('User not found');
    const validatedAddress = shippingAddressSchema.parse(data);
    if (data.id) {

      const updatedAddress = await prisma.address.update({
        where: {
          id: data.id,
          userId
        },
        data: {
          fullName: validatedAddress.fullName,
          streetAddress: validatedAddress.streetAddress,
          city: validatedAddress.city,
          state: validatedAddress.state,
          country: validatedAddress.country,
          pinCode: validatedAddress.pinCode,
          isDefault: validatedAddress.isDefault || false
        }
      });

      return {
        success: true,
        message: 'Address updated successfully',
        address: updatedAddress
      };
    } else {
      if (!userId) throw new Error('User ID not found');
      // Create new address
      const newAddress = await prisma.address.create({
        data: {
          ...validatedAddress,
          userId,
          isDefault: validatedAddress.isDefault || false
        }
      });

      return {
        success: true,
        message: 'New address created successfully',
        address: newAddress
      };
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
