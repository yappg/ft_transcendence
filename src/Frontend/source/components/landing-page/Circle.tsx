import React from "react";

const Circle = ({
  title,
  top,
  left,
  etop,
  eleft,
  transform,
  w,
  h,
}: {
  w: string;
  h: string;
  top: string;
  left: string;
  etop: string;
  eleft: string;
  transform: number;
  title: string;
}) => {
  return (
    <div
      className="absolute rounded-full bg-[#28AFB0] shadow-[0_0_30px_20px_#28AFB0] dark:bg-[#FF0000] dark:shadow-[0_0_30px_20px_#FF0000]"
      style={{
        width: w,
        height: h,
        left: left,
        top: top,
        animation: `${title} 6s linear infinite`,
        animationDuration: `${transform / 6}s`,
      }}
    >
      <style>
        {`
          @keyframes ${title} {
            0% {
              left: ${left};
              top: ${top};
            }
            100% {
              left: ${eleft};
              top: ${etop};
              transform: translateX(${transform}%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Circle;
