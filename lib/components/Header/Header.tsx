import { HeaderVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

type HeaderProps = ComponentPropsWithoutRef<'header'> &
  VariantProps<typeof HeaderVariants> & {
    testId?: string;
    children: ReactNode;
  };

const Header = forwardRef<React.ElementRef<'header'>, HeaderProps>(
  ({ bgColor, padding, gap, height, className, testId = 'header', children, ...props }, ref) => (
    <header
      ref={ref}
      data-testid={testId}
      className={cn(HeaderVariants({ bgColor, padding, gap, height }), className)}
      {...props}
    >
      {children}
    </header>
  )
);

Header.displayName = 'Header';

export default Header;
