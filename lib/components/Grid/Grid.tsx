import { GridVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { PolymorphicComponent } from '@utils/types';
import { VariantProps } from 'class-variance-authority';
import { ElementType } from 'react';

type GridProps<C extends React.ElementType> = VariantProps<typeof GridVariants> &
  PolymorphicComponent<C, { as?: C; testId?: string }>;

const Grid = <C extends ElementType = 'div'>({
  as,
  display,
  gap,
  colGap,
  rowGap,
  gridCol,
  gridRow,
  testId,
  className,
  children,
  ...props
}: GridProps<C>) => {
  const Tag = as || 'div';
  return (
    <Tag
      data-testid={testId}
      className={cn(GridVariants({ display, gap, colGap, rowGap, gridCol, gridRow }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Grid;
