import React from "react";

// allow to dynamically define the native html element for the component
export type AsProp<C extends React.ElementType> = {
  as?: C;
};

// omit props strictly related to the html element defined so it can be changed without losing html attributes support
export type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

// allow support for html attributes related to the component defined by the AsProp type
export type PolymorphicComponent<
  C extends React.ElementType,
  Props = object,
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentProps<C>, PropsToOmit<C, Props>>;
