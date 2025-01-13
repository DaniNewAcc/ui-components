import { cn } from '@/utils/cn';
import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

const SeparatorVariants = cva('bg-gray-300', {
  variants: {
    variant: {
      horizontalMiddle: 'px-4',
      verticalMiddle: 'py-4'
    },
    orientation: {
      horizontal: 'w-full h-1',
      vertical: 'h-full w-1'
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
});

type SeparatorOwnProps<C extends React.ElementType> = {
  as?: C;
  children?: ReactNode;
};

type SeparatorProps<C extends React.ElementType> = SeparatorOwnProps<C> &
  VariantProps<typeof SeparatorVariants> &
  Omit<React.ComponentProps<C>, keyof SeparatorOwnProps<C>>;

export const Separator = <C extends React.ElementType = 'hr'>({
  as,
  variant,
  orientation,
  children,
  ...props
}: SeparatorProps<C>) => {
  let Tag = as || 'hr';
  if (orientation === 'vertical') {
    Tag = 'div';
  }
  return (
    <Tag className={cn(SeparatorVariants({ variant, orientation }))} {...props}>
      {children}
    </Tag>
  );
};
