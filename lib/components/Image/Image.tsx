import { cn } from "@utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

const ImageVariants = cva(
  "ui-block ui-cursor-pointer ui-transition-all ui-ease-in ui-duration-200",
  {
    variants: {
      border: {
        default: "",
        sm: "ui-border",
        md: "ui-border-2",
        lg: "ui-border-4",
      },
      borderColor: {
        primary: "ui-border-primary-500",
        transparent: "ui-border-transparent",
      },
      fit: {
        default: "",
        contain: "ui-object-contain",
        cover: "ui-object-cover",
        none: "ui-object-none",
        scaleDown: "ui-object-scale-down",
      },
      rounded: {
        default: "",
        sm: "ui-rounded-sm",
        md: "ui-rounded-md",
        lg: "ui-rounded-lg",
        full: "ui-rounded-full",
      },
      zoom: {
        true: "hover:ui-scale-110",
      },
    },
    compoundVariants: [
      {
        border: ["sm", "md", "lg"],
        borderColor: ["primary", "transparent"],
        class: "hover:ui-border-primary-800",
      },
    ],
    defaultVariants: {
      border: "default",
      fit: "default",
      rounded: "default",
    },
  },
);

type ImageProps = ComponentProps<"img"> &
  VariantProps<typeof ImageVariants> & {
    width?: number;
    height?: number;
    sourceImg?: string;
    altText?: string;
  };

const Image = ({
  border,
  borderColor,
  fit,
  rounded,
  zoom,
  sourceImg,
  altText,
  width,
  height,
  className,
  ...props
}: ImageProps) => {
  return (
    <img
      loading="lazy"
      srcSet={sourceImg}
      alt={altText}
      height={height}
      width={width}
      className={cn(
        ImageVariants({ border, borderColor, fit, rounded, zoom }),
        className,
      )}
      {...props}
    />
  );
};

export default Image;
