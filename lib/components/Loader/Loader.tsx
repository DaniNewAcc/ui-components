import '@/index.css';
import { FlexVariants, LoaderVariants } from '@/utils/variants';
import Flex from '@components/Flex';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

type LoaderProps = ComponentProps<'div'> &
  VariantProps<typeof LoaderVariants> &
  VariantProps<typeof FlexVariants> & {
    testId?: string;
    children?: ReactNode;
  };

const Loader = ({
  loaderType,
  size,
  borderColor,
  testId,
  className,
  children,
  ...props
}: LoaderProps) => {
  const loaderClass = LoaderVariants({ loaderType, size, borderColor });

  const createDots = () =>
    Array.from({ length: 3 }).map((_, i) => (
      <span key={i} className={cn(loaderClass, className)} />
    ));

  return (
    <Flex
      align={'center'}
      gap={'sm'}
      justify={'center'}
      data-testid={testId}
      role="status"
      aria-busy="true"
      className={cn(FlexVariants({ align: 'center', gap: 'sm', justify: 'center' }), className)}
      {...props}
    >
      <Flex gap={'sm'}>
        {loaderType === 'dots' ? createDots() : <span className={cn(loaderClass, className)} />}
      </Flex>
      {children}
    </Flex>
  );
};

export default Loader;
