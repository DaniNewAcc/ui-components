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
    children: ReactNode;
  };

const Button = forwardRef<React.ElementRef<'button'>, ButtonProps>(
  (
    {
      intent,
      loading,
      showLoader,
      variant,
      size,
      fullWidth,
      rounded,
      className,
      children,
      ...props
    },
    ref
  ) => {
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
        {loading && showLoader ? (
          <Loader size={'md'} loaderType={'spinner'} />
        ) : (
          <Text>{children}</Text>
        )}
      </button>
    );
  }
);

export default Button;
