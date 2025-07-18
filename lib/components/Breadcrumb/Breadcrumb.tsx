import { cn } from '@/utils/cn';
import { SeparatorVariants } from '@/utils/variants';
import { ComponentProps, ComponentPropsWithoutRef, createContext, useContext } from 'react';
import Separator from '../Separator';

type BreadcrumbProps = ComponentProps<'nav'> & {};

type BreadcrumbContextProps = {};

const BreadcrumbContext = createContext<BreadcrumbContextProps | null>(null);

const Breadcrumb = ({ className, children, ...props }: BreadcrumbProps) => {
  const contextValue = {};
  return (
    <BreadcrumbContext.Provider value={contextValue}>
      <nav aria-label="Breadcrumb" {...props}>
        <ol className={cn('list-none p-0 m-0 flex', className)}>{children}</ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

// helper function for using Breadcrumb context

function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error('Breadcrumb components needs to be wrapped in <Breadcrumb>.');
  }

  return context;
}

// ------------ Item component

type BreadcrumbItemProps = ComponentPropsWithoutRef<'li'> & {};

const BreadcrumbItem = ({ className, children, ...props }: BreadcrumbItemProps) => {
  return (
    <li className={cn('', className)} {...props}>
      {children}
    </li>
  );
};

Breadcrumb.Item = BreadcrumbItem;
BreadcrumbItem.displayName = 'BreadcrumbItem';

// ------------ Separator component

type BreadcrumbSeparatorProps = ComponentPropsWithoutRef<typeof Separator>;

const BreadcrumbSeparator = ({
  orientation = 'vertical',
  className,
  ...props
}: BreadcrumbSeparatorProps) => {
  return (
    <Separator
      aria-hidden="true"
      className={cn(SeparatorVariants({ orientation }), 'ui:mx-2 ui:inline-block', className)}
      {...props}
    />
  );
};

Breadcrumb.Separator = BreadcrumbSeparator;
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export default Breadcrumb;
