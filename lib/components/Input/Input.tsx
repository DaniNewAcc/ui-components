import { cn } from '@/utils/cn';
import { InputVariants } from '@/utils/variants';
import { VariantProps } from 'class-variance-authority';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> &
  VariantProps<typeof InputVariants> & {
    testId?: string;
  };

const Input = forwardRef<React.ElementRef<'input'>, InputProps>(
  ({ error, className, testId = 'input', ...props }, ref) => (
    <input
      data-testid={testId}
      ref={ref}
      aria-invalid={error ? 'true' : undefined}
      className={cn(InputVariants({ error }), className)}
      {...props}
    />
  )
);

Input.displayName = 'Input';

export default Input;
