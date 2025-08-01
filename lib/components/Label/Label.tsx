import { cn } from '@utils/cn';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

export type LabelProps = ComponentPropsWithoutRef<'label'> & {
  testId?: string;
  children?: ReactNode;
};

const Label = forwardRef<React.ElementRef<'label'>, LabelProps>(
  ({ testId = 'label', children, className, ...props }, ref) => {
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

Label.displayName = 'Label';

export default Label;
