'use client';

import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Cart, CartItem } from '@/types';
import { Loader, Minus, Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const AddToCart = ({ cart, cartItem }: { cart?: Cart; cartItem: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const resp = await addItemToCart(cartItem);

      if (!resp.success) {
        toast({
          variant: 'destructive',
          description: resp.message,
        });
        return;
      }

      toast({
        description: resp.message,
        action: (
          <ToastAction
            className="bg-primary text-white hover:bg-gray-300"
            altText="Go to Cart"
            onClick={() => router.push('/cart')}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const resp = await removeItemFromCart(cartItem.bookId);

      toast({
        variant: resp.success ? 'default' : 'destructive',
        description: resp.message,
      });
    });
  };

  const itemAlreadyInCart =
    cart && cart.items.find((item) => item.bookId === cartItem.bookId);

  return itemAlreadyInCart ? (
    <div className="flex">
      <Button
        className="w-full"
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2 py-2">{itemAlreadyInCart.quantity}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus />
      Add to Cart
    </Button>
  );
};

export default AddToCart;
