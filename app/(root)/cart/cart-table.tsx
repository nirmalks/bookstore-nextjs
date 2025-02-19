'use client';

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

import { useTransition } from 'react';
import Image from 'next/image';
import { BASE_IMAGE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Loader, Minus, Plus } from 'lucide-react';

const CartTable = ({ cart }: { cart: Cart }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  return (
    <>
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
    </>
  );
};

export default CartTable;
