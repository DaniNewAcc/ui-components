import { cn } from '@/utils/cn';
import { InputVariants } from '@/utils/variants';
import { VariantProps } from 'class-variance-authority';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & VariantProps<typeof InputVariants>;

const Input = forwardRef<React.ElementRef<'input'>, InputProps>(
  ({ error, className, ...props }, ref) => (
    <input ref={ref} className={cn(InputVariants({ error }), className)} {...props} />
  )
);
export default Input;
