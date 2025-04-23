import { cn } from '@/utils/cn';
import { PolymorphicComponent } from '@utils/types';

type LayoutProps<C extends React.ElementType> = PolymorphicComponent<
  C,
  { as?: C; testId?: string }
>;

const Layout = <C extends React.ElementType = 'div'>({
  as,
  testId,
  className,
  children,
  ...props
}: LayoutProps<C>) => {
  const Tag = as || 'div';

  return (
    <Tag
      data-testid={testId}
      role={as === 'main' ? 'main' : undefined}
      className={cn(
        'ui:flex ui:h-screen ui:w-screen ui:flex-col ui:items-center ui:justify-center ui:overflow-x-hidden',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Layout;
