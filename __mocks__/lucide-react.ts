import React from 'react';

interface LucideProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  color?: string;
  strokeWidth?: string | number;
}

const createMockIcon = (iconName: string) => {
  const Icon = React.forwardRef<SVGSVGElement, LucideProps>((props, ref) =>
    React.createElement('svg', { 'data-testid': iconName, ref, ...props })
  );
  Icon.displayName = iconName;
  return Icon;
};

export const ArrowLeft = createMockIcon('ArrowLeft');
export const ArrowRight = createMockIcon('ArrowRight');
export const ChevronLeft = createMockIcon('ChevronLeft');
export const ChevronRight = createMockIcon('ChevronRight');
export const Home = createMockIcon('Home');
export const Settings = createMockIcon('Settings');
export const Search = createMockIcon('Search');
export const User = createMockIcon('User');
export const Menu = createMockIcon('Menu');
export const X = createMockIcon('X');
export const Book = createMockIcon('Book');
export const ShoppingCart = createMockIcon('ShoppingCart');
export const Star = createMockIcon('Star');
export const Heart = createMockIcon('Heart');
export const Plus = createMockIcon('Plus');
export const Minus = createMockIcon('Minus');

type LucideIconsModule = {
  [key: string]: React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;
};

const mockLucideReact = new Proxy({} as LucideIconsModule, {
  get: (_, iconName: string | symbol) => {
    if (typeof iconName === 'string') {
      const exports = {
        ArrowLeft,
        ArrowRight,
        ChevronLeft,
        ChevronRight,
        Home,
        Settings,
        Search,
        User,
        Menu,
        X,
        Book,
        ShoppingCart,
        Star,
        Heart,
        Plus,
        Minus,
      };

      if (iconName in exports) {
        return exports[iconName as keyof typeof exports];
      }

      return createMockIcon(iconName);
    }
    return undefined;
  },
});

export default mockLucideReact;