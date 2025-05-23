'use client';

import SectionTitle from '@/components/shared/SectionTitle';

import { Cart } from '@/types';
import CartTable from './cart-table';
import CartTotal from './cart-total';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const FullCart = ({ cart }: { cart: Cart }) => {
  const router = useRouter();
  return (
    <>
      {!cart || cart.items.length === 0 ? (
        <div className="">
          Cart is empty.{' '}
          <Link href="/">
            <Button>Shop</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 md:gap-4">
            <div className="md:col-span-3">
              <SectionTitle text="Shopping Cart" />
              <CartTable cart={cart} />
            </div>
            <div className="md:col-span-1">
              <CartTotal
                cart={cart}
                buttonText="Proceed to Checkout"
                buttonAction={() => router.push('/checkout')}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FullCart;
