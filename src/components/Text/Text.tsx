import { ReactNode } from 'react';

type TextOwnProps<C extends React.ElementType> = {
  as?: C;
  children?: ReactNode;
};

type TextProps<C extends React.ElementType> = TextOwnProps<C> &
  Omit<React.ComponentProps<C>, keyof TextOwnProps<C>>;

export const Text = <C extends React.ElementType = 'span'>({
  as,
  children,
  ...props
}: TextProps<C>) => {
  const Tag = as || 'span';
  return <Tag {...props}>{children}</Tag>;
};
