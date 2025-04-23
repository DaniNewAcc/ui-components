import { cn } from '@utils/cn';
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

const HeaderVariants = cva('ui:flex ui:w-full ui:items-center ui:justify-between', {
  variants: {
    bgColor: {
      default: '',
      50: 'ui:bg-primary-50',
      100: 'ui:bg-primary-100',
      200: 'ui:bg-primary-200',
      300: 'ui:bg-primary-300',
      400: 'ui:bg-primary-400',
      500: 'ui:bg-primary-500',
      600: 'ui:bg-primary-600',
      700: 'ui:bg-primary-700',
      800: 'ui:bg-primary-800',
      900: 'ui:bg-primary-900',
    },
    padding: {
      default: '',
      sm: 'ui:px-2',
      md: 'ui:px-4',
      lg: 'ui:px-8',
    },
    gap: {
      default: '',
      sm: 'ui:gap-2',
      md: 'ui:gap-4',
      lg: 'ui:gap-8',
    },
    height: {
      default: '',
      sm: 'ui:h-16',
      md: 'ui:h-20',
      lg: 'ui:h-24',
    },
  },
  defaultVariants: {
    bgColor: 'default',
    padding: 'default',
    gap: 'default',
    height: 'default',
  },
});

type HeaderProps = ComponentProps<'header'> &
  VariantProps<typeof HeaderVariants> & {
    children: ReactNode;
  };

const Header = ({ bgColor, padding, gap, height, className, children, ...props }: HeaderProps) => {
  return (
    <header className={cn(HeaderVariants({ bgColor, padding, gap, height }), className)} {...props}>
      {children}
    </header>
  );
};

export default Header;
