import { ImageVariants } from '@/utils/variants';
import { cn } from '@utils/cn';
import { VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

type ImageProps = Omit<ComponentPropsWithoutRef<'img'>, 'width' | 'height' | 'alt'> &
  VariantProps<typeof ImageVariants> & {
    width?: string | number;
    height?: string | number;
    alt?: string;
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
      alt = 'Image',
      width = '100%',
      height = 'auto',
      className,
      testId = 'image',
      ...props
    },
    ref
  ) => {
    return (
      <img
        data-testid={testId}
        ref={ref}
        loading={loading}
        src={src}
        srcSet={srcSet}
        alt={alt}
        sizes={sizes}
        width={width}
        height={height}
        className={cn(ImageVariants({ border, borderColor, fit, rounded, zoom }), className)}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';

export default Image;
