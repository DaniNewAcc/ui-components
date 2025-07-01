import { ButtonVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';
import Loader from '../Loader';
import Text from '../Text';

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof ButtonVariants> & {
    loading?: boolean;
    showLoader?: boolean;
    testId?: string;
    children: ReactNode;
  };

const Button = forwardRef<React.ElementRef<'button'>, ButtonProps>(
  (
    {
      disabled,
      type = 'button',
      intent,
      loading,
      showLoader,
      variant,
      size,
      fullWidth,
      rounded,
      className,
      children,
      testId = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = loading || disabled;
    return (
      <button
        data-testid={testId}
        type={type}
        ref={ref}
        aria-busy={loading}
        aria-disabled={isDisabled}
        aria-live="polite"
        className={cn(
          ButtonVariants({
            intent,
            variant,
            size,
            fullWidth,
            rounded,
          }),
          { 'ui:pointer-events-none ui:opacity-50': loading && !showLoader },
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && showLoader ? (
          <Loader size={'md'} loaderType={'spinner'} />
        ) : (
          <Text>{children}</Text>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
