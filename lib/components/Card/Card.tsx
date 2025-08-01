import { cn } from '@utils/cn';
import { CardVariants } from '@utils/variants';
import { VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

export type CardProps = ComponentPropsWithoutRef<'article'> &
  VariantProps<typeof CardVariants> & {
    testId?: string;
    focusable?: boolean;
    role?: string;
    tabIndex?: number;
    children: ReactNode;
  };

const Card = forwardRef<React.ElementRef<'article'>, CardProps>(
  (
    {
      border,
      hoverEffect,
      padding,
      rounded,
      shadow,
      focusable,
      role,
      tabIndex,
      testId = 'card',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <article
        ref={ref}
        data-testid={testId}
        tabIndex={focusable ? (tabIndex ?? 0) : undefined}
        role={focusable ? (role ?? 'button') : undefined}
        className={cn(
          CardVariants({ border, hoverEffect, padding, rounded, shadow }),
          focusable &&
            'ui:focus:outline-none ui:focus-visible:ring-2 ui:focus-visible:ring-primary-500',
          className
        )}
        {...props}
      >
        {children}
      </article>
    );
  }
);

Card.displayName = 'Card';

export default Card;
