import { cn } from '@/utils/cn';
import { forwardRefWithAs, PolymorphicProps, PolymorphicRef } from '@utils/types';
import { ElementType } from 'react';

type LayoutOwnProps = {
  testId?: string;
  isCentered?: boolean;
  overflowHidden?: boolean;
};

type LayoutProps<C extends ElementType> = PolymorphicProps<C, LayoutOwnProps>;

function LayoutRender<C extends ElementType = 'div'>(
  {
    as,
    testId = 'layout',
    className,
    isCentered = true,
    overflowHidden = false,
    children,
    ...props
  }: LayoutProps<C>,
  ref: PolymorphicRef<C>
) {
  const Tag = as ?? 'div';

  return (
    <Tag
      data-testid={testId}
      ref={ref}
      className={cn(
        'ui:flex ui:min-h-screen ui:w-full ui:grow-0 ui:flex-col',
        isCentered ? 'ui:items-center ui:justify-center' : 'ui:items-start ui:justify-start',
        overflowHidden ? 'ui:overflow-hidden' : 'ui:overflow-auto',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

const Layout = forwardRefWithAs<'div', LayoutOwnProps>(LayoutRender, 'Layout');

export default Layout;
