import { PolymorphicComponent } from "@utils/types";

type LayoutProps<C extends React.ElementType> = PolymorphicComponent<
  C,
  { as?: C; testId?: string }
>;

const Layout = <C extends React.ElementType = "div">({
  as,
  testId,
  children,
  ...props
}: LayoutProps<C>) => {
  const Tag = as || "div";

  return (
    <Tag
      data-testid={testId}
      className="ui:flex ui:h-screen ui:w-screen ui:flex-col ui:overflow-x-hidden"
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Layout;
