import { SeparatorVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { forwardRefWithAs, PolymorphicProps, PolymorphicRef } from '@utils/types';
import { VariantProps } from 'class-variance-authority';

type SeparatorOwnProps = {
  testId?: string;
} & VariantProps<typeof SeparatorVariants>;

type SeparatorProps<C extends React.ElementType> = PolymorphicProps<C, SeparatorOwnProps>;

function SeparatorRender<C extends React.ElementType = 'hr'>(
  { testId, as, orientation, className, ...props }: SeparatorProps<C>,
  ref: PolymorphicRef<C>
) {
  let Tag = as ?? (orientation === 'horizontal' ? 'hr' : 'div');

  const isSemantic = 'aria-label' in props || 'aria-labelledby' in props;
  const isDecorative = orientation === 'diagonal' || !isSemantic;
  return (
    <Tag
      data-testid={testId}
      ref={ref}
      role="separator"
      aria-hidden={isDecorative ? true : undefined}
      className={cn(SeparatorVariants({ orientation }), className)}
      {...props}
    />
  );
}

const Separator = forwardRefWithAs<'hr', SeparatorOwnProps>(SeparatorRender, 'Separator');

export default Separator;
