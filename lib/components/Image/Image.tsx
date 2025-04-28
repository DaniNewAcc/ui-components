import { ImageVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

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
