import { cn } from '@/utils/cn';
import { InputVariants } from '@/utils/variants';
import { VariantProps } from 'class-variance-authority';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> &
  VariantProps<typeof InputVariants> & {
    testId?: string;
    errorId?: string;
    hintId?: string;
  };

const Input = forwardRef<React.ElementRef<'input'>, InputProps>(
  ({ error, className, errorId, hintId, testId = 'input', ...props }, ref) => {
    const describedByIds =
      [props['aria-describedby'], error && errorId, hintId].filter(Boolean).join(' ') || undefined;

    return (
      <input
        data-testid={testId}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedByIds}
        className={cn(InputVariants({ error }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
