import { cn } from '@/utils/cn';
import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  children: ReactNode;
}

const ButtonVariants = cva('', {
  variants: {
    variant: {
      solid: '',
      outlined: '',
      transparent: ''
    },
    size: {
      sm: '',
      md: '',
      lg: ''
    }
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md'
  }
});

export const Button = ({ variant, size, children, ...props }: ButtonProps) => {
  return (
    <button className={cn(ButtonVariants({ variant, size }))} {...props}>
      {children}
    </button>
  );
};
