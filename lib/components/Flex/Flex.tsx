import Scrollable from '@components/Scrollable';
import { cn } from '@utils/cn';
import { forwardRefWithAs, PolymorphicProps, PolymorphicRef } from '@utils/types';
import { FlexVariants } from '@utils/variants';
import { VariantProps } from 'class-variance-authority';

type FlexOwnProps = {
  testId?: string;
  scrollable?: boolean;
  scrollableProps?: React.ComponentProps<typeof Scrollable>;
} & VariantProps<typeof FlexVariants>;

export type FlexProps<C extends React.ElementType> = PolymorphicProps<C, FlexOwnProps>;

function FlexRender<C extends React.ElementType = 'div'>(
  {
    as,
    scrollable = false,
    scrollableProps,
    align,
    direction,
    flexWrap,
    gap,
    justify,
    testId = 'flex',
    className,
    children,
    ...props
  }: FlexProps<C>,
  ref: PolymorphicRef<C>
) {
  const Tag = as || 'div';

  const flexClasses = cn(FlexVariants({ align, direction, flexWrap, gap, justify }), className);

  const flexContent = (
    <Tag data-testid={testId} ref={ref} className={flexClasses} {...props}>
      {children}
    </Tag>
  );

  if (scrollable) {
    const defaultScrollableClassName = 'ui:max-h-[300px]';
    const mergedScrollableClassName = cn(defaultScrollableClassName, scrollableProps?.className);

    return (
      <Scrollable {...scrollableProps} className={mergedScrollableClassName}>
        {flexContent}
      </Scrollable>
    );
  }

  return flexContent;
}

const Flex = forwardRefWithAs<'div', FlexOwnProps>(FlexRender, 'Flex');

export default Flex;
