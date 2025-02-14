'use client';

import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { CartItem } from '@/types';
import { Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();
  console.log('item', item);
  const handleAddToCart = async () => {
    const resp = await addItemToCart(item);
    console.log(resp);
    if (!resp.success) {
      toast({
        variant: 'destructive',
        description: resp.message,
      });
      return;
    }

    toast({
      description: `${item.name} added to cart`,
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
  };
  return (
    <div className="flex-center mt-4">
      <Button className="w-full" type="button" onClick={handleAddToCart}>
        <Plus />
        Add to Cart
      </Button>
    </div>
  );
};

export default AddToCart;
