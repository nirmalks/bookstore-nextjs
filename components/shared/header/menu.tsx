import { Button } from '@/components/ui/button';
import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import ThemeToggler from './theme-toggler';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import UserButton from './user-button';
import { cn } from '@/lib/utils';

const Menu = ({ role }: { role: string }) => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ThemeToggler></ThemeToggler>
        <Button asChild variant="ghost">
          {role === 'ADMIN' ? (
            <Link
              key="/admin/overview"
              href="/admin/overview"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary'
              )}
            >
              Admin
            </Link>
          ) : (
            ''
          )}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart />
            Cart
          </Link>
        </Button>
        <UserButton></UserButton>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical></EllipsisVertical>
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>

            <ThemeToggler></ThemeToggler>
            <Button asChild variant="ghost">
              {role === 'ADMIN' ? (
                <Link
                  key="/admin/overview"
                  href="/admin/overview"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary'
                  )}
                >
                  Admin
                </Link>
              ) : (
                ''
              )}
            </Button>
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart></ShoppingCart>
                Cart
              </Link>
            </Button>
            <UserButton></UserButton>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
