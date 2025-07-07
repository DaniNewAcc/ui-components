import '@/index.css';
import { FlexVariants, LoaderVariants } from '@/utils/variants';
import Flex from '@components/Flex';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

type LoaderProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof LoaderVariants> &
  VariantProps<typeof FlexVariants> & {
    testId?: string;
    children?: ReactNode;
    loaderClassName?: string;
  };

const Loader = forwardRef<React.ElementRef<'div'>, LoaderProps>(
  (
    {
      loaderType,
      size,
      borderColor,
      align,
      gap,
      justify,
      testId = 'loader',
      className,
      loaderClassName,
      children,
      ...props
    },
    ref
  ) => {
    const loaderClass = LoaderVariants({ loaderType, size, borderColor });

    const createDots = () =>
      Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className={cn(loaderClass, loaderClassName)} />
      ));

    return (
      <Flex
        ref={ref}
        align={'center'}
        gap={'sm'}
        justify={'center'}
        data-testid={testId}
        role="status"
        aria-busy="true"
        className={cn(FlexVariants({ align, gap, justify }), className)}
        {...props}
      >
        <Flex gap={'sm'}>
          {loaderType === 'dots' ? (
            createDots()
          ) : (
            <span className={cn(loaderClass, loaderClassName)} />
          )}
        </Flex>
        {children}
      </Flex>
    );
  }
);

Loader.displayName = 'Loader';

export default Loader;
