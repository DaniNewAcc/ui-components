import { cn } from '@/utils/cn';
import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

const TextVariants = cva('', {
  variants: {},
  defaultVariants: {}
});

type TextOwnProps<C extends React.ElementType> = {
  as?: C;
  children?: ReactNode;
};

type TextProps<C extends React.ElementType> = TextOwnProps<C> &
  VariantProps<typeof TextVariants> &
  Omit<React.ComponentProps<C>, keyof TextOwnProps<C>>;

export const Text = <C extends React.ElementType = 'span'>({
  as,
  children,
  ...props
}: TextProps<C>) => {
  const Tag = as || 'span';
  return (
    <Tag className={cn(TextVariants({}))} {...props}>
      {children}
    </Tag>
  );
};
