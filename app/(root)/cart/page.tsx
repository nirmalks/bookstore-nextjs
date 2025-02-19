import { getMyCart } from '@/lib/actions/cart.actions';

import { Cart } from '@/types';
import FullCart from './full-cart';

export const metadata = {
  title: 'Shopping cart',
};

const CartPage = async () => {
  const cart = (await getMyCart()) as Cart;
  return <FullCart cart={cart}></FullCart>;
};

export default CartPage;
