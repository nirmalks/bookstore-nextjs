'use client';

import type React from 'react';

import { useToast } from '@/hooks/use-toast';
import { shippingAddressSchema } from '@/lib/validators';
import type { Cart, ShippingAddress } from '@/types';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
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
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, Pencil } from 'lucide-react';
import { PAYMENT_METHODS, shippingAddressDefaultValues } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserAddress } from '@/lib/actions/user.actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CartTable from '../cart/cart-table';
import CartTotal from '../cart/cart-total';

const formSchema = z.object({
  ...shippingAddressSchema.shape,
  paymentMethod: z.string(),
});

const ShippingPaymentForm = ({
  addresses,
  cart,
}: {
  addresses: ShippingAddress[];
  cart: Cart;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const hasExistingAddresses = addresses.length > 0;
  const defaultAddress = addresses.find((addr) => addr.isDefault);
  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress?.id || ''
  );
  const [isEditing, setIsEditing] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string>('address');
  const [addressList, setAddressList] = useState<ShippingAddress[]>(addresses);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...shippingAddressDefaultValues,
      paymentMethod: 'card',
    },
  });
  const [isPending, startTransition] = useTransition();

  const handleEditAddress = (e: React.MouseEvent, address: ShippingAddress) => {
    e.preventDefault();
    setIsEditing(true);
    form.reset({ ...address, paymentMethod: form.getValues('paymentMethod') });
    setActiveAccordion('address');
  };

  const handleAddNewAddress = () => {
    setIsEditing(true);
    form.reset({
      ...shippingAddressDefaultValues,
      paymentMethod: form.getValues('paymentMethod'),
    });
    setActiveAccordion('address');
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
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

      const newAddress = {
        ...values,
        id: res.address?.id,
        isDefault: isFirstAddress,
      };
      const updatedAddresses = [...addresses, newAddress];

      setSelectedAddressId(newAddress.id ?? '');
      setIsEditing(false);
      setActiveAccordion('payment');
      setAddressList(updatedAddresses);
    });
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    setIsEditing(false);
    setActiveAccordion('payment');
  };

  return (
    <FormProvider {...form}>
      <div className="grid md:grid-cols-4 ">
        <div className="md:col-span-3">
          <SectionTitle text="Checkout" />
          <Accordion
            type="single"
            value={activeAccordion}
            onValueChange={setActiveAccordion}
            collapsible
          >
            <AccordionItem value="address">
              <AccordionTrigger>Shipping Address</AccordionTrigger>
              <AccordionContent>
                {hasExistingAddresses && !isEditing && (
                  <form>
                    <RadioGroup
                      value={selectedAddressId}
                      onValueChange={handleAddressSelection}
                      className="space-y-4"
                    >
                      {addressList.map((addr) => (
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
                )}
                {(!hasExistingAddresses || isEditing) && (
                  <Form {...form}>
                    <form
                      method="post"
                      className="space-y-4"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="streetAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter state" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="pinCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pin Code</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter pin code"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" disabled={isPending}>
                        {isPending ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : null}
                        Save and Deliver here
                      </Button>
                      <Button
                        type="button"
                        className="ml-4"
                        onClick={() => {
                          setIsEditing(false);
                          setActiveAccordion('');
                        }}
                      >
                        Cancel
                      </Button>
                    </form>
                  </Form>
                )}
                {hasExistingAddresses && !isEditing && (
                  <Button onClick={handleAddNewAddress} className="mt-4">
                    Add New Address
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="payment" disabled={addresses.length === 0}>
              <AccordionTrigger>Payment Method</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            {PAYMENT_METHODS.map((payment) => (
                              <FormItem
                                key={payment}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={payment}
                                    id={payment}
                                    checked={field.value === payment}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {payment}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="payment" disabled={addresses.length === 0}>
              <AccordionTrigger>Order Summary</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <CartTable cart={cart}></CartTable>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="md:col-span-1 space-y-4  ml-4">
          <CartTotal
            cart={cart}
            buttonText="Place Order"
            buttonAction={() => router.push('/order-confirmation')}
          ></CartTotal>
        </div>
      </div>
    </FormProvider>
  );
};

export default ShippingPaymentForm;
