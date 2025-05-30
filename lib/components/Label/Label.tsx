import { cn } from '@/utils/cn';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

type LabelProps = ComponentPropsWithoutRef<'label'> & {
  htmlFor?: string;
  testId?: string;
  children?: ReactNode;
};

const Label = forwardRef<React.ElementRef<'label'>, LabelProps>(
  ({ testId, children, className, ...props }, ref) => {
    return (
      <label
        data-testid={testId}
        ref={ref}
        className={cn('ui:flex ui:items-center ui:gap-4 ui:font-medium', className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);

export default Label;
