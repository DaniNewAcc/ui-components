import { TextVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { forwardRefWithAs, PolymorphicProps, PolymorphicRef } from '@utils/types';
import { VariantProps } from 'class-variance-authority';
import { ElementType } from 'react';

type TextOwnProps = {
  testId?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

type TextProps<C extends ElementType> = PolymorphicProps<
  C,
  TextOwnProps & VariantProps<typeof TextVariants>
>;

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

const Text = forwardRefWithAs(TextRender, 'Text');

export default Text;
