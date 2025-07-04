import React, { ComponentPropsWithoutRef, ElementType, forwardRef, ReactElement } from 'react';

// allow to dynamically define the native html element for the component
type AsProp<C extends React.ElementType> = {
  as?: C;
};

// omit props strictly related to the html element defined so it can be changed without losing html attributes support
type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

// helper for passing correctly ref to the component
export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

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

// Helper type to merge your custom props with the props of the `as` element, omitting conflicts
export type PolymorphicProps<C extends ElementType, Props = {}> = Props & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof Props | 'as'>;

// Helper function to allow correct ref forwarding in polymorphic component
export function forwardRefWithAs<
  RenderFn extends <C extends ElementType = 'div'>(
    props: PolymorphicProps<C, any>,
    ref: PolymorphicRef<C>
  ) => ReactElement | null,
>(render: RenderFn, displayName?: string) {
  type Props = Parameters<RenderFn>[0];
  type RefType = Parameters<RenderFn>[1];

  const component = forwardRef((props: Props, ref: RefType) => render(props, ref));

  (component as any).displayName = displayName || render.name || 'Component';

  return component as unknown as RenderFn;
}
