import { cn } from '@utils/cn';
import { PolymorphicComponent } from '@utils/types';
import { cva, VariantProps } from 'class-variance-authority';
import { ElementType } from 'react';

const GridVariants = cva('', {
  variants: {
    display: {
      grid: 'ui:grid',
      inlineGrid: 'ui:inline-grid',
      none: 'ui:hidden',
    },
    gap: {
      default: '',
      xs: 'ui:gap-1',
      sm: 'ui:gap-2',
      md: 'ui:gap-4',
      lg: 'ui:gap-8',
      xl: 'ui:gap-12',
      xxl: 'ui:gap-16',
    },
    colGap: {
      default: '',
      xs: 'ui:gap-x-1',
      sm: 'ui:gap-x-2',
      md: 'ui:gap-x-4',
      lg: 'ui:gap-x-8',
      xl: 'ui:gap-x-12',
      xxl: 'ui:gap-x-16',
    },
    rowGap: {
      default: '',
      xs: 'ui:gap-y-1',
      sm: 'ui:gap-y-2',
      md: 'ui:gap-y-4',
      lg: 'ui:gap-y-8',
      xl: 'ui:gap-y-12',
      xxl: 'ui:gap-y-16',
    },
    gridCol: {
      default: '',
      2: 'ui:grid-cols-2',
      3: 'ui:grid-cols-3',
      4: 'ui:grid-cols-4',
      5: 'ui:grid-cols-5',
      6: 'ui:grid-cols-6',
      7: 'ui:grid-cols-7',
      8: 'ui:grid-cols-8',
      9: 'ui:grid-cols-9',
      10: 'ui:grid-cols-10',
      11: 'ui:grid-cols-11',
      12: 'ui:grid-cols-12',
    },
    gridRow: {
      default: '',
      2: 'ui:grid-rows-2',
      3: 'ui:grid-rows-3',
      4: 'ui:grid-rows-4',
      5: 'ui:grid-rows-5',
      6: 'ui:grid-rows-6',
      7: 'ui:grid-rows-7',
      8: 'ui:grid-rows-8',
      9: 'ui:grid-rows-9',
      10: 'ui:grid-rows-10',
      11: 'ui:grid-rows-11',
      12: 'ui:grid-rows-12',
    },
  },
  defaultVariants: {
    display: 'grid',
    gap: 'default',
    colGap: 'default',
    rowGap: 'default',
    gridCol: 'default',
    gridRow: 'default',
  },
});

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
