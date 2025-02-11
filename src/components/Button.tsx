import { cn } from '@/utils/cn';
import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  children: ReactNode;
}

const ButtonVariants = cva(
  [
    'inline-flex',
    'gap-2',
    'items-center',
    'justify-center',
    'font-semibold',
    'leading-none',
    'tracking-wide',
    'whitespace-nowrap',
    'transition-colors',
    'duration-200',
    'hover:opacity-70',
    'focus:outline-none',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ],
  {
    variants: {
      as: {
        btn: '',
        icon: 'px-0'
      },
      variant: {
        default: 'bg-indigo-600 border text-white',
        outlined: 'bg-white border border-black text-black',
        transparent: 'bg-transparent border-none text-black'
      },
      size: {
        sm: 'text-sm py-1 px-2',
        md: 'text-base py-2 px-4',
        lg: 'text-base py-3 px-6'
      },
      rounded: {
        default: '',
        full: 'rounded-full'
      }
    },
    compoundVariants: [
      {
        as: 'btn',
        size: 'sm',
        rounded: 'default',
        class: 'rounded-sm'
      },
      {
        as: 'btn',
        size: 'md',
        rounded: 'default',
        class: 'rounded-md'
      },
      {
        as: 'btn',
        size: 'lg',
        rounded: 'default',
        class: 'rounded-lg'
      },
      {
        as: 'icon',
        size: 'sm',
        rounded: 'default',
        class: 'rounded-sm h-8 w-8'
      },
      {
        as: 'icon',
        size: 'md',
        rounded: 'default',
        class: 'rounded-md h-10 w-10'
      },
      {
        as: 'icon',
        size: 'lg',
        rounded: 'default',
        class: 'rounded-lg h-12 w-12'
      },
      {
        as: 'icon',
        size: 'sm',
        rounded: 'full',
        class: 'h-8 w-8'
      },
      {
        as: 'icon',
        size: 'md',
        rounded: 'full',
        class: 'h-10 w-10'
      },
      {
        as: 'icon',
        size: 'lg',
        rounded: 'full',
        class: 'h-12 w-12'
      }
    ],
    defaultVariants: {
      as: 'btn',
      variant: 'default',
      size: 'md',
      rounded: 'default'
    }
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ as, variant, size, rounded, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          ButtonVariants({ as, variant, size, rounded }),
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
