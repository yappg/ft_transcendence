export const Card = ({
  children,
  style,
}: {
  children: JSX.Element | JSX.Element[];
  style?: string;
}) => {
  return (
    <div
      className={` ${style} size-full lg:h-full lg:w-full xl:h-[90%] xl:w-[90%] 2xl:w-[80%] 2xl:max-w-[1200px] tfa-card-bg xl:rounded-[50px] shadow-2xl`}
    >
      {children}
    </div>
  );
};
