import React from 'react';

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
export type PolymorphicProps<C extends React.ElementType, Props = {}> = Props & {
  as?: C;
} & Omit<React.ComponentPropsWithoutRef<C>, keyof Props | 'as'>;

// Helper function to allow correct ref forwarding in polymorphic component
export function forwardRefWithAs<DefaultTag extends React.ElementType, Props = {}>(
  render: <C extends React.ElementType = DefaultTag>(
    props: PolymorphicProps<C, Props>,
    ref: PolymorphicRef<C>
  ) => React.ReactElement | null,
  displayName?: string
) {
  const component = React.forwardRef((props: any, ref: React.Ref<any>) => render(props, ref)) as <
    C extends React.ElementType = DefaultTag,
  >(
    props: PolymorphicProps<C, Props> & {
      ref?: PolymorphicRef<C>;
    }
  ) => React.ReactElement | null;

  (component as typeof component & { displayName?: string }).displayName =
    displayName ?? render.name ?? 'Component';

  return component;
}
