import { cva } from 'class-variance-authority';

export const ButtonVariants = cva(
  [
    'ui:inline-flex',
    'ui:gap-2',
    'ui:items-center',
    'ui:justify-center',
    'ui:font-semibold',
    'ui:leading-none',
    'ui:border',
    'ui:relative',
    'ui:shadow-sm',
    'ui:whitespace-nowrap',
    'ui:cursor-pointer',
    'ui:transition-colors',
    'ui:duration-200',
    'ui:active:shadow-none',
    'ui:focus-visible:transition-none',
    'ui:focus-visible:duration-initial',
    'ui:focus-visible:outline-hidden',
    'ui:focus-visible:ring-2',
    'ui:focus-visible:ring-primary-600',
    'ui:disabled:pointer-events-none',
    'ui:disabled:opacity-50',
    'ui:disabled:shadow-none',
  ],
  {
    variants: {
      intent: {
        btn: '',
        icon: 'ui:p-0',
      },
      variant: {
        unstyled: 'ui:border-transparent',
        default: 'ui:border-transparent ui:bg-primary-600 ui:text-primary-50',
        outlined: 'ui:border-primary-700 ui:bg-transparent ui:text-primary-600',
        transparent: 'ui:border-transparent ui:bg-transparent ui:text-primary-600 ui:shadow-none',
        success: 'ui:border-transparent ui:bg-green-200 ui:text-green-600',
        destructive: 'ui:border-transparent ui:bg-red-200 ui:text-red-600',
      },
      size: {
        sm: 'ui:px-2 ui:py-1 ui:text-sm',
        md: 'ui:px-4 ui:py-2 ui:text-base',
        lg: 'ui:px-6 ui:py-3 ui:text-base',
      },
      fullWidth: {
        true: 'ui:w-full',
      },
      rounded: {
        default: '',
        sm: 'ui:rounded-sm',
        md: 'ui:rounded-md',
        lg: 'ui:rounded-lg',
        full: 'ui:rounded-full',
      },
    },
    compoundVariants: [
      {
        intent: ['icon', 'btn'],
        size: ['sm', 'md', 'lg'],
        variant: 'default',
        class:
          'ui:hover:border-primary-900 ui:hover:bg-primary-700 ui:focus-visible:ring-primary-800 ui:active:border-primary-900 ui:active:bg-primary-700 ui:active:text-primary-50',
      },
      {
        intent: ['icon', 'btn'],
        size: ['sm', 'md', 'lg'],
        variant: 'outlined',
        class:
          'ui:hover:border-transparent ui:hover:bg-primary-600 ui:hover:text-primary-50 ui:focus-visible:border-transparent ui:focus-visible:bg-primary-600 ui:focus-visible:text-primary-50 ui:focus-visible:ring-primary-800 ui:active:border-transparent ui:active:bg-primary-700 ui:active:text-primary-50',
      },
      {
        intent: ['icon', 'btn'],
        size: ['sm', 'md', 'lg'],
        variant: 'transparent',
        class:
          'ui:hover:border-primary-500 ui:focus-visible:ring-primary-500 ui:active:border-primary-500',
      },
      {
        intent: ['icon', 'btn'],
        size: ['sm', 'md', 'lg'],
        variant: 'destructive',
        class:
          'ui:hover:bg-red-300 ui:hover:text-red-700 ui:focus-visible:ring-red-500 ui:active:bg-red-300',
      },
      {
        intent: ['icon', 'btn'],
        size: ['sm', 'md', 'lg'],
        variant: 'success',
        class:
          'ui:hover:bg-green-300 ui:hover:text-green-700 ui:focus-visible:ring-green-500 ui:active:bg-green-300',
      },
      {
        intent: 'icon',
        size: 'sm',
        rounded: ['default', 'sm', 'full'],
        class: 'ui:h-8 ui:w-8',
      },
      {
        intent: 'icon',
        size: 'md',
        rounded: ['default', 'md', 'full'],
        class: 'ui:h-10 ui:w-10',
      },
      {
        intent: 'icon',
        size: 'lg',
        rounded: ['default', 'lg', 'full'],
        class: 'ui:h-12 ui:w-12',
      },
    ],
    defaultVariants: {
      intent: 'btn',
      variant: 'unstyled',
      size: 'sm',
      rounded: 'default',
    },
  }
);

export const CardVariants = cva(
  'ui:relative ui:flex ui:cursor-pointer ui:flex-col ui:gap-4 ui:overflow-hidden ui:bg-primary-50 ui:transition-all ui:duration-200 ui:ease-out',
  {
    variants: {
      border: {
        default: 'ui:border',
        outlined: 'ui:border-2 ui:border-primary-500',
        topLeft: 'ui:border-t-2 ui:border-l-2 ui:border-t-primary-50 ui:border-l-primary-50',
      },
      hoverEffect: {
        default: '',
        zoom: 'ui:hover:scale-110',
        shift: 'ui:hover:translate-x-2 ui:hover:translate-y-2',
      },
      padding: {
        sm: 'ui:p-2',
        md: 'ui:p-4',
        lg: 'ui:p-6',
      },
      rounded: {
        sm: 'ui:rounded-sm',
        md: 'ui:rounded-md',
        lg: 'ui:rounded-lg',
      },
      shadow: {
        sm: 'ui:shadow-sm',
        md: 'ui:shadow-md',
        lg: 'ui:shadow-lg',
      },
    },
    defaultVariants: {
      border: 'default',
      hoverEffect: 'default',
      padding: 'md',
      rounded: 'md',
      shadow: 'md',
    },
  }
);

export const FlexVariants = cva('ui:flex', {
  variants: {
    align: {
      default: '',
      baseline: 'ui:items-baseline',
      start: 'ui:items-start',
      center: 'ui:items-center',
      end: 'ui:items-end',
      stretch: 'ui:items-stretch',
    },
    direction: {
      default: '',
      col: 'ui:flex-col',
      row: 'ui:flex-row',
    },
    gap: {
      default: '',
      xs: 'ui:gap-1',
      sm: 'ui:gap-2',
      md: 'ui:gap-4',
      lg: 'ui:gap-8',
      xl: 'ui:gap-12',
      xxl: 'ui:gap-16',
    },
    justify: {
      default: '',
      around: 'ui:justify-around',
      between: 'ui:justify-between',
      evenly: 'ui:justify-evenly',
      start: 'ui:justify-start',
      center: 'ui:justify-center',
      end: 'ui:justify-end',
    },
    flexWrap: {
      default: '',
      wrap: 'ui:flex-wrap',
      noWrap: 'ui:flex-nowrap',
      reverse: 'ui:flex-wrap-reverse',
    },
  },
  defaultVariants: {
    align: 'default',
    direction: 'default',
    flexWrap: 'default',
    gap: 'default',
    justify: 'default',
  },
});

export const FooterVariants = cva('ui:flex ui:w-full ui:items-center ui:justify-center', {
  variants: {
    bgColor: {
      default: '',
      50: 'ui:bg-primary-50',
      100: 'ui:bg-primary-100',
      200: 'ui:bg-primary-200',
      300: 'ui:bg-primary-300',
      400: 'ui:bg-primary-400',
      500: 'ui:bg-primary-500',
      600: 'ui:bg-primary-600',
      700: 'ui:bg-primary-700',
      800: 'ui:bg-primary-800',
      900: 'ui:bg-primary-900',
    },
    padding: {
      default: '',
      sm: 'ui:px-2',
      md: 'ui:px-4',
      lg: 'ui:px-8',
    },
    gap: {
      default: '',
      sm: 'ui:gap-2',
      md: 'ui:gap-4',
      lg: 'ui:gap-8',
    },
    height: {
      default: '',
      sm: 'ui:h-16',
      md: 'ui:h-20',
      lg: 'ui:h-24',
    },
  },
  defaultVariants: {
    bgColor: 'default',
    padding: 'default',
    gap: 'default',
    height: 'default',
  },
});

export const GridVariants = cva('', {
  variants: {
    display: {
      grid: 'ui:grid',
      inlineGrid: 'ui:inline-grid',
      none: 'ui:hidden',
    },
    gap: {
      default: '',
      xs: 'ui:gap-1',
      sm: 'ui:gap-2',
      md: 'ui:gap-4',
      lg: 'ui:gap-8',
      xl: 'ui:gap-12',
      xxl: 'ui:gap-16',
    },
    colGap: {
      default: '',
      xs: 'ui:gap-x-1',
      sm: 'ui:gap-x-2',
      md: 'ui:gap-x-4',
      lg: 'ui:gap-x-8',
      xl: 'ui:gap-x-12',
      xxl: 'ui:gap-x-16',
    },
    rowGap: {
      default: '',
      xs: 'ui:gap-y-1',
      sm: 'ui:gap-y-2',
      md: 'ui:gap-y-4',
      lg: 'ui:gap-y-8',
      xl: 'ui:gap-y-12',
      xxl: 'ui:gap-y-16',
    },
    gridCol: {
      default: '',
      2: 'ui:grid-cols-2',
      3: 'ui:grid-cols-3',
      4: 'ui:grid-cols-4',
      5: 'ui:grid-cols-5',
      6: 'ui:grid-cols-6',
      7: 'ui:grid-cols-7',
      8: 'ui:grid-cols-8',
      9: 'ui:grid-cols-9',
      10: 'ui:grid-cols-10',
      11: 'ui:grid-cols-11',
      12: 'ui:grid-cols-12',
    },
    gridRow: {
      default: '',
      2: 'ui:grid-rows-2',
      3: 'ui:grid-rows-3',
      4: 'ui:grid-rows-4',
      5: 'ui:grid-rows-5',
      6: 'ui:grid-rows-6',
      7: 'ui:grid-rows-7',
      8: 'ui:grid-rows-8',
      9: 'ui:grid-rows-9',
      10: 'ui:grid-rows-10',
      11: 'ui:grid-rows-11',
      12: 'ui:grid-rows-12',
    },
  },
  defaultVariants: {
    display: 'grid',
    gap: 'default',
    colGap: 'default',
    rowGap: 'default',
    gridCol: 'default',
    gridRow: 'default',
  },
});

export const HeaderVariants = cva('ui:flex ui:w-full ui:items-center ui:justify-between', {
  variants: {
    bgColor: {
      default: '',
      50: 'ui:bg-primary-50',
      100: 'ui:bg-primary-100',
      200: 'ui:bg-primary-200',
      300: 'ui:bg-primary-300',
      400: 'ui:bg-primary-400',
      500: 'ui:bg-primary-500',
      600: 'ui:bg-primary-600',
      700: 'ui:bg-primary-700',
      800: 'ui:bg-primary-800',
      900: 'ui:bg-primary-900',
    },
    padding: {
      default: '',
      sm: 'ui:px-2',
      md: 'ui:px-4',
      lg: 'ui:px-8',
    },
    gap: {
      default: '',
      sm: 'ui:gap-2',
      md: 'ui:gap-4',
      lg: 'ui:gap-8',
    },
    height: {
      default: '',
      sm: 'ui:h-16',
      md: 'ui:h-20',
      lg: 'ui:h-24',
    },
  },
  defaultVariants: {
    bgColor: 'default',
    padding: 'default',
    gap: 'default',
    height: 'default',
  },
});

export const ImageVariants = cva(
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

export const InputVariants = cva(
  'ui:flex ui:h-8 ui:w-full ui:rounded-md ui:border ui:px-3 ui:py-2 ui:text-base ui:shadow-sm ui:transition-all ui:duration-200 ui:outline-none ui:focus:ring-2 ui:disabled:pointer-events-none ui:disabled:cursor-not-allowed ui:disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'ui:border-red-600 ui:text-red-600 ui:placeholder-red-500 ui:focus:border-red-800',
        false:
          'ui:border-primary-600 ui:text-primary-500 ui:placeholder-primary-500 ui:focus:border-primary-900',
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

export const LoaderVariants = cva('ui:rounded-full', {
  variants: {
    loaderType: {
      dots: 'ui-dots-loader-animation ui:bg-gray-500',
      spinner: 'ui:animate-spin ui:border-2',
    },
    size: {
      sm: 'ui:h-2 ui:w-2',
      md: 'ui:h-4 ui:w-4',
      lg: 'ui:h-8 ui:w-8',
    },
    borderColor: {
      gray: 'ui:border-gray-500',
      primary: 'ui:border-primary-500',
      white: 'ui:border-white',
    },
  },
  compoundVariants: [
    {
      loaderType: 'spinner',
      borderColor: ['gray', 'primary', 'white'],
      class: 'ui:border-b-transparent',
    },
  ],
  defaultVariants: {
    loaderType: 'spinner',
    size: 'md',
    borderColor: 'gray',
  },
});

export const ScrollableVariants = cva('ui:overflow-auto', {
  variants: {
    direction: {
      vertical: 'ui:overflow-x-hidden ui:overflow-y-auto',
      horizontal: 'ui:overflow-x-auto ui:overflow-y-hidden ui:whitespace-nowrap',
      both: 'ui:overflow-auto',
    },
    scrollBar: {
      auto: 'ui:scrollbar ui:scrollbar-thumb-rounded ui:scrollbar-thumb-gray-400 ui:scrollbar-track-gray-100',
      always:
        'ui:scrollbar ui:scrollbar-thumb-rounded ui:scrollbar-thumb-gray-400 ui:scrollbar-track-gray-100 ui:scrollbar-visible',
      hidden: 'ui:scrollbar-none',
    },
    smooth: {
      true: 'ui:scroll-smooth',
      false: '',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    scrollBar: 'auto',
    smooth: false,
  },
});

export const SeparatorVariants = cva('ui:bg-gray-400', {
  variants: {
    orientation: {
      horizontal: 'ui:h-[1px] ui:w-full',
      vertical: 'ui:h-full ui:w-[1px]',
      diagonal: 'ui:h-[1px] ui:rotate-45',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const TabsVariants = cva(
  'ui:flex ui:w-fit ui:flex-col ui:justify-between ui:bg-transparent ui:shadow-md',
  {
    variants: {
      hasPadding: {
        true: 'ui:p-4',
      },
      selfAlign: {
        center: 'ui:self-center',
        start: 'ui:self-start',
        stretch: 'ui:self-stretch',
      },
    },
    defaultVariants: {
      hasPadding: false,
      selfAlign: 'stretch',
    },
  }
);

export const TabsListVariants = cva(
  'ui:inline-flex ui:w-fit ui:shrink-0 ui:items-center ui:justify-center ui:bg-transparent',
  {
    variants: {
      variant: {
        default: '',
        spaced: 'ui:gap-2 ui:bg-primary-300 ui:[&>button]:rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const TextVariants = cva('', {
  variants: {
    variant: {
      unstyled: '',
      heading: 'ui:scroll-mt-16 ui:tracking-tight',
      list: 'ui:list-disc ui:[&>li]:mt-2',
    },
    border: {
      unstyled: '',
      bottom: 'ui:border-b ui:pb-2',
      left: 'ui:border-l ui:pl-4',
    },
    truncate: {
      true: 'ui:overflow-hidden ui:text-ellipsis ui:whitespace-nowrap',
    },
    clamp: {
      none: '',
      1: 'ui:line-clamp-1',
      2: 'ui:line-clamp-2',
      3: 'ui:line-clamp-3',
    },
  },
  defaultVariants: {
    variant: 'unstyled',
    border: 'unstyled',
    clamp: 'none',
  },
});

export const AnimationVariants = cva('', {
  variants: {
    type: {
      default: '',
      fadeIn: 'ui-animate-fadeIn',
      fadeOut: 'ui-animate-fadeOut',
      slideUp: 'ui-animate-slideUp',
      slideDown: 'ui-animate-slideDown',
      bounce: 'ui-animate-bounce',
      zoomIn: 'ui-animate-zoomIn',
    },
    duration: {
      100: 'ui-animate-duration-100',
      200: 'ui-animate-duration-200',
      300: 'ui-animate-duration-300',
      500: 'ui-animate-duration-500',
      700: 'ui-animate-duration-700',
      1000: 'ui-animate-duration-1000',
    },
    delay: {
      0: 'ui-animate-delay-0',
      100: 'ui-animate-delay-100',
      200: 'ui-animate-delay-200',
      300: 'ui-animate-delay-300',
      500: 'ui-animate-delay-500',
    },
    repeat: {
      once: 'ui-animate-once',
      infinite: 'ui-animate-infinite',
    },
    fillMode: {
      default: 'ui-animate-default',
      forwards: 'ui-animate-forwards',
    },
    exitType: {
      default: '',
      fadeIn: 'ui-animate-fadeIn',
      fadeOut: 'ui-animate-fadeOut',
      slideUp: 'ui-animate-slideUp',
      slideDown: 'ui-animate-slideDown',
      bounce: 'ui-animate-bounce',
      zoomIn: 'ui-animate-zoomIn',
    },
    easing: {
      ease: 'ui-animate-ease',
      easeIn: 'ui-animate-ease-in',
      easeOut: 'ui-animate-ease-out',
      easeInOut: 'ui-animate-ease-in-out',
      linear: 'ui-animate-linear',
    },
    exitEasing: {
      ease: 'ui-animate-ease',
      easeIn: 'ui-animate-ease-in',
      easeOut: 'ui-animate-ease-out',
      easeInOut: 'ui-animate-ease-in-out',
      linear: 'ui-animate-linear',
    },
  },
  defaultVariants: {
    type: 'default',
    duration: 300,
    delay: 0,
    repeat: 'once',
    fillMode: 'default',
    exitType: 'default',
    easing: 'easeOut',
    exitEasing: 'easeIn',
  },
});
