import { TextVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { PolymorphicComponent } from '@utils/types';
import { VariantProps } from 'class-variance-authority';

type TextProps<C extends React.ElementType> = VariantProps<typeof TextVariants> &
  PolymorphicComponent<C, { as?: C; testId?: string }>;

const Text = <C extends React.ElementType = 'span'>({
  as,
  border,
  variant,
  className,
  testId,
  children,
  ...props
}: TextProps<C>) => {
  const Tag = as || 'span';
  return (
    <Tag
      data-testid={testId}
      className={cn(TextVariants({ variant, border }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Text;
