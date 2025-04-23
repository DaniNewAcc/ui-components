import { cn } from '@/utils/cn';
import { cva, VariantProps } from 'class-variance-authority';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';

const InputVariants = cva(
  'ui:flex ui:h-8 ui:w-full ui:rounded-md ui:border ui:px-3 ui:py-2 ui:text-base ui:shadow-sm ui:transition-all ui:duration-200 ui:outline-none ui:focus:ring-2 ui:disabled:pointer-events-none ui:disabled:cursor-not-allowed ui:disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'ui:border-red-600 ui:text-red-600 ui:placeholder-red-500 ui:focus:border-red-800',
        false:
          'ui:border-primary-600 ui:text-primary-500 ui:placeholder-primary-500 ui:focus:border-primary-900',
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

type InputProps = ComponentPropsWithoutRef<'input'> & VariantProps<typeof InputVariants>;

const Input = forwardRef<React.ElementRef<'input'>, InputProps>(
  ({ error, className, ...props }, ref) => (
    <input ref={ref} className={cn(InputVariants({ error }), className)} {...props} />
  )
);
export default Input;
