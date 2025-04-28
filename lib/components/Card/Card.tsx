import { CardVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import React, { ComponentPropsWithRef, forwardRef, ReactNode } from 'react';

type CardProps = ComponentPropsWithRef<'article'> &
  VariantProps<typeof CardVariants> & {
    testId?: string;
    onClick?: React.MouseEventHandler;
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
        onClick={onClick}
        data-testid={testId}
        className={cn(CardVariants({ border, hoverEffect, padding, rounded, shadow }), className)}
        {...props}
      >
        {children}
      </article>
    );
  }
);

export default Card;
