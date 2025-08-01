import { cn } from '@utils/cn';
import { ImageVariants } from '@utils/variants';
import { VariantProps } from 'class-variance-authority';
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';

export type ImageProps = Omit<ComponentPropsWithoutRef<'img'>, 'width' | 'height' | 'alt'> &
  VariantProps<typeof ImageVariants> & {
    width?: string | number;
    height?: string | number;
    alt?: string;
    testId?: string;
    fallbackSrc?: string;
    onError?: React.ReactEventHandler<HTMLImageElement>;
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
      fallbackSrc,
      onError,
      ...props
    },
    ref
  ) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(src);

    useLayoutEffect(() => {
      setImgSrc(src);
    }, [src]);

    const handleError = useCallback<React.ReactEventHandler<HTMLImageElement>>(
      e => {
        if (onError) {
          onError(e);
        } else if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      },
      [onError, fallbackSrc, imgSrc]
    );
    return (
      <img
        data-testid={testId}
        ref={ref}
        loading={loading}
        src={imgSrc}
        srcSet={srcSet}
        alt={alt}
        sizes={sizes}
        width={width}
        height={height}
        className={cn(ImageVariants({ border, borderColor, fit, rounded, zoom }), className)}
        onError={handleError}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';

export default Image;
