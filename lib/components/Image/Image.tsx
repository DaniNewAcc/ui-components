import { cva, VariantProps } from "class-variance-authority";
import { ImgHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const ImageVariants = cva("ui-block", {
  variants: {
    rounded: {
      default: "",
      sm: "ui-rounded-sm",
      md: "ui-rounded-md",
      lg: "ui-rounded-lg",
      full: "ui-rounded-full",
    },
  },
  defaultVariants: {
    rounded: "default",
  },
});

interface ImageProps
  extends ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof ImageVariants> {
  ref?: React.Ref<HTMLImageElement>;
  width: number;
  height: number;
  sourceImg: string;
  altText: string;
}

const Image = ({
  ref,
  rounded,
  sourceImg,
  altText,
  width,
  height,
  className,
  ...props
}: ImageProps) => {
  return (
    <img
      ref={ref}
      loading="lazy"
      srcSet={sourceImg}
      alt={altText}
      height={height}
      width={width}
      className={cn(ImageVariants({ rounded }), className)}
      {...props}
    />
  );
};

export default Image;
