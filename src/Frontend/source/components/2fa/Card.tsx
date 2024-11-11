export const Card = ({
  children,
  style,
}: {
  children: JSX.Element | JSX.Element[];
  style?: string;
}) => {
  return (
    <div
      className={` ${style} `}
    >
      {children}
    </div>
  );
};
