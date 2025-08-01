import { cn } from '@utils/cn';
import { forwardRefWithAs, PolymorphicProps, PolymorphicRef } from '@utils/types';
import { TextVariants } from '@utils/variants';
import { VariantProps } from 'class-variance-authority';

type TextOwnProps = {
  testId?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
} & VariantProps<typeof TextVariants>;

export type TextProps<C extends React.ElementType> = PolymorphicProps<C, TextOwnProps>;

function TextRender<C extends React.ElementType = 'span'>(
  { as, variant, level, className, children, testId, ...props }: TextProps<C>,
  ref: PolymorphicRef<C>
) {
  let Tag: React.ElementType = as || 'span';

  if (!as && variant === 'heading') {
    Tag = level ? `h${level}` : 'h1';
  }

  return (
    <Tag
      data-testid={testId}
      ref={ref}
      className={cn(TextVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

const Text = forwardRefWithAs<'span', TextOwnProps>(TextRender, 'Text');

export default Text;
