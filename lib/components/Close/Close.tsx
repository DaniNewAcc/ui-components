import { cn } from '@/utils/cn';
import { ButtonVariants } from '@/utils/variants';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { VariantProps } from 'class-variance-authority';
import {
  cloneElement,
  ComponentPropsWithoutRef,
  forwardRef,
  isValidElement,
  useCallback,
} from 'react';
import Button from '../Button';

export type CloseProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof ButtonVariants> & {
    testId?: string;
    asChild?: boolean;
    ariaLabel?: string;
    onClose: () => void;
    children?: React.ReactNode;
  };

const Close = forwardRef<React.ElementRef<'button'>, CloseProps>(
  (
    {
      testId = 'close',
      ariaLabel = 'Close',
      asChild = false,
      variant,
      size,
      intent,
      rounded,
      className,
      children,
      onClose,
      ...props
    },
    ref
  ) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        onClose();
        if (isValidElement(children) && typeof children.props?.onClick === 'function') {
          children.props.onClick(e);
        }
      },
      [children, onClose]
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        onClick: handleClick,
        ...props,
      });
    }

    return (
      <Button
        testId={testId}
        ref={ref}
        aria-label={ariaLabel}
        intent={'icon'}
        rounded={'full'}
        size={'sm'}
        className={cn(
          ButtonVariants({ variant, size, intent, rounded }),
          'ui:text-gray-500 ui:hover:bg-gray-100',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <XMarkIcon className="ui:h-5 ui:w-5" aria-hidden="true" />
      </Button>
    );
  }
);

Close.displayName = 'Close';

export default Close;
