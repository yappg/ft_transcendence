export const Card = ({
  children,
  style,
}: {
  children: JSX.Element | JSX.Element[];
  style?: string;
}) => {
  return (
    <div
      className={` ${style} xl:w-[1095px] xl:h-[998px] flex flex-col items-center justify-center lg:w-[950px] lg:h-[850px] w-full h-full tfa-card-bg lg:rounded-[50px] transition-all duration-300 backdrop-blur-xlg gap-10`}
    >
      {children}
    </div>
  );
};
