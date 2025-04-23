import { cn } from '@utils/cn';
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

const ImageVariants = cva(
  'ui:block ui:cursor-pointer ui:transition-all ui:duration-200 ui:ease-in',
  {
    variants: {
      border: {
        default: '',
        sm: 'ui:border',
        md: 'ui:border-2',
        lg: 'ui:border-4',
      },
      borderColor: {
        primary: 'ui:border-primary-500',
        transparent: 'ui:border-transparent',
      },
      fit: {
        default: '',
        contain: 'ui:object-contain',
        cover: 'ui:object-cover',
        none: 'ui:object-none',
        scaleDown: 'ui:object-scale-down',
      },
      rounded: {
        default: '',
        sm: 'ui:rounded-sm',
        md: 'ui:rounded-md',
        lg: 'ui:rounded-lg',
        full: 'ui:rounded-full',
      },
      zoom: {
        true: 'ui:hover:scale-110',
      },
    },
    compoundVariants: [
      {
        border: ['sm', 'md', 'lg'],
        borderColor: ['primary', 'transparent'],
        class: 'ui:hover:border-primary-800',
      },
    ],
    defaultVariants: {
      border: 'default',
      fit: 'default',
      rounded: 'default',
    },
  }
);

type ImageProps = ComponentPropsWithoutRef<'img'> &
  VariantProps<typeof ImageVariants> & {
    width?: string | number;
    height?: string | number;
    loading?: 'lazy' | 'eager';
    src?: string;
    srcSet?: string;
    altText?: string;
    sizes?: string;
    zoom?: boolean;
    testId?: string;
  };

const Image = forwardRef<React.ElementRef<'img'>, ImageProps>(
  (
    {
      border,
      borderColor,
      fit,
      rounded,
      zoom,
      loading = 'lazy',
      src,
      srcSet,
      sizes,
      altText = 'Image',
      width,
      height,
      className,
      testId,
      ...props
    },
    ref
  ) => {
    width = width || '100%';
    height = height || 'auto';
    return (
      <img
        data-testid={testId}
        ref={ref}
        loading={loading}
        src={src}
        srcSet={srcSet}
        alt={altText}
        sizes={sizes}
        height={height}
        width={width}
        className={cn(ImageVariants({ border, borderColor, fit, rounded, zoom }), className)}
        {...props}
      />
    );
  }
);

export default Image;
