import { cn } from '@/utils/cn';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  className: string;
  children: ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={cn(['flex flex-col', className])} {...props}>
      {children}
    </div>
  );
};
