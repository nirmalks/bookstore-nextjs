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
import { z } from 'zod';
import {
  DEFAULT_PAYMENT_METHOD,
  shippingAddressDefaultValues,
} from '@/lib/constants';
import { updateUserAddress } from '@/lib/actions/user.actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CartTable from '../cart/cart-table';
import CartTotal from '../cart/cart-total';
import { createOrder } from '@/lib/actions/order.actions';
import PaymentMethodForm from './payment-method-form';
import ShippingAddressForm from './shipping-address-form';

const formSchema = z.object({
  ...shippingAddressSchema.shape,
  paymentMethod: z.string(),
});

const CheckoutForm = ({
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
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...shippingAddressDefaultValues,
      paymentMethod: 'card',
    },
  });
  const [isPending, startTransition] = useTransition();

  const isPlaceOrderDisabled = !(selectedAddressId && paymentMethod);
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

  const handlePlaceOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    const selectedAddress = addressList.find(
      (a) => a.id === selectedAddressId
    )!;
    const resp = await createOrder(selectedAddress, paymentMethod);
    if (resp.redirectTo) {
      router.push(resp.redirectTo);
    }
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
                <ShippingAddressForm
                  form={form}
                  addressList={addressList}
                  hasExistingAddresses={hasExistingAddresses}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  setActiveAccordion={setActiveAccordion}
                  selectedAddressId={selectedAddressId}
                  handleAddressSelection={handleAddressSelection}
                  onSubmit={onSubmit}
                ></ShippingAddressForm>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="payment" disabled={addresses.length === 0}>
              <AccordionTrigger>Payment Method</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <PaymentMethodForm
                    form={form}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                  ></PaymentMethodForm>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="payment" disabled={addresses.length === 0}>
              <AccordionTrigger>Order Summary</AccordionTrigger>
              <AccordionContent>
                <CartTable cart={cart}></CartTable>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="md:col-span-1 space-y-4  ml-4">
          <CartTotal
            cart={cart}
            buttonText="Place Order"
            buttonAction={handlePlaceOrder}
            isDisabled={isPlaceOrderDisabled}
          ></CartTotal>
        </div>
      </div>
    </FormProvider>
  );
};

export default CheckoutForm;
