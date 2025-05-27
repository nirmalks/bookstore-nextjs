'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PAYMENT_METHODS } from '@/lib/constants';
import { Control } from 'react-hook-form';

type PaymentMethodFormProps = {
  form: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
  };
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreateOrder: () => Promise<any>;
  clientId: string;
};

const PaymentMethodForm = ({
  form,
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodFormProps) => {
  return (
    <FormField
      control={form.control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Select Payment Method</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(val) => {
                field.onChange(val);
                setPaymentMethod(val);
              }}
              defaultValue={paymentMethod}
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
                      checked={paymentMethod === payment}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{payment}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PaymentMethodForm;
