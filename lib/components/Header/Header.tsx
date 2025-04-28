import { HeaderVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

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
