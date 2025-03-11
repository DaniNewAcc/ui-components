import { cva, VariantProps } from "class-variance-authority";
import { ImgHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const ImageVariants = cva("ui-w-full ui-block", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface ImageProps
  extends ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof ImageVariants> {
  ref?: React.Ref<HTMLImageElement>;
  sourceImg: string;
  altText: string;
}

const Image = ({
  ref,
  size,
  sourceImg,
  altText,
  className,
  ...props
}: ImageProps) => {
  return (
    <img
      ref={ref}
      src={sourceImg}
      alt={altText}
      className={cn(ImageVariants({ size }), className)}
      {...props}
    />
  );
};

export default Image;
