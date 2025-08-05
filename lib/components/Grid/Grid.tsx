import Scrollable, { ScrollableProps } from '@components/Scrollable';
import { cn } from '@utils/cn';
import { mergeScrollableClasses } from '@utils/helpers';
import { forwardRefWithAs, PolymorphicProps, PolymorphicRef } from '@utils/types';
import { GridVariants } from '@utils/variants';
import { VariantProps } from 'class-variance-authority';
import { ElementType } from 'react';

type GridOwnProps = {
  testId?: string;
  scrollable?: boolean;
  scrollableProps?: ScrollableProps<'div'>;
} & VariantProps<typeof GridVariants>;

export type GridProps<C extends React.ElementType> = PolymorphicProps<C, GridOwnProps>;

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
    const mergedScrollableClassName = mergeScrollableClasses({
      className: scrollableProps?.className,
      style: scrollableProps?.style,
    });
    return (
      <Scrollable {...scrollableProps} className={mergedScrollableClassName}>
        {gridContent}
      </Scrollable>
    );
  }

  return gridContent;
}

const Grid = forwardRefWithAs<'div', GridOwnProps>(GridRender, 'Grid');

export default Grid;
