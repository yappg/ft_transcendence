interface cardProps {
  children: React.ReactNode;
  className?: string;
}
const Content = ({ children, className }: cardProps) => {
  return <div className="size-full">{children}</div>;
};
export default Content;
