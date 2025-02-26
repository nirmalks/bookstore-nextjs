import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import Menu from '@/components/shared/header/menu';
import MainNav from './main-nav';
export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <header className="w-full border-b container mx-auto">
        <div className="wrapper flex-between">
          <Link href="/" className="flex-start">
            <Image
              priority={true}
              src="/images/logo.png"
              width={90}
              height={45}
              alt={`${APP_NAME} logo`}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
          <MainNav className="mx-6"></MainNav>
          <div className="ml-auto items-center flex space-x-4">
            <Menu></Menu>
          </div>
        </div>
      </header>
      <div className="flex-1 space-y-4 p 8 pt-8 container mx-auto">
        {children}
      </div>
    </div>
  );
}
