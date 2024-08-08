import React from 'react';

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
      className="circle"
      style={{
        zIndex: 1,
        width: w,
        height: h,
        backgroundColor: '#c1382c',
        borderRadius: '50%',
        position: 'absolute',
        left: left,
        top: top,
        boxShadow: '0 0 30px 20px #c1382c',
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