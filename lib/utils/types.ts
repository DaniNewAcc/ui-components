import React from "react";

// allow to dynamically define the native html element for the component
type AsProp<C extends React.ElementType> = {
  as?: C;
};

// omit props strictly related to the html element defined so it can be changed without losing html attributes support
type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

// helper for passing correctly ref to the component
export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

// allow support for html attributes related to the component defined by the AsProp type

// without ref
export type PolymorphicComponent<
  C extends React.ElementType,
  Props = object,
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

// with ref
export type PolymorphicComponentWithRef<
  C extends React.ElementType,
  Props = object,
> = PolymorphicComponent<C, Props> & { ref?: PolymorphicRef<C> };
