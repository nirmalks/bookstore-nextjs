import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { getAllGenresWithCount } from '@/lib/actions/book.actions';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const GenreDrawer = async () => {
  const genres = await getAllGenresWithCount();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className="space-y-1 mt-4">
            {genres.map((g) => (
              <Button
                variant="ghost"
                className="w-full justify-start"
                key={g.genre}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${g.genre}`}>
                    {g.genre} ({g.count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default GenreDrawer;
