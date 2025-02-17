import { getMyCart } from '@/lib/actions/cart.actions';
import CartTable from './cart-table';
import { Cart } from '@/types';

export const metadata = {
  title: 'Shopping cart',
};

const CartPage = async () => {
  const cart = (await getMyCart()) as Cart;
  return <CartTable cart={cart}></CartTable>;
};

export default CartPage;
