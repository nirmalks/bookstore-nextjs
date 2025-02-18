'use client';

import type React from 'react';

import { useToast } from '@/hooks/use-toast';
import { shippingAddressSchema } from '@/lib/validators';
import type { ShippingAddress } from '@/types';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  type ControllerRenderProps,
  FormProvider,
  type SubmitHandler,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SectionTitle from '@/components/shared/SectionTitle';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import type { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader, Pencil } from 'lucide-react';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserAddress } from '@/lib/actions/user.actions';
const ShippingAddressForm = ({
  addresses,
}: {
  addresses: ShippingAddress[];
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const hasExistingAddresses = addresses.length > 0;
  const defaultAddress = addresses.find((addr) => addr.isDefault);
  const [useExistingAddress, setUseExistingAddress] =
    useState(hasExistingAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress?.id || ''
  );
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: shippingAddressDefaultValues,
  });
  const methods = useForm();
  const [isPending, startTransition] = useTransition();
  const handleEditAddress = (e: React.MouseEvent, address: ShippingAddress) => {
    e.preventDefault();
    setIsEditing(true);
    setUseExistingAddress(false);
    form.reset(address);
  };

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const isFirstAddress = addresses.length === 0;
      const res = await updateUserAddress({
        ...values,
        isDefault: isFirstAddress || values.isDefault,
      });

      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
        return;
      }

      router.push('/payment-method');
    });
  };
  return (
    <>
      {' '}
      <div className="max-w-md mx-auto space-y-4">
        <SectionTitle text="Shipping Address"></SectionTitle>
        {hasExistingAddresses && (
          <FormProvider {...methods}>
            <form>
              <RadioGroup
                value={selectedAddressId}
                onValueChange={setSelectedAddressId}
                className="space-y-4"
              >
                {addresses.map((addr) => (
                  <FormItem
                    key={addr.id}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={addr.id || ''} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {addr.fullName}, {addr.streetAddress}, {addr.city},{' '}
                      {addr.state}, {addr.pinCode}, {addr.country}
                    </FormLabel>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={(e) => handleEditAddress(e, addr)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </FormItem>
                ))}
              </RadioGroup>
            </form>
          </FormProvider>
        )}
        {hasExistingAddresses && (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={!useExistingAddress}
              onChange={() => setUseExistingAddress(!useExistingAddress)}
            />
            <span>Add a new address</span>
          </div>
        )}
        {hasExistingAddresses && useExistingAddress && (
          <Button
            onClick={() => router.push('/payment-method')}
            disabled={!selectedAddressId}
          >
            Proceed to Payment
          </Button>
        )}
        {!useExistingAddress && (
          <Form {...form}>
            <form
              method="post"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'fullName'
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'streetAddress'
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="city"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'city'
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="pinCode"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'pinCode'
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Pin Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pin code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="state"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'state'
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="country"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'country'
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader className="h-4 w-4 animate-spin"></Loader>
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  Continue to Payment
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </>
  );
};

export default ShippingAddressForm;
