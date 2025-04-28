import { FooterVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

type FooterProps = ComponentProps<'footer'> &
  VariantProps<typeof FooterVariants> & {
    testId?: string;
    children: ReactNode;
  };

const Footer = ({ bgColor, padding, gap, height, className, testId, children }: FooterProps) => {
  return (
    <footer
      data-testid={testId}
      className={cn(FooterVariants({ bgColor, padding, gap, height }), className)}
    >
      {children}
    </footer>
  );
};

export default Footer;
