import { cn } from '@/utils/cn';
import { SeparatorVariants } from '@/utils/variants';
import React, { ComponentProps, ComponentPropsWithoutRef, createContext, useContext } from 'react';
import Separator from '../Separator';

type BreadcrumbProps = ComponentProps<'nav'> & {};

type BreadcrumbContextProps = {};

const BreadcrumbContext = createContext<BreadcrumbContextProps | null>(null);

const Breadcrumb = ({ className, children, ...props }: BreadcrumbProps) => {
  const childrenArray = React.Children.toArray(children);

  const totalItems = childrenArray.length;

  const childrenWithProps = childrenArray.map((child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<{ index: number; isLast: boolean }>, {
        index,
        isLast: index === totalItems - 1,
      });
    }
    return child;
  });

  const contextValue = {};
  return (
    <BreadcrumbContext.Provider value={contextValue}>
      <nav aria-label="Breadcrumb" {...props}>
        <ol className={cn('list-none p-0 m-0 flex', className)}>{childrenWithProps}</ol>
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
  index?: number;
  isLast?: boolean;
};

const BreadcrumbItem = ({ className, children, index, isLast, ...props }: BreadcrumbItemProps) => {
  return (
    <li className={cn('', className)} {...props}>
      {children}
      {!isLast && <Breadcrumb.Separator />}
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
        className={cn('ui:font-semibold ui:text-blue-600', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
  return (
    <a className={cn('ui:text-blue-600 ui:hover:underline', className)} {...props}>
      {children}
    </a>
  );
};

Breadcrumb.Link = BreadcrumbLink;
BreadcrumbLink.displayName = 'BreadcrumbLink';

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
