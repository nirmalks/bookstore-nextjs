import { APP_NAME, userRole } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import Menu from './menu';
import GenreDrawer from './genre-drawer';
import Search from './search';
import { auth } from '@/auth';

const Header = async () => {
  const session = await auth();
  const role = session?.user?.role || userRole;
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <GenreDrawer />
          <Link href="/" className="flex-start">
            <Image
              priority={true}
              src="/images/logo.png"
              width={75}
              height={30}
              alt={`${APP_NAME} logo`}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <Menu role={role}></Menu>
      </div>
    </header>
  );
};

export default Header;
