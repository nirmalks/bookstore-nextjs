import { formatPrice } from '@/components/shared/books/BooksList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cart } from '@/types';
import { Loader, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useTransition } from 'react';
import { boolean } from 'zod';
type CartTotalProps = {
  cart: Cart;
  buttonText: string;
  buttonAction: () => void;
  isDisabled?: boolean;
};
const CartTotal = ({
  cart,
  buttonText,
  buttonAction,
  isDisabled,
}: CartTotalProps) => {
  const [isPending, startTransition] = useTransition();
  return (
    <Card>
      <CardContent className="p-4 gap-4">
        <div className="pb-3 text-xl">
          Subtotal ({cart.items.reduce((a, c) => a + c.quantity, 0)})
          <span className="font-bold">{formatPrice(cart.itemsPrice)}</span>
        </div>
        <Button
          className="w-full"
          disabled={isPending || isDisabled}
          onClick={buttonAction}
        >
          {isPending ? (
            <Loader className="w-4 h-4 animate-spin"></Loader>
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
export default CartTotal;
