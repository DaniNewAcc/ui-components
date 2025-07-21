import { cn } from '@/utils/cn';
import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  useContext,
} from 'react';

type Orientation = 'horizontal' | 'vertical';

type BreadcrumbProps = ComponentProps<'nav'> & {
  orientation?: Orientation;
};

type BreadcrumbContextProps = {
  orientation: Orientation;
};

const BreadcrumbContext = createContext<BreadcrumbContextProps | null>(null);

const Breadcrumb = ({
  orientation = 'horizontal',
  className,
  children,
  ...props
}: BreadcrumbProps) => {
  const contextValue = {
    orientation,
  };
  return (
    <BreadcrumbContext.Provider value={contextValue}>
      <nav aria-label="Breadcrumb" {...props}>
        <ol
          className={cn(
            'ui:m-0 ui:flex ui:list-none ui:items-center ui:p-0',
            { 'ui:flex-col': orientation === 'vertical' },
            className
          )}
        >
          {children}
        </ol>
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

type BreadcrumbItemProps = ComponentPropsWithoutRef<'li'>;

const BreadcrumbItem = ({ className, children, ...props }: BreadcrumbItemProps) => {
  return (
    <li className={cn('', className)} {...props}>
      {children}
    </li>
  );
};

Breadcrumb.Item = BreadcrumbItem;
BreadcrumbItem.displayName = 'BreadcrumbItem';

// ------------ Link component

type BreadcrumbLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  isCurrent?: boolean;
};

const BreadcrumbLink = ({ isCurrent, className, children, ...props }: BreadcrumbLinkProps) => {
  if (isCurrent) {
    return (
      <span
        aria-current="page"
        className={cn('ui:font-semibold ui:text-primary-600', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
  return (
    <a className={cn('ui:text-gray-600 ui:hover:underline', className)} {...props}>
      {children}
    </a>
  );
};

Breadcrumb.Link = BreadcrumbLink;
BreadcrumbLink.displayName = 'BreadcrumbLink';

// ------------ Separator component

type BreadcrumbSeparatorProps = ComponentPropsWithoutRef<'span'> & {
  children?: ReactNode;
};

const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => {
  const { orientation } = useBreadcrumbContext();

  const defaultContent = orientation === 'vertical' ? '↓' : '/';
  return (
    <span
      aria-hidden="true"
      className={cn('ui:mx-2 ui:inline-block ui:select-none', className)}
      {...props}
    >
      {children ?? defaultContent}
    </span>
  );
};

Breadcrumb.Separator = BreadcrumbSeparator;
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export default Breadcrumb;
