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
  testId?: string;
  orientation?: Orientation;
  separator?: ReactNode;
};

type BreadcrumbContextProps = {
  orientation: Orientation;
  separator: ReactNode;
};

const BreadcrumbContext = createContext<BreadcrumbContextProps | null>(null);

const Breadcrumb = ({
  orientation = 'horizontal',
  separator,
  className,
  children,
  testId = 'breadcrumb',
  ...props
}: BreadcrumbProps) => {
  const defaultSeparator = orientation === 'vertical' ? '↓' : '/';
  const contextValue = {
    orientation,
    separator: separator ?? defaultSeparator,
  };
  return (
    <BreadcrumbContext.Provider value={contextValue}>
      <nav data-testid={testId} aria-label="Breadcrumb" {...props}>
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

type BreadcrumbItemProps = ComponentPropsWithoutRef<'li'> & {
  testId?: string;
};

const BreadcrumbItem = ({ className, children, testId, ...props }: BreadcrumbItemProps) => {
  return (
    <li data-testid={testId} className={cn('', className)} {...props}>
      {children}
    </li>
  );
};

Breadcrumb.Item = BreadcrumbItem;
BreadcrumbItem.displayName = 'BreadcrumbItem';

// ------------ Link component

type BreadcrumbLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  isCurrent?: boolean;
  testId?: string;
};

const BreadcrumbLink = ({
  isCurrent,
  className,
  children,
  testId = 'link',
  ...props
}: BreadcrumbLinkProps) => {
  if (isCurrent) {
    return (
      <span
        data-testid={testId}
        aria-current="page"
        className={cn('ui:font-semibold ui:text-primary-600', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
  return (
    <a
      data-testid={testId}
      className={cn('ui:text-gray-600 ui:hover:underline', className)}
      {...props}
    >
      {children}
    </a>
  );
};

Breadcrumb.Link = BreadcrumbLink;
BreadcrumbLink.displayName = 'BreadcrumbLink';

// ------------ Separator component

type BreadcrumbSeparatorProps = ComponentPropsWithoutRef<'span'> & {
  testId?: string;
  children?: ReactNode;
};

const BreadcrumbSeparator = ({
  children,
  className,
  testId = 'separator',
  ...props
}: BreadcrumbSeparatorProps) => {
  const { separator } = useBreadcrumbContext();
  return (
    <span
      data-testid={testId}
      aria-hidden="true"
      className={cn('ui:mx-2 ui:inline-block ui:select-none', className)}
      {...props}
    >
      {children ?? separator}
    </span>
  );
};

Breadcrumb.Separator = BreadcrumbSeparator;
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export default Breadcrumb;
