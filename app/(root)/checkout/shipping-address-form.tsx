'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { ShippingAddress } from '@/types';
import { Loader, Pencil } from 'lucide-react';
import { useTransition } from 'react';

type ShippingAddressFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  addressList: ShippingAddress[];
  hasExistingAddresses: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setActiveAccordion: (section: string) => void;
  selectedAddressId: string;
  handleAddressSelection: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
};

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  form,
  addressList,
  hasExistingAddresses,
  isEditing,
  setIsEditing,
  setActiveAccordion,
  selectedAddressId,
  handleAddressSelection,
  onSubmit,
}) => {
  const [isPending] = useTransition();

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

  return (
    <>
      {hasExistingAddresses && !isEditing && (
        <form>
          <div className="space-y-4">
            {addressList.map((address) => (
              <FormItem
                key={address.id}
                className="flex items-center space-x-3 space-y-0"
              >
                <FormControl>
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={address.id || ''}
                    checked={selectedAddressId === address.id}
                    onChange={() => handleAddressSelection(address.id!)}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {address.fullName}, {address.streetAddress}, {address.city},{' '}
                  {address.state}, {address.pinCode}, {address.country}
                </FormLabel>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={(e) => handleEditAddress(e, address)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </FormItem>
            ))}
          </div>
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
                      <Input placeholder="Enter pin code" {...field} />
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
              ) : (
                'Save and Deliver here'
              )}
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
    </>
  );
};

export default ShippingAddressForm;
