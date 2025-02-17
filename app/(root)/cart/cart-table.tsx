'use client';

import SectionTitle from '@/components/shared/SectionTitle';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Cart } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useTransition } from 'react';
import Image from 'next/image';
import { BASE_IMAGE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/components/shared/books/BooksList';

const CartTable = ({ cart }: { cart: Cart }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  console.log(cart);
  return (
    <>
      <SectionTitle text="Shopping Cart"></SectionTitle>
      {!cart || cart.items.length === 0 ? (
        <div className="">
          Cart is empty. <Link href="/">Shop</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-4">
          <div className="md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center"> Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={`${BASE_IMAGE_URL}${item.image}`}
                          alt={item.name}
                          width={50}
                          height={50}
                        ></Image>
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const resp = await removeItemFromCart(item.bookId);

                            if (!resp.success) {
                              toast({
                                variant: 'destructive',
                                description: resp.message,
                              });
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="h-2 w-2"></Loader>
                        ) : (
                          <Minus className="h-2 w-2"></Minus>
                        )}
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const resp = await addItemToCart(item);

                            if (!resp.success) {
                              toast({
                                variant: 'destructive',
                                description: resp.message,
                              });
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="h-2 w-2"></Loader>
                        ) : (
                          <Plus className="h-2 w-2"></Plus>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right ">{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal ({cart.items.reduce((a, c) => a + c.quantity, 0)})
                <span className="font-bold">
                  {formatPrice(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() => startTransition(() => router.push('/shipping'))}
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin"></Loader>
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
