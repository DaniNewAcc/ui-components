import { cn } from '@/utils/cn';
import { PolymorphicComponent } from '@utils/types';

type LayoutProps<C extends React.ElementType> = PolymorphicComponent<
  C,
  { as?: C; testId?: string; isCentered?: boolean; overflowHidden?: boolean }
>;

const Layout = <C extends React.ElementType = 'div'>({
  as,
  testId = 'layout',
  className,
  isCentered = true,
  overflowHidden = false,
  children,
  ...props
}: LayoutProps<C>) => {
  const Tag = as || 'div';

  return (
    <Tag
      data-testid={testId}
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
};

Layout.displayName = 'Layout';

export default Layout;
