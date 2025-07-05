import { GridVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { forwardRefWithAs, PolymorphicProps, PolymorphicRef } from '@utils/types';
import { VariantProps } from 'class-variance-authority';
import { ElementType } from 'react';
import Scrollable from '../Scrollable/Scrollable';

type GridOwnProps = {
  testId?: string;
  scrollable?: boolean;
  scrollableProps?: React.ComponentProps<typeof Scrollable>;
};

type GridProps<C extends React.ElementType> = PolymorphicProps<
  C,
  GridOwnProps & VariantProps<typeof GridVariants>
>;

function GridRender<C extends ElementType = 'div'>(
  {
    as,
    scrollable = false,
    scrollableProps,
    display,
    gap,
    colGap,
    rowGap,
    gridCol,
    gridRow,
    testId = 'grid',
    className,
    children,
    ...props
  }: GridProps<C>,
  ref: PolymorphicRef<C>
) {
  const Tag = as || 'div';

  const gridClasses = cn(
    GridVariants({ display, gap, colGap, rowGap, gridCol, gridRow }),
    className
  );

  const gridContent = (
    <Tag data-testid={testId} ref={ref} className={gridClasses} {...props}>
      {children}
    </Tag>
  );

  if (scrollable) {
    const defaultScrollableClassName = 'ui:max-h-[300px]';
    const mergedScrollableClassName = cn(defaultScrollableClassName, scrollableProps?.className);

    return (
      <Scrollable {...scrollableProps} className={mergedScrollableClassName}>
        {gridContent}
      </Scrollable>
    );
  }

  return gridContent;
}

const Grid = forwardRefWithAs(GridRender, 'Grid');

export default Grid;
