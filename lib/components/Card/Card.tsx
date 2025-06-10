import { CardVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import React, { ComponentPropsWithRef, forwardRef, ReactNode } from 'react';

type CardProps = ComponentPropsWithRef<'article'> &
  VariantProps<typeof CardVariants> & {
    testId?: string;
    focusable?: boolean;
    role?: string;
    tabIndex?: number;
    children: ReactNode;
    onClick?: React.MouseEventHandler;
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
      testId,
      className,
      children,
      onClick,
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
        onClick={onClick}
        {...props}
      >
        {children}
      </article>
    );
  }
);

export default Card;
