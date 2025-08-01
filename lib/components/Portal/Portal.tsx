import { usePortal } from '@hooks/usePortal';
import { cn } from '@utils/cn';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type PortalProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
  containerId?: string;
  isOpen?: boolean;
  role?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  children: ReactNode;
  visibleClassName?: string;
  hiddenClassName?: string;
};

const Portal = ({
  containerId,
  className,
  testId = 'portal',
  children,
  isOpen = true,
  role,
  ariaLabelledby,
  ariaDescribedby,
  visibleClassName = '',
  hiddenClassName = 'ui:pointer-events-none ui:opacity-0',
  ...props
}: PortalProps) => {
  const container = usePortal(containerId);
  if (!container) return null;

  return createPortal(
    <div
      data-testid={testId}
      role={role}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      className={cn(className, isOpen ? visibleClassName : hiddenClassName)}
      {...props}
    >
      {children}
    </div>,
    container
  );
};

Portal.displayName = 'Portal';

export default Portal;
