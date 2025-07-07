import { FooterVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

type FooterProps = ComponentPropsWithoutRef<'footer'> &
  VariantProps<typeof FooterVariants> & {
    testId?: string;
    children: ReactNode;
  };

const Footer = forwardRef<React.ElementRef<'footer'>, FooterProps>(
  ({ bgColor, padding, gap, height, className, testId = 'footer', children, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        data-testid={testId}
        className={cn(FooterVariants({ bgColor, padding, gap, height }), className)}
        {...props}
      >
        {children}
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;
