import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getAddresses } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import ShippingAddressForm from './shipping-address-form';

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    redirect('/cart');
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('No user id');
  const allAddresses = (await getAddresses(userId)) || [];

  return (
    <>
      <ShippingAddressForm
        addresses={allAddresses}
        cart={cart}
      ></ShippingAddressForm>
    </>
  );
};
export default ShippingAddressPage;
