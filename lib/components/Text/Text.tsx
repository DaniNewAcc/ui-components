import { TextVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { PolymorphicComponent } from '@utils/types';
import { VariantProps } from 'class-variance-authority';

type TextProps<C extends React.ElementType> = VariantProps<typeof TextVariants> &
  PolymorphicComponent<C, { as?: C; testId?: string; level?: 1 | 2 | 3 | 4 | 5 | 6 }>;

const Text = <C extends React.ElementType = 'span'>({
  as,
  variant,
  level,
  className,
  children,
  testId,
  ...props
}: TextProps<C>) => {
  let Tag: React.ElementType = as || 'span';

  if (!as && variant === 'heading') {
    Tag = level ? `h${level}` : 'h1';
  }

  return (
    <Tag data-testid={testId} className={cn(TextVariants({ variant }), className)} {...props}>
      {children}
    </Tag>
  );
};

Text.displayName = 'Text';

export default Text;
