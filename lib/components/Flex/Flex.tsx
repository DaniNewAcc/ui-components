import { FlexVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { PolymorphicComponent } from '@utils/types';
import { VariantProps } from 'class-variance-authority';
import Scrollable from '../Scrollable/Scrollable';

type FlexProps<C extends React.ElementType> = VariantProps<typeof FlexVariants> &
  PolymorphicComponent<
    C,
    { as?: C; testId?: string; scrollable?: boolean | React.ComponentProps<typeof Scrollable> }
  >;

const Flex = <C extends React.ElementType = 'div'>({
  as,
  scrollable = false,
  align,
  direction,
  flexWrap,
  gap,
  justify,
  testId,
  className,
  children,
  ...props
}: FlexProps<C>) => {
  const Tag = as || 'div';

  const flexClasses = cn(FlexVariants({ align, direction, flexWrap, gap, justify }), className);

  const flexContent = (
    <Tag data-testid={testId} className={flexClasses} {...props}>
      {children}
    </Tag>
  );

  if (scrollable) {
    const scrollableProps =
      typeof scrollable === 'object' ? scrollable : { className: 'ui:max-h-[300px]' };
    return <Scrollable {...scrollableProps}>{flexContent}</Scrollable>;
  }

  return flexContent;
};

export default Flex;
