interface cardProps {
    children: React.ReactNode;
    className?: string;
  }
const Content = ({ children, className }: cardProps) => {
    return (
        <div className="bg-[#00000026] size-full">
            {children}
        </div>
    );
}
export default Content;