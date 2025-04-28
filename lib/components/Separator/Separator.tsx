import { SeparatorVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { PolymorphicComponent } from '@utils/types';
import { VariantProps } from 'class-variance-authority';

type SeparatorProps<C extends React.ElementType> = VariantProps<typeof SeparatorVariants> &
  PolymorphicComponent<C, { as?: C; testId?: string }>;

const Separator = <C extends React.ElementType = 'hr'>({
  testId,
  as,
  orientation,
  className,
  ...props
}: SeparatorProps<C>) => {
  let Tag = as ?? (orientation === 'vertical' ? 'div' : 'hr');
  return (
    <Tag
      data-testid={testId}
      role="separator"
      aria-hidden="true"
      className={cn(SeparatorVariants({ orientation }), className)}
      {...props}
    />
  );
};

export default Separator;
