import { Metadata } from 'next';

import { notFound, redirect } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';
import { UserRole } from '@prisma/client';
import { getOrderById } from '@/lib/actions/order.actions';

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  if (order.userId !== session?.user?.id) {
    return redirect('/unauthorized');
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={session?.user?.role === UserRole.ADMIN || false}
    />
  );
};

export default OrderDetailsPage;
