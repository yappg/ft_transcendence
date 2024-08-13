import Circle from '@/components/landing-page/Circle';
import circleData from '@/constants/circleData';
import Card from './Card';

const Background = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {circleData.map((circle, index) => (
        <Circle
          key={index}
          w={circle.w}
          h={circle.h}
          top={circle.top}
          left={circle.left}
          etop={circle.etop}
          eleft={circle.eleft}
          transform={circle.transform}
          title={circle.title}
        />
      ))}
      <div className="h-screen w-full flex justify-center items-center z-[2]">
        <Card />
      </div>
    </div>
  );
};

export default Background;
