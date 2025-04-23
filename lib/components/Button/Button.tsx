import { cn } from '@utils/cn';
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';
import Loader from '../Loader';
import Text from '../Text';

export const ButtonVariants = cva(
  [
    'ui:inline-flex',
    'ui:gap-2',
    'ui:items-center',
    'ui:justify-center',
    'ui:font-semibold',
    'ui:leading-none',
    'ui:border',
    'ui:relative',
    'ui:shadow-sm',
    'ui:whitespace-nowrap',
    'ui:cursor-pointer',
    'ui:transition-all',
    'ui:duration-200',
    'ui:active:shadow-none',
    'ui:focus:outline-none',
    'ui:focus-visible:ring-4',
    'ui:disabled:pointer-events-none',
    'ui:disabled:opacity-50',
    'ui:disabled:shadow-none',
  ],
  {
    variants: {
      intent: {
        btn: '',
        icon: 'ui:p-0',
      },
      variant: {
        unstyled: 'ui:border-transparent',
        default: 'ui:border-transparent ui:bg-primary-600 ui:text-primary-50',
        outlined: 'ui:border-primary-700 ui:bg-transparent ui:text-primary-600',
        transparent: 'ui:border-transparent ui:bg-transparent ui:text-primary-600 ui:shadow-none',
      },
      size: {
        sm: 'ui:px-2 ui:py-1 ui:text-sm',
        md: 'ui:px-4 ui:py-2 ui:text-base',
        lg: 'ui:px-6 ui:py-3 ui:text-base',
      },
      fullWidth: {
        true: 'ui:w-full',
      },
      rounded: {
        default: '',
        sm: 'ui:rounded-sm',
        md: 'ui:rounded-md',
        lg: 'ui:rounded-lg',
        full: 'ui:rounded-full',
      },
    },
    compoundVariants: [
      {
        intent: ['icon', 'btn'],
        size: ['sm', 'md', 'lg'],
        variant: 'default',
        class:
          'ui:hover:border-primary-900 ui:hover:bg-primary-700 ui:focus:ring-primary-800 ui:active:border-primary-900 ui:active:bg-primary-700 ui:active:text-primary-50',
      },
      {
        intent: ['icon', 'btn'],
        size: ['sm', 'md', 'lg'],
        variant: 'outlined',
        class:
          'ui:hover:border-transparent ui:hover:bg-primary-600 ui:hover:text-primary-50 ui:focus:border-transparent ui:focus:bg-primary-600 ui:focus:text-primary-50 ui:focus:ring-primary-800 ui:active:border-transparent ui:active:bg-primary-700 ui:active:text-primary-50',
      },
      {
        intent: ['icon', 'btn'],
        size: ['sm', 'md', 'lg'],
        variant: 'transparent',
        class: 'ui:hover:border-primary-500 ui:focus:ring-primary-500 ui:active:border-primary-500',
      },
      {
        intent: 'icon',
        size: 'sm',
        rounded: ['default', 'sm', 'full'],
        class: 'ui:h-8 ui:w-8',
      },
      {
        intent: 'icon',
        size: 'md',
        rounded: ['default', 'md', 'full'],
        class: 'ui:h-10 ui:w-10',
      },
      {
        intent: 'icon',
        size: 'lg',
        rounded: ['default', 'lg', 'full'],
        class: 'ui:h-12 ui:w-12',
      },
      {
        intent: 'btn',
        size: 'sm',
        rounded: ['default', 'sm', 'full'],
        class: 'ui:h-8 ui:w-16',
      },
      {
        intent: 'btn',
        size: 'md',
        rounded: ['default', 'md', 'full'],
        class: 'ui:h-10 ui:w-20',
      },
      {
        intent: 'btn',
        size: 'lg',
        rounded: ['default', 'lg', 'full'],
        class: 'ui:h-12 ui:w-24',
      },
    ],
    defaultVariants: {
      intent: 'btn',
      variant: 'unstyled',
      size: 'sm',
      rounded: 'default',
    },
  }
);

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof ButtonVariants> & {
    loading?: boolean;
    children: ReactNode;
  };

const Button = forwardRef<React.ElementRef<'button'>, ButtonProps>(
  ({ intent, loading, variant, size, fullWidth, rounded, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          ButtonVariants({
            intent,
            variant,
            size,
            fullWidth,
            rounded,
          }),
          className
        )}
        {...props}
      >
        {loading ? <Loader size={'md'} loaderType={'spinner'} /> : <Text>{children}</Text>}
      </button>
    );
  }
);

export default Button;
