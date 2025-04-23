import { cn } from '@utils/cn';
import { PolymorphicComponent } from '@utils/types';
import { cva, VariantProps } from 'class-variance-authority';

const SeparatorVariants = cva('ui:bg-gray-400', {
  variants: {
    orientation: {
      horizontal: 'ui:h-[1px] ui:w-full',
      vertical: 'ui:h-full ui:w-[1px]',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

type SeparatorProps<C extends React.ElementType> = VariantProps<typeof SeparatorVariants> &
  PolymorphicComponent<C, { as?: C; testId?: string }>;

const Separator = <C extends React.ElementType = 'hr'>({
  testId,
  as,
  orientation,
  className,
  ...props
}: SeparatorProps<C>) => {
  let Tag = as ?? (orientation === 'vertical' ? 'hr' : 'div');
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
