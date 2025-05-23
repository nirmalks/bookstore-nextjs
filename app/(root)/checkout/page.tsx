import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getAddresses } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import CheckoutForm from './checkout-form';

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    redirect('/cart');
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect('/sign-in?callbackUrl=/checkout');
  }
  const allAddresses = (await getAddresses(userId)) || [];

  return (
    <>
      <CheckoutForm addresses={allAddresses} cart={cart}></CheckoutForm>
    </>
  );
};
export default ShippingAddressPage;
